import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';
import { triggerEmojiBurst } from '../../utils/emojiPop';
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
  LogIn,
  User,
} from 'lucide-react';

const MASCOT_QUOTES = [
  "“Bro is LARPing as a 4.0 GPA student while scrolling brainrot reels for 3 hours straight. LOCK IN FR FR 💀🔥”",
  "“Stop LARPing in the library staring at page 1 for 40 minutes. That's a massive skill issue, hit the timer!” 🚨",
  "“Aura -10,000 for saying 'kal subah 5 baje uthke pura syllabus khatam karunga'. Bro you are cooked, start NOW 📉”",
  "“Tu padh raha hai ya bas aesthetic matcha latte ke saath study vlog ka LARP kar raha hai? 😭💀”",
  "“Syllabus dekhke moot nikal gaya? Delulu is not the solulu shawtys, 45-min sprint lagao aur cook karo!” 🔥",
  "“Bro thinks watching a 2x YouTube summary is studying. Stop yapping and solve practice questions fr fr.” 🧠",
  "“Aura +5,000 for finishing a Pomodoro block without touching Instagram. Academic weapon behavior 🗿⚡”",
  "“Agar aaj bhi padhai nahi ki toh paper ke din topper tujhe mog karega. Padhlo shawtys!” 🏆",
  "“Bro is 4 chapters behind and still acting nonchalant. You are dangerously COOKED, lock in right now!” ⏳",
  "“Academic comeback arc tabhi shuru hoga jab reel scrolling band hogi. No cap, pure execution.” 🎯",
  "“Bro spent 2 hours color-coding a Notion dashboard instead of solving 1 problem. Olympic level LARPing 💀”",
  "“Padhlo shawtys warna viva me external examiner ke saamne NPC ban jaoge fr fr! 😭”",
];

export const LandingView: React.FC = () => {
  const { setActiveTab, loadDemoMode, data } = useApp();
  const user = data.profile;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [clickCombo, setClickCombo] = useState<number>(0);
  const lastClickTimeRef = useRef<number>(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Scroll-driven transforms:
  // As user scrolls, main text fades in smoothly & image fades in and expands scale up to 1.25x
  const imageScrollScale = useTransform(scrollY, [0, 450], [1.0, 1.25]);
  const smoothImageScale = useSpring(imageScrollScale, { stiffness: 120, damping: 20 });
  const imageScrollOpacity = useTransform(scrollY, [0, 100], [0.9, 1.0]);

  // Dynamic scale for badges/comments behind the mascot (combines scroll & rapid clicks)
  const badgeScrollScale = useTransform(scrollY, [0, 450], [0.95, 1.2]);
  const smoothBadgeScrollScale = useSpring(badgeScrollScale, { stiffness: 120, damping: 20 });

  const comboMotion = useMotionValue(1);
  const smoothComboScale = useSpring(comboMotion, { stiffness: 320, damping: 16 });

  const totalBadgeScale = useTransform(
    [smoothBadgeScrollScale, smoothComboScale],
    ([s, c]) => Number(s || 1) * Number(c || 1)
  );

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, []);

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

  const handleMascotClick = (e?: React.MouseEvent) => {
    const now = Date.now();
    const isRapid = now - lastClickTimeRef.current < 1200;
    const nextCombo = isRapid ? Math.min(clickCombo + 1, 10) : 1;
    lastClickTimeRef.current = now;
    setClickCombo(nextCombo);

    const targetScale = 1 + nextCombo * 0.055;
    comboMotion.set(targetScale + 0.09);
    setTimeout(() => {
      comboMotion.set(targetScale);
    }, 60);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setClickCombo(0);
      comboMotion.set(1);
    }, 1400);

    setMascotQuoteIndex((prev) => (prev + 1) % MASCOT_QUOTES.length);
    setClickCount((c) => c + 1);

    // Burst Apple Fire and Meme emojis from the click location!
    const intensity = nextCombo >= 5 ? 'frenzy' : nextCombo >= 3 ? 'streak' : 'normal';
    triggerEmojiBurst(e ? { x: e.clientX, y: e.clientY, intensity } : { intensity });

    if (nextCombo >= 5) {
      playSound('level_up', data.settings.soundEnabled);
    } else if (nextCombo >= 3) {
      playSound('complete', data.settings.soundEnabled);
    } else {
      playSound('badge', data.settings.soundEnabled);
    }
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
        {/* Subtle, clean monochrome dot background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & CTAs with Fade-in and Scroll Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: textScrollOpacity, y: textScrollY }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* The Main Title requested by User: Crisp Black-and-White Streetwear / Editorial typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-[64px] font-sans font-black tracking-tight text-black leading-[1.12]"
            >
              Kyu nhi hori padhai? <br />
              <span className="inline-flex flex-wrap items-baseline gap-2.5 mt-2">
                <span className="text-neutral-900 font-extrabold">kyuki aap</span>
                <span className="inline-flex items-baseline gap-2 px-4 py-1.5 rounded-2xl bg-black text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] -rotate-1 hover:rotate-0 transition-transform">
                  <span className="font-extrabold text-2xl sm:text-3xl lg:text-[40px] tracking-tight text-neutral-300">
                    Padhlo
                  </span>
                  <span className="font-black text-3xl sm:text-5xl lg:text-[62px] tracking-tighter text-white uppercase italic">
                    SHAWTYS
                  </span>
                </span>
                <span className="text-neutral-900 font-extrabold">nhi use karte! 😭🔥</span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed font-sans"
            >
              Exams sir pe hain, syllabus pahad jaisa hai aur bro aesthetic notes ka LARP kar raha hai?{' '}
              Stop the cap and lock in fr fr! <strong className="text-black font-bold">PadhloShawtys</strong>{' '}
              aapka algorithmic study OS hai jo topics ko plan karta hai, drift-proof Pomodoro se focus lock karta hai,
              aur aapko completely cooked se certified academic weapon bana deta hai 🗿🔥
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap items-stretch sm:items-center gap-3 pt-2"
            >
              <button
                onClick={() => setActiveTab('scheduler')}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-sans font-bold text-sm shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Build My Study Plan</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-black border-2 border-black font-sans font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-105 active:scale-95"
              >
                <span>Command Center</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-black text-white font-sans font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95"
              >
                {user?.isLoggedIn ? (
                  <>
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>{user.name.split(' ')[0]}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-white" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <button
                onClick={loadDemoMode}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 font-mono font-semibold text-xs transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Demo</span>
              </button>
            </motion.div>

            {/* Social Trust Metrics */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-neutral-600">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="flex text-black">★★★★★</span>
                <span className="font-bold text-black font-mono">4.9/5</span>
                <span>by 10,000+ Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span className="font-medium text-neutral-800">100% Free & Local Privacy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: INTERACTIVE MASCOT WITH MOUSE TILT & SCROLL SCALE INCREASE */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-5 relative flex flex-col items-center justify-center perspective-[1000px] select-none"
          >
            {/* Subtle monochrome ambient backdrop ring */}
            <div className="absolute inset-0 bg-neutral-900/5 rounded-full blur-3xl -z-10 scale-95" />

            {/* Rapid Click Combo Pill (Floats at z-30 over everything when user clicks continuously) */}
            <AnimatePresence>
              {clickCombo >= 2 && (
                <motion.div
                  initial={{ scale: 0, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0, y: -20, opacity: 0 }}
                  className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-30 bg-black text-white px-4 py-1.5 rounded-full border-2 border-white shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center gap-2 font-mono text-xs font-black tracking-wider whitespace-nowrap pointer-events-none"
                >
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin" />
                  <span>🔥 {clickCombo}X SCOLD COMBO! INTENSITY {Math.round(100 + clickCombo * 25)}%</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sarcastic Satire Sticker (Top Left) - BEHIND (z-10) */}
            <motion.div
              style={{ scale: totalBadgeScale }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              onClick={handleMascotClick}
              className="absolute -top-4 -left-4 sm:top-2 sm:-left-8 z-10 bg-black text-white px-3 py-2 rounded-xl border border-neutral-700 shadow-md flex items-center gap-2 cursor-pointer font-sans font-black text-xs uppercase"
            >
              <span>💀</span>
              <span>BRO IS COOKED FR</span>
            </motion.div>

            {/* Sarcastic Satire Sticker (Top Right) - BEHIND (z-10) */}
            <motion.div
              style={{ scale: totalBadgeScale }}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              onClick={handleMascotClick}
              className="absolute top-2 -right-4 sm:top-4 sm:-right-8 z-10 bg-white text-black px-3 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer font-sans font-black text-xs uppercase"
            >
              <span>⚡</span>
              <span>AURA +5,000</span>
            </motion.div>

            {/* Custom Matte Obsidian Speech Capsule - BEHIND (z-10) */}
            <motion.div
              key={mascotQuoteIndex}
              style={{ scale: totalBadgeScale }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleMascotClick}
              whileTap={{ scale: 0.96 }}
              className="relative z-10 mb-4 bg-[#0A0A0A] text-white p-4 sm:p-4.5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)] border border-neutral-700/80 max-w-sm cursor-pointer hover:border-neutral-500 hover:shadow-[0_24px_48px_-10px_rgba(0,0,0,0.45)] transition-all group"
              title="Click mentor for advice + confetti!"
            >
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase font-bold">
                    MENTOR.DISPATCH // 0{mascotQuoteIndex + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-[9px] group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors font-semibold">
                  <span>TAP TO CYCLE</span>
                  <span className="font-bold">↻</span>
                </div>
              </div>

              {/* Punchy Desi Quote in Authentic SF Pro Display Font */}
              <p className="text-white font-sans font-semibold text-[13px] sm:text-[14px] leading-snug tracking-tight antialiased">
                {MASCOT_QUOTES[mascotQuoteIndex]}
              </p>

              {/* Bottom Subtle Speech Pointer Tail pointing down towards mentor */}
              <div className="absolute -bottom-2 right-16 w-3.5 h-3.5 bg-[#0A0A0A] border-r border-b border-neutral-700/80 rotate-45 transform"></div>
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
              whileTap={{ scale: 0.94 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] cursor-pointer group"
              title="Click mentor for motivation + confetti!"
            >
              {/* ============================================================== */}
              {/* Floating Badges BEHIND the Mascot Cutout (z-10)               */}
              {/* ============================================================== */}

              {/* Floating Badge 1: Stark Black Card - BEHIND (z-10) */}
              <motion.div
                style={{ scale: totalBadgeScale }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-4 -left-4 z-10 bg-black text-white p-3 sm:p-3.5 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.3)] border border-neutral-800 flex items-center gap-3 text-xs hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center font-bold border border-neutral-800">
                  <Flame className="w-4.5 h-4.5 fill-amber-400" />
                </div>
                <div>
                  <span className="font-bold text-white block font-sans tracking-tight">5-Day Study Streak</span>
                  <span className="text-[10px] text-neutral-400 font-mono">+75 XP TODAY</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Crisp White Card with 2px Black Border - BEHIND (z-10) */}
              <motion.div
                style={{ scale: totalBadgeScale }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 -right-4 z-10 bg-white text-black p-3 sm:p-3.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center gap-3 text-xs hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold font-mono">
                  ⚡
                </div>
                <div>
                  <span className="font-bold text-black block font-sans tracking-tight">Calculus Midterm</span>
                  <span className="text-[10px] text-neutral-600 font-mono font-semibold">In 6 Days • Target A</span>
                </div>
              </motion.div>

              {/* ============================================================== */}
              {/* Mascot Cutout Image without background - IN FRONT AT z-20     */}
              {/* ============================================================== */}
              <img
                src="/padhlo-mascot.png"
                alt="PadhloShawtys Mentor"
                className="relative z-20 w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] group-hover:drop-shadow-[0_30px_45px_rgba(0,0,0,0.28)] transition-all duration-300 select-none pointer-events-auto"
                draggable={false}
              />

              {/* Interactive Click Tip Pill - IN FRONT AT z-25 */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-25 bg-white text-black border-2 border-black text-[10px] px-3.5 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono whitespace-nowrap flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-black animate-spin" />
                <span>TAP MENTOR ({clickCount > 0 ? `${clickCount}x clicked` : 'ADVICE & CONFETTI'})</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Feature Bento Grid (Sleek Monochrome Luxury Architecture) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-black bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-300">
            Designfull Academic Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-black">
            Why PadhloShawtys Hits Different
          </h2>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto font-sans">
            Not another boring planner. Built with monochrome aesthetic precision, genuine algorithms, and
            gamification that keeps you locked in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group hover:border-black transition-all">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-2 transition-transform">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-sans font-extrabold text-black tracking-tight">Smart Study Scheduler</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Transparent deterministic algorithm distributes your entire exam syllabus and task
              agenda across available days. It inserts rest intervals and avoids lectures or gym
              slots.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Urgency + Difficulty + Confidence Formula</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group hover:border-black transition-all">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-rotate-2 transition-transform">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-sans font-extrabold text-black tracking-tight">“Lock In” Pomodoro Timer</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Drift-proof circular countdown that never freezes in background tabs. Includes
              synthesized Web Audio chimes, task linking, and post-session reflection modals.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>25m Focus / 5m Chill / Audio Synth</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group hover:border-black transition-all">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-2 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-sans font-extrabold text-black tracking-tight">Exam Countdown & Syllabus</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Real-time countdown to exam day down to the second. Matrix tracks topics with
              confidence ratings so you never waste hours reviewing chapters you already know.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Confidence Matrix & Real-time Tickers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group hover:border-black transition-all">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-rotate-2 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-sans font-extrabold text-black tracking-tight">The Academic Comeback</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Interactive Recharts charts: daily focus minutes, planned vs. actual execution, and
              subject distribution. Generates genuine insights based on verified study logs.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Zero Fake Stats • 100% Real Calculations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group hover:border-black transition-all">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-2 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-sans font-extrabold text-black tracking-tight">Gamification (Not Cringe)</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Earn XP for studying, level up from Procrastination Rookie to Academic Weapon, finish
              daily quests, unlock badges, and get your Spotify Wrapped-style Sunday recap!
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Levels 1-10 + Weekly Wrapped Recap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6 */}
          <div className="design-card p-7 rounded-3xl space-y-4 group hover:border-black transition-all">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-rotate-2 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-sans font-extrabold text-black tracking-tight">Local Privacy & JSON Backup</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              No account required. All data survives refreshes in browser localStorage. Export your
              entire backup as a JSON file or restore it anytime with one click.
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>100% Client-Side Privacy Guaranteed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Section (Editorial Black & White Cards) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-8 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-black">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-black text-black" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-black">
            “Kyu nhi hori thi padhai? Ab samajh aaya!”
          </h2>
          <p className="text-xs text-neutral-500 font-sans">Real students on their PadhloShawtys comeback arc</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 hover:border-black transition-colors">
            <p className="text-xs text-neutral-700 italic leading-relaxed font-sans">
              "Bhai sach batau toh pehle pura din nikal jata tha sochte sochte ki start kahan se karu.
              PadhloShawtys ne priority score se sab sort kar diya. GPA 2.4 se seedha 3.8!"
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold font-mono text-xs">
                AK
              </div>
              <div>
                <p className="text-xs font-bold text-black font-sans">Aman Kumar</p>
                <p className="text-[10px] text-neutral-500 font-mono">Computer Science Major</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 hover:border-black transition-colors">
            <p className="text-xs text-neutral-700 italic leading-relaxed font-sans">
              "The Spotify Wrapped weekly recap on Sunday night is literally the best motivation.
              Seeing my 22 focus hours mapped across Organic Chem made me actually proud."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold font-mono text-xs border border-neutral-700">
                SL
              </div>
              <div>
                <p className="text-xs font-bold text-black font-sans">Sneha Lal</p>
                <p className="text-[10px] text-neutral-500 font-mono">Biochemistry Pre-Med</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 hover:border-black transition-colors">
            <p className="text-xs text-neutral-700 italic leading-relaxed font-sans">
              "Normal productivity tools boring hote hain. PadhloShawtys feels like a game where you
              level up from rookie to weapon. The chimes and streaks are addictive."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold font-mono text-xs border border-neutral-600">
                RV
              </div>
              <div>
                <p className="text-xs font-bold text-black font-sans">Rohan Verma</p>
                <p className="text-[10px] text-neutral-500 font-mono">Economics & Finance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion (Clean High-Contrast Cards) */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-500 font-sans">Everything you need to know about PadhloShawtys</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl bg-white border transition-all ${
                  isOpen ? 'border-black shadow-md' : 'border-neutral-200/90 shadow-xs'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-black hover:text-neutral-700 transition-colors font-sans"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-black shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Call To Action Banner: Jet Black Obsidian Luxury Banner */}
      <section className="p-8 sm:p-14 rounded-3xl bg-black text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-neutral-800">
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block">
            No Excuses • Pure Execution
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-white leading-tight">
            Stop Procrastinating. PadhloShawtys pe Lock In Karo!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-sans leading-relaxed">
            Your exams won't wait. Add your subjects, run the smart scheduler, and start your first
            25-minute focus session right now.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-3.5 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-neutral-100 font-sans font-bold text-sm shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Launch Command Center</span>
            <Zap className="w-4 h-4 text-black fill-black" />
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className="px-6 py-4 rounded-2xl bg-neutral-900 text-white border border-neutral-700 font-sans font-bold text-sm hover:bg-neutral-800 transition-all hover:scale-105 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>{user?.isLoggedIn ? 'Manage Account' : 'Sign In / Login'}</span>
          </button>
          <button
            onClick={loadDemoMode}
            className="px-6 py-4 rounded-2xl bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono font-semibold text-xs hover:bg-neutral-800 transition-all hover:scale-105"
          >
            Load Demo Data
          </button>
        </div>
      </section>
    </div>
  );
};

