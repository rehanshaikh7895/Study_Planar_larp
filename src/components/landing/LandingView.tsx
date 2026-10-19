import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';
import { triggerEmojiBurst } from '../../utils/emojiPop';
import {
  Zap,
  Sparkles,
  Timer,
  GraduationCap,
  TrendingUp,
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

  const fadeProgressMotion = useMotionValue(0);
  const smoothFadeProgress = useSpring(fadeProgressMotion, {
    stiffness: 260,
    damping: 28,
    restDelta: 0.001,
  });

  const isUnlockedRef = useRef(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  // 1. Title scroll blur fade-in & scale:
  // Starts with an atmospheric focus blur, smoothly unblurs & scales as user scrolls
  const titleBlur = useTransform(smoothFadeProgress, [0, 0.95], [18, 0]);
  const titleOpacity = useTransform(smoothFadeProgress, [0, 0.85], [0.18, 1]);
  const titleScale = useTransform(smoothFadeProgress, [0, 0.95], [0.92, 1]);
  const titleY = useTransform(smoothFadeProgress, [0, 0.95], [20, 0]);
  const titleFilter = useMotionTemplate`blur(${titleBlur}px)`;

  // 2. Subtitle scroll blur fade-in & slide-up
  const subtitleBlur = useTransform(smoothFadeProgress, [0.08, 0.95], [12, 0]);
  const subtitleOpacity = useTransform(smoothFadeProgress, [0.08, 0.85], [0.15, 1]);
  const subtitleY = useTransform(smoothFadeProgress, [0.08, 0.95], [16, 0]);
  const subtitleFilter = useMotionTemplate`blur(${subtitleBlur}px)`;

  // 3. CTA Buttons & Social Proof
  const ctaOpacity = useTransform(smoothFadeProgress, [0.18, 0.9], [0, 1]);
  const ctaY = useTransform(smoothFadeProgress, [0.18, 0.9], [14, 0]);
  const ctaScale = useTransform(smoothFadeProgress, [0.18, 0.9], [0.95, 1]);

  // 4. Mascot scroll unblur & scale
  const mascotBlur = useTransform(smoothFadeProgress, [0, 0.95], [12, 0]);
  const mascotOpacity = useTransform(smoothFadeProgress, [0, 0.85], [0.3, 1]);
  const mascotScrollScale = useTransform(smoothFadeProgress, [0, 1], [0.92, 1.03]);
  const mascotFilter = useMotionTemplate`blur(${mascotBlur}px)`;

  // 5. Scroll Prompt Pill at bottom: visible initially, fades out as user begins scroll
  const scrollPromptOpacity = useTransform(smoothFadeProgress, [0, 0.35], [1, 0]);
  const scrollPromptY = useTransform(smoothFadeProgress, [0, 0.35], [0, 10]);

  // Dynamic scale for badges/comments behind the mascot (combines scroll & rapid clicks)
  const badgeScrollScale = useTransform(smoothFadeProgress, [0, 1], [0.95, 1.05]);
  const smoothBadgeScrollScale = useSpring(badgeScrollScale, { stiffness: 160, damping: 20 });

  // Scroll lock effect:
  // Prevents overall website from scrolling forward until the whole title is completely faded in!
  useEffect(() => {
    // If user is already scrolled down on initial mount (e.g. reload or back button), unlock immediately
    if (window.scrollY > 20) {
      fadeProgressMotion.set(1);
      isUnlockedRef.current = true;
      setIsFullyRevealed(true);
      return;
    }

    let touchStartY = 0;
    const SCROLL_THRESHOLD = 200; // Scroll distance needed to complete the fade in

    const handleWheel = (e: WheelEvent) => {
      // If already unlocked, allow normal window scrolling
      if (isUnlockedRef.current) return;

      // Only lock if we are at the top of the homepage
      if (window.scrollY <= 5) {
        if (e.deltaY > 0) {
          // User scrolling down: advance title fade in
          const current = fadeProgressMotion.get();
          if (current < 1) {
            e.preventDefault();
            const next = Math.min(1, current + e.deltaY / SCROLL_THRESHOLD);
            fadeProgressMotion.set(next);
            if (next >= 1) {
              isUnlockedRef.current = true;
              setIsFullyRevealed(true);
            }
          }
        } else if (e.deltaY < 0) {
          // User scrolling up while at top
          const current = fadeProgressMotion.get();
          if (current > 0 && current < 1) {
            e.preventDefault();
            const next = Math.max(0, current + e.deltaY / SCROLL_THRESHOLD);
            fadeProgressMotion.set(next);
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isUnlockedRef.current) return;

      if (window.scrollY <= 5) {
        const deltaY = touchStartY - e.touches[0].clientY;
        const current = fadeProgressMotion.get();
        if (deltaY > 0 && current < 1) {
          // Swiping up to scroll down: advance title fade in
          e.preventDefault();
          const next = Math.min(1, current + deltaY / 160);
          fadeProgressMotion.set(next);
          touchStartY = e.touches[0].clientY;
          if (next >= 1) {
            isUnlockedRef.current = true;
            setIsFullyRevealed(true);
          }
        } else if (deltaY < 0 && current > 0 && current < 1) {
          e.preventDefault();
          const next = Math.max(0, current + deltaY / 160);
          fadeProgressMotion.set(next);
          touchStartY = e.touches[0].clientY;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlockedRef.current) return;
      if (window.scrollY <= 5) {
        if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
          const current = fadeProgressMotion.get();
          if (current < 1) {
            e.preventDefault();
            const next = Math.min(1, current + 0.35);
            fadeProgressMotion.set(next);
            if (next >= 1) {
              isUnlockedRef.current = true;
              setIsFullyRevealed(true);
            }
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fadeProgressMotion]);

  const handleScrollPromptClick = () => {
    fadeProgressMotion.set(1);
    isUnlockedRef.current = true;
    setIsFullyRevealed(true);
    setTimeout(() => {
      const target = document.getElementById('focus-areas-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: 400, behavior: 'smooth' });
      }
    }, 200);
  };

  const comboMotion = useMotionValue(1);
  const smoothComboScale = useSpring(comboMotion, { stiffness: 320, damping: 16 });

  const totalBadgeScale = useTransform(
    [smoothBadgeScrollScale, smoothComboScale],
    ([s, c]) => Number(s || 1) * Number(c || 1)
  );

  const combinedMascotScale = useTransform(
    [mascotScrollScale, smoothComboScale],
    ([m, c]) => Number(m || 1) * Number(c || 1)
  );

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, []);

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
    // If title is not yet fully revealed, clicking mentor unlocks and reveals immediately!
    if (!isUnlockedRef.current) {
      fadeProgressMotion.set(1);
      isUnlockedRef.current = true;
      setIsFullyRevealed(true);
    }

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
    <div className="space-y-16 sm:space-y-20 pb-16 animate-in fade-in duration-300 overflow-x-clip">
      {/* 1. Hero Section with Scroll-Driven Blur Fade-In (ZERO BLANK SPACE) */}
      <div className="relative min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-center py-6 sm:py-10">
        {/* Subtle, clean monochrome dot background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center px-2 sm:px-4">
            {/* Left Column: Headlines & CTAs with Scroll-Driven Blur Fade-In */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-6 text-left">
              {/* The Main Title requested by User: Crisp Black-and-White Streetwear / Editorial typography with Scroll Blur Fade-In */}
              <motion.h1
                style={{
                  filter: titleFilter,
                  opacity: titleOpacity,
                  scale: titleScale,
                  y: titleY,
                }}
                className="text-2xl sm:text-4xl lg:text-[62px] font-sans font-black tracking-tight text-black leading-[1.12]"
              >
                Kyu nhi hori padhai? <br />
                <span className="inline-flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-2">
                  <span className="text-neutral-900 font-extrabold text-xl sm:text-3xl lg:text-[48px]">kyuki aap</span>
                  <span className="inline-flex items-baseline gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-0.5 sm:py-1.5 rounded-2xl bg-black text-white shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] -rotate-1 hover:rotate-0 transition-transform">
                    <span className="font-extrabold text-lg sm:text-3xl lg:text-[38px] tracking-tight text-neutral-300">
                      Padhlo
                    </span>
                    <span className="font-black text-xl sm:text-4xl lg:text-[58px] tracking-tighter text-white uppercase italic">
                      SHAWTYS
                    </span>
                  </span>
                  <span className="text-neutral-900 font-extrabold text-xl sm:text-3xl lg:text-[48px]">nhi use karte! 😭🔥</span>
                </span>
              </motion.h1>

              {/* Subtitle with Blur Fade-In */}
              <motion.p
                style={{
                  filter: subtitleFilter,
                  opacity: subtitleOpacity,
                  y: subtitleY,
                }}
                className="text-xs sm:text-base lg:text-lg text-neutral-600 max-w-xl leading-relaxed font-sans line-clamp-3 sm:line-clamp-none"
              >
                Exams sir pe hain, syllabus pahad jaisa hai aur bro aesthetic notes ka LARP kar raha hai?{' '}
                Stop the cap and lock in fr fr! <strong className="text-black font-bold">PadhloShawtys</strong>{' '}
                aapka algorithmic study OS hai jo topics ko plan karta hai, drift-proof Pomodoro se focus lock karta hai,
                aur aapko completely cooked se certified academic weapon bana deta hai 🗿🔥
              </motion.p>

              {/* CTAs with Fade-In */}
              <motion.div
                style={{
                  opacity: ctaOpacity,
                  y: ctaY,
                  scale: ctaScale,
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 pt-1">
                  <button
                    onClick={() => setActiveTab('exams')}
                    className="col-span-2 sm:col-auto flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-sans font-bold text-xs sm:text-sm shadow-[0_12px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 group"
                  >
                    <GraduationCap className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                    <span>1. Enter Subjects & Exams</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('scheduler')}
                    className="col-span-2 sm:col-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-black border-2 border-black font-sans font-bold text-xs sm:text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>2. Auto-Create Schedule</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('login')}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl bg-neutral-900 hover:bg-black text-white font-sans font-bold text-xs sm:text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95"
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
                    className="flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 font-mono font-semibold text-xs transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Demo</span>
                  </button>
                </div>

                {/* Social Trust Metrics */}
                <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-600">
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
            </div>

            {/* Right Column: INTERACTIVE MASCOT WITH MOUSE TILT & SCROLL SCALE INCREASE */}
            <motion.div
              style={{
                filter: mascotFilter,
                opacity: mascotOpacity,
              }}
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
                className="hidden sm:flex absolute -top-3 -left-2 sm:top-2 sm:-left-8 z-10 bg-black text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-neutral-700 shadow-md items-center gap-1.5 sm:gap-2 cursor-pointer font-sans font-black text-[10px] sm:text-xs uppercase"
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
                className="hidden sm:flex absolute top-1 -right-2 sm:top-4 sm:-right-8 z-10 bg-white text-black px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] items-center gap-1.5 sm:gap-2 cursor-pointer font-sans font-black text-[10px] sm:text-xs uppercase"
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
                className="relative z-10 mb-2 sm:mb-4 bg-[#0A0A0A] text-white p-2.5 sm:p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)] border border-neutral-700/80 max-w-[270px] sm:max-w-sm cursor-pointer hover:border-neutral-500 hover:shadow-[0_24px_48px_-10px_rgba(0,0,0,0.45)] transition-all group"
                title="Click mentor for advice + confetti!"
              >
                {/* Top Meta Bar */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase font-bold">
                      MENTOR.DISPATCH // 0{mascotQuoteIndex + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-[9px] group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors font-semibold">
                    <span>TAP TO CYCLE</span>
                    <span className="font-bold">↻</span>
                  </div>
                </div>

                {/* Punchy Desi Quote in Authentic SF Pro Display Font */}
                <p className="text-white font-sans font-semibold text-[11px] sm:text-[13.5px] leading-snug tracking-tight antialiased">
                  {MASCOT_QUOTES[mascotQuoteIndex]}
                </p>

                {/* Bottom Subtle Speech Pointer Tail pointing down towards mentor */}
                <div className="absolute -bottom-2 right-16 w-3.5 h-3.5 bg-[#0A0A0A] border-r border-b border-neutral-700/80 rotate-45 transform"></div>
              </motion.div>

              {/* Mascot Image Container with Scroll Scale & 3D Interactive Tilt */}
              <motion.div
                style={{
                  scale: combinedMascotScale,
                  rotateX,
                  rotateY,
                  transformPerspective: 1000,
                }}
                onClick={handleMascotClick}
                whileTap={{ scale: 0.94 }}
                className="relative w-full max-w-[130px] sm:max-w-[240px] lg:max-w-[360px] cursor-pointer group"
                title="Click mentor for motivation + confetti!"
              >
                {/* Floating Badge 1: Stark Black Card - BEHIND (z-10) */}
                <motion.div
                  style={{ scale: totalBadgeScale }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute bottom-3 -left-2 sm:bottom-4 sm:-left-4 z-10 bg-black text-white p-2 sm:p-3 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.3)] border border-neutral-800 items-center gap-2 sm:gap-2.5 text-xs hover:scale-105 transition-transform scale-90 sm:scale-100 origin-bottom-left"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center font-bold border border-neutral-800 shrink-0">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block font-sans tracking-tight text-[10px] sm:text-[11px] whitespace-nowrap">5-Day Study Streak</span>
                    <span className="text-[8px] sm:text-[9px] text-neutral-400 font-mono">+75 XP TODAY</span>
                  </div>
                </motion.div>

                {/* Floating Badge 2: Crisp White Card with 2px Black Border - BEHIND (z-10) */}
                <motion.div
                  style={{ scale: totalBadgeScale }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex absolute top-10 -right-2 sm:top-16 sm:-right-4 z-10 bg-white text-black p-2 sm:p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black items-center gap-2 sm:gap-2.5 text-xs hover:scale-105 transition-transform scale-90 sm:scale-100 origin-top-right"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-black text-white flex items-center justify-center font-bold font-mono text-[10px] sm:text-xs shrink-0">
                    ⚡
                  </div>
                  <div>
                    <span className="font-bold text-black block font-sans tracking-tight text-[10px] sm:text-[11px] whitespace-nowrap">Calculus Midterm</span>
                    <span className="text-[8px] sm:text-[9px] text-neutral-600 font-mono font-semibold whitespace-nowrap">In 6 Days • Target A</span>
                  </div>
                </motion.div>

                {/* Mascot Cutout Image without background - IN FRONT AT z-20 */}
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
            </motion.div>
          </div>

        {/* Scroll Indicator Prompt */}
        <motion.div
          style={{
            opacity: scrollPromptOpacity,
            y: scrollPromptY,
          }}
          onClick={handleScrollPromptClick}
          className={`absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-30 select-none group ${
            isFullyRevealed ? 'pointer-events-none opacity-0' : 'pointer-events-auto cursor-pointer'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-[0_8px_20px_rgba(0,0,0,0.3)] border border-neutral-700 group-hover:scale-105 transition-transform">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Scroll to Reveal Title ↓</span>
          </div>
          <div className="w-4 h-7 rounded-full border-2 border-neutral-400 flex items-start justify-center p-0.5 opacity-70">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-black"
            />
          </div>
        </motion.div>
      </div>

      {/* 2. The 4 Main Focus Areas (Clean, Simple, 0 Clutter - ZERO BLANK SPACE) */}
      <section id="focus-areas-section" className="space-y-8 pt-2">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-black">
            Only 4 Steps. Zero Fluff.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-sans">
            PadhloShawtys strips away the productivity BS. Just enter your subjects, generate your plan,
            lock in on topics, and watch your comeback arc unfold.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Focus 1: Subjects & Exam Dates */}
          <div
            onClick={() => setActiveTab('exams')}
            className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black tracking-widest text-neutral-400 uppercase">
                  STEP 01
                </span>
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-sans font-black text-black tracking-tight">
                  1. Enter Subjects & Exams
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Add your courses, syllabus chapters, and upcoming exam dates with real-time countdown tickers.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-black font-sans group-hover:translate-x-1 transition-transform">
              <span>Add Exam Dates</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Focus 2: Smart Schedule */}
          <div
            onClick={() => setActiveTab('scheduler')}
            className="p-6 rounded-3xl bg-black text-white border-2 border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black tracking-widest text-neutral-400 uppercase">
                  STEP 02
                </span>
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-amber-400 flex items-center justify-center border border-neutral-700 group-hover:rotate-6 transition-transform">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-sans font-black text-white tracking-tight">
                  2. Auto-Create Schedule
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  One tap generates a balanced revision timetable distributed across your available days leading to the exam.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-white font-sans group-hover:translate-x-1 transition-transform">
              <span>Generate Timetable</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* Focus 3: Track Topics & Lock In Timer */}
          <div
            onClick={() => setActiveTab('focus')}
            className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black tracking-widest text-neutral-400 uppercase">
                  STEP 03
                </span>
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Timer className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-sans font-black text-black tracking-tight">
                  3. Track & Focus Sprint
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Check off completed topics on your syllabus matrix and lock in with the drift-proof 25-minute Pomodoro timer.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-black font-sans group-hover:translate-x-1 transition-transform">
              <span>Start Focus Sprint</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Focus 4: Progress & Streak */}
          <div
            onClick={() => setActiveTab('analytics')}
            className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black tracking-widest text-neutral-400 uppercase">
                  STEP 04
                </span>
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-sans font-black text-black tracking-tight">
                  4. Track Real Progress
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Real syllabus progress percentages per subject, study streak counter, and verified comeback metrics.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-black font-sans group-hover:translate-x-1 transition-transform">
              <span>View Progress</span>
              <ArrowRight className="w-4 h-4" />
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

