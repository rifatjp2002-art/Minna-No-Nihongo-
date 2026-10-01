import React, { useState } from 'react';
import {
  Search,
  Volume2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Star,
  Headphones,
  BookOpen
} from 'lucide-react';
import { DisplaySettings, SRSItemData, VocabItem } from '../types';
import { RubyRenderer } from './RubyRenderer';
import { speakJapanese } from '../utils/speech';
import { getMasteryLevel } from '../utils/srs';

interface VocabListViewProps {
  items: VocabItem[];
  srsData: Record<number, SRSItemData>;
  settings: DisplaySettings;
  lessonNumber?: number;
  bookmarkedKeys?: Set<number>;
  onToggleBookmark?: (srsKey: number) => void;
  onOpenCommutePlayer?: () => void;
  onOpenSettings?: () => void;
  onAudioEarnXP?: () => void;
}

const getMasteryBadge = (level: 'new' | 'learning' | 'review' | 'mastered') => {
  switch (level) {
    case 'new':
      return { label: 'নতুন', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
    case 'learning':
      return { label: 'শিখছেন', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    case 'review':
      return { label: 'রিভিউ', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
    case 'mastered':
      return { label: 'মাস্টার্ড', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
  }
};

export const VocabListView: React.FC<VocabListViewProps> = ({
  items,
  srsData,
  settings,
  lessonNumber = 26,
  bookmarkedKeys = new Set(),
  onToggleBookmark,
  onOpenCommutePlayer,
  onOpenSettings,
  onAudioEarnXP,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'starred'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Calculate starred count in current lesson
  const starredCountInLesson = items.filter((item) =>
    bookmarkedKeys.has(lessonNumber * 100 + item.id)
  ).length;

  // Filter items based on search and starred filter
  const filtered = items.filter((item) => {
    const srsKey = lessonNumber * 100 + item.id;
    if (filterMode === 'starred' && !bookmarkedKeys.has(srsKey)) {
      return false;
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.kanji.toLowerCase().includes(q) ||
      item.kana.toLowerCase().includes(q) ||
      item.romaji.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      item.bengali.toLowerCase().includes(q)
    );
  });

  const handlePlayWord = (e: React.MouseEvent, item: VocabItem) => {
    e.stopPropagation();
    setPlayingId(item.id);
    const textToSpeak = item.kanji.split('/')[0].split('[')[0].trim() || item.kana;
    speakJapanese(
      textToSpeak,
      settings.speechRate,
      () => setPlayingId(item.id),
      () => {
        setPlayingId(null);
        onAudioEarnXP?.();
      },
      () => setPlayingId(null)
    );
  };

  const handlePlaySentence = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakJapanese(text, settings.speechRate);
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 pb-24 pt-2">
      {/* 1. Top Search & Filter Bar */}
      <div className="flex items-center gap-2 px-1">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="শব্দ খুঁজুন (কান্জি, রোমাজি, বাংলা অর্থ)..."
            className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[36px] px-1 flex items-center cursor-pointer"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Commute Hands-Free Player Button */}
        <button
          onClick={onOpenCommutePlayer}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer shrink-0 min-h-[44px]"
          title="হ্যান্ডস-ফ্রি লিসেনিং মোড"
        >
          <Headphones className="w-4 h-4" />
          <span className="hidden sm:inline">লিসেনিং মোড</span>
        </button>

        {/* Display Settings Toggle */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#0f172a] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0 min-h-[44px]"
          title="ডিসপ্লে টগল ও সেটিংস"
        >
          <SlidersHorizontal className="w-4 h-4 text-sky-500" />
          <span className="hidden sm:inline">টগল</span>
        </button>
      </div>

      {/* 2. Sub-Tabs: [সকল শব্দ] vs [⭐ প্রিয় শব্দ] */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[36px] ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            সকল শব্দ ({items.length})
          </button>
          <button
            onClick={() => setFilterMode('starred')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 min-h-[36px] ${
              filterMode === 'starred'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>বুকমার্ক ({starredCountInLesson})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
          কার্ডে ট্যাপ করে উদাহরণ বাক্য দেখুন
        </span>
      </div>

      {/* 3. Empty State for Starred filter */}
      {filtered.length === 0 && filterMode === 'starred' && (
        <div className="p-8 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 mx-auto flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            এই লেসনে কোনো বুকমার্ক করা শব্দ নেই
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            যেকোনো শব্দের কার্ডে থাকা ⭐ স্টার বাটনে চাপ দিলে তা এই তালিকায় যুক্ত হবে।
          </p>
        </div>
      )}

      {/* 4. Vocabulary Cards List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const srs = srsData[item.id];
          const masteryLevel = getMasteryLevel(srs);
          const mastery = getMasteryBadge(masteryLevel);
          const isPlaying = playingId === item.id;
          const srsKey = lessonNumber * 100 + item.id;
          const isBookmarked = bookmarkedKeys.has(srsKey);

          return (
            <div
              key={item.id}
              onClick={() => toggleExpand(item.id)}
              className={`rounded-2xl border transition-all duration-150 cursor-pointer overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-[#0f172a] border-sky-500/50 shadow-md ring-1 ring-sky-500/20'
                  : 'bg-white dark:bg-[#0f172a]/90 hover:bg-slate-50 dark:hover:bg-[#0f172a] border-slate-200 dark:border-slate-800/90 shadow-sm'
              }`}
            >
              {/* Card Container */}
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Row 1: Japanese (Furigana directly above large Kanji) + Action buttons */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col items-start min-w-0">
                      {/* Furigana above large Kanji */}
                      {settings.showFurigana && item.kanji !== item.kana && (
                        <span className="text-xs text-sky-600 dark:text-sky-400 font-medium font-['Noto_Sans_JP'] tracking-wider leading-none mb-1">
                          {item.kana}
                        </span>
                      )}
                      {/* Large Kanji */}
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Noto_Sans_JP'] tracking-wide leading-tight">
                        {settings.showKanji ? item.kanji : item.kana}
                      </div>
                    </div>

                    {/* Bookmark Star + Audio Play Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.emoji ? (
                        <span className="text-xl sm:text-2xl mr-1" role="img" aria-label="emoji">
                          {item.emoji}
                        </span>
                      ) : null}

                      {/* Bookmark Star Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark?.(srsKey);
                        }}
                        className={`p-2.5 rounded-xl border transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                          isBookmarked
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 text-slate-400 hover:text-amber-500'
                        }`}
                        title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্কে যোগ করুন'}
                        aria-label="Toggle star"
                      >
                        <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>

                      {/* Audio Play Button */}
                      <button
                        onClick={(e) => handlePlayWord(e, item)}
                        className={`p-2.5 rounded-xl transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                          isPlaying
                            ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title="উচ্চারণ শুনুন"
                        aria-label="Play audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Bengali Meaning FIRST and LARGE */}
                  {settings.showBengali && (
                    <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Hind_Siliguri'] leading-snug">
                      {item.bengali}
                    </div>
                  )}

                  {/* Row 3: English Meaning smaller below */}
                  {settings.showEnglish && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.english}
                    </div>
                  )}

                  {/* Row 4: Romaji reading */}
                  {settings.showRomaji && (
                    <div className="text-xs font-mono text-amber-600 dark:text-amber-300/90 font-medium">
                      {item.romaji}
                    </div>
                  )}

                  {/* Row 5: SRS Level Badge */}
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${mastery.color}`}
                    >
                      {mastery.label}
                    </span>
                    {srs && srs.historyCount > 0 && (
                      <span className="text-[10px] text-slate-400">
                        {srs.historyCount} বার পর্যালোচিত
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Expand Chevron Icon */}
                <div className="pt-2 text-slate-400 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Expanded Example Sentences (Daily Life Context) */}
              {isExpanded && (
                <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 animate-fade-in">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    বাস্তবমুখী উদাহরণ বাক্যসমূহ (Example Sentences)
                  </div>

                  <div className="space-y-2.5">
                    {item.sentences.map((sent, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {sent.context}
                          </span>
                          <button
                            onClick={(e) => handlePlaySentence(e, sent.japanese)}
                            className="p-1 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                            title="বাক্যটির উচ্চারণ শুনুন"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white font-['Noto_Sans_JP'] leading-relaxed">
                          {sent.japanese}
                        </div>
                        <div className="text-xs text-slate-800 dark:text-slate-200 font-['Hind_Siliguri'] font-medium">
                          {sent.bengali}
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {sent.english}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
