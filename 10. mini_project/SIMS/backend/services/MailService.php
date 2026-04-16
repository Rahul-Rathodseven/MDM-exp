<?php
class MailService {
    private array $config;
    private string $logDirectory;

    public function __construct(?array $config = null) {
        $this->config = $config ?? (require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'env.php');
        $this->logDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'mail_logs';
    }

    public function sendMail($to, $subject, $message): bool {
        if (!$to) {
            return false;
        }

        try {
            $transport = strtolower(trim((string) ($this->config['SIMS_MAIL_TRANSPORT'] ?? 'smtp')));

            if ($transport === 'mail') {
                $sent = $this->sendViaPhpMail($to, $subject, $message);
            } else {
                $sent = $this->sendViaSmtp($to, $subject, $message);
            }

            if (!$sent) {
                $this->logFailure($to, $subject, $message, 'Mail transport returned false.');
            }

            return $sent;
        } catch (Throwable $throwable) {
            $this->logFailure($to, $subject, $message, $throwable->getMessage());
            return false;
        }
    }

    private function sendViaPhpMail(string $to, string $subject, string $message): bool {
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . $this->getFromHeader()
        ];

        return @mail($to, $subject, $message, implode("\r\n", $headers));
    }

    private function sendViaSmtp(string $to, string $subject, string $message): bool {
        $host = trim((string) ($this->config['SIMS_SMTP_HOST'] ?? ''));
        $port = (int) ($this->config['SIMS_SMTP_PORT'] ?? 587);
        $encryption = strtolower(trim((string) ($this->config['SIMS_SMTP_ENCRYPTION'] ?? 'tls')));
        $username = (string) ($this->config['SIMS_SMTP_USERNAME'] ?? '');
        $password = (string) ($this->config['SIMS_SMTP_PASSWORD'] ?? '');

        if ($host === '') {
            throw new RuntimeException('SMTP host is not configured in backend/.env.');
        }

        $remoteHost = $encryption === 'ssl' ? "ssl://{$host}" : $host;

        $socket = @stream_socket_client(
            "{$remoteHost}:{$port}",
            $errorNumber,
            $errorMessage,
            15,
            STREAM_CLIENT_CONNECT
        );

        if (!$socket) {
            throw new RuntimeException("SMTP connection failed: {$errorMessage} ({$errorNumber})");
        }

        stream_set_timeout($socket, 15);

        try {
            $this->expectResponse($socket, [220]);
            $this->sendCommand($socket, 'EHLO localhost', [250]);

            if ($encryption === 'tls') {
                $this->sendCommand($socket, 'STARTTLS', [220]);

                $cryptoEnabled = @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if ($cryptoEnabled !== true) {
                    throw new RuntimeException('Failed to enable TLS for SMTP.');
                }

                $this->sendCommand($socket, 'EHLO localhost', [250]);
            }

            if ($username !== '' || $password !== '') {
                $this->sendCommand($socket, 'AUTH LOGIN', [334]);
                $this->sendCommand($socket, base64_encode($username), [334]);
                $this->sendCommand($socket, base64_encode($password), [235]);
            }

            $fromEmail = (string) ($this->config['SIMS_SMTP_FROM_EMAIL'] ?? 'no-reply@sims.local');
            $this->sendCommand($socket, "MAIL FROM:<{$fromEmail}>", [250]);
            $this->sendCommand($socket, "RCPT TO:<{$to}>", [250, 251]);
            $this->sendCommand($socket, 'DATA', [354]);

            $headers = $this->buildHeaders($to, $subject);
            $payload = implode("\r\n", $headers)
                . "\r\n\r\n"
                . $this->escapeMessageBody($message)
                . "\r\n.\r\n";

            if (fwrite($socket, $payload) === false) {
                throw new RuntimeException('Failed to write SMTP message body.');
            }

            $this->expectResponse($socket, [250]);
            $this->sendCommand($socket, 'QUIT', [221]);
            fclose($socket);

            return true;
        } catch (Throwable $throwable) {
            fclose($socket);
            throw $throwable;
        }
    }

    private function buildHeaders(string $to, string $subject): array {
        $encodedSubject = function_exists('mb_encode_mimeheader')
            ? mb_encode_mimeheader($subject, 'UTF-8')
            : $subject;

        return [
            'Date: ' . date(DATE_RFC2822),
            "To: <{$to}>",
            'From: ' . $this->getFromHeader(),
            "Subject: {$encodedSubject}",
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit'
        ];
    }

    private function getFromHeader(): string {
        $fromName = (string) ($this->config['SIMS_SMTP_FROM_NAME'] ?? 'SIMS Notifications');
        $fromEmail = (string) ($this->config['SIMS_SMTP_FROM_EMAIL'] ?? 'no-reply@sims.local');

        return "{$fromName} <{$fromEmail}>";
    }

    private function escapeMessageBody(string $message): string {
        $normalized = str_replace(["\r\n", "\r"], "\n", $message);
        $lines = explode("\n", $normalized);

        foreach ($lines as &$line) {
            if (strpos($line, '.') === 0) {
                $line = '.' . $line;
            }
        }

        return implode("\r\n", $lines);
    }

    private function sendCommand($socket, string $command, array $expectedCodes): string {
        if (fwrite($socket, $command . "\r\n") === false) {
            throw new RuntimeException('Failed to write SMTP command.');
        }

        return $this->expectResponse($socket, $expectedCodes);
    }

    private function expectResponse($socket, array $expectedCodes): string {
        $response = '';

        while (($line = fgets($socket, 515)) !== false) {
            $response .= $line;

            if (strlen($line) < 4 || $line[3] !== '-') {
                break;
            }
        }

        if ($response === '') {
            throw new RuntimeException('SMTP server returned an empty response.');
        }

        $statusCode = (int) substr($response, 0, 3);
        if (!in_array($statusCode, $expectedCodes, true)) {
            $cleanResponse = trim(str_replace(["\r", "\n"], ' ', $response));
            throw new RuntimeException("SMTP error {$statusCode}: {$cleanResponse}");
        }

        return $response;
    }

    private function logFailure(string $to, string $subject, string $message, string $reason): void {
        if (!is_dir($this->logDirectory)) {
            @mkdir($this->logDirectory, 0777, true);
        }

        $logPath = $this->logDirectory . DIRECTORY_SEPARATOR . 'mail.log';
        $entry = '[' . date('Y-m-d H:i:s') . "] To: {$to}" . PHP_EOL
            . "Subject: {$subject}" . PHP_EOL
            . "Reason: {$reason}" . PHP_EOL
            . $message . PHP_EOL
            . str_repeat('-', 60) . PHP_EOL;

        @file_put_contents($logPath, $entry, FILE_APPEND);
    }
}
?>