import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Star,
  Headphones,
  Sliders,
  Sparkles
} from 'lucide-react';
import { VocabItem, DisplaySettings } from '../types';
import { speakJapanese } from '../utils/speech';

interface CommutePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: VocabItem[];
  settings: DisplaySettings;
  bookmarkedKeys: Set<number>;
  onToggleBookmark: (srsKey: number) => void;
  lessonNumber: number;
}

export const CommutePlayerModal: React.FC<CommutePlayerModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  bookmarkedKeys,
  onToggleBookmark,
  lessonNumber,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [speechRate, setSpeechRate] = useState(settings.speechRate || 1.0);
  const [delaySec, setDelaySec] = useState<number>(2.5); // Delay between words
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount or close
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    }
  }, [isOpen]);

  const currentItem = items[currentIndex];
  const srsKey = currentItem ? lessonNumber * 100 + currentItem.id : 0;
  const isBookmarked = bookmarkedKeys.has(srsKey);

  // Function to play current word audio and schedule next
  const playWordAudio = (index: number) => {
    const item = items[index];
    if (!item) return;

    const textToSpeak = item.kanji.split('/')[0].split('[')[0].trim() || item.kana;
    window.speechSynthesis?.cancel();

    // Speak Japanese
    speakJapanese(textToSpeak, speechRate);

    // Estimate speaking time or wait fixed interval before advancing
    if (isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      const estimatedSpeakTimeMs = Math.max(1200, (textToSpeak.length * 350) / speechRate);
      const totalWaitMs = estimatedSpeakTimeMs + delaySec * 1000;

      timerRef.current = setTimeout(() => {
        handleNextWord();
      }, totalWaitMs);
    }
  };

  // Trigger audio playback when isPlaying is true or currentIndex changes while playing
  useEffect(() => {
    if (isPlaying && isOpen && currentItem) {
      playWordAudio(currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPlaying, isOpen, speechRate, delaySec]);

  const handleNextWord = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (isLooping) {
      setCurrentIndex(0);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(items.length - 1);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    } else {
      setIsPlaying(true);
    }
  };

  const handleManualReplay = () => {
    if (currentItem) {
      const textToSpeak = currentItem.kanji.split('/')[0].split('[')[0].trim() || currentItem.kana;
      speakJapanese(textToSpeak, speechRate);
    }
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Player Container */}
      <div className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-slate-900 text-white sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between p-6 sm:p-7">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>হ্যান্ডস-ফ্রি লিসেনিং</span>
                <span className="px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-mono">
                  L{lessonNumber}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                শব্দ {currentIndex + 1} / {items.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark Star button */}
            <button
              onClick={() => onToggleBookmark(srsKey)}
              className={`p-2.5 rounded-xl border transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্কে যুক্ত করুন'}
              aria-label="Toggle favorite"
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Display Card */}
        <div className="my-auto py-6 text-center space-y-4">
          {/* Audio Wave / Indicator */}
          <div className="flex items-center justify-center gap-1 h-5">
            {isPlaying ? (
              <>
                <span className="w-1 bg-sky-400 rounded-full animate-bounce h-3" />
                <span className="w-1 bg-sky-400 rounded-full animate-bounce h-5 [animation-delay:0.15s]" />
                <span className="w-1 bg-sky-400 rounded-full animate-bounce h-4 [animation-delay:0.3s]" />
                <span className="w-1 bg-sky-400 rounded-full animate-bounce h-5 [animation-delay:0.45s]" />
                <span className="w-1 bg-sky-400 rounded-full animate-bounce h-3 [animation-delay:0.2s]" />
              </>
            ) : (
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                প্লেয়ার পজ করা আছে
              </span>
            )}
          </div>

          {/* Large Kanji Display */}
          <div
            onClick={handleManualReplay}
            className="cursor-pointer group select-none transition active:scale-95"
            title="উচ্চারণ পুনরায় শুনতে ট্যাপ করুন"
          >
            <div className="text-4xl sm:text-5xl font-black text-white font-['Noto_Sans_JP'] tracking-wide group-hover:text-sky-300 transition">
              {currentItem.kanji}
            </div>
            <div className="text-lg text-sky-400 font-['Noto_Sans_JP'] font-semibold mt-2">
              {currentItem.kana} • <span className="text-amber-300/80 text-sm font-mono">{currentItem.romaji}</span>
            </div>
          </div>

          {/* Meaning Box */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 max-w-sm mx-auto space-y-1">
            <div className="text-lg sm:text-xl font-bold text-emerald-400 font-['Hind_Siliguri']">
              {currentItem.bengali}
            </div>
            <div className="text-xs text-slate-400 italic">
              {currentItem.english}
            </div>
          </div>
        </div>

        {/* Bottom Controls Area */}
        <div className="space-y-4 pt-2">
          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>

          {/* Main Playback Buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-3 rounded-2xl border transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isLooping
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
              title={isLooping ? 'লুপ চালু (Auto Repeat)' : 'লুপ বন্ধ'}
              aria-label="Toggle loop"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={handlePrevWord}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="পূর্ববর্তী শব্দ"
              aria-label="Previous word"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play / Pause (Big Central Hero Button) */}
            <button
              onClick={togglePlayPause}
              className={`p-5 rounded-3xl transition transform active:scale-95 cursor-pointer shadow-xl min-w-[64px] min-h-[64px] flex items-center justify-center ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                  : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25'
              }`}
              title={isPlaying ? 'পজ করুন' : 'অটো প্লে শুরু করুন'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
            </button>

            {/* Next */}
            <button
              onClick={handleNextWord}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer min-w-[48px] min-h-[48px] flex items-center justify-center"
              title="পরবর্তী শব্দ"
              aria-label="Next word"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Manual Audio Replay */}
            <button
              onClick={handleManualReplay}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="উচ্চারণ শুনুন"
              aria-label="Replay audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Speed & Delay Pills */}
          <div className="flex items-center justify-between text-xs pt-1 px-1">
            {/* Speed selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">গতি:</span>
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeechRate(rate)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer min-h-[30px] ${
                    speechRate === rate
                      ? 'bg-sky-500/30 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Delay Interval */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">বিরতি:</span>
              {[1.5, 2.5, 4.0].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setDelaySec(sec)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer min-h-[30px] ${
                    delaySec === sec
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
