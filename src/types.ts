export interface ExampleSentence {
  context: "Daily Life" | "Emotional/Relatable";
  japanese: string;
  english: string;
  bengali: string;
}

export interface VocabItem {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  bengali: string;
  sentences: [ExampleSentence, ExampleSentence];
  category?: string;
  emoji?: string;
}

export type SRSRating = "hard" | "good" | "easy";

export interface SRSItemData {
  interval: number; // days
  repetition: number;
  easeFactor: number;
  nextReview: number; // timestamp
  lastRating?: SRSRating;
  historyCount: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  cardsReviewedToday: number;
  totalReviews: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 's' | 'm' | 'l';

export interface DisplaySettings {
  showKanji: boolean;
  showFurigana: boolean;
  showKana: boolean;
  showRomaji: boolean;
  showEnglish: boolean;
  showBengali: boolean;
  speechRate: number; // 0.75, 1.0, 1.25
  theme: ThemeMode;
  fontSize: FontSize;
}
