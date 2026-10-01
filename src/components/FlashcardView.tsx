import React, { useState, useEffect } from 'react';
import { Volume2, RotateCw, Shuffle, ArrowUpDown, Sparkles, Star } from 'lucide-react';
import { DisplaySettings, SRSItemData, SRSRating, VocabItem } from '../types';
import { RubyRenderer } from './RubyRenderer';
import { speakJapanese } from '../utils/speech';
import { previewNextInterval, estimateRetention, getMasteryLevel } from '../utils/srs';

interface FlashcardViewProps {
  items: VocabItem[];
  srsData: Record<number, SRSItemData>;
  settings: DisplaySettings;
  onRate: (itemId: number, rating: SRSRating) => void;
  onAudioEarnXP?: () => void;
  lessonNumber?: number;
  bookmarkedKeys?: Set<number>;
  onToggleBookmark?: (srsKey: number) => void;
}

export type FlashcardSortOrder = 'smart' | 'original' | 'shuffle';

// Pedagogical sorting helper: New -> Hard -> Medium -> Easy
function sortDeckPedagogically(vocabItems: VocabItem[], srs: Record<number, SRSItemData>): VocabItem[] {
  return [...vocabItems].sort((a, b) => {
    const srsA = srs[a.id];
    const srsB = srs[b.id];

    // Priority 0: New word (historyCount === 0 or no entry)
    // Priority 1: Hard (lastRating === 'hard' or repetition === 0 while having history)
    // Priority 2: Medium / Good (repetition 1 or 2, or lastRating === 'good')
    // Priority 3: Easy / Mastered (repetition >= 3 or lastRating === 'easy')
    const getPriority = (data: SRSItemData | undefined) => {
      if (!data || data.historyCount === 0) return 0; // New
      if (data.lastRating === 'hard' || data.repetition === 0) return 1; // Hard
      if (data.repetition < 3 || data.lastRating === 'good') return 2; // Medium
      return 3; // Easy
    };

    const prioA = getPriority(srsA);
    const prioB = getPriority(srsB);

    if (prioA !== prioB) {
      return prioA - prioB;
    }
    // Secondary sort: keep clean numerical order within the same group
    return a.id - b.id;
  });
}

function getWordTierBadge(data: SRSItemData | undefined) {
  if (!data || data.historyCount === 0) {
    return { label: 'নতুন (New)', color: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' };
  }
  if (data.lastRating === 'hard' || data.repetition === 0) {
    return { label: 'কঠিন (Hard)', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
  }
  if (data.repetition < 3 || data.lastRating === 'good') {
    return { label: 'মাঝারি (Medium)', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
  }
  return { label: 'সহজ (Easy)', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  items,
  srsData,
  settings,
  onRate,
  onAudioEarnXP,
  lessonNumber = 26,
  bookmarkedKeys,
  onToggleBookmark,
}) => {
  const [sortOrder, setSortOrder] = useState<FlashcardSortOrder>('smart');
  const [deck, setDeck] = useState<VocabItem[]>(() => sortDeckPedagogically(items, srsData));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync and order deck whenever items or srsData change
  useEffect(() => {
    if (sortOrder === 'smart') {
      setDeck(sortDeckPedagogically(items, srsData));
    } else if (sortOrder === 'original') {
      setDeck([...items].sort((a, b) => a.id - b.id));
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items, sortOrder]);

  const currentItem = deck[currentIndex] || deck[0];
  const currentSRS = currentItem ? srsData[currentItem.id] : undefined;
  const mastery = getMasteryLevel(currentSRS);
  const retention = estimateRetention(currentSRS);
  const tier = getWordTierBadge(currentSRS);

  // Scientific real-world interval projections (SM-2 based)
  const hardInterval = previewNextInterval(currentSRS, 'hard');
  const goodInterval = previewNextInterval(currentSRS, 'good');
  const easyInterval = previewNextInterval(currentSRS, 'easy');

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handlePlayAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentItem) return;
    setIsPlayingAudio(true);
    const textToSpeak = currentItem.kanji.split('/')[0].split('[')[0].trim() || currentItem.kana;
    speakJapanese(
      textToSpeak,
      settings.speechRate,
      () => setIsPlayingAudio(true),
      () => {
        setIsPlayingAudio(false);
        onAudioEarnXP?.();
      },
      () => setIsPlayingAudio(false)
    );
  };

  const handleRateChoice = (rating: SRSRating) => {
    if (!currentItem) return;
    onRate(currentItem.id, rating);
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed round, wrap or reset
      setCurrentIndex(0);
    }
  };

  const handleShuffle = () => {
    setSortOrder('shuffle');
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleToggleSmartOrder = () => {
    if (sortOrder === 'smart') {
      setSortOrder('original');
      setDeck([...items].sort((a, b) => a.id - b.id));
    } else {
      setSortOrder('smart');
      setDeck(sortDeckPedagogically(items, srsData));
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Desktop keyboard shortcuts: Space = flip, 1/2/3 = Hard/Good/Easy, A = audio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped && e.key === '1') {
        e.preventDefault();
        handleRateChoice('hard');
      } else if (isFlipped && e.key === '2') {
        e.preventDefault();
        handleRateChoice('good');
      } else if (isFlipped && e.key === '3') {
        e.preventDefault();
        handleRateChoice('easy');
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handlePlayAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentItem, currentIndex, isFlipped, deck]);

  if (!currentItem) {
    return (
      <div className="text-center py-20 text-slate-400">
        কোনো শব্দ পাওয়া যায়নি।
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-[calc(100vh-140px)] justify-between pb-24 pt-2 px-1">
      {/* Top Bar: Progress, Smart Pedagogical Order chip and Shuffle */}
      <div className="space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
          {/* Card counter and Current Word Tier */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-900 dark:text-white">
              কার্ড {currentIndex + 1} / {deck.length}
            </span>
            {/* Word Tier Badge: New -> Hard -> Medium -> Easy */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${tier.color}`}>
              {tier.label}
            </span>
            {mastery !== 'new' && (
              <span className="text-[10px] text-slate-400">
                · {retention}% রিটেনশন
              </span>
            )}
          </div>

          {/* Controls: Smart Order Toggle & Shuffle */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSmartOrder}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition cursor-pointer min-h-[36px] ${
                sortOrder === 'smart'
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-600 dark:text-sky-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="স্মার্ট ক্রম: New ➜ Hard ➜ Medium ➜ Easy"
            >
              <Sparkles className="w-3 h-3" />
              <span>{sortOrder === 'smart' ? 'স্মার্ট ক্রম' : 'মূল ক্রম'}</span>
            </button>

            <button
              onClick={handleShuffle}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-sky-500 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="এলোমেলো করুন (Shuffle)"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-sky-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard Card with Flip */}
      <div className="my-3 flex-1 flex flex-col justify-center">
        <div
          onClick={handleFlip}
          className="relative min-h-[320px] w-full bg-white dark:bg-[#0f172a] hover:border-slate-300 dark:hover:border-slate-700/80 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-200 select-none group"
        >
          {/* Card Top Label & Audio Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                #{currentItem.id} {isFlipped ? 'উত্তর / Answer' : 'প্রশ্ন / Question'}
              </span>
              {currentSRS && currentSRS.repetition > 0 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Rep {currentSRS.repetition} · {currentSRS.interval}d
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Star Bookmark button */}
              {onToggleBookmark && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const srsKey = (lessonNumber || 26) * 100 + currentItem.id;
                    onToggleBookmark(srsKey);
                  }}
                  className={`p-2.5 rounded-full transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    bookmarkedKeys?.has((lessonNumber || 26) * 100 + currentItem.id)
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
                  }`}
                  title="বুকমার্কে যোগ / অপসারণ করুন"
                >
                  <Star
                    className={`w-4 h-4 ${
                      bookmarkedKeys?.has((lessonNumber || 26) * 100 + currentItem.id)
                        ? 'fill-amber-400 text-amber-400'
                        : ''
                    }`}
                  />
                </button>
              )}

              <button
                onClick={handlePlayAudio}
                className={`p-3 rounded-full transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500'
                }`}
                title="উচ্চারণ শুনুন (A)"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* FRONT: Show ONLY the Kanji on the front */}
          {!isFlipped ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-['Noto_Sans_JP'] tracking-wider leading-relaxed">
                {currentItem.kanji}
              </div>

              <div className="pt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span>ট্যাপ করে অর্থ দেখুন</span>
                {/* Desktop-only hint */}
                <kbd className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-mono border border-slate-200 dark:border-slate-700 ml-1">
                  Space
                </kbd>
              </div>
            </div>
          ) : (
            /* BACK: Show Bengali & English meaning plus one sentence */
            <div className="text-center py-3 space-y-3">
              {/* Kanji & Kana */}
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white font-['Noto_Sans_JP']">
                  {currentItem.kanji}
                </div>
                <div className="text-sm text-sky-600 dark:text-sky-400 font-medium font-['Noto_Sans_JP'] mt-0.5">
                  {currentItem.kana}
                </div>
              </div>

              {/* Bengali & English Meaning */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-lg font-bold text-slate-900 dark:text-emerald-300 font-['Hind_Siliguri']">
                  {currentItem.bengali}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {currentItem.english}
                </div>
              </div>

              {/* Plus One Example Sentence with Furigana */}
              {currentItem.sentences && currentItem.sentences.length > 0 && (
                <div className="text-left text-xs bg-slate-100/70 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">উদাহরণ বাক্য:</div>
                  <div className="text-slate-900 dark:text-white leading-relaxed">
                    <RubyRenderer html={currentItem.sentences[0].japanese} showFurigana={settings.showFurigana} />
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-300/90 font-['Hind_Siliguri'] text-[11px]">
                    {currentItem.sentences[0].bengali}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Flip Indicator */}
          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
            {isFlipped ? 'নিচের বৈজ্ঞানিক SRS শিডিউল নির্বাচন করুন' : 'কার্ডে ট্যাপ করলেই উল্টে যাবে'}
          </div>
        </div>
      </div>

      {/* Action Buttons Area: ONLY shown after the flip with REAL-WORLD scientific SRS intervals! */}
      {isFlipped ? (
        <div className="grid grid-cols-3 gap-2.5 shrink-0 animate-fade-in">
          {/* Hard Button (Reset / Lapse interval) */}
          <button
            onClick={() => handleRateChoice('hard')}
            className="min-h-[52px] py-2 px-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/30 text-rose-600 dark:text-rose-300 flex flex-col items-center justify-center transition cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">কঠিন (Hard)</span>
              <kbd className="hidden md:inline-flex px-1.5 py-0.2 rounded bg-rose-500/20 text-[10px] text-rose-500 dark:text-rose-300 font-mono">1</kbd>
            </div>
            {/* Real-World Scientific SRS Interval Projection */}
            <span className="text-[11px] font-extrabold text-rose-500 mt-0.5">
              {hardInterval.label}
            </span>
          </button>

          {/* Good Button (SM-2 Projected Interval) */}
          <button
            onClick={() => handleRateChoice('good')}
            className="min-h-[52px] py-2 px-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 border border-amber-500/30 text-amber-600 dark:text-amber-300 flex flex-col items-center justify-center transition cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">মোটামুটি (Good)</span>
              <kbd className="hidden md:inline-flex px-1.5 py-0.2 rounded bg-amber-500/20 text-[10px] text-amber-500 dark:text-amber-300 font-mono">2</kbd>
            </div>
            {/* Real-World Scientific SRS Interval Projection */}
            <span className="text-[11px] font-extrabold text-amber-500 mt-0.5">
              {goodInterval.label}
            </span>
          </button>

          {/* Easy Button (Bonus Interval + Ease Boost) */}
          <button
            onClick={() => handleRateChoice('easy')}
            className="min-h-[52px] py-2 px-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 flex flex-col items-center justify-center transition cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">সহজ (Easy)</span>
              <kbd className="hidden md:inline-flex px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] text-emerald-500 dark:text-emerald-300 font-mono">3</kbd>
            </div>
            {/* Real-World Scientific SRS Interval Projection */}
            <span className="text-[11px] font-extrabold text-emerald-500 mt-0.5">
              {easyInterval.label}
            </span>
          </button>
        </div>
      ) : (
        /* Hint button when not yet flipped */
        <button
          onClick={handleFlip}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCw className="w-4 h-4 text-sky-500" />
          <span>উত্তর দেখতে কার্ডে ট্যাপ করুন</span>
          <kbd className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
            Space
          </kbd>
        </button>
      )}
    </div>
  );
};
