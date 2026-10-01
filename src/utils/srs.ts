import { DisplaySettings, SRSItemData, SRSRating, UserStats } from '../types';

const STORAGE_KEYS = {
  SRS_DATA: 'nihongo_master_srs_data_v1',
  USER_STATS: 'nihongo_master_stats_v1',
  SETTINGS: 'nihongo_master_settings_v1',
  BOOKMARKS: 'nihongo_master_bookmarks_v1',
};

export const DEFAULT_SETTINGS: DisplaySettings = {
  showKanji: true,
  showFurigana: true,
  showKana: true,
  showRomaji: false,
  showEnglish: true,
  showBengali: true,
  speechRate: 1.0,
  theme: 'system',
  fontSize: 'm',
};

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    const today = getTodayDateString();
    if (raw) {
      const stats: UserStats = JSON.parse(raw);
      // Check streak continuity
      const lastDate = new Date(stats.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day
        return stats;
      } else if (diffDays === 1) {
        // Consecutive day
        return {
          ...stats,
          lastActiveDate: today,
          cardsReviewedToday: 0,
        };
      } else {
        // Streak broken
        return {
          ...stats,
          streak: 1,
          lastActiveDate: today,
          cardsReviewedToday: 0,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load user stats', e);
  }

  return {
    xp: 0,
    streak: 1,
    lastActiveDate: getTodayDateString(),
    cardsReviewedToday: 0,
    totalReviews: 0,
  };
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function loadSRSData(): Record<number, SRSItemData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SRS_DATA);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load SRS data', e);
  }
  return {};
}

export function saveSRSData(data: Record<number, SRSItemData>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SRS_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save SRS data', e);
  }
}

export function loadSettings(): DisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: DisplaySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load bookmarks', e);
  }
  return [];
}

export function saveBookmarks(bookmarks: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}

/**
 * SuperMemo SM-2 variation for SRS calculate
 */
export function calculateNextReview(
  currentData: SRSItemData | undefined,
  rating: SRSRating
): { nextData: SRSItemData; xpEarned: number } {
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const current: SRSItemData = currentData || {
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReview: now,
    historyCount: 0,
  };

  let interval = current.interval;
  let repetition = current.repetition;
  let easeFactor = current.easeFactor;
  let xp = 10;

  if (rating === 'hard') {
    interval = 1;
    repetition = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    xp = 3;
  } else if (rating === 'good') {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
    xp = 2;
  } else if (rating === 'easy') {
    if (repetition === 0) {
      interval = 3;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
    repetition += 1;
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    xp = 1;
  }

  const nextReview = now + interval * ONE_DAY_MS;

  const nextData: SRSItemData = {
    interval,
    repetition,
    easeFactor,
    nextReview,
    lastRating: rating,
    historyCount: current.historyCount + 1,
  };

  return { nextData, xpEarned: xp };
}

export function formatInterval(days: number): string {
  if (days <= 0) return '1d';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  if (days < 365) {
    const months = Math.round((days / 30) * 10) / 10;
    return Number.isInteger(months) ? `${months}mo` : `${months.toFixed(1)}mo`;
  }
  const years = Math.round((days / 365) * 10) / 10;
  return Number.isInteger(years) ? `${years}y` : `${years.toFixed(1)}y`;
}

/**
 * Real-world scientific interval preview for Flashcard buttons (SM-2 projection)
 */
export function previewNextInterval(
  currentData: SRSItemData | undefined,
  rating: SRSRating
): { days: number; label: string } {
  const current: SRSItemData = currentData || {
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReview: Date.now(),
    historyCount: 0,
  };

  let interval = current.interval;
  const repetition = current.repetition;
  const easeFactor = current.easeFactor;

  if (rating === 'hard') {
    interval = 1;
  } else if (rating === 'good') {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  } else if (rating === 'easy') {
    if (repetition === 0) {
      interval = 3;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
  }

  const safeDays = Math.max(1, interval);
  return {
    days: safeDays,
    label: formatInterval(safeDays),
  };
}

/**
 * Ebbinghaus Forgetting Curve memory retention estimate: R = e^(-t/S)
 */
export function estimateRetention(data: SRSItemData | undefined): number {
  if (!data || data.historyCount === 0) return 0;
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const stability = Math.max(1, data.interval);
  const elapsedDays = Math.max(0, (now - (data.nextReview - stability * ONE_DAY_MS)) / ONE_DAY_MS);
  // Target ~90% recall at interval expiration: R = exp(-0.105 * (t / S))
  const retention = Math.round(Math.exp(-0.105 * (elapsedDays / stability)) * 100);
  return Math.min(100, Math.max(15, retention));
}

export function getMasteryLevel(data: SRSItemData | undefined): 'new' | 'learning' | 'review' | 'mastered' {
  if (!data || data.historyCount === 0) return 'new';
  if (data.repetition >= 4) return 'mastered';
  if (data.repetition >= 2) return 'review';
  return 'learning';
}
