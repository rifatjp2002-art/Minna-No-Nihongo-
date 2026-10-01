import React from 'react';
import { Mail, Github, Globe, ExternalLink, Heart, ShieldCheck, BookOpen, Sparkles, User } from 'lucide-react';
import { ALL_LESSONS } from '../data/lessonsConfig';

export const AboutView: React.FC = () => {
  const totalWords = ALL_LESSONS.reduce((acc, l) => acc + l.vocab.length, 0);

  const links = [
    {
      label: 'Email Developer',
      href: 'mailto:rifatjp2002@gmail.com',
      icon: Mail,
      desc: 'rifatjp2002@gmail.com',
      color: 'text-rose-500',
    },
    {
      label: 'GitHub Profile',
      href: 'https://github.com',
      icon: Github,
      desc: 'github.com/placeholder',
      color: 'text-slate-800 dark:text-slate-200',
    },
    {
      label: 'Personal Portfolio',
      href: 'https://portfolio.placeholder',
      icon: Globe,
      desc: 'portfolio.placeholder',
      color: 'text-sky-500',
    },
  ];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 pt-2 px-1">
      {/* 1. Developer Profile Card */}
      <div className="p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-sm">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-rose-500 p-0.5 shadow-md shadow-sky-500/10">
            <div className="w-full h-full bg-slate-100 dark:bg-[#0b1120] rounded-2xl flex items-center justify-center text-3xl font-black text-slate-900 dark:text-white">
              R
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
            Dev
          </span>
        </div>

        {/* Identity & Short Bio */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Rifat (Developer Name)
          </h2>
          <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
            Japanese Language Learner & Full-stack Developer
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
            জাপানিজ ভাষা শিক্ষার্থীদের (JLPT N5–N4) জন্য মিন্না নো নিহোঙ্গ বইয়ের প্রতিটি শব্দ নির্ভুল ফুরিগানা ও বাংলা অর্থসহ সহজে অনুশীলনের ডিজিটাল প্ল্যাটফর্ম।
          </p>
        </div>

        {/* Styled Link Buttons (Min 44px tap targets) */}
        <div className="pt-2 space-y-2">
          {links.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer min-h-[48px] group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition" />
              </a>
            );
          })}
        </div>
      </div>

      {/* 2. App Information Summary */}
      <div className="p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
          অ্যাপের তথ্য ও প্রযুক্তি
        </h3>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
            <span>মিন্না নো নিহোঙ্গ লেসন ২৬ থেকে ৫০ (সর্বমোট {totalWords}+ শব্দার্থ)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>১০০% অফলাইন কার্যকর (LocalStorage এ স্বয়ংক্রিয় প্রোগ্রেস সেভ)</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Web Speech API দ্বারা নেটিভ জাপানিজ অডিও উচ্চারণ</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>for Japanese learners • Minimalist & Distraction-free</span>
      </div>
    </div>
  );
};
