import React from 'react';
import { BookOpen, ListOrdered, Layers, Trophy, TrendingUp, Flame, Zap } from 'lucide-react';
import { UserStats } from '../types';

export type NavTab = 'lessons' | 'vocab' | 'flashcards' | 'quiz' | 'progress';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  stats?: UserStats;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab, stats }) => {
  const tabs = [
    { id: 'lessons' as NavTab, label: 'Lessons', bengali: 'পাঠসমূহ', icon: BookOpen },
    { id: 'vocab' as NavTab, label: 'Vocab', bengali: 'শব্দার্থ', icon: ListOrdered },
    { id: 'flashcards' as NavTab, label: 'Cards', bengali: 'ফ্ল্যাশকার্ড', icon: Layers },
    { id: 'quiz' as NavTab, label: 'Quiz', bengali: 'কুইজ', icon: Trophy },
    { id: 'progress' as NavTab, label: 'Progress', bengali: 'অগ্রগতি', icon: TrendingUp },
  ];

  return (
    <>
      {/* 1. MOBILE ONLY: Fixed Bottom Navigation Bar (< 768px) with Safe Area padding */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/90 pb-[calc(0.35rem+env(safe-area-inset-bottom))] shadow-2xl transition-colors">
        <div className="flex items-center justify-around px-1.5 sm:px-3 py-1 min-h-[56px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl transition-all duration-150 cursor-pointer select-none min-h-[44px] min-w-[44px] ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. TABLET ONLY: Slim Left Icon Rail (768px - 1023px) */}
      <aside className="hidden md:flex lg:hidden fixed top-0 bottom-0 left-0 w-[72px] z-40 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex-col items-center py-4 justify-between transition-colors">
        {/* Top Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-500 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-sm font-['Noto_Sans_JP'] tracking-tighter">
          日本
        </div>

        {/* Center Icons Stack */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                title={`${tab.label} (${tab.bengali})`}
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer min-h-[44px] min-w-[44px] ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] mt-0.5 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </aside>

      {/* 3. DESKTOP ONLY: Full Left Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex fixed top-0 bottom-0 left-0 w-60 z-40 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-slate-800 flex-col justify-between p-5 transition-colors">
        {/* Top Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-500 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-md shrink-0 font-['Noto_Sans_JP'] tracking-tight">
              日本
            </span>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight whitespace-nowrap truncate">
                Nihongo Master
              </h1>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Minna no Nihongo N4
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="text-left min-w-0">
                    <span className="text-sm block whitespace-nowrap">{tab.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal block whitespace-nowrap">
                      {tab.bengali}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile / Quick Stats */}
        {stats && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">দৈনিক স্ট্রিক</span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {stats.streak} দিন
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">মোট XP</span>
              <span className="flex items-center gap-1 font-bold text-violet-500">
                <Zap className="w-3.5 h-3.5 fill-violet-500" />
                {stats.xp} XP
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
