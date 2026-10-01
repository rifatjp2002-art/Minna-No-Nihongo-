import React, { useState, useEffect, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { ALL_LESSONS } from './data/lessonsConfig';
import { DisplaySettings, SRSItemData, SRSRating, UserStats, VocabItem } from './types';
import {
  calculateNextReview,
  getTodayDateString,
  loadSettings,
  loadSRSData,
  loadUserStats,
  loadBookmarks,
  saveSettings,
  saveSRSData,
  saveUserStats,
  saveBookmarks,
} from './utils/srs';
import {
  initAuthSession,
  testFirebaseConnection,
  syncUserStatsToCloud,
  syncSRSItemToCloud,
  syncSettingsToCloud,
  fetchCloudUserData,
  signInWithGoogle,
  signOutUser,
} from './utils/firebase';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { LessonDirectory } from './components/LessonDirectory';
import { VocabListView } from './components/VocabListView';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ProgressView } from './components/ProgressView';
import { SettingsSheet } from './components/SettingsSheet';
import { LessonPickerModal } from './components/LessonPickerModal';
import { CommutePlayerModal } from './components/CommutePlayerModal';

export default function App() {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [srsData, setSrsData] = useState<Record<number, SRSItemData>>(loadSRSData);
  const [settings, setSettings] = useState<DisplaySettings>(loadSettings);
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<number>>(() => new Set(loadBookmarks()));
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavTab>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('26');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLessonPickerOpen, setIsLessonPickerOpen] = useState(false);
  const [isCommutePlayerOpen, setIsCommutePlayerOpen] = useState(false);
  const [isReviewSession, setIsReviewSession] = useState(false);
  const [customReviewDeck, setCustomReviewDeck] = useState<VocabItem[]>([]);

  // 1. THEME MANAGEMENT: Light, Dark, System
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && mediaQuery.matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings.theme]);

  // 2. FONT SIZE MANAGEMENT: S, M, L
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', settings.fontSize || 'm');
  }, [settings.fontSize]);

  // 3. PERSIST STATE TO LOCALSTORAGE (Immediate Local-First storage)
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  useEffect(() => {
    saveSRSData(srsData);
  }, [srsData]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveBookmarks(Array.from(bookmarkedKeys));
  }, [bookmarkedKeys]);

  // 4. FIREBASE CLOUD SYNC INITIALIZATION (Silent Background Sync)
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = initAuthSession(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Silent non-blocking cloud check
        const cloud = await fetchCloudUserData(user.uid);
        if (cloud.stats) {
          setStats((prev) => ({
            ...prev,
            xp: Math.max(prev.xp, cloud.stats?.xp ?? 0),
            streak: Math.max(prev.streak, cloud.stats?.streak ?? 0),
          }));
        }
        // Background sync current state to cloud
        syncUserStatsToCloud(user.uid, stats);
      }
    });

    return () => unsubscribe();
  }, []);

  // Current lesson metadata
  const currentLesson = useMemo(() => {
    const found = ALL_LESSONS.find((l) => l.id === selectedLessonId);
    return found || ALL_LESSONS[0];
  }, [selectedLessonId]);

  // Subset of SRS data for the currently selected lesson
  const lessonSrsData = useMemo(() => {
    const subset: Record<number, SRSItemData> = {};
    for (const item of currentLesson.vocab) {
      const key = currentLesson.number * 100 + item.id;
      if (srsData[key]) {
        subset[item.id] = srsData[key];
      }
    }
    return subset;
  }, [currentLesson, srsData]);

  // Daily review deck calculation (Due cards prioritized by forgetting curve + new cards up to 20)
  const { dueCards, newCards, fullReviewDeck } = useMemo(() => {
    const now = Date.now();
    const dues: VocabItem[] = [];
    const news: VocabItem[] = [];

    // Traverse all lessons
    for (const lesson of ALL_LESSONS) {
      for (const item of lesson.vocab) {
        const srsKey = lesson.number * 100 + item.id;
        const entry = srsData[srsKey];

        if (entry && entry.nextReview <= now) {
          dues.push(item);
        } else if (!entry || entry.historyCount === 0) {
          news.push(item);
        }
      }
    }

    // Pick due cards first (up to 20)
    const pickedDue = dues.slice(0, 20);
    // Fill remainder with new cards
    const remainder = Math.max(0, 20 - pickedDue.length);
    const pickedNew = news.slice(0, remainder);
    const combined = [...pickedDue, ...pickedNew];

    return {
      dueCards: dues,
      newCards: news,
      fullReviewDeck: combined.length > 0 ? combined : ALL_LESSONS[0].vocab.slice(0, 20),
    };
  }, [srsData]);

  // Handle display settings update
  const handleUpdateSettings = (newSettings: Partial<DisplaySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Silent background sync
    if (currentUser) {
      syncSettingsToCloud(currentUser.uid, updated);
    }
  };

  // Toggle bookmark star for a word
  const handleToggleBookmark = (srsKey: number) => {
    setBookmarkedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(srsKey)) {
        next.delete(srsKey);
      } else {
        next.add(srsKey);
      }
      return next;
    });
  };

  // Handle SRS rating on a flashcard (0ms latency, local-first)
  const handleRateItem = (itemId: number, rating: SRSRating) => {
    const itemLessonNumber = currentLesson.number;
    const srsKey = itemLessonNumber * 100 + itemId;
    const current = srsData[srsKey];
    const { nextData, xpEarned } = calculateNextReview(current, rating);

    // Immediate local state update
    setSrsData((prev) => ({
      ...prev,
      [srsKey]: nextData,
    }));

    const today = getTodayDateString();
    const isNewDay = stats.lastActiveDate !== today;

    const updatedStats: UserStats = {
      ...stats,
      xp: stats.xp + xpEarned,
      totalReviews: stats.totalReviews + 1,
      cardsReviewedToday: isNewDay ? 1 : stats.cardsReviewedToday + 1,
      streak: isNewDay ? stats.streak + 1 : Math.max(1, stats.streak),
      lastActiveDate: today,
    };

    setStats(updatedStats);

    // Silent background cloud sync (Never blocks the user)
    if (currentUser) {
      syncSRSItemToCloud(currentUser.uid, srsKey, nextData);
      syncUserStatsToCloud(currentUser.uid, updatedStats);
    }
  };

  // Handle XP from listening to pronunciation
  const handleAudioXP = () => {
    const updatedStats = {
      ...stats,
      xp: stats.xp + 2,
    };
    setStats(updatedStats);

    if (currentUser) {
      syncUserStatsToCloud(currentUser.uid, updatedStats);
    }
  };

  // Handle XP from Quiz answers (supports -5 penalty, floor at 0)
  const handleQuizXP = (xpDelta: number) => {
    const updatedStats = {
      ...stats,
      xp: Math.max(0, stats.xp + xpDelta),
    };
    setStats(updatedStats);

    if (currentUser) {
      syncUserStatsToCloud(currentUser.uid, updatedStats);
    }
  };

  // Start today's review session from Home
  const handleStartReviewSession = () => {
    setCustomReviewDeck(fullReviewDeck);
    setIsReviewSession(true);
    setActiveTab('flashcards');
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setIsReviewSession(false);
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'flashcards') {
      setIsReviewSession(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  // Deck for flashcards: custom review deck if triggered from Home, otherwise current lesson
  const activeFlashcardDeck =
    isReviewSession && customReviewDeck.length > 0
      ? customReviewDeck
      : currentLesson.vocab;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors">
      {/* Responsive Left Navigation (Tablet Icon Rail & Desktop Sidebar) + Mobile Bottom Nav */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        stats={stats}
      />

      {/* Main Content Column with Desktop & Tablet offsets */}
      <div className="flex-1 flex flex-col md:pl-[72px] lg:pl-60 transition-all">
        {/* Slim Header: Streak & XP Chip + Compact Lesson Selector */}
        <Header
          stats={stats}
          currentLesson={currentLesson}
          activeTab={activeTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLessonPicker={() => setIsLessonPickerOpen(true)}
          isCloudSyncActive={!!currentUser}
        />

        {/* Centered Content Area */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-6">
          {activeTab === 'lessons' && (
            <LessonDirectory
              stats={stats}
              srsData={srsData}
              dueCount={dueCards.length}
              newCount={newCards.length}
              onStartReview={handleStartReviewSession}
              onSelectLesson={(lessonId) => {
                setSelectedLessonId(lessonId);
                setIsReviewSession(false);
                setActiveTab('vocab');
              }}
            />
          )}

          {activeTab === 'vocab' && (
            <VocabListView
              items={currentLesson.vocab}
              srsData={lessonSrsData}
              settings={settings}
              lessonNumber={currentLesson.number}
              bookmarkedKeys={bookmarkedKeys}
              onToggleBookmark={handleToggleBookmark}
              onOpenCommutePlayer={() => setIsCommutePlayerOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onAudioEarnXP={handleAudioXP}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardView
              items={activeFlashcardDeck}
              srsData={lessonSrsData}
              settings={settings}
              lessonNumber={currentLesson.number}
              bookmarkedKeys={bookmarkedKeys}
              onToggleBookmark={handleToggleBookmark}
              onRate={handleRateItem}
              onAudioEarnXP={handleAudioXP}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              items={currentLesson.vocab}
              settings={settings}
              onCorrectAnswer={handleQuizXP}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              stats={stats}
              srsData={srsData}
              currentUser={currentUser}
              onGoogleSignIn={handleGoogleSignIn}
              onSignOut={handleSignOut}
            />
          )}
        </main>
      </div>

      {/* Hands-Free Commute Audio Player Modal */}
      <CommutePlayerModal
        isOpen={isCommutePlayerOpen}
        onClose={() => setIsCommutePlayerOpen(false)}
        items={currentLesson.vocab}
        settings={settings}
        bookmarkedKeys={bookmarkedKeys}
        onToggleBookmark={handleToggleBookmark}
        lessonNumber={currentLesson.number}
      />

      {/* Settings Bottom Sheet with Cloud Sync, Theme, Font size, Toggles */}
      <SettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Lesson Picker Modal */}
      <LessonPickerModal
        isOpen={isLessonPickerOpen}
        onClose={() => setIsLessonPickerOpen(false)}
        currentLessonId={selectedLessonId}
        onSelectLesson={handleSelectLesson}
      />
    </div>
  );
}
