const Icon = ({ children, className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
);

export const TicketIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M7 4.75h10a2.25 2.25 0 0 1 2.25 2.25v3.5a2 2 0 0 0 0 3V17A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17v-3.5a2 2 0 0 0 0-3V7A2.25 2.25 0 0 1 7 4.75Z" />
    <path d="M9.5 9.5h5" />
    <path d="M9.5 14.5h3" />
  </Icon>
);

export const ClockIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.75v4.5l3 1.75" />
  </Icon>
);

export const CheckCircleIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="m8.75 12 2.25 2.25L15.75 9.5" />
  </Icon>
);

export const SparkIcon = ({ className }) => (
  <Icon className={className}>
    <path d="m12 3.75 1.75 4.5L18.25 10l-4.5 1.75L12 16.25l-1.75-4.5L5.75 10l4.5-1.75L12 3.75Z" />
    <path d="M18.5 4.5v2" />
    <path d="M19.5 5.5h-2" />
  </Icon>
);

export const FlagIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M5.75 20.25v-16.5" />
    <path d="M7.5 5.25h8.75l-1.75 3.5 1.75 3.5H7.5" />
  </Icon>
);

export const TimelineIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M6.5 6.5h4" />
    <path d="M13.5 6.5h4" />
    <path d="M10.5 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
    <path d="M6.5 12h4" />
    <path d="M13.5 12h4" />
    <path d="M10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
    <path d="M6.5 17.5h4" />
    <path d="M13.5 17.5h4" />
    <path d="M10.5 17.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
  </Icon>
);

export const UserIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M12 12.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
    <path d="M6.25 18.25a5.75 5.75 0 0 1 11.5 0" />
  </Icon>
);

export const ArrowLeftIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M15.75 5.75 9.5 12l6.25 6.25" />
    <path d="M9.75 12h8.5" />
  </Icon>
);

export const MailIcon = ({ className }) => (
  <Icon className={className}>
    <rect x="4.25" y="6.25" width="15.5" height="11.5" rx="2.25" />
    <path d="m5.5 7.5 6.5 5 6.5-5" />
  </Icon>
);

export const PaperclipIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M9.5 13.5 15 8a3 3 0 1 0-4.25-4.25L4.5 10A5 5 0 0 0 11.57 17l6.18-6.18" />
  </Icon>
);

export const DownloadIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M12 4.5v10" />
    <path d="m8.25 10.75 3.75 3.75 3.75-3.75" />
    <path d="M5.5 18.5h13" />
  </Icon>
);

export const ChatIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M5 6.75A2.75 2.75 0 0 1 7.75 4h8.5A2.75 2.75 0 0 1 19 6.75v6.5A2.75 2.75 0 0 1 16.25 16H11l-4.75 3v-3H7.75A2.75 2.75 0 0 1 5 13.25Z" />
  </Icon>
);

export const SendIcon = ({ className }) => (
  <Icon className={className}>
    <path d="m4.75 12 14.5-6.75-3.5 13.5-3.5-4.25-4.5-2.5Z" />
    <path d="M12.25 14.5 19.25 5.25" />
  </Icon>
);

export const ExportIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M12 15.5V4.75" />
    <path d="m8.25 8.5 3.75-3.75 3.75 3.75" />
    <path d="M5.25 19.25h13.5" />
  </Icon>
);