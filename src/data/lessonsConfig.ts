import { LESSON_26_VOCAB } from './lesson26';
import { LESSON_27_VOCAB } from './lesson27';
import { LESSON_28_VOCAB } from './lesson28';
import { LESSON_29_VOCAB } from './lesson29';
import { LESSON_30_VOCAB } from './lesson30';
import { LESSON_31_VOCAB } from './lesson31';
import { LESSON_32_VOCAB } from './lesson32';
import { LESSON_33_VOCAB } from './lesson33';
import { LESSON_34_VOCAB } from './lesson34';
import { LESSON_35_VOCAB } from './lesson35';
import { LESSON_36_VOCAB } from './lesson36';
import { LESSON_37_VOCAB } from './lesson37';
import { LESSON_38_VOCAB } from './lesson38';
import { LESSON_39_VOCAB } from './lesson39';
import { LESSON_40_VOCAB } from './lesson40';
import { LESSON_41_VOCAB } from './lesson41';
import { LESSON_42_VOCAB } from './lesson42';
import { LESSON_43_VOCAB } from './lesson43';
import { LESSON_44_VOCAB } from './lesson44';
import { LESSON_45_VOCAB } from './lesson45';
import { LESSON_46_VOCAB } from './lesson46';
import { LESSON_47_VOCAB } from './lesson47';
import { LESSON_48_VOCAB } from './lesson48';
import { LESSON_49_VOCAB } from './lesson49';
import { LESSON_50_VOCAB } from './lesson50';
import { VocabItem } from '../types';

export interface LessonMeta {
  id: string;
  number: number;
  title: string;
  japaneseTitle: string;
  grammarFocus: string;
  vocab: VocabItem[];
  color: string;
  icon: string;
}

export const ALL_LESSONS: LessonMeta[] = [
  {
    id: '26',
    number: 26,
    title: 'Lesson 26 (第26課)',
    japaneseTitle: '〜んです・〜ていただけませんか',
    grammarFocus: 'Explanation / Reason (~んです), Politeness, Opportunities',
    vocab: LESSON_26_VOCAB,
    color: 'from-blue-600 to-sky-600',
    icon: '🔍',
  },
  {
    id: '27',
    number: 27,
    title: 'Lesson 27 (第27課)',
    japaneseTitle: '可能動詞・見えます・聞こえます',
    grammarFocus: 'Potential Verbs (সম্ভাব্য ক্রিয়া), Visible / Audible, しか~ない',
    vocab: LESSON_27_VOCAB,
    color: 'from-emerald-600 to-teal-600',
    icon: '🕊️',
  },
  {
    id: '28',
    number: 28,
    title: 'Lesson 28 (第28課)',
    japaneseTitle: '〜ながら・〜ています・〜し、〜し',
    grammarFocus: 'Simultaneous action (~ながら), Habits (~ています), Multiple reasons (~し)',
    vocab: LESSON_28_VOCAB,
    color: 'from-purple-600 to-pink-600',
    icon: '🎵',
  },
  {
    id: '29',
    number: 29,
    title: 'Lesson 29 (第29課)',
    japaneseTitle: '自動詞・〜ています・〜てしまいました',
    grammarFocus: 'State of Intransitive Verbs (自動詞 〜ています), Regret (~てしまいました)',
    vocab: LESSON_29_VOCAB,
    color: 'from-amber-600 to-orange-600',
    icon: '🚪',
  },
  {
    id: '30',
    number: 30,
    title: 'Lesson 30 (第30課)',
    japaneseTitle: '他動詞・〜てあります・〜ておきます',
    grammarFocus: 'Resultant State of Transitive Verbs (〜てあります), Preparation (~ておきます), Still (~まだ)',
    vocab: LESSON_30_VOCAB,
    color: 'from-rose-600 to-red-600',
    icon: '📌',
  },
  {
    id: '31',
    number: 31,
    title: 'Lesson 31 (第31課)',
    japaneseTitle: '意向形・〜と思っています・〜予定です',
    grammarFocus: 'Volitional Form (意向形 〜よう), Intentions (~と思っています), Plans (~予定です)',
    vocab: LESSON_31_VOCAB,
    color: 'from-indigo-600 to-cyan-600',
    icon: '🎯',
  },
  {
    id: '32',
    number: 32,
    title: 'Lesson 32 (第32課)',
    japaneseTitle: '〜ほうがいい・〜でしょう・〜かもしれません',
    grammarFocus: 'Advice (~ほうがいい), Predictions (~でしょう), Possibility (~かもしれません)',
    vocab: LESSON_32_VOCAB,
    color: 'from-teal-600 to-emerald-500',
    icon: '⛅',
  },
  {
    id: '33',
    number: 33,
    title: 'Lesson 33 (第33課)',
    japaneseTitle: '命令形・禁止形・〜という意味です',
    grammarFocus: 'Imperative & Prohibitive Forms (命令形・禁止形), Signs & Definitions (~という意味)',
    vocab: LESSON_33_VOCAB,
    color: 'from-amber-500 to-rose-600',
    icon: '⚠️',
  },
  {
    id: '34',
    number: 34,
    title: 'Lesson 34 (第34課)',
    japaneseTitle: '〜とおりに・〜あとで・〜て／ないで',
    grammarFocus: 'Instructions (~とおりに), Sequence of Actions (~あとで), Actions without (~ないで)',
    vocab: LESSON_34_VOCAB,
    color: 'from-fuchsia-600 to-pink-500',
    icon: '🌸',
  },
  {
    id: '35',
    number: 35,
    title: 'Lesson 35 (第35課)',
    japaneseTitle: '条件形（〜ば）・〜なら・〜ば〜ほど',
    grammarFocus: 'Conditional Form (条件形 〜ば / 〜なら), Proportionality (〜ば〜ほど)',
    vocab: LESSON_35_VOCAB,
    color: 'from-cyan-600 to-blue-600',
    icon: '💡',
  },
  {
    id: '36',
    number: 36,
    title: 'Lesson 36 (第36課)',
    japaneseTitle: '〜ように・〜ようになります・〜ようにします',
    grammarFocus: 'Purpose (~ように), Change of State (~ようになります), Efforts & Habits (~ようにします)',
    vocab: LESSON_36_VOCAB,
    color: 'from-violet-600 to-indigo-500',
    icon: '🚀',
  },
  {
    id: '37',
    number: 37,
    title: 'Lesson 37 (第37課)',
    japaneseTitle: '受身動詞・〜によって・〜から作られます',
    grammarFocus: 'Passive Voice (受身動詞 〜られます), Inventions (~によって), Creation (~から作られます)',
    vocab: LESSON_37_VOCAB,
    color: 'from-orange-600 to-red-500',
    icon: '🏆',
  },
  {
    id: '38',
    number: 38,
    title: 'Lesson 38 (第38課)',
    japaneseTitle: '形式名詞「の」・〜のを忘れました・〜のは〜です',
    grammarFocus: 'Nominalization (形式名詞 〜の), Clauses as Objects (~のを知っていますか / 〜のを忘れました)',
    vocab: LESSON_38_VOCAB,
    color: 'from-emerald-600 to-lime-600',
    icon: '🎨',
  },
  {
    id: '39',
    number: 39,
    title: 'Lesson 39 (第39課)',
    japaneseTitle: '〜て／〜くて／〜で・〜ので',
    grammarFocus: 'Causes & Reasons (~て/〜で, 〜ので), Natural Disasters, Emotional Reactions',
    vocab: LESSON_39_VOCAB,
    color: 'from-amber-600 to-yellow-500',
    icon: '⚡',
  },
  {
    id: '40',
    number: 40,
    title: 'Lesson 40 (第40課)',
    japaneseTitle: '〜か／〜かどうか・〜てみます',
    grammarFocus: 'Embedded Questions (~か / 〜かどうか), Trying Actions (~てみます), Measurements',
    vocab: LESSON_40_VOCAB,
    color: 'from-sky-600 to-indigo-600',
    icon: '📏',
  },
  {
    id: '41',
    number: 41,
    title: 'Lesson 41 (第41課)',
    japaneseTitle: '〜ていただきます・〜てくださいます・〜てやります',
    grammarFocus: 'Giving & Receiving (Benefactive Verbs: いただきます / くださいます / やります), Respect & Humility',
    vocab: LESSON_41_VOCAB,
    color: 'from-teal-600 to-emerald-600',
    icon: '🎁',
  },
  {
    id: '42',
    number: 42,
    title: 'Lesson 42 (第42課)',
    japaneseTitle: '〜ために・〜のに使います／便利です',
    grammarFocus: 'Purpose & Objectives (~ために), Utility & Applications (~のに使います / 〜のに便利です / 〜のに時間がかかります)',
    vocab: LESSON_42_VOCAB,
    color: 'from-orange-600 to-amber-500',
    icon: '🍱',
  },
  {
    id: '43',
    number: 43,
    title: 'Lesson 43 (第43課)',
    japaneseTitle: '〜そうです（様態）・〜て来ます',
    grammarFocus: 'Conjecture based on Appearance (~そうです / Looks like), Going and Returning Actions (~て来ます)',
    vocab: LESSON_43_VOCAB,
    color: 'from-pink-600 to-rose-500',
    icon: '🌹',
  },
  {
    id: '44',
    number: 44,
    title: 'Lesson 44 (第44課)',
    japaneseTitle: '〜すぎます・〜やすい／〜にくい・〜にします',
    grammarFocus: 'Excessiveness (~すぎます), Ease & Difficulty (~やすい／〜にくい), State Change & Decision (~にします)',
    vocab: LESSON_44_VOCAB,
    color: 'from-cyan-600 to-blue-600',
    icon: '✂️',
  },
  {
    id: '45',
    number: 45,
    title: 'Lesson 45 (第45課)',
    japaneseTitle: '〜場合（は）・〜のに',
    grammarFocus: 'In the event of (~場合), Contrary to Expectations / Despite (~のに)',
    vocab: LESSON_45_VOCAB,
    color: 'from-rose-600 to-amber-600',
    icon: '🚩',
  },
  {
    id: '46',
    number: 46,
    title: 'Lesson 46 (第46課)',
    japaneseTitle: '〜ところです・〜たばかりです・〜はずです',
    grammarFocus: 'Aspect & Time Points (~ところです: 直前・最中・直後), Recent Completion (~たばかり), Strong Expectation (~はずです)',
    vocab: LESSON_46_VOCAB,
    color: 'from-violet-600 to-purple-600',
    icon: '📦',
  },
  {
    id: '47',
    number: 47,
    title: 'Lesson 47 (第47課)',
    japaneseTitle: '〜そうです（伝聞）・〜ようです',
    grammarFocus: 'Hearsay (~そうです: According to ~によると), Conjecture based on senses (~ようです, 音/声/味/匂いがします)',
    vocab: LESSON_47_VOCAB,
    color: 'from-blue-600 to-indigo-700',
    icon: '📰',
  },
  {
    id: '48',
    number: 48,
    title: 'Lesson 48 (第48課)',
    japaneseTitle: '使役形（〜せます／〜させます）・〜させていただけませんか',
    grammarFocus: 'Causative Verbs (使役: Make/Let someone do), Polite Requests for Permission (〜させていただけませんか)',
    vocab: LESSON_48_VOCAB,
    color: 'from-emerald-600 to-teal-700',
    icon: '🎒',
  },
  {
    id: '49',
    number: 49,
    title: 'Lesson 49 (第49課)',
    japaneseTitle: '尊敬語（お〜になります・特別な尊敬動詞・受身形尊敬）',
    grammarFocus: 'Honorific Language (尊敬語: Sonkeigo), Special Honorific Verbs (いらっしゃる / 召し上がる / おっしゃる / ご覧になる / なさる)',
    vocab: LESSON_49_VOCAB,
    color: 'from-purple-600 to-indigo-800',
    icon: '👑',
  },
  {
    id: '50',
    number: 50,
    title: 'Lesson 50 (第50課)',
    japaneseTitle: '謙譲語（お〜します・特別な謙譲動詞・丁寧語）',
    grammarFocus: 'Humble Language (謙譲語: Kenjougo), Politeness in Business (丁寧語: でございます / よろしいでしょうか)',
    vocab: LESSON_50_VOCAB,
    color: 'from-amber-600 to-yellow-600',
    icon: '🎓',
  },
];
