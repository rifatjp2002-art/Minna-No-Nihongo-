import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, Trophy, RotateCcw, Zap, AlertTriangle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { DisplaySettings, VocabItem } from '../types';
import { speakJapanese } from '../utils/speech';

interface QuizViewProps {
  items: VocabItem[];
  settings: DisplaySettings;
  onCorrectAnswer: (xpEarned: number) => void;
}

export type QuizMode = 'kanji_to_meaning' | 'meaning_to_kanji' | 'listening';

interface Question {
  item: VocabItem;
  mode: QuizMode;
  options: VocabItem[];
  correctAnswer: VocabItem;
  isRetry?: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({ items, settings, onCorrectAnswer }) => {
  // Current active deck and index
  const [deck, setDeck] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Retry queue for the current round
  const [retryQueue, setRetryQueue] = useState<VocabItem[]>([]);
  // Persistent list of words needing revisit for the final summary screen
  const [wordsToRevisit, setWordsToRevisit] = useState<VocabItem[]>([]);

  // Round tracking and scores
  const [roundNumber, setRoundNumber] = useState(1);
  const [initialTotalCount, setInitialTotalCount] = useState(10);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // Option selection and completion state
  const [selectedOption, setSelectedOption] = useState<VocabItem | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('kanji_to_meaning');

  // Helper to build question list from vocabulary items
  const buildQuestionsFromItems = (targetItems: VocabItem[], mode: QuizMode, isRetryRound: boolean): Question[] => {
    return targetItems.map((target) => {
      const distractors = items
        .filter((i) => i.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);

      return {
        item: target,
        mode,
        options,
        correctAnswer: target,
        isRetry: isRetryRound,
      };
    });
  };

  // Start fresh quiz session
  const startQuizSession = (mode: QuizMode) => {
    if (!items || items.length === 0) return;
    const shuffledItems = [...items].sort(() => Math.random() - 0.5).slice(0, 10);
    const initialDeck = buildQuestionsFromItems(shuffledItems, mode, false);

    setDeck(initialDeck);
    setInitialTotalCount(initialDeck.length);
    setCurrentQuestionIndex(0);
    setRetryQueue([]);
    setWordsToRevisit([]);
    setRoundNumber(1);
    setFirstTryCorrectCount(0);
    setTotalXpEarned(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  useEffect(() => {
    startQuizSession(quizMode);
  }, [items, quizMode]);

  const currentQ = deck[currentQuestionIndex];

  // Auto-play audio when question loads in listening mode
  useEffect(() => {
    if (currentQ && currentQ.mode === 'listening' && !isAnswered) {
      const text = currentQ.item.kanji.split('/')[0].split('[')[0].trim() || currentQ.item.kana;
      speakJapanese(text, settings.speechRate);
    }
  }, [currentQuestionIndex, currentQ, isAnswered]);

  const handleSelectOption = (option: VocabItem) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.id === currentQ.correctAnswer.id;

    if (isCorrect) {
      // Award XP (+3 for hard/retry words, +2 for normal)
      const earned = currentQ.isRetry ? 3 : 2;
      onCorrectAnswer(earned);
      setTotalXpEarned((prev) => prev + earned);

      if (roundNumber === 1 && !currentQ.isRetry) {
        setFirstTryCorrectCount((prev) => prev + 1);
      }
    } else {
      // Penalty: Deduct 5 XP on wrong answer!
      onCorrectAnswer(-5);
      setTotalXpEarned((prev) => Math.max(0, prev - 5));

      const wrongWord = currentQ.correctAnswer;

      // 1. Store in retryQueue for this round (to be reviewed once current deck is exhausted)
      setRetryQueue((prev) => {
        if (prev.some((item) => item.id === wrongWord.id)) return prev;
        return [...prev, wrongWord];
      });

      // 2. Store in wordsToRevisit for the final summary screen
      setWordsToRevisit((prev) => {
        if (prev.some((item) => item.id === wrongWord.id)) return prev;
        return [...prev, wrongWord];
      });
    }
  };

  // Move to next question or iterate through retryQueue when current deck is exhausted
  const handleNext = () => {
    if (currentQuestionIndex < deck.length - 1) {
      // Still have cards in the current deck
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Current deck is exhausted! Check retryQueue
      if (retryQueue.length > 0) {
        // Automatically iterate through the retryQueue until all words are answered correctly
        const retryDeck = buildQuestionsFromItems(retryQueue, quizMode, true);
        setDeck(retryDeck);
        setRetryQueue([]);
        setCurrentQuestionIndex(0);
        setRoundNumber((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        // All words are answered correctly! Show final summary screen
        setQuizFinished(true);
      }
    }
  };

  const handlePlayAudio = (textToPlay?: string) => {
    const text =
      textToPlay ||
      currentQ?.item.kanji.split('/')[0].split('[')[0].trim() ||
      currentQ?.item.kana ||
      '';
    if (text) {
      speakJapanese(text, settings.speechRate);
    }
  };

  if (!items || items.length < 4) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        কুইজ শুরু করার জন্য কমপক্ষে ৪টি শব্দ প্রয়োজন।
      </div>
    );
  }

  // 1. FINAL SUMMARY SCREEN (Displaying correct percentage, total XP earned, and words to revisit)
  if (quizFinished) {
    const correctPercent = Math.round((firstTryCorrectCount / Math.max(1, initialTotalCount)) * 100);

    return (
      <div className="max-w-md mx-auto py-5 px-2 space-y-4 pb-24 animate-fade-in">
        {/* Trophy & Header */}
        <div className="text-center space-y-2">
          <div className="w-18 h-18 bg-amber-500/15 text-amber-500 rounded-3xl mx-auto flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Trophy className="w-9 h-9 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            কুইজ ফলাফল • Final Summary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            সকল শব্দ সফলভাবে সমাধান ও আয়ত্ত করা হয়েছে
          </p>
        </div>

        {/* 3 Metric Summary Cards: Correct %, Total XP, Words to Revisit Count */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Correct % */}
          <div className="p-3.5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">সঠিক হার</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {correctPercent}%
            </div>
            <div className="text-[10px] text-slate-400">Correct %</div>
          </div>

          {/* Total XP Earned */}
          <div className="p-3.5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">মোট XP</div>
            <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-0.5">
              +{totalXpEarned}
            </div>
            <div className="text-[10px] text-slate-400">Total XP</div>
          </div>

          {/* First Try Score */}
          <div className="p-3.5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">প্রথমবারে সঠিক</div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-0.5">
              {firstTryCorrectCount}/{initialTotalCount}
            </div>
            <div className="text-[10px] text-slate-400">Questions</div>
          </div>
        </div>

        {/* List of Words to Revisit */}
        <div className="p-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>পুনরায় দেখার শব্দসমূহ ({wordsToRevisit.length})</span>
            </div>
            {wordsToRevisit.length === 0 ? (
              <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>১০০% নির্ভুল স্কোর!</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">
                রি-ট্রাই কিউতে সমাধান হয়েছে
              </span>
            )}
          </div>

          {wordsToRevisit.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {wordsToRevisit.map((w) => (
                <div
                  key={w.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base text-slate-900 dark:text-white font-['Noto_Sans_JP']">
                        {w.kanji}
                      </span>
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-['Noto_Sans_JP']">
                        {w.kana}
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-['Hind_Siliguri'] font-semibold truncate mt-0.5">
                      {w.bengali}
                    </div>
                    <div className="text-[11px] text-slate-400 italic truncate">
                      {w.english}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(w.kanji || w.kana)}
                    className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition cursor-pointer shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="উচ্চারণ শুনুন"
                    aria-label="Listen pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                🎉 অসাধারণ! সব প্রশ্নের উত্তর প্রথমবারেই সঠিক ছিল!
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                এই সেশনে কোনো শব্দ পুনরায় পড়ার প্রয়োজন পড়েনি।
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Play Again & Mode Selection */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => startQuizSession(quizMode)}
            className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>আবার কুইজ খেলুন (Play Again)</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setQuizMode('kanji_to_meaning')}
              className={`py-2.5 px-1 rounded-xl text-xs font-semibold border transition text-center min-h-[44px] cursor-pointer ${
                quizMode === 'kanji_to_meaning'
                  ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              কান্জি ➜ অর্থ
            </button>
            <button
              onClick={() => setQuizMode('meaning_to_kanji')}
              className={`py-2.5 px-1 rounded-xl text-xs font-semibold border transition text-center min-h-[44px] cursor-pointer ${
                quizMode === 'meaning_to_kanji'
                  ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              অর্থ ➜ কান্জি
            </button>
            <button
              onClick={() => setQuizMode('listening')}
              className={`py-2.5 px-1 rounded-xl text-xs font-semibold border transition text-center min-h-[44px] cursor-pointer ${
                quizMode === 'listening'
                  ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              লিসেনিং
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const isCorrect = selectedOption?.id === currentQ.correctAnswer.id;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / deck.length) * 100);

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-[calc(100vh-140px)] justify-between pb-24 pt-2 px-1">
      {/* 2. PROGRESS & ROUND HEADER */}
      <div className="space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
          {/* Question / Round info */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              প্রশ্ন {currentQuestionIndex + 1} / {deck.length}
            </span>
            {roundNumber > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin-reverse" />
                <span>রি-ট্রাই রাউন্ড #{roundNumber}</span>
              </span>
            )}
          </div>

          {/* Right indicator: Queued for retry & Live XP */}
          <div className="flex items-center gap-3">
            {retryQueue.length > 0 && (
              <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                রি-ট্রাই কিউ: {retryQueue.length}
              </span>
            )}
            <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-violet-500" />
              <span>+{totalXpEarned}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar of Current Deck */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              roundNumber > 1 ? 'bg-gradient-to-r from-amber-500 to-emerald-500' : 'bg-gradient-to-r from-sky-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Mode Selector Pill Buttons */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <button
            onClick={() => setQuizMode('kanji_to_meaning')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer min-h-[36px] ${
              quizMode === 'kanji_to_meaning'
                ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            কান্জি ➜ অর্থ
          </button>
          <button
            onClick={() => setQuizMode('meaning_to_kanji')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer min-h-[36px] ${
              quizMode === 'meaning_to_kanji'
                ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            অর্থ ➜ কান্জি
          </button>
          <button
            onClick={() => setQuizMode('listening')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 min-h-[36px] ${
              quizMode === 'listening'
                ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>লিসেনিং</span>
          </button>
        </div>
      </div>

      {/* 3. QUESTION PROMPT CARD */}
      <div className="my-3 p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-md dark:shadow-lg">
        <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 tracking-wider">
          {currentQ.isRetry ? 'ভুল হওয়া শব্দের পুনরায় অনুশীলন' : 'সঠিক উত্তরটি নির্বাচন করুন'}
        </span>

        {/* Mode A: Kanji to Meaning */}
        {quizMode === 'kanji_to_meaning' && (
          <div className="py-4 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Noto_Sans_JP'] tracking-wide">
              {currentQ.item.kanji}
            </div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-['Noto_Sans_JP']">
              {currentQ.item.kana} • <span className="text-amber-600 dark:text-amber-300/80 font-mono text-xs">{currentQ.item.romaji}</span>
            </div>
          </div>
        )}

        {/* Mode B: Meaning to Kanji */}
        {quizMode === 'meaning_to_kanji' && (
          <div className="py-4 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-300 font-['Hind_Siliguri']">
              {currentQ.item.bengali}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{currentQ.item.english}</div>
          </div>
        )}

        {/* Mode C: Listening */}
        {quizMode === 'listening' && (
          <div className="py-4 flex flex-col items-center gap-2">
            <button
              onClick={() => handlePlayAudio()}
              className="p-4 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 transition cursor-pointer animate-pulse min-w-[56px] min-h-[56px] flex items-center justify-center"
              title="পুনরায় অডিও শুনুন"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">অডিওটি শুনে সঠিক শব্দটি নির্বাচন করুন</span>
          </div>
        )}
      </div>

      {/* 4. FOUR INTERACTIVE OPTION CARDS */}
      <div className="space-y-2">
        {currentQ.options.map((option) => {
          let btnStyle = 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

          if (isAnswered) {
            if (option.id === currentQ.correctAnswer.id) {
              btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
            } else if (selectedOption?.id === option.id) {
              btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 line-through';
            } else {
              btnStyle = 'bg-slate-50 dark:bg-[#0f172a]/60 border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer select-none active:scale-[0.99] min-h-[48px] ${btnStyle}`}
            >
              {quizMode === 'meaning_to_kanji' ? (
                /* Meaning to Kanji: Shows Kanji & Kana */
                <div>
                  <span className="text-base font-bold font-['Noto_Sans_JP'] text-slate-900 dark:text-white">
                    {option.kanji}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-['Noto_Sans_JP']">
                    ({option.kana})
                  </span>
                </div>
              ) : quizMode === 'listening' ? (
                /* Listening: Shows Kanji, Kana and Bengali Meaning */
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold font-['Noto_Sans_JP'] text-slate-900 dark:text-white">
                      {option.kanji}
                    </span>
                    <span className="text-xs text-sky-600 dark:text-sky-400 font-['Noto_Sans_JP']">
                      {option.kana}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-['Hind_Siliguri'] mt-0.5">
                    {option.bengali}
                  </div>
                </div>
              ) : (
                /* Kanji to Meaning: Shows Bengali & English Meaning */
                <div>
                  <div className="text-sm font-semibold font-['Hind_Siliguri'] text-slate-900 dark:text-slate-100">
                    {option.bengali}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {option.english}
                  </div>
                </div>
              )}

              {isAnswered && option.id === currentQ.correctAnswer.id && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
              {isAnswered && selectedOption?.id === option.id && option.id !== currentQ.correctAnswer.id && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 5. ANSWER BOTTOM FEEDBACK & CONTINUE BAR */}
      {isAnswered && (
        <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 animate-fade-in shrink-0 min-h-[48px]">
          <div className="min-w-0">
            <div className={`text-xs font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isCorrect
                ? currentQ.isRetry
                  ? '✓ চমৎকার! কঠিন শব্দ ঠিক হয়েছে (+৩ XP)'
                  : '✓ দারুণ! সঠিক উত্তর (+২ XP)'
                : '✕ ভুল উত্তর! (-৫ XP কাটা গেছে) — শব্দটি পুনরায় আসবে'}
            </div>
            {!isCorrect && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 truncate">
                সঠিক: {currentQ.correctAnswer.kanji} ({currentQ.correctAnswer.kana}) - {currentQ.correctAnswer.bengali}
              </div>
            )}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition cursor-pointer shrink-0 min-h-[44px] flex items-center justify-center gap-1 shadow-sm"
          >
            <span>{currentQuestionIndex === deck.length - 1 ? (retryQueue.length > 0 ? 'রি-ট্রাই শুরু ➜' : 'ফলাফল ➜') : 'পরবর্তী ➜'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
