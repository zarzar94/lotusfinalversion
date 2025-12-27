import type { ReactNode } from 'react';
import type { IconProps } from './Icon';
import {
  BrainCircuitIcon,
  HeadsetIcon,
  WaveformIcon,
  SpectrogramIcon,
  ShieldMedicalIcon,
  SchoolIcon,
  ClinicianIcon,
  ParentIcon,
  ReportIcon,
  DownloadIcon,
  XIcon,
  PlayIcon,
  CircleIcon,
  MicroscopeIcon,
  CheckCircleIcon,
  StarIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  BookIcon,
  ChartIcon,
  TargetIcon,
  ChecklistIcon,
  LightbulbIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  CalendarIcon,
  MapPinIcon,
  MessageIcon,
  LockIcon,
  FlameIcon,
  TrophyIcon,
  RocketIcon,
  GamepadIcon,
  SearchIcon,
  SparklesIcon,
  InfoIcon,
  WarningTriangleIcon,
  MonitorIcon,
  GlobeIcon,
  EyeIcon,
  CoinIcon,
} from './LabIcons';

const EMOJI_TARGET = '\u{1F3AF}';
const EMOJI_CLIPBOARD = '\u{1F4CB}';
const EMOJI_BRAIN = '\u{1F9E0}';
const EMOJI_CHART = '\u{1F4CA}';
const EMOJI_CHART_UP = '\u{1F4C8}';
const EMOJI_BOOKS = '\u{1F4DA}';
const EMOJI_BUILDING = '\u{1F3DB}\u{FE0F}';
const EMOJI_ENVELOPE = '\u{2709}\u{FE0F}';
const EMOJI_ROCKET = '\u{1F680}';
const EMOJI_MICROSCOPE = '\u{1F52C}';
const EMOJI_TEST_TUBE = '\u{1F9EA}';
const EMOJI_LAPTOP = '\u{1F4BB}';
const EMOJI_GLOBE = '\u{1F310}';
const EMOJI_HOME_GARDEN = '\u{1F3E1}';
const EMOJI_HOME = '\u{1F3E0}';
const EMOJI_PHONE = '\u{1F4DE}';
const EMOJI_TELEPHONE = '\u{260E}\u{FE0F}';
const EMOJI_GRADUATION = '\u{1F393}';
const EMOJI_CHECK = '\u{2705}';
const EMOJI_SCHOOL = '\u{1F3EB}';
const EMOJI_HOSPITAL = '\u{1F3E5}';
const EMOJI_FAMILY = '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}';
const EMOJI_FAMILY_SMALL = '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}';
const EMOJI_LIGHTBULB = '\u{1F4A1}';
const EMOJI_WARNING = '\u{26A0}\u{FE0F}';
const EMOJI_QUESTION = '\u{2753}';
const EMOJI_COMPASS = '\u{1F9ED}';
const EMOJI_MAP = '\u{1F5FA}\u{FE0F}';
const EMOJI_FILE = '\u{1F4C4}';
const EMOJI_FOLDER = '\u{1F4C1}';
const EMOJI_SCROLL = '\u{1F4DC}';
const EMOJI_WAVE = '\u{3030}\u{FE0F}';
const EMOJI_WAVE_WATER = '\u{1F30A}';
const EMOJI_SPEAKER = '\u{1F50A}';
const EMOJI_HEADSET = '\u{1F3A7}';
const EMOJI_EAR = '\u{1F442}';
const EMOJI_SHELL = '\u{1F41A}';
const EMOJI_SPEECH = '\u{1F5E3}\u{FE0F}';
const EMOJI_CHAT = '\u{1F4AC}';
const EMOJI_SATELLITE = '\u{1F4E1}';
const EMOJI_EYE = '\u{1F441}\u{FE0F}';
const EMOJI_MONEY = '\u{1F4B0}';
const EMOJI_SHIELD = '\u{1F6E1}\u{FE0F}';
const EMOJI_GEAR = '\u{2699}\u{FE0F}';
const EMOJI_WRENCH = '\u{1F527}';
const EMOJI_BELL = '\u{1F514}';
const EMOJI_LOCK = '\u{1F512}';
const EMOJI_PLAY = '\u{1F3AC}';
const EMOJI_GAME = '\u{1F3AE}';
const EMOJI_MUSIC = '\u{1F3B5}';
const EMOJI_MUSIC_ALT = '\u{1F3BC}';
const EMOJI_MUSIC_SCORE = '\u{1F3BC}';
const EMOJI_MUTE = '\u{1F507}';
const EMOJI_STAR = '\u{2B50}';
const EMOJI_STAR_ALT = '\u{1F31F}';
const EMOJI_PARTY = '\u{1F389}';
const EMOJI_CONFETTI = '\u{1F38A}';
const EMOJI_FINISH = '\u{1F3C1}';
const EMOJI_TROPHY = '\u{1F3C6}';
const EMOJI_MEDAL = '\u{1F3C5}';
const EMOJI_MEDAL_GOLD = '\u{1F947}';
const EMOJI_MEDAL_SILVER = '\u{1F948}';
const EMOJI_MEDAL_BRONZE = '\u{1F949}';
const EMOJI_CROWN = '\u{1F451}';
const EMOJI_FIRE = '\u{1F525}';
const EMOJI_USER = '\u{1F44B}';
const EMOJI_PALETTE = '\u{1F3A8}';
const EMOJI_CALENDAR = '\u{1F4C5}';
const EMOJI_CALENDAR_SPIRAL = '\u{1F5D3}\u{FE0F}';
const EMOJI_HOURGLASS = '\u{23F3}';
const EMOJI_STOPWATCH = '\u{23F1}\u{FE0F}';
const EMOJI_CLOCK = '\u{1F550}';
const EMOJI_PIN = '\u{1F4CD}';
const EMOJI_HANDSHAKE = '\u{1F91D}';
const EMOJI_SPARKLES = '\u{2728}';
const EMOJI_SPARKLE_TRAIL = '\u{1F4AB}';
const EMOJI_DIAMOND = '\u{1F48E}';
const EMOJI_SEARCH = '\u{1F50D}';
const EMOJI_STETHOSCOPE = '\u{1FA7A}';
const EMOJI_INFO = '\u{2139}\u{FE0F}';
const EMOJI_DOCTOR = '\u{1F468}\u{200D}\u{2695}\u{FE0F}';
const EMOJI_DOCTOR_WOMAN = '\u{1F469}\u{200D}\u{2695}\u{FE0F}';
const EMOJI_DNA = '\u{1F9EC}';
const EMOJI_PUZZLE = '\u{1F9E9}';
const EMOJI_HANDS = '\u{1F932}';
const EMOJI_GREEN_HEART = '\u{1F49A}';
const EMOJI_BLUE_HEART = '\u{1F499}';
const EMOJI_LOTUS = '\u{1FAB7}';
const EMOJI_SHUSH = '\u{1F92B}';
const EMOJI_BABY = '\u{1F476}';
const EMOJI_GLOBE_EARTH = '\u{1F30D}';
const SYMBOL_CHECK = '\u2713';
const SYMBOL_X = '\u2715';

const emojiIconMap: Record<string, (props: IconProps) => JSX.Element> = {
  [EMOJI_TARGET]: (props) => <TargetIcon {...props} />,
  [EMOJI_CLIPBOARD]: (props) => <ChecklistIcon {...props} />,
  [EMOJI_BRAIN]: (props) => <BrainCircuitIcon {...props} />,
  [EMOJI_CHART]: (props) => <ChartIcon {...props} />,
  [EMOJI_CHART_UP]: (props) => <ChartIcon {...props} />,
  [EMOJI_BOOKS]: (props) => <BookIcon {...props} />,
  [EMOJI_BUILDING]: (props) => <SchoolIcon {...props} />,
  [EMOJI_ENVELOPE]: (props) => <MailIcon {...props} />,
  [EMOJI_ROCKET]: (props) => <RocketIcon {...props} />,
  [EMOJI_MICROSCOPE]: (props) => <MicroscopeIcon {...props} />,
  [EMOJI_TEST_TUBE]: (props) => <MicroscopeIcon {...props} />,
  [EMOJI_LAPTOP]: (props) => <MonitorIcon {...props} />,
  [EMOJI_GLOBE]: (props) => <GlobeIcon {...props} />,
  [EMOJI_HOME_GARDEN]: (props) => <HomeIcon {...props} />,
  [EMOJI_HOME]: (props) => <HomeIcon {...props} />,
  [EMOJI_PHONE]: (props) => <PhoneIcon {...props} />,
  [EMOJI_TELEPHONE]: (props) => <PhoneIcon {...props} />,
  [EMOJI_GRADUATION]: (props) => <SchoolIcon {...props} />,
  [EMOJI_CHECK]: (props) => <CheckCircleIcon {...props} />,
  [EMOJI_SCHOOL]: (props) => <SchoolIcon {...props} />,
  [EMOJI_HOSPITAL]: (props) => <ShieldMedicalIcon {...props} />,
  [EMOJI_FAMILY]: (props) => <ParentIcon {...props} />,
  [EMOJI_FAMILY_SMALL]: (props) => <ParentIcon {...props} />,
  [EMOJI_LIGHTBULB]: (props) => <LightbulbIcon {...props} />,
  [EMOJI_WARNING]: (props) => <WarningTriangleIcon {...props} />,
  [EMOJI_QUESTION]: (props) => <InfoIcon {...props} />,
  [EMOJI_COMPASS]: (props) => <MapPinIcon {...props} />,
  [EMOJI_MAP]: (props) => <MapPinIcon {...props} />,
  [EMOJI_FILE]: (props) => <ReportIcon {...props} />,
  [EMOJI_FOLDER]: (props) => <ReportIcon {...props} />,
  [EMOJI_SCROLL]: (props) => <ReportIcon {...props} />,
  [EMOJI_WAVE]: (props) => <WaveformIcon {...props} />,
  [EMOJI_WAVE_WATER]: (props) => <WaveformIcon {...props} />,
  [EMOJI_SPEAKER]: (props) => <WaveformIcon {...props} />,
  [EMOJI_HEADSET]: (props) => <HeadsetIcon {...props} />,
  [EMOJI_EAR]: (props) => <HeadsetIcon {...props} />,
  [EMOJI_SHELL]: (props) => <SpectrogramIcon {...props} />,
  [EMOJI_SPEECH]: (props) => <MessageIcon {...props} />,
  [EMOJI_CHAT]: (props) => <MessageIcon {...props} />,
  [EMOJI_SATELLITE]: (props) => <WaveformIcon {...props} />,
  [EMOJI_EYE]: (props) => <EyeIcon {...props} />,
  [EMOJI_MONEY]: (props) => <CoinIcon {...props} />,
  [EMOJI_SHIELD]: (props) => <ShieldMedicalIcon {...props} />,
  [EMOJI_GEAR]: (props) => <SettingsIcon {...props} />,
  [EMOJI_WRENCH]: (props) => <SettingsIcon {...props} />,
  [EMOJI_BELL]: (props) => <BellIcon {...props} />,
  [EMOJI_LOCK]: (props) => <LockIcon {...props} />,
  [EMOJI_PLAY]: (props) => <PlayIcon {...props} />,
  [EMOJI_GAME]: (props) => <GamepadIcon {...props} />,
  [EMOJI_MUSIC]: (props) => <WaveformIcon {...props} />,
  [EMOJI_MUSIC_ALT]: (props) => <SpectrogramIcon {...props} />,
  [EMOJI_MUSIC_SCORE]: (props) => <SpectrogramIcon {...props} />,
  [EMOJI_MUTE]: (props) => <WaveformIcon {...props} />,
  [EMOJI_STAR]: (props) => <StarIcon {...props} />,
  [EMOJI_STAR_ALT]: (props) => <StarIcon {...props} />,
  [EMOJI_PARTY]: (props) => <SparklesIcon {...props} />,
  [EMOJI_CONFETTI]: (props) => <SparklesIcon {...props} />,
  [EMOJI_FINISH]: (props) => <CheckCircleIcon {...props} />,
  [EMOJI_TROPHY]: (props) => <TrophyIcon {...props} />,
  [EMOJI_MEDAL]: (props) => <TrophyIcon {...props} />,
  [EMOJI_MEDAL_GOLD]: (props) => <TrophyIcon {...props} />,
  [EMOJI_MEDAL_SILVER]: (props) => <TrophyIcon {...props} />,
  [EMOJI_MEDAL_BRONZE]: (props) => <TrophyIcon {...props} />,
  [EMOJI_CROWN]: (props) => <StarIcon {...props} />,
  [EMOJI_FIRE]: (props) => <FlameIcon {...props} />,
  [EMOJI_USER]: (props) => <UserIcon {...props} />,
  [EMOJI_PALETTE]: (props) => <SparklesIcon {...props} />,
  [EMOJI_CALENDAR]: (props) => <CalendarIcon {...props} />,
  [EMOJI_CALENDAR_SPIRAL]: (props) => <CalendarIcon {...props} />,
  [EMOJI_HOURGLASS]: (props) => <CalendarIcon {...props} />,
  [EMOJI_STOPWATCH]: (props) => <CalendarIcon {...props} />,
  [EMOJI_CLOCK]: (props) => <CalendarIcon {...props} />,
  [EMOJI_PIN]: (props) => <MapPinIcon {...props} />,
  [EMOJI_HANDSHAKE]: (props) => <CheckCircleIcon {...props} />,
  [EMOJI_SPARKLES]: (props) => <SparklesIcon {...props} />,
  [EMOJI_SPARKLE_TRAIL]: (props) => <SparklesIcon {...props} />,
  [EMOJI_DIAMOND]: (props) => <SparklesIcon {...props} />,
  [EMOJI_SEARCH]: (props) => <SearchIcon {...props} />,
  [EMOJI_STETHOSCOPE]: (props) => <ClinicianIcon {...props} />,
  [EMOJI_INFO]: (props) => <InfoIcon {...props} />,
  [EMOJI_DOCTOR]: (props) => <ClinicianIcon {...props} />,
  [EMOJI_DOCTOR_WOMAN]: (props) => <ClinicianIcon {...props} />,
  [EMOJI_DNA]: (props) => <BrainCircuitIcon {...props} />,
  [EMOJI_PUZZLE]: (props) => <BrainCircuitIcon {...props} />,
  [EMOJI_HANDS]: (props) => <ParentIcon {...props} />,
  [EMOJI_GREEN_HEART]: (props) => <SparklesIcon {...props} />,
  [EMOJI_BLUE_HEART]: (props) => <SparklesIcon {...props} />,
  [EMOJI_LOTUS]: (props) => <SparklesIcon {...props} />,
  [EMOJI_SHUSH]: (props) => <LockIcon {...props} />,
  [EMOJI_BABY]: (props) => <UserIcon {...props} />,
  [EMOJI_GLOBE_EARTH]: (props) => <GlobeIcon {...props} />,
  [SYMBOL_CHECK]: (props) => <CheckCircleIcon {...props} />,
  [SYMBOL_X]: (props) => <XIcon {...props} />,
};

export const renderLabIcon = (icon: ReactNode, props: IconProps = {}) => {
  if (icon === null || icon === undefined) return null;
  if (typeof icon === 'string') {
    const trimmed = icon.trim();
    if (!trimmed) return null;
    const IconComp = emojiIconMap[trimmed];
    if (IconComp) return <IconComp {...props} />;
    return <span aria-hidden="true">{icon}</span>;
  }
  return icon;
};
