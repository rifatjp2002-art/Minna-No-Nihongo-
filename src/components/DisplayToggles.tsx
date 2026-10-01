import React from 'react';
import { Volume2, SlidersHorizontal } from 'lucide-react';
import { DisplaySettings } from '../types';

interface DisplayTogglesProps {
  settings: DisplaySettings;
  onUpdate: (newSettings: Partial<DisplaySettings>) => void;
}

export const DisplayToggles: React.FC<DisplayTogglesProps> = ({ settings, onUpdate }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl px-3 py-2.5 shadow-sm mb-5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
      {/* Label */}
      <div className="flex items-center gap-1.5 text-slate-400 font-medium">
        <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden sm:inline">প্রদর্শন টগল:</span>
      </div>

      {/* Compact toggle chips */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Furigana */}
        <button
          type="button"
          onClick={() => onUpdate({ showFurigana: !settings.showFurigana })}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
            settings.showFurigana
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 line-through'
          }`}
        >
          <span>ふりがな Furigana</span>
        </button>

        {/* Kana */}
        <button
          type="button"
          onClick={() => onUpdate({ showKana: !settings.showKana })}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
            settings.showKana
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 line-through'
          }`}
        >
          <span>かな Kana</span>
        </button>

        {/* Romaji */}
        <button
          type="button"
          onClick={() => onUpdate({ showRomaji: !settings.showRomaji })}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
            settings.showRomaji
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 line-through'
          }`}
        >
          <span>Romaji</span>
        </button>

        {/* English */}
        <button
          type="button"
          onClick={() => onUpdate({ showEnglish: !settings.showEnglish })}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
            settings.showEnglish
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 line-through'
          }`}
        >
          <span>English</span>
        </button>

        {/* Bengali */}
        <button
          type="button"
          onClick={() => onUpdate({ showBengali: !settings.showBengali })}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
            settings.showBengali
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-slate-800 text-slate-500 border border-slate-700/60 line-through'
          }`}
        >
          <span>বাংলা অর্থ</span>
        </button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
        <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          {[0.75, 1.0, 1.25].map((rate) => (
            <button
              key={rate}
              onClick={() => onUpdate({ speechRate: rate })}
              className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                settings.speechRate === rate
                  ? 'bg-sky-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
