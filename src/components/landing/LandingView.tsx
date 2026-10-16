import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import {
  Zap,
  Sparkles,
  CalendarCheck,
  Timer,
  GraduationCap,
  TrendingUp,
  Trophy,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Play,
  Flame,
  ShieldCheck,
  Star,
  MessageSquare,
} from 'lucide-react';

const MASCOT_QUOTES = [
  "“Bhai reels band kar, PadhloShawtys pe focus timer laga aur lock in kar!” 🔥",
  "“Agar aaj nahi padha toh kal paper me ceiling ginega! 😭 Bas start karo!”",
  "“Syllabus pahad lag raha hai? 45-minute sprint lagao, sab cover hoga! ⚡”",
  "“Academic Weapon arc loading... Ek Pomodoro session aur! 🎯”",
  "“Padhlo shawtys! Result ke din full swag me ghumna hai na? 🏆”",
  "“Dopamine reels dekhne me nahi, syllabus tick karne me hai! 🧠”",
  "“Kal padhunga = kabhi nahi padhunga. Abhi timer on kar! 🚀”",
];

export const LandingView: React.FC = () => {
  const { setActiveTab, loadDemoMode } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Scroll-driven transforms:
  // As user scrolls, main text fades in smoothly & image fades in and expands scale up to 1.25x
  const imageScrollScale = useTransform(scrollY, [0, 450], [1.0, 1.25]);
  const smoothImageScale = useSpring(imageScrollScale, { stiffness: 120, damping: 20 });
  const imageScrollOpacity = useTransform(scrollY, [0, 100], [0.9, 1.0]);

  const textScrollOpacity = useTransform(scrollY, [0, 120], [0.92, 1.0]);
  const textScrollY = useTransform(scrollY, [0, 450], [0, -15]);

  // Mouse tilt tracking for the mascot image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMascotClick = () => {
    setMascotQuoteIndex((prev) => (prev + 1) % MASCOT_QUOTES.length);
    setClickCount((c) => c + 1);
    playSound('badge');
    triggerConfetti();
  };

  const faqs = [
    {
      q: 'Kyu nhi hori padhai? PadhloShawtys kaise help karega?',
      a: 'Bhai simple si baat hai: syllabus bada hota hai aur dimaag blank. PadhloShawtys ek transparent algorithm use karta hai jo aapke exams, topic difficulty aur confidence level ko dekhkar realistic 45-minute study blocks banata hai. Isse aapko sochna nahi padta ki "kya padhu", bas timer start karo aur lock in karo!',
    },
    {
      q: 'How does the Smart Study Scheduler calculate my plan?',
      a: 'PadhloShawtys uses a transparent priority algorithm factoring in four distinct metrics: days remaining until your exam/deadline (urgency), topic difficulty (1-5), your personal confidence deficit (6 - confidence score), and exam weight. It chunks study blocks into manageable 45-minute sessions, inserts breaks, avoids your recurring commitments (like lectures/gym), and warns you if your total workload exceeds available study capacity.',
    },
    {
      q: 'Does the Pomodoro timer keep counting if I switch browser tabs?',
      a: 'Yes! Unlike standard interval-based timers that drift or freeze in inactive tabs, PadhloShawtys calculates remaining duration using actual timestamp differences (targetEndTime - Date.now()), ensuring millisecond-level precision even when the tab is backgrounded.',
    },
    {
      q: 'Does this app send my study data to an external server or require an account?',
      a: 'Zero cloud tracking or account signup required. All your tasks, syllabus topics, study logs, and achievements are stored locally in your browser’s localStorage. You can export and import your entire backup as JSON at any time.',
    },
    {
      q: 'Is the gamification just superficial badges or does it actually help?',
      a: 'It is built specifically around the psychology of compounding momentum. You earn XP for genuine 25-minute focus intervals and task completions. Unlocking ranks from "Procrastination Rookie" to "Academic Weapon" and reviewing your Spotify Wrapped-style weekly recap makes studying feel rewarding rather than draining.',
    },
  ];

  return (
    <div className="space-y-24 pb-16 animate-in fade-in duration-300">
      {/* 1. Hero Section with Interactive Mascot & Scroll-Driven Scale */}
      <section ref={heroRef} className="relative pt-6 sm:pt-10">
        {/* Soft colorful backdrop orbs for rich modern white UI */}
        <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & CTAs with Fade-in and Scroll Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: textScrollOpacity, y: textScrollY }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-200/80 text-indigo-700 text-xs font-mono font-bold tracking-wider uppercase shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>PadhloShawtys OS v2.0 • The Ultimate Study Weapon</span>
            </motion.div>

            {/* The Main Title requested by User */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Kyu nhi hori padhai? <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                kyuki aap PadhloShawtys nhi use karte! 😭🔥
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed"
            >
              Exams sir pe hain, syllabus pahad jaisa hai aur reels scroll ho rahi hai?{' '}
              <strong className="text-slate-900 font-semibold">PadhloShawtys</strong> aapka personalized
              study OS hai jo topics ko algorithmically schedule karta hai, Pomodoro se focus lock in
              karta hai, aur padhai ko ek rewarding game bana deta hai.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <button
                onClick={() => setActiveTab('scheduler')}
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-display font-bold text-sm shadow-[0_10px_25px_-5px_rgba(99,102,241,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build My Study Plan</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-display font-semibold text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>Command Center</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={loadDemoMode}
                className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-display font-semibold text-xs transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Load Demo Data</span>
              </button>
            </motion.div>

            {/* Social Trust Metrics */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="flex text-amber-500">★★★★★</span>
                <span className="font-semibold text-slate-800">4.9/5</span>
                <span>by 10,000+ Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-700">100% Free & Local Privacy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: INTERACTIVE MASCOT WITH MOUSE TILT & SCROLL SCALE INCREASE */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-5 relative flex flex-col items-center justify-center perspective-[1000px]"
          >
            {/* Glowing background gradient ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-pink-200/50 rounded-full blur-2xl -z-10 scale-95" />

            {/* Interactive Speech Bubble: click to cycle humorous motivational quotes */}
            <motion.div
              key={mascotQuoteIndex}
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              onClick={handleMascotClick}
              className="relative z-20 mb-3 bg-white p-3.5 rounded-2xl shadow-[0_12px_30px_rgba(99,102,241,0.15)] border-2 border-indigo-200 text-slate-800 text-xs font-semibold max-w-xs cursor-pointer hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all group"
              title="Click for more motivation!"
            >
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 group-hover:rotate-12 transition-transform" />
                <div>
                  <p className="text-slate-900 font-bold leading-snug">
                    {MASCOT_QUOTES[mascotQuoteIndex]}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-indigo-600 font-mono font-normal">
                    <span>— The Academic Mentor</span>
                    <span className="font-bold underline group-hover:text-pink-600">Click to change 💬</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mascot Image Container with Scroll Scale & 3D Interactive Tilt */}
            <motion.div
              style={{
                scale: smoothImageScale,
                opacity: imageScrollOpacity,
                rotateX,
                rotateY,
                transformPerspective: 1000,
              }}
              onClick={handleMascotClick}
              whileTap={{ scale: 0.96 }}
              className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] cursor-pointer group"
              title="Click mentor for motivation + confetti!"
            >
              {/* Mascot Cutout Image without background */}
              <img
                src="/padhlo-mascot.png"
                alt="PadhloShawtys Mentor"
                className="w-full h-auto drop-shadow-[0_25px_35px_rgba(99,102,241,0.28)] group-hover:drop-shadow-[0_30px_45px_rgba(236,72,153,0.35)] transition-all duration-300 select-none pointer-events-auto"
                draggable={false}
              />

              {/* Floating Badge 1: Streak */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-4 -left-2 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.08)] border border-slate-200 flex items-center gap-2.5 text-xs hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">5-Day Study Streak</span>
                  <span className="text-[10px] text-slate-500">+75 XP per day</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Exam Target */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 -right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.08)] border border-slate-200 flex items-center gap-2.5 text-xs hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Calculus Midterm</span>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold">In 6 Days (Target A)</span>
                </div>
              </motion.div>

              {/* Interactive Click Tip Pill */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] px-3 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                <span>Click mentor for advice ({clickCount > 0 ? `${clickCount}x clicked` : 'tap me!'})</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Feature Bento Grid (Clean White Background Design) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Designfull Academic Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Why PadhloShawtys Hits Different
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Not another boring planner. Built with clean aesthetics, genuine algorithms, and
            gamification that keeps you locked in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform shadow-sm">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Smart Study Scheduler</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent deterministic algorithm distributes your entire exam syllabus and task
              agenda across available days. It inserts rest intervals and avoids lectures or gym
              slots.
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-indigo-600 flex items-center gap-1">
              <span>Urgency + Difficulty + Confidence Formula</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100 group-hover:scale-110 transition-transform shadow-sm">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">“Lock In” Pomodoro Timer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drift-proof circular countdown that never freezes in background tabs. Includes
              synthesized Web Audio chimes, task linking, and post-session reflection modals.
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-pink-600 flex items-center gap-1">
              <span>25m Focus / 5m Chill / Web Audio Synth</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 group-hover:scale-110 transition-transform shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Exam Countdown & Syllabus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time countdown to exam day down to the second. Matrix tracks topics with
              confidence ratings so you never waste hours reviewing chapters you already know.
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-cyan-600 flex items-center gap-1">
              <span>Confidence Matrix & Real-time Tickers</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">The Academic Comeback</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive Recharts charts: daily focus minutes, planned vs. actual execution, and
              subject distribution. Generates genuine insights based on verified study logs.
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-emerald-600 flex items-center gap-1">
              <span>Zero Fake Stats • 100% Real Calculations</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Gamification (Not Cringe)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn XP for studying, level up from Procrastination Rookie to Academic Weapon, finish
              daily quests, unlock badges, and get your Spotify Wrapped-style Sunday recap!
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-amber-600 flex items-center gap-1">
              <span>Levels 1-10 + Weekly Wrapped Recap</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Local Privacy & JSON Backup</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No account required. All data survives refreshes in browser localStorage. Export your
              entire backup as a JSON file or restore it anytime with one click.
            </p>
            <div className="pt-2 text-[11px] font-mono font-semibold text-purple-600 flex items-center gap-1">
              <span>100% Client-Side Privacy Guaranteed</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Section */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            “Kyu nhi hori thi padhai? Ab samajh aaya!”
          </h2>
          <p className="text-xs text-slate-500">Real students on their PadhloShawtys comeback arc</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Bhai sach batau toh pehle pura din nikal jata tha sochte sochte ki start kahan se karu.
              PadhloShawtys ne priority score se sab sort kar diya. GPA 2.4 se seedha 3.8!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                AK
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Aman Kumar</p>
                <p className="text-[10px] text-slate-500">Computer Science Major</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "The Spotify Wrapped weekly recap on Sunday night is literally the best motivation.
              Seeing my 22 focus hours mapped across Organic Chem made me actually proud."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                SL
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Sneha Lal</p>
                <p className="text-[10px] text-slate-500">Biochemistry Pre-Med</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Normal productivity tools boring hote hain. PadhloShawtys feels like a game where you
              level up from rookie to weapon. The chimes and streaks are addictive."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                RV
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Rohan Verma</p>
                <p className="text-[10px] text-slate-500">Economics & Finance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">Everything you need to know about PadhloShawtys</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Call To Action Banner with White Card Gradient Border */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center space-y-5 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-200">
            No Excuses • Pure Execution
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Stop Procrastinating. PadhloShawtys pe Lock In Karo!
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto">
            Your exams won't wait. Add your subjects, run the smart scheduler, and start your first
            25-minute focus session right now.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-display font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Launch Command Center ⚡
          </button>
          <button
            onClick={loadDemoMode}
            className="px-6 py-3.5 rounded-2xl bg-indigo-900/40 text-white border border-white/30 font-semibold text-xs hover:bg-indigo-900/60 transition-all"
          >
            Load Demo Data
          </button>
        </div>
      </section>
    </div>
  );
};
