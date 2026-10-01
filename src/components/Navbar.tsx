import React from 'react';
import { Flame, Zap, ArrowLeft, RotateCcw } from 'lucide-react';
import { UserStats } from '../types';

interface NavbarProps {
  stats: UserStats;
  selectedLessonId: string | null;
  onBackToHome: () => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  selectedLessonId,
  onBackToHome,
  onResetProgress,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Back button or Main Logo */}
          <div className="flex items-center gap-3">
            {selectedLessonId ? (
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer border border-slate-700 hover:border-slate-600"
              >
                <ArrowLeft className="w-4 h-4 text-sky-400" />
                <span>সব লেসন</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                  語
                </div>
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight leading-none">
                    Nihongo Master
                  </h1>
                  <span className="text-[11px] text-slate-400">Minna No Nihongo JLPT N4</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Gamification Badges (Streak & XP) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Streak */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300"
              title="Daily study streak"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-xs font-bold">{stats.streak} দিন</span>
            </div>

            {/* XP */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300"
              title={`Total XP: ${stats.xp}`}
            >
              <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span className="text-xs font-bold">{stats.xp} XP</span>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                if (window.confirm('আপনি কি স্টাডি প্রগ্রেস এবং হিস্ট্রি রিসেট করতে চান?')) {
                  onResetProgress();
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="রিসেট"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
