import { brandCyan, brandPurple, brandPink } from '../../styles';
import type { IconProps, IconTone } from './Icon';
import {
  BrainCircuitIcon,
  HeadsetIcon,
  WaveformIcon,
  SpectrogramIcon,
  ShieldMedicalIcon,
  ReportIcon,
  SchoolIcon,
  ParentIcon,
} from './LabIcons';

export type BrainFunctionIconKey =
  | 'auditory'
  | 'language'
  | 'balance'
  | 'wellbeing'
  | 'music'
  | 'memory'
  | 'behavior'
  | 'learning'
  | 'sensory'
  | 'attention';

const iconMap: Record<BrainFunctionIconKey, (props: IconProps) => JSX.Element> = {
  auditory: (props) => <HeadsetIcon {...props} />,
  language: (props) => <WaveformIcon {...props} />,
  balance: (props) => <ShieldMedicalIcon {...props} />,
  wellbeing: (props) => <ParentIcon {...props} />,
  music: (props) => <SpectrogramIcon {...props} />,
  memory: (props) => <ReportIcon {...props} />,
  behavior: (props) => <BrainCircuitIcon {...props} />,
  learning: (props) => <SchoolIcon {...props} />,
  sensory: (props) => <SpectrogramIcon {...props} />,
  attention: (props) => <BrainCircuitIcon {...props} />,
};

export const toneFromColor = (color: string): IconTone => {
  const normalized = color.toLowerCase();
  if (normalized === brandCyan.toLowerCase()) return 'cyan';
  if (normalized === brandPurple.toLowerCase()) return 'purple';
  if (normalized === brandPink.toLowerCase()) return 'pink';
  return 'muted';
};

export const renderBrainFunctionIcon = (key: string, props: IconProps) => {
  const iconKey = Object.prototype.hasOwnProperty.call(iconMap, key)
    ? (key as BrainFunctionIconKey)
    : 'attention';
  return iconMap[iconKey](props);
};
