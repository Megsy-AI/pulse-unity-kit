export type NomiShape = "round" | "cat" | "bear" | "star" | "robot";

export type NomiPose =
  | "idle"
  | "wave"
  | "shopping"
  | "reminder"
  | "calendar"
  | "search"
  | "write"
  | "email"
  | "call"
  | "travel"
  | "celebrate"
  | "think";

export type NomiPersonality = "friendly" | "calm" | "playful" | "focused" | "wise";
export type NomiTone = "warm" | "casual" | "formal" | "short";
export type NomiLanguage = "en" | "ar";

export interface NomiCompanion {
  name: string;
  shape: NomiShape;
  baseColor: string;
  accentColor: string;
  personality: NomiPersonality;
  tone: NomiTone;
  language: NomiLanguage;
  voice: "soft" | "bright" | "deep";
  onboarded: boolean;
}

export interface NomiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  pose: NomiPose;
  createdAt: string;
}

export interface NomiTask {
  id: string;
  title: string;
  note?: string;
  kind: "task" | "reminder";
  dueAt?: string | null;
  done: boolean;
  createdAt: string;
}

export interface NomiMemory {
  id: string;
  category: string;
  content: string;
  enabled: boolean;
  createdAt: string;
}

export interface NomiPermissions {
  calls: boolean;
  email: boolean;
  calendar: boolean;
  web: boolean;
  microphone: boolean;
  memory: boolean;
}

export const DEFAULT_COMPANION: NomiCompanion = {
  name: "Nomi",
  shape: "round",
  baseColor: "#7C5CFF",
  accentColor: "#FFB86B",
  personality: "friendly",
  tone: "warm",
  language: "en",
  voice: "soft",
  onboarded: false,
};

export const DEFAULT_PERMISSIONS: NomiPermissions = {
  calls: false,
  email: false,
  calendar: false,
  web: false,
  microphone: false,
  memory: true,
};
