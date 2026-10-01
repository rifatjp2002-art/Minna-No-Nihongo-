import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakJapanese } from '../utils/speech';

interface RubyRendererProps {
  html: string;
  showFurigana?: boolean;
  className?: string;
  allowAudio?: boolean;
  speechRate?: number;
  onAudioPlayed?: () => void;
}

export const RubyRenderer: React.FC<RubyRendererProps> = ({
  html,
  showFurigana = true,
  className = '',
  allowAudio = false,
  speechRate = 1.0,
  onAudioPlayed,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    speakJapanese(
      html,
      speechRate,
      () => setIsPlaying(true),
      () => {
        setIsPlaying(false);
        onAudioPlayed?.();
      },
      () => setIsPlaying(false)
    );
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={!showFurigana ? 'ruby-no-furigana' : ''}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          // When furigana is disabled, style rt as invisible/zero-size
          ...(!showFurigana
            ? ({
                // rt will be hidden via global style
              } as React.CSSProperties)
            : {}),
        }}
      />
      {allowAudio && (
        <button
          onClick={handlePlayAudio}
          type="button"
          aria-label="Listen to Japanese pronunciation"
          className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            isPlaying
              ? 'text-rose-400 bg-rose-500/20 scale-110 shadow-lg shadow-rose-500/30 animate-pulse'
              : 'text-slate-400 hover:text-sky-300 hover:bg-slate-700/50'
          }`}
          title="Play audio (Web Speech API)"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      )}
    </span>
  );
};
