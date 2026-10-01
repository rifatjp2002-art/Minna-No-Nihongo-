import React from 'react';
import { X, Check } from 'lucide-react';
import { ALL_LESSONS } from '../data/lessonsConfig';

interface LessonPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
}

export const LessonPickerModal: React.FC<LessonPickerModalProps> = ({
  isOpen,
  onClose,
  currentLessonId,
  onSelectLesson,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl z-10 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">লেসন নির্বাচন করুন (L26 - L50)</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-1.5 py-3 pr-1">
          {ALL_LESSONS.map((lesson) => {
            const isSelected = lesson.id === currentLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  onSelectLesson(lesson.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer min-h-[50px] ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{lesson.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Lesson {lesson.number} · {lesson.vocab.length} words
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-sky-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
