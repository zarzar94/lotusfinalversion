import { Icon, type IconProps } from './Icon';

export function BrainCircuitIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
      <circle cx="8.5" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <path d="M8.5 9h2" />
      <path d="M13 7h2.5" />
      <path d="M13 15h2.5" />
    </Icon>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </Icon>
  );
}

export function WaveformIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 12h3l2-4 4 8 2-4h4l2 4h3" />
    </Icon>
  );
}

export function SpectrogramIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="10" width="2" height="8" rx="1" fill="currentColor" stroke="none" />
      <rect x="7" y="6" width="2" height="12" rx="1" fill="currentColor" stroke="none" />
      <rect x="11" y="3" width="2" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="15" y="7" width="2" height="11" rx="1" fill="currentColor" stroke="none" />
      <rect x="19" y="11" width="2" height="7" rx="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function ShieldMedicalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 7v6" />
      <path d="M9 10h6" />
    </Icon>
  );
}

export function SchoolIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
      <path d="M9 8h6" />
      <path d="M12 5v3" />
    </Icon>
  );
}

export function ClinicianIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </Icon>
  );
}

export function ParentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="16.5" cy="10" r="2" />
      <path d="M2.5 20c0-3.2 2.8-5.5 6-5.5h0c3.2 0 6 2.3 6 5.5" />
      <path d="M13.5 20c0-2.2 1.8-3.8 4-3.8h0c2.2 0 4 1.6 4 3.8" />
    </Icon>
  );
}

export function ReportIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="7 14 10 11 13 14 17 10" />
    </Icon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="6 4 19 12 6 20 6 4" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function CircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Icon>
  );
}

export function MicroscopeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" />
    </Icon>
  );
}
