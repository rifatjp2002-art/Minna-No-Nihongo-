import React from 'react';
import { ALL_LESSONS, LessonMeta } from '../data/lessonsConfig';
import { SRSItemData, UserStats } from '../types';
import { ChevronRight, Play, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface LessonDirectoryProps {
  stats: UserStats;
  srsData: Record<number, SRSItemData>;
  onSelectLesson: (lessonId: string) => void;
  onStartReview: () => void;
  dueCount: number;
  newCount: number;
}

export const LessonDirectory: React.FC<LessonDirectoryProps> = ({
  stats,
  srsData,
  onSelectLesson,
  onStartReview,
  dueCount,
  newCount,
}) => {
  // Helper to calculate progress for a specific lesson
  const getLessonStats = (lesson: LessonMeta) => {
    const total = lesson.vocab.length;
    let mastered = 0;

    lesson.vocab.forEach((item) => {
      const srsKey = Number(lesson.id) * 100 + item.id;
      const data = srsData[srsKey];
      if (data && data.repetition >= 3) {
        mastered++;
      }
    });

    const percent = Math.min(100, Math.round((mastered / Math.max(1, total)) * 100));
    return { total, mastered, percent };
  };

  // Daily goal calculation (20 cards)
  const DAILY_GOAL = 20;
  const reviewedCount = stats.cardsReviewedToday || 0;
  const goalPercent = Math.min(100, Math.round((reviewedCount / DAILY_GOAL) * 100));
  const isGoalReached = reviewedCount >= DAILY_GOAL;

  // SVG Ring calculation
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalPercent / 100) * circumference;

  const totalReviewCards = dueCount + newCount;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24 pt-2">
      {/* 1. TOP HERO: Daily Review Card with Daily Goal Ring & Start Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-indigo-50/50 dark:from-[#0f172a] dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md dark:shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Left: Info & Goal Ring */}
          <div className="flex items-center gap-4">
            {/* SVG Circular Daily Goal Ring */}
            <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
              <svg className="w-18 h-18 -rotate-90" viewBox="0 0 64 64">
                {/* Background Track */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-200 dark:text-slate-800 fill-transparent"
                />
                {/* Progress Circle */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`fill-transparent transition-all duration-700 ${
                    isGoalReached ? 'text-emerald-500' : 'text-sky-500'
                  }`}
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {isGoalReached ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                ) : (
                  <>
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                      {reviewedCount}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">
                      /{DAILY_GOAL}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Title & Goal explanation */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>দৈনিক লক্ষ্য: ২০টি কার্ড</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                {isGoalReached ? 'আজকের লক্ষ্য পূরণ হয়েছে!' : 'আজকের অনুশীলন বাকি'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {dueCount > 0
                  ? `${dueCount}টি বকেয়া (Due) ও ${newCount}টি নতুন শব্দ প্রস্তুত`
                  : `${newCount}টি নতুন শব্দ পর্যালোচনার জন্য প্রস্তুত`}
              </p>
            </div>
          </div>

          {/* Large Primary Action Button: "Start today's review" */}
          <div className="sm:shrink-0 w-full sm:w-auto">
            <button
              onClick={onStartReview}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 min-h-[50px]"
            >
              <Play className="w-4 h-4 fill-white shrink-0" />
              <div className="text-left sm:text-center">
                <div>Start today's review</div>
                <div className="text-[10px] text-sky-100 font-normal opacity-90">
                  {totalReviewCards > 0 ? `${totalReviewCards}টি কার্ড প্র্যাকটিস` : 'রিভিউ শুরু করুন'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. LESSON LIST SECTION HEADER */}
      <div className="px-1 pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            পাঠসমূহ (Lessons 26–50)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            যে কোনো লেসনে ট্যাপ করে শব্দ তালিকা পড়ুন
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {ALL_LESSONS.length} লেসন
        </span>
      </div>

      {/* 3. COMPACT TAPPABLE LESSON LIST */}
      <div className="space-y-2">
        {ALL_LESSONS.map((lesson) => {
          const { total, percent } = getLessonStats(lesson);

          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className="group relative bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.99] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-3.5 transition-all duration-150 cursor-pointer shadow-sm min-h-[56px]"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0 border border-slate-200 dark:border-slate-700/50 group-hover:scale-105 transition">
                    {lesson.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition truncate">
                        {lesson.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lesson.grammarFocus || lesson.japaneseTitle}
                    </p>
                  </div>
                </div>

                {/* Right: Word Count & Arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {total} শব্দ
                    </span>
                    {percent > 0 && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {percent}%
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition" />
                </div>
              </div>

              {/* Thin Sleek Progress Bar */}
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
