import React from 'react';
import { BookOpen, ListOrdered, Layers, Trophy, User } from 'lucide-react';

export type NavTab = 'lessons' | 'vocab' | 'flashcards' | 'quiz' | 'about';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'lessons' as NavTab, label: 'Lessons', bengali: 'পাঠসমূহ', icon: BookOpen },
    { id: 'vocab' as NavTab, label: 'Vocab', bengali: 'শব্দার্থ', icon: ListOrdered },
    { id: 'flashcards' as NavTab, label: 'Cards', bengali: 'ফ্ল্যাশকার্ড', icon: Layers },
    { id: 'quiz' as NavTab, label: 'Quiz', bengali: 'কুইজ', icon: Trophy },
    { id: 'about' as NavTab, label: 'About', bengali: 'প্রোফাইল', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1120]/95 backdrop-blur-lg border-t border-slate-800/90 pb-[env(safe-area-inset-bottom)] shadow-2xl">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'text-sky-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-sky-500/15 text-sky-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
