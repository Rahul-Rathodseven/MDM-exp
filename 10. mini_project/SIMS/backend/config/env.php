<?php
$envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';

$defaults = [
    'SIMS_MAIL_TRANSPORT' => 'smtp',
    'SIMS_SMTP_HOST' => '',
    'SIMS_SMTP_PORT' => '587',
    'SIMS_SMTP_ENCRYPTION' => 'tls',
    'SIMS_SMTP_USERNAME' => '',
    'SIMS_SMTP_PASSWORD' => '',
    'SIMS_SMTP_FROM_EMAIL' => 'no-reply@sims.local',
    'SIMS_SMTP_FROM_NAME' => 'SIMS Notifications'
];

$values = [];

if (is_file($envFile)) {
    $parsedValues = parse_ini_file($envFile, false, INI_SCANNER_RAW);
    if (is_array($parsedValues)) {
        $values = $parsedValues;
    }
}

return array_merge($defaults, $values);
?>