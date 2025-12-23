export interface UserProfile {
  name: string;
  niche: string;
  goal: string;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  isOnboarded: boolean;
  completedLessons: string[]; // IDs of completed lessons
}

export interface ScriptHistoryItem {
  id: string;
  date: string;
  scriptSnippet: string;
  score: number;
  hook: string;
}

export interface AnalysisMetric {
  name: string;
  score: number; // 0-100
  color: string;
}

export interface ScriptAnalysisResult {
  overallScore: number;
  metrics: AnalysisMetric[];
  weakestArea: string;
  suggestion: string;
  improvedHook: string;
}

export interface VideoAnalysisResult {
  overallScore: number;
  feedback: string;
  pacingScore: number;
  visualScore: number;
  hookScore: number;
  prediction: string;
}

export interface Lesson {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: string; // Simplified content for MVP
  duration: string;
  xpReward: number;
  minLevel: number;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  SCRIPT_ANALYZER = 'SCRIPT_ANALYZER',
  VIDEO_ANALYZER = 'VIDEO_ANALYZER',
  LEARN = 'LEARN',
  PROFILE = 'PROFILE'
}

export const NICHES = [
  'Comedy', 'Education', 'Lifestyle', 'Finance', 'Tech', 'Fitness', 'Food', 'Dance'
];

export const GOALS = [
  'First Viral Video', 'Grow Followers', 'Improve Hooks', 'Sell Products', 'Consistency'
];
