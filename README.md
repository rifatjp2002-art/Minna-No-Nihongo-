# 🌸 Nihongo Master (মিন্না নো নিহোঙ্গ L26–L50)
> **Japanese Vocabulary Learning Web App & 100% Offline PWA for Bengali Speakers (JLPT N4)**

[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline-green.svg)](https://web.dev/progressive-web-apps/)
[![JLPT](https://img.shields.io/badge/JLPT-N4%20Level-rose.svg)]()
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

একটি মিনিমালিস্ট, ডিস্ট্র্যাকশন-ফ্রি ও প্রিমিয়াম জাপানিজ ভাষা শিক্ষার প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA), যা বাংলাভাষী শিক্ষার্থীদের জন্য বিশেষভাবে তৈরি। এটি **১০০% অফলাইনে** কাজ করে এবং যেকোনো মোবাইল, ট্যাবলেট ও কম্পিউটারে ইনস্টল করা যায়।

---

## ✨ প্রধান বৈশিষ্ট্যসমূহ (Key Features)

### ১. 🇧🇩 বাংলা অর্থ সর্বাগ্রে (Bengali-First Pedagogy)
- বড় ও স্পষ্ট হরফে ফুরিগানাসহ কান্জি, রোমাজি এবং বাংলা অর্থ সবার আগে দৃশ্যমান।
- প্রতিটি শব্দের সাথে বাস্তব জীবনের ১-২টি প্রাসঙ্গিক উদাহরণ বাক্য।
- প্রাকৃতিক জাপানিজ ভয়েস অডিও (Web Speech API - `ja-JP`) স্পিড কন্ট্রোলসহ (0.75x, 1.0x, 1.25x)।

### ২. 🎧 হ্যান্ডস-ফ্রি লিসেনিং মোড (Commute / Hands-Free Player)
- বাসে, হাঁটার সময় বা বিছানায় শুয়ে ফোন স্পর্শ না করেই পুরো লেসনের শব্দগুলো স্বয়ংক্রিয়ভাবে শোনার সুযোগ।
- কাস্টম স্পিড (`0.75x`, `1.0x`, `1.25x`), শব্দের মধ্যবর্তী বিরতি (`1.5s`, `2.5s`, `4.0s`), অটো-লুপ এবং বিশাল কান্জি ডিসপ্লে।

### ৩. ⭐ প্রিয় শব্দ ও বুকমার্ক লিস্ট (Favorite / Starred Words)
- প্রতিটি শব্দার্থ কার্ড ও ফ্ল্যাশকার্ডে ১-ট্যাপ **⭐ স্টার বাটন**।
- শব্দার্থ পেজে **[সকল শব্দ]** এবং **[⭐ বুকমার্ক]** ফিল্টার দিয়ে কঠিন শব্দগুলো আলাদা করে দ্রুত রিভিশন।

### ৪. 🧠 বৈজ্ঞানিক মেমোরি সিস্টেম (SM-2 & Forgetting Curve)
- Piotr Woźniak-এর **SuperMemo SM-2 অ্যালগরিদম** ও এবিংহাউসের বিস্মরণ বক্ররেখা অনুযায়ী বিরতি নির্ধারিত হয়।
- বাটনের নিচে ডায়নামিক রিয়েল-ওয়ার্ল্ড ইন্টারভ্যাল প্রজেকশন (`1d`, `3d`, `8d`, `20d`, `1.5mo` ইত্যাদি)।
- প্রতিটি কার্ডের মেমোরি রিটেনশন শতকরা হার (Memory Recall %) প্রদর্শন।
- **স্মার্ট প্যাডাগজিক্যাল ক্রম:** স্বয়ংক্রিয়ভাবে আসে: `New (নতুন) ➜ Hard (কঠিন) ➜ Medium (মাঝারি) ➜ Easy (সহজ)`।

### ৫. 🎮 হার্ডকোর XP গেমিফিকেশন ও স্ট্রিক ট্র্যাকার
- 🟢 সহজ (Easy): `+১ XP`
- 🟡 মাঝারি (Medium): `+২ XP`
- 🔴 কঠিন (Hard / Retry): `+৩ XP`
- ❌ কুইজে ভুল উত্তরের পেনাল্টি: `-৫ XP` (সেফটি ফ্লোর ০ সহ)।
- প্রতিদিনের ধারাবাহিক পড়াশোনার হিসাব রাখতে **দৈনিক স্ট্রিক (Streak)** ও দৈনিক লক্ষ্যের প্রোগ্রেস বার।

### ৬. 🎯 ইন্টেলিজেন্ট কুইজ ইঞ্জিন (`retryQueue` সহ)
- ৩টি মোড: কান্জি ➜ অর্থ, অর্থ ➜ কান্জি এবং লিসেনিং।
- ভুল হওয়া শব্দগুলো স্বয়ংক্রিয়ভাবে `retryQueue`-এ জমা হয় এবং ডেক শেষ হওয়ার পর সেগুলো নিয়ে রাউন্ড চলতে থাকে যতক্ষণ না সবগুলো নির্ভুল হয়।
- শেষে পূর্ণাঙ্গ সামারি স্ক্রিন (সঠিকের হার %, মোট XP এবং ভুল হওয়া শব্দের অডিওসহ তালিকা)।

### ৭. ☁️ ফায়ারবেস লোকাল-ফার্স্ট ক্লাউড ব্যাকআপ ও Google লগইন
- **০ মিলিসেকেন্ড রেসপন্স (Local-First):** ডেটা লোকাল মেমোরিতে তাৎক্ষণিক সেভ হয়, তাই অ্যাপে বিন্দুমাত্র ল্যাগ নেই।
- **নীরব ব্যাকগ্রাউন্ড ব্যাকআপ:** সমস্ত XP, স্ট্রিক, বুকমার্ক ও SRS হিস্ট্রি স্বয়ংক্রিয়ভাবে Firebase Firestore-এ সিঙ্ক হয়।
- **Google অ্যাকাউন্ট লিঙ্কিং:** অগ্রগতি (Progress) পেজ ও সেটিংস থেকে এক ক্লিকে গুগল দিয়ে লগইন করে একাধিক ডিভাইসে সিঙ্ক করা যায়।

### ৮. 📱 ১০০% অফলাইন PWA ও `日本 / 先生` লাক্সারি আইকন
- ঐতিহ্যবাহী জাপানিজ লাক্ষা-সীলমোহর স্টাইলে **`日本`** (Nihon) এবং **`先生`** (Sensei) গোল্ডেন কান্জি খোদাই করা অফিশিয়াল অ্যাপ আইকন।
- Service Worker ও Google Fonts ক্যাশিং যুক্ত থাকায় একবার লোড হলে ইন্টারনেট ছাড়াও পুরো অ্যাপ ও ফন্ট নির্বিঘ্নে চলবে।

---

## 🛠️ প্রযুক্তি স্ট্যাক (Tech Stack)

| স্তর | ব্যবহৃত প্রযুক্তি |
|---|---|
| **Frontend Framework** | React 18 (TypeScript) + Vite |
| **Styling & Icons** | Tailwind CSS + Lucide React |
| **Typography** | Noto Sans JP, Hind Siliguri, Plus Jakarta Sans |
| **Spaced Repetition** | SuperMemo SM-2 Algorithm + Ebbinghaus Retention |
| **Speech Engine** | Web Speech Synthesis API (`ja-JP`) |
| **Database & Auth** | Firebase Firestore + Firebase Authentication |
| **Offline / PWA** | Custom Service Worker + Web App Manifest |
| **CI/CD Deployment** | GitHub Actions (`deploy.yml`) |

---

## 🚀 গিটহাবে পুশ ও স্বয়ংক্রিয় লাইভ পাবলিশ গাইড (GitHub Pages Setup)

এই প্রজেক্টে **GitHub Actions Workflow** আগে থেকেই সাজানো আছে। আপনি কোড পুশ করলেই এটি স্বয়ংক্রিয়ভাবে লাইভ ওয়েবসাইটে রূপান্তর হবে।

### ধাপ ১: আপনার লোকাল রিপোজিটরিতে কোড পুশ করুন
```bash
# গিট ইনিশিয়ালাইজ করুন
git init

# সব ফাইল যোগ করুন
git add .

# কমিট করুন
git commit -m "feat: complete Nihongo Master with commute player and cloud sync"

# মেইন ব্রাঞ্চ নির্বাচন করুন
git branch -M main

# আপনার গিটহাব রিপোসিটরির রিমোট ইউআরএল যুক্ত করুন (YOUR_USERNAME ও REPO_NAME বসান)
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# গিটহাবে পুশ করুন
git push -u origin main
```

### ধাপ ২: গিটহাব পেজেস একটিভ করুন (Only 1 Step)
1. আপনার GitHub রিপোজিটরি ওপেন করুন।
2. **Settings** ট্যাবে যান ➜ বামপাশের মেনু থেকে **Pages**-এ ক্লিক করুন।
3. **Build and deployment > Source** ড্রপডাউনে **"GitHub Actions"** সিলেক্ট করুন।
4. ব্যস! গিটহাব স্বয়ংক্রিয়ভাবে বিল্ড করে আপনার সাইট পাবলিশ করে দেবে:
   ```
   https://<YOUR_USERNAME>.github.io/<REPO_NAME>/
   ```

---

## 💻 লোকাল ডেভেলপমেন্ট (Local Development)

```bash
# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# লোকাল ডেভ সার্ভার চালু করুন (Port 3000)
npm run dev

# প্রোডাকশন বিল্ড যাচাই করুন
npm run build
```

---

## 📲 কীভাবে ফোনে ও পিসিতে ইনস্টল করবেন (How to Install PWA)

- **Android (Chrome):** ব্রাউজার মেনু (৩ ডট) ➜ **"Install app"** অথবা **"Add to Home screen"** চাপুন।
- **iPhone / iPad (Safari):** শেয়ার বাটন (Share icon) ➜ **"Add to Home Screen"** চাপুন।
- **Desktop (Chrome/Edge):** অ্যাড্রেস বারের ডানপাশে থাকা **Install** আইকনে ক্লিক করুন।

---

## 📄 লাইসেন্স (License)

MIT License • তৈরি করা হয়েছে বাংলাভাষী জাপানিজ ভাষা শিক্ষার্থীদের সুবিধার জন্য।
