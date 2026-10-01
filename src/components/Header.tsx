import React from 'react';
import { Flame, Zap, Settings, ChevronDown, Cloud } from 'lucide-react';
import { UserStats } from '../types';
import { LessonMeta } from '../data/lessonsConfig';

interface HeaderProps {
  stats: UserStats;
  currentLesson: LessonMeta;
  activeTab: string;
  onOpenSettings: () => void;
  onOpenLessonPicker: () => void;
  isCloudSyncActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentLesson,
  activeTab,
  onOpenSettings,
  onOpenLessonPicker,
  isCloudSyncActive = true,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-2.5 sm:px-6 py-2 pt-[calc(0.5rem+env(safe-area-inset-top))] transition-colors">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 min-h-[44px]">
        {/* Left: App Logo or Compact Lesson Selector (strictly single line, no wrapping on any device) */}
        <div className="flex items-center gap-2 min-w-0 shrink">
          {activeTab === 'lessons' ? (
            <div className="flex items-center gap-2 min-h-[44px] min-w-0">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm shrink-0 font-['Noto_Sans_JP'] tracking-tight">
                日本
              </span>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white whitespace-nowrap truncate">
                Nihongo Master
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenLessonPicker}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer min-h-[44px] max-w-[145px] sm:max-w-xs shrink"
              title="লেসন পরিবর্তন করুন"
            >
              <span className="text-sm shrink-0">{currentLesson.icon}</span>
              <span className="font-medium whitespace-nowrap truncate">
                L{currentLesson.number} · {currentLesson.vocab.length}w
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>
          )}
        </div>

        {/* Right: Slim Streak, XP chip, and Settings icon */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Streak Chip */}
          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold min-h-[36px] whitespace-nowrap"
            title={`${stats.streak} দিনের স্ট্রিক`}
          >
            <Flame className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-500 text-amber-500 shrink-0" />
            <span>{stats.streak}</span>
          </div>

          {/* XP Chip */}
          <div
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold min-h-[36px] whitespace-nowrap"
            title={`${stats.xp} XP অর্জিত`}
          >
            <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-violet-500 text-violet-500 shrink-0" />
            <span>{stats.xp}</span>
          </div>

          {/* Cloud Sync Status Indicator */}
          {isCloudSyncActive && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 rounded-xl text-sky-500/80 hover:text-sky-500 transition cursor-pointer min-w-[32px] min-h-[36px] flex items-center justify-center"
              title="স্বয়ংক্রিয় ক্লাউড ব্যাকআপ সক্রিয় (Local-First Sync)"
              aria-label="Cloud sync status"
            >
              <Cloud className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-sky-500/20" />
            </button>
          )}

          {/* Settings Trigger (44px min tap target) */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 transition cursor-pointer min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center shrink-0"
            title="ডিসপ্লে সেটিংস ও থিম"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
