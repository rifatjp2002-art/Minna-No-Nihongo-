import React, { useState } from 'react';
import { LessonMeta } from '../data/lessonsConfig';
import { DisplaySettings, SRSItemData, SRSRating } from '../types';
import { BookOpen, Layers, HelpCircle, ArrowLeft } from 'lucide-react';
import { DisplayToggles } from './DisplayToggles';
import { VocabListView } from './VocabListView';
import { FlashcardView } from './FlashcardView';
import { QuizView } from './QuizView';

interface LessonDetailViewProps {
  lesson: LessonMeta;
  srsData: Record<number, SRSItemData>;
  settings: DisplaySettings;
  initialTab?: 'list' | 'flashcards' | 'quiz';
  onBack: () => void;
  onUpdateSettings: (newSettings: Partial<DisplaySettings>) => void;
  onRateItem: (itemId: number, rating: SRSRating) => void;
  onAudioXP: () => void;
  onQuizXP: (xp: number) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  srsData,
  settings,
  initialTab = 'list',
  onBack,
  onUpdateSettings,
  onRateItem,
  onAudioXP,
  onQuizXP,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'flashcards' | 'quiz'>(initialTab);

  // Map lesson-specific SRS data
  const lessonSrsData: Record<number, SRSItemData> = {};
  lesson.vocab.forEach((item) => {
    const key = lesson.number * 100 + item.id;
    if (srsData[key]) {
      lessonSrsData[item.id] = srsData[key];
    }
  });

  const handleRate = (itemId: number, rating: SRSRating) => {
    const key = lesson.number * 100 + itemId;
    onRateItem(key, rating);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-3">
      {/* Lesson Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="সব লেসনে ফেরত যান"
          >
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400">Lesson {lesson.number}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{lesson.vocab.length} টি শব্দ</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* 3 Clear Segment Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'list'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>শব্দ তালিকা</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ফ্ল্যাশকার্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>কুইজ</span>
          </button>
        </div>
      </div>

      {/* Streamlined Display Toggles (Available in list and flashcards) */}
      <DisplayToggles settings={settings} onUpdate={onUpdateSettings} />

      {/* Tab Contents */}
      {activeTab === 'list' && (
        <VocabListView
          items={lesson.vocab}
          srsData={lessonSrsData}
          settings={settings}
          onAudioEarnXP={onAudioXP}
        />
      )}

      {activeTab === 'flashcards' && (
        <FlashcardView
          items={lesson.vocab}
          srsData={lessonSrsData}
          settings={settings}
          onRate={handleRate}
          onAudioEarnXP={onAudioXP}
        />
      )}

      {activeTab === 'quiz' && (
        <QuizView
          items={lesson.vocab}
          settings={settings}
          onCorrectAnswer={onQuizXP}
        />
      )}
    </div>
  );
};
