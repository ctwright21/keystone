import {
  Star,
  Sun,
  Moon,
  Sunrise,
  Coffee,
  Dumbbell,
  Heart,
  Brain,
  Book,
  Pencil,
  Code,
  Music,
  Camera,
  Gamepad2,
  Bike,
  Car,
  Plane,
  Home,
  Briefcase,
  GraduationCap,
  Trophy,
  Target,
  Flame,
  Zap,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Ban,
  Droplets,
  Apple,
  Salad,
  Pill,
  Bed,
  Bath,
  Smile,
  Frown,
  Users,
  User,
  Baby,
  Dog,
  Cat,
  Leaf,
  TreeDeciduous,
  Flower2,
  Mountain,
  Waves,
  Wind,
  Cigarette,
  Wine,
  Beer,
  Utensils,
  Wallet,
  PiggyBank,
  TrendingUp,
  Phone,
  Mail,
  MessageCircle,
  Laptop,
  Tv,
  Headphones,
  Mic,
  Video,
  type LucideIcon,
} from "lucide-react";

// Map of icon names to Lucide components
export const HABIT_ICONS: Record<string, LucideIcon> = {
  // Default
  star: Star,

  // Time of day
  sun: Sun,
  moon: Moon,
  sunrise: Sunrise,
  clock: Clock,
  calendar: Calendar,

  // Health & Fitness
  dumbbell: Dumbbell,
  heart: Heart,
  bed: Bed,
  bath: Bath,
  droplets: Droplets,
  pill: Pill,

  // Food & Drink
  coffee: Coffee,
  apple: Apple,
  salad: Salad,
  utensils: Utensils,

  // Bad habits to break
  cigarette: Cigarette,
  wine: Wine,
  beer: Beer,
  ban: Ban,
  "x-circle": XCircle,

  // Mind & Learning
  brain: Brain,
  book: Book,
  "graduation-cap": GraduationCap,
  pencil: Pencil,

  // Work & Productivity
  briefcase: Briefcase,
  laptop: Laptop,
  code: Code,
  target: Target,
  "check-circle": CheckCircle,
  "trending-up": TrendingUp,

  // Entertainment
  music: Music,
  headphones: Headphones,
  camera: Camera,
  gamepad: Gamepad2,
  tv: Tv,
  mic: Mic,
  video: Video,

  // Social & Communication
  users: Users,
  user: User,
  baby: Baby,
  smile: Smile,
  frown: Frown,
  phone: Phone,
  mail: Mail,
  "message-circle": MessageCircle,

  // Home & Pets
  home: Home,
  dog: Dog,
  cat: Cat,

  // Travel & Transportation
  bike: Bike,
  car: Car,
  plane: Plane,

  // Nature
  leaf: Leaf,
  tree: TreeDeciduous,
  flower: Flower2,
  mountain: Mountain,
  waves: Waves,
  wind: Wind,

  // Achievement & Motivation
  trophy: Trophy,
  flame: Flame,
  zap: Zap,

  // Finance
  wallet: Wallet,
  "piggy-bank": PiggyBank,
};

// Organized icon categories for the picker
export const HABIT_ICON_CATEGORIES = {
  "Health & Fitness": ["dumbbell", "heart", "bed", "bath", "droplets", "pill", "apple", "salad"],
  "Morning & Evening": ["sun", "moon", "sunrise", "coffee", "clock"],
  "Work & Learning": ["briefcase", "laptop", "code", "book", "brain", "pencil", "graduation-cap", "target"],
  "Social & Family": ["users", "user", "baby", "smile", "phone", "message-circle", "home"],
  "Break Bad Habits": ["ban", "x-circle", "cigarette", "wine", "beer"],
  "Hobbies": ["music", "headphones", "camera", "gamepad", "tv", "mic", "video"],
  "Outdoors & Nature": ["bike", "mountain", "waves", "leaf", "tree", "flower", "wind"],
  "Goals & Finance": ["trophy", "flame", "zap", "star", "wallet", "piggy-bank", "trending-up"],
};

// Get icon component by name
export function getHabitIcon(iconName: string): LucideIcon {
  return HABIT_ICONS[iconName] || Star;
}

// Render habit icon component
export function HabitIcon({
  name,
  className = "w-5 h-5"
}: {
  name: string;
  className?: string;
}) {
  const Icon = getHabitIcon(name);
  return <Icon className={className} />;
}
