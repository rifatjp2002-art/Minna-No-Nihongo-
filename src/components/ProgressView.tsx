import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Award,
  BookOpen,
  CheckCircle2,
  Mail,
  Github,
  Globe,
  Heart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Cloud,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { ALL_LESSONS } from '../data/lessonsConfig';
import { SRSItemData, UserStats } from '../types';

interface ProgressViewProps {
  stats: UserStats;
  srsData: Record<number, SRSItemData>;
  currentUser?: FirebaseUser | null;
  onGoogleSignIn?: () => Promise<void>;
  onSignOut?: () => Promise<void>;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  srsData,
  currentUser,
  onGoogleSignIn,
  onSignOut,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'progress' | 'about'>('progress');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Compute stats across all lessons using existing data only
  const totalWords = ALL_LESSONS.reduce((acc, l) => acc + l.vocab.length, 0);
  let masteredWords = 0;
  let learningWords = 0;

  ALL_LESSONS.forEach((lesson) => {
    lesson.vocab.forEach((item) => {
      const key = lesson.number * 100 + item.id;
      const data = srsData[key];
      if (data) {
        if (data.repetition >= 3) {
          masteredWords++;
        } else if (data.historyCount > 0) {
          learningWords++;
        }
      }
    });
  });

  const unseenWords = Math.max(0, totalWords - masteredWords - learningWords);
  const masteryPercentage = Math.round((masteredWords / Math.max(1, totalWords)) * 100);

  // Daily goal calculation
  const DAILY_GOAL = 20;
  const cardsToday = stats.cardsReviewedToday || 0;
  const goalPercent = Math.min(100, Math.round((cardsToday / DAILY_GOAL) * 100));

  const handleSignIn = async () => {
    if (!onGoogleSignIn) return;
    try {
      setIsSigningIn(true);
      await onGoogleSignIn();
    } catch {
      // Ignored
    } finally {
      setIsSigningIn(false);
    }
  };

  const isGoogleUser = currentUser && !currentUser.isAnonymous && currentUser.email;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24 pt-2 px-1">
      {/* Top Segmented Control: Progress vs About */}
      <div className="flex p-1 bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('progress')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
            activeSubTab === 'progress'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>অগ্রগতি (Progress)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('about')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
            activeSubTab === 'about'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>পরিচিতি (About)</span>
        </button>
      </div>

      {activeSubTab === 'progress' ? (
        /* PROGRESS VIEW */
        <div className="space-y-4 animate-fade-in">
          {/* 1. GOOGLE ACCOUNT & CLOUD SYNC CARD */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-white via-white to-sky-50/50 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-sky-950/20 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm space-y-3">
            {isGoogleUser ? (
              /* State A: User is Signed In with Google */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-11 h-11 rounded-2xl border-2 border-emerald-500 shadow-sm object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-bold text-base flex items-center justify-center shadow-sm shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'G'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {currentUser.displayName || 'Google User'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>সিঙ্ক সক্রিয়</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-500/10 dark:bg-slate-800 hover:dark:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[40px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              /* State B: Anonymous / Guest User Prompted to Link Google */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-sky-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Google দিয়ে ক্লাউড ব্যাকআপ সিঙ্ক করুন
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                    আপনার {stats.streak} দিনের স্ট্রিক এবং {stats.xp} XP যেকোনো নতুন ডিভাইস বা ব্রাউজারে সুরক্ষিত রাখতে গুগল অ্যাকাউন্ট যুক্ত করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
                >
                  {/* Google 'G' Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{isSigningIn ? 'কানেক্ট হচ্ছে...' : 'Google দিয়ে সাইন ইন'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Main 3 Metrics: Streak, XP, Mastered Words */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Streak */}
            <div className="p-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="w-9 h-9 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Flame className="w-5 h-5 fill-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.streak} <span className="text-xs font-bold text-slate-400">দিন</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                স্ট্রিক (Streak)
              </div>
            </div>

            {/* 2. XP */}
            <div className="p-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="w-9 h-9 mx-auto rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                <Zap className="w-5 h-5 fill-violet-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.xp}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                অর্জিত XP
              </div>
            </div>

            {/* 3. Mastered Words */}
            <div className="p-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {masteredWords}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                মাস্টার্ড শব্দ
              </div>
            </div>
          </div>

          {/* Mastery Breakdown Card */}
          <div className="p-5 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ভোকাবুলারি পারদর্শিতা (Vocabulary Mastery)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  মোট {totalWords}টি শব্দের মধ্যে আপনার অগ্রগতি
                </p>
              </div>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {masteryPercentage}%
              </span>
            </div>

            {/* Multi-segmented Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(masteredWords / totalWords) * 100}%` }}
                title={`মাস্টার করা শব্দ: ${masteredWords}`}
              />
              <div
                className="bg-sky-500 h-full transition-all duration-500"
                style={{ width: `${(learningWords / totalWords) * 100}%` }}
                title={`শিখছেন: ${learningWords}`}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{masteredWords}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">মাস্টার্ড শব্দ</div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>{learningWords}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">অনুশীলনে আছে</div>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{unseenWords}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">বাকি শব্দ</div>
              </div>
            </div>
          </div>

          {/* Daily Goal & Reviews Summary */}
          <div className="p-5 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>আজকের গোল: {DAILY_GOAL}টি কার্ড</span>
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                আজ অনুশীলন: {cardsToday} / {DAILY_GOAL}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                সর্বমোট পর্যালোচনা: {stats.totalReviews} বার
              </div>
            </div>

            <div className="shrink-0 text-center">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {goalPercent}%
              </span>
              <div className="text-[10px] text-slate-400">সম্পন্ন</div>
            </div>
          </div>
        </div>
      ) : (
        /* ABOUT DEVELOPER PROFILE VIEW */
        <div className="space-y-4 animate-fade-in">
          <div className="p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-sm">
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-rose-500 p-0.5 shadow-lg shadow-sky-500/10">
                <div className="w-full h-full bg-slate-100 dark:bg-[#0b1120] rounded-2xl flex items-center justify-center text-3xl font-black text-slate-900 dark:text-white">
                  R
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                Dev
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Rifat (Developer)
              </h2>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                Frontend Engineer & Japanese Language Learner
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
                জাপানিজ ভাষা শিক্ষার্থীদের (JLPT N4) জন্য মিন্না নো নিহোঙ্গ (L26–L50) এর নির্ভুল ফুরিগানা, উচ্চারণ ও বাংলা অর্থসহ সহজে পড়ার মিনিমালিস্ট লার্নিং প্ল্যাটফর্ম।
              </p>
            </div>

            {/* Clean Link Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              {/* Email */}
              <a
                href="mailto:rifatjp2002@gmail.com"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 transition min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-rose-500" />
                <span>rifatjp2002@gmail.com</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition min-h-[44px]"
                >
                  <Github className="w-4 h-4 text-slate-500" />
                  <span>GitHub</span>
                </a>

                {/* Portfolio */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition min-h-[44px]"
                >
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>

          {/* App Highlights */}
          <div className="p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2.5 shadow-sm text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>মিন্না নো নিহোঙ্গ লেসন ২৬ থেকে ৫০ (সর্বমোট {totalWords}+ শব্দার্থ)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>১০০% অফলাইন সমর্থিত (ব্রাউজার LocalStorage ও ক্লাউডে সুরক্ষিত)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>প্রাকৃতিক জাপানিজ ভয়েস অডিও (Web Speech API)</span>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Bengali learners of Japanese • v3.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
