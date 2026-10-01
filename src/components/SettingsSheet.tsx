import React, { useState } from 'react';
import { X, Volume2, Sun, Moon, Laptop, Check, Type, Sliders, Cloud, CheckCircle2, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { DisplaySettings, FontSize, ThemeMode } from '../types';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: Partial<DisplaySettings>) => void;
  currentUser?: FirebaseUser | null;
  onGoogleSignIn?: () => Promise<void>;
  onSignOut?: () => Promise<void>;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentUser,
  onGoogleSignIn,
  onSignOut,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  if (!isOpen) return null;

  const displayToggles = [
    { key: 'showFurigana' as const, label: 'Furigana (ふりがな)', desc: 'কান্জির উপর উচ্চারণ' },
    { key: 'showKana' as const, label: 'Kana (かな)', desc: 'হিরাগানা রিডিং' },
    { key: 'showRomaji' as const, label: 'Romaji (রোমাজি)', desc: 'ইংরেজি হরফে উচ্চারণ' },
    { key: 'showBengali' as const, label: 'বাংলা অর্থ (Bengali)', desc: 'শব্দের বাংলা অর্থ' },
    { key: 'showEnglish' as const, label: 'English Meaning', desc: 'ইংরেজি অনুবাদ' },
  ];

  const speechRates = [
    { value: 0.75, label: '0.75x (ধীর)' },
    { value: 1.0, label: '1.0x (স্বাভাবিক)' },
    { value: 1.25, label: '1.25x (দ্রুত)' },
  ];

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-sky-400" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-slate-400" /> },
  ];

  const fontSizes: { value: FontSize; label: string; desc: string }[] = [
    { value: 's', label: 'S', desc: 'ছোট (Small)' },
    { value: 'm', label: 'M', desc: 'স্বাভাবিক (Medium)' },
    { value: 'l', label: 'L', desc: 'বড় (Large)' },
  ];

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">সেটিংস ও কন্ট্রোল</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Theme Selection */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            অ্যাপ থিম (Theme)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((opt) => {
              const isSelected = settings.theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: opt.value })}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs font-bold transition cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Size Selection */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Type className="w-3.5 h-3.5" />
            <span>জাপানিজ ফন্ট সাইজ (Font Size)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {fontSizes.map((fs) => {
              const isSelected = settings.fontSize === fs.value;
              return (
                <button
                  key={fs.value}
                  type="button"
                  onClick={() => onUpdateSettings({ fontSize: fs.value })}
                  className={`py-3 px-2 rounded-2xl border transition text-center cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-sm font-bold">{fs.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{fs.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Reading & Meaning Display Toggles */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            ডিসপ্লে ও রিডিং অপশন
          </label>
          <div className="space-y-2">
            {displayToggles.map((item) => {
              const isActive = settings[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ [item.key]: !isActive })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer min-h-[24px] ${
                      isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Audio Speech Rate */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Volume2 className="w-3.5 h-3.5 text-sky-500" />
            <span>জাপানিজ অডিও স্পিড (Web Speech API)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {speechRates.map((rate) => (
              <button
                key={rate.value}
                type="button"
                onClick={() => onUpdateSettings({ speechRate: rate.value })}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition text-center cursor-pointer min-h-[44px] ${
                  settings.speechRate === rate.value
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {rate.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Firebase Cloud Sync Status Card */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-sky-500" />
            <span>ফায়ারবেস ক্লাউড ব্যাকআপ (Cloud Sync)</span>
          </label>

          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  স্বয়ংক্রিয় ব্যাকআপ সক্রিয়
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                Local-First
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              আপনার স্ট্রিক, অর্জিত XP এবং প্রতিটি শব্দের SRS মেমোরি ডেটা স্বয়ংক্রিয়ভাবে ব্যাকগ্রাউন্ডে ক্লাউডে সুরক্ষিত থাকে। কোনো ল্যাগ হবে না।
            </p>

            {currentUser && !currentUser.isAnonymous && currentUser.email ? (
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-rose-500 hover:text-white transition cursor-pointer flex items-center gap-1 min-h-[36px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center justify-center gap-2 min-h-[40px]"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-500" />
                  <span>{isSigningIn ? 'কানেক্ট হচ্ছে...' : 'Google অ্যাকাউন্ট দিয়ে সিঙ্ক করুন'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition cursor-pointer shadow-lg shadow-sky-500/20 min-h-[44px] flex items-center justify-center"
        >
          সম্পন্ন (Done)
        </button>
      </div>
    </div>
  );
};
