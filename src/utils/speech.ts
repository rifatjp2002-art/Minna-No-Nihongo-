/**
 * Web Speech API wrapper for natural Japanese pronunciation
 * Optimized for cross-device compatibility (iOS Safari, Android Chrome, Tablet, Desktop)
 */

export function stripHtmlTags(html: string): string {
  // First remove <rt>...</rt> ruby annotations
  // For Japanese TTS, reading the kanji directly produces the most natural rhythm.
  const withoutRt = html.replace(/<rt>.*?<\/rt>/gi, '');
  return withoutRt.replace(/<[^>]*>/g, '').trim();
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoice: SpeechSynthesisVoice | null = null;

// Initialize voices listener early for iOS Safari & Android
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      const voices = window.speechSynthesis.getVoices();
      cachedVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('ja') ||
            v.lang.toLowerCase() === 'ja-jp' ||
            v.lang.toLowerCase() === 'ja_jp'
        ) || null;
    } catch {
      // Ignore in non-supported environments
    }
  };

  loadVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function speakJapanese(
  text: string,
  rate: number = 1.0,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported on this device/browser.');
    onError?.();
    return;
  }

  // Cancel any running synthesis
  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {
    // Ignore cancel failure
  }

  const cleanText = stripHtmlTags(text);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ja-JP';
  utterance.rate = Math.max(0.6, Math.min(1.5, rate));
  utterance.pitch = 1.0;

  // Use cached voice or try fresh lookup
  if (cachedVoice) {
    utterance.voice = cachedVoice;
  } else {
    try {
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ja'));
      if (jaVoice) {
        cachedVoice = jaVoice;
        utterance.voice = jaVoice;
      }
    } catch {
      // Default to lang
    }
  }

  utterance.onstart = () => {
    activeUtterance = utterance;
    onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    activeUtterance = null;
    onError?.();
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis error:', err);
    onError?.();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch {
      // Ignore
    }
  }
}
