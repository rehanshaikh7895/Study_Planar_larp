import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';
import { triggerEmojiBurst } from '../../utils/emojiPop';
import {
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Flame,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

const SATIRE_QUOTES = [
  "“Syllabus dekhke moot nikal gaya? Delulu is not the solulu shawtys, login karo aur cook karna shuru karo!” 🔥",
  "“Bro is LARPing as an academic weapon while scrolling brainrot reels for 3 hours straight. LOGIN FR FR 💀”",
  "“Tu kal bhi bol raha tha ki subah 5 baje uthke padhunga. Bro you are completely cooked 😭”",
  "“Aura -10,000 for opening Instagram instead of the textbook. Stop the cap! 📉”",
  "“Exam hall me ceiling ginne se accha yahan 25-minute Pomodoro timer laga lo! 🗿”",
  "“Padhlo shawtys warna external examiner ke saamne NPC ban jaoge! 🧠”",
  "“Bro thinks watching a 2x YouTube summary is studying. Stop yapping and solve practice questions fr fr.” 🎯",
  "“Aura +5,000 for finishing a Pomodoro block without touching Instagram. Academic weapon behavior 🗿⚡”",
];

export const LoginView: React.FC = () => {
  const { login, setActiveTab, data } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('Rehan');
  const [email, setEmail] = useState('rehan@shawtys.edu');
  const [password, setPassword] = useState('lockin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSatireIdx, setCurrentSatireIdx] = useState(0);
  const [scoldCount, setScoldCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll-driven scale for comments behind the mascot
  const { scrollY } = useScroll();
  const scrollCommentScale = useTransform(scrollY, [0, 180, 450], [0.95, 1.08, 1.25]);
  const smoothScrollCommentScale = useSpring(scrollCommentScale, { stiffness: 140, damping: 20 });

  // Continuous click scale tracking
  const [clickCombo, setClickCombo] = useState(0);
  const lastClickTimeRef = useRef<number>(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const comboMotion = useMotionValue(1);
  const smoothComboScale = useSpring(comboMotion, { stiffness: 320, damping: 16 });

  // Combined scale for all sarcastic comments behind the person
  const totalCommentScale = useTransform(
    [smoothScrollCommentScale, smoothComboScale],
    ([s, c]) => Number(s || 1) * Number(c || 1)
  );

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, []);

  // 3D Parallax Mouse Tilt for the BIG Mascot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), { stiffness: 200, damping: 20 });

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
    const nextCombo = isRapid ? Math.min(clickCombo + 1, 12) : 1;
    lastClickTimeRef.current = now;
    setClickCombo(nextCombo);

    // Continuous click scale kick: scales comments progressively up with combo
    const targetScale = 1 + nextCombo * 0.055;
    comboMotion.set(targetScale + 0.1);
    setTimeout(() => {
      comboMotion.set(targetScale);
    }, 70);

    // Auto reset combo after 1.4s of inactivity
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setClickCombo(0);
      comboMotion.set(1);
    }, 1400);

    setCurrentSatireIdx((prev) => (prev + 1) % SATIRE_QUOTES.length);
    setScoldCount((c) => c + 1);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    playSound('start', data.settings.soundEnabled);
    triggerEmojiBurst({ intensity: 'frenzy' });

    setTimeout(() => {
      login(name || 'Scholar', email);
    }, 450);
  };

  const handleQuickDemoLogin = () => {
    setIsSubmitting(true);
    playSound('start', data.settings.soundEnabled);
    triggerEmojiBurst({ intensity: 'frenzy' });
    setTimeout(() => {
      login('Rehan Scholar', 'rehan@shawtys.edu');
    }, 350);
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Clean monochrome background dot matrix */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none -z-10" />

      {/* Top Navigation bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between mb-6 px-2">
        <motion.button
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          onClick={() => setActiveTab('landing')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-black border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all font-sans"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Title & Clean High-Contrast Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-6 text-left"
        >
          {/* Main Title matching Home Page */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-[58px] font-sans font-black tracking-tight text-black leading-[1.12]"
            >
              Kyu nhi hori padhai? <br />
              <span className="inline-flex flex-wrap items-baseline gap-2.5 mt-2">
                <span className="text-neutral-900 font-extrabold">kyuki aap</span>
                <span className="inline-flex items-baseline gap-2 px-4 py-1.5 rounded-2xl bg-black text-white shadow-xl -rotate-1 hover:rotate-0 transition-transform">
                  <span className="font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-neutral-300">
                    Padhlo
                  </span>
                  <span className="font-black text-3xl sm:text-5xl lg:text-[56px] tracking-tighter text-white uppercase italic">
                    SHAWTYS
                  </span>
                </span>
                <span className="text-neutral-900 font-extrabold">pe Login nhi karte! 😭🔥</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-neutral-600 max-w-md font-sans leading-relaxed"
            >
              Bhai aesthetic study vlogs ka LARP band karo. Enter your credentials or tap 1-Click Guest to
              sync your timetable, exams, and start leveling up your GPA.
            </motion.p>
          </div>

          {/* Auth Card (Clean, high-contrast, black and white) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6"
          >
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-2xl bg-neutral-100 border border-neutral-300">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  playSound('click', data.settings.soundEnabled);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all font-sans ${
                  mode === 'signin'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  playSound('click', data.settings.soundEnabled);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all font-sans ${
                  mode === 'register'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-700">
                      Scholar Name / Alias
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aryan, Sneha, Topper Chad"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black text-xs font-sans text-black outline-none transition-all"
                        required={mode === 'register'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black text-xs font-sans text-black outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-700">
                    Password
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">Any password works (Demo)</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black text-xs font-sans text-black outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-sans font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Locking You In...</span>
                  </span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In & Lock In' : 'Create Academic Profile'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-neutral-200"></div>
              <span className="absolute bg-white px-3 text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                OR SKIP THE HASSLE
              </span>
            </div>

            {/* Quick 1-Click Guest Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>⚡ 1-Click Instant Guest Sign In</span>
            </motion.button>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>100% Client-Side Privacy • Stored in Browser</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: THE BIG INTERACTIVE PERSON WITH COMMENTS BEHIND HIM */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[540px] lg:min-h-[660px] perspective-[1000px] select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-neutral-900/5 rounded-full blur-3xl -z-10 scale-95" />

          {/* Rapid Click Combo Pill (Floats at z-30 over everything when user clicks continuously) */}
          <AnimatePresence>
            {clickCombo >= 2 && (
              <motion.div
                initial={{ scale: 0, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0, y: -20, opacity: 0 }}
                className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 z-30 bg-black text-white px-4 py-1.5 rounded-full border-2 border-white shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center gap-2 font-mono text-xs font-black tracking-wider whitespace-nowrap pointer-events-none"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin" />
                <span>🔥 {clickCombo}X SCOLD COMBO! INTENSITY {Math.round(100 + clickCombo * 25)}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================== */}
          {/* ALL SARCASTIC COMMENTS LAYERED BEHIND THE PERSON (z-10)       */}
          {/* They scale in when the user scrolls OR clicks continuously!    */}
          {/* ============================================================== */}

          {/* 1. Sarcastic Satire Sticker 1 (Top Left) - BEHIND (z-10) */}
          <motion.div
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: -4, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 0.1, duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            onClick={handleMascotClick}
            className="absolute -top-6 -left-4 sm:-top-2 sm:-left-8 lg:-left-12 z-10 max-w-[210px] sm:max-w-[250px] bg-black text-white p-3.5 sm:p-4 rounded-2xl border-2 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer hover:border-white transition-all group"
            title="Click for insult"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">💀</span>
              <p className="font-sans font-black text-xs sm:text-[13px] leading-tight tracking-tight uppercase text-white">
                BHAI REEL SCROLL KARKE PASS HONE KA PLAN HAI KYA?
              </p>
            </div>
          </motion.div>

          {/* 2. Sarcastic Satire Sticker 2 (Top Right) - BEHIND (z-10) */}
          <motion.div
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, rotate: 8 }}
            animate={{ opacity: 1, rotate: 3, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 0.2, duration: 0.5 },
              y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            onClick={handleMascotClick}
            className="absolute -top-2 -right-2 sm:top-2 sm:-right-8 lg:-right-12 z-10 max-w-[210px] sm:max-w-[250px] bg-white text-black p-3.5 sm:p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-neutral-50 transition-all group"
            title="Click for insult"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">📉</span>
              <p className="font-sans font-black text-xs sm:text-[13px] leading-tight tracking-tight uppercase text-black">
                AURA -10,000 IF YOU CLOSE THIS TAB RIGHT NOW
              </p>
            </div>
          </motion.div>

          {/* 3. Sarcastic Satire Sticker 3 (Middle Left) - BEHIND (z-10) */}
          <motion.div
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 1, rotate: 2, y: [0, 6, 0] }}
            transition={{
              opacity: { delay: 0.25, duration: 0.5 },
              y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            onClick={handleMascotClick}
            className="absolute top-[35%] -left-6 sm:-left-12 lg:-left-16 z-10 max-w-[190px] sm:max-w-[230px] bg-white text-black p-3 sm:p-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-neutral-50 transition-all group"
            title="Click for insult"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">🧠</span>
              <p className="font-sans font-black text-xs sm:text-[12.5px] leading-tight tracking-tight uppercase text-black">
                DELULU IS NOT THE SOLULU SHAWTYS! PADHLO FR!
              </p>
            </div>
          </motion.div>

          {/* 4. Sarcastic Satire Sticker 4 (Middle Right) - BEHIND (z-10) */}
          <motion.div
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 1, rotate: -2, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: 0.3, duration: 0.5 },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            onClick={handleMascotClick}
            className="absolute top-[40%] -right-6 sm:-right-10 lg:-right-14 z-10 max-w-[200px] sm:max-w-[240px] bg-black text-white p-3.5 rounded-2xl border-2 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer hover:border-white transition-all group"
            title="Click for insult"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">🗿</span>
              <p className="font-sans font-black text-xs sm:text-[13px] leading-tight tracking-tight uppercase text-white">
                TU KAL BHI BOL RAHA THA KI AAJ PADHUNGA
              </p>
            </div>
          </motion.div>

          {/* 5. Sarcastic Satire Sticker 5 (Bottom Left) - BEHIND (z-10) */}
          <motion.div
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, rotate: 5 }}
            animate={{ opacity: 1, rotate: 4, y: [0, 6, 0] }}
            transition={{
              opacity: { delay: 0.35, duration: 0.5 },
              y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            onClick={handleMascotClick}
            className="absolute bottom-8 -left-4 sm:bottom-12 sm:-left-8 lg:-left-12 z-10 max-w-[210px] sm:max-w-[240px] bg-black text-white p-3.5 sm:p-4 rounded-2xl border-2 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer hover:border-white transition-all group"
            title="Click for insult"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">🚨</span>
              <p className="font-sans font-black text-xs sm:text-[13px] leading-tight tracking-tight uppercase text-white">
                STOP LARPING AS A TOPPER. LOGIN KAR ABHI!
              </p>
            </div>
          </motion.div>

          {/* 6. Sarcastic Satire Sticker 6 (Bottom Right) - BEHIND (z-10) */}
          <motion.div
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: -3, y: [0, -7, 0] }}
            transition={{
              opacity: { delay: 0.4, duration: 0.5 },
              y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, rotate: 0 }}
            onClick={handleMascotClick}
            className="absolute -bottom-4 right-0 sm:bottom-4 sm:-right-4 lg:-right-8 z-10 max-w-[220px] sm:max-w-[250px] bg-white text-black p-3.5 sm:p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-neutral-50 transition-all group"
            title="Click for insult"
          >
            <div className="flex items-start gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
              <p className="font-sans font-black text-xs sm:text-[13px] leading-tight tracking-tight uppercase text-black">
                EXAM HALL ME CEILING GINNE KA SHOUK HAI?
              </p>
            </div>
          </motion.div>

          {/* Dynamic Center Speech Capsule over his head (BEHIND head at z-10) */}
          <motion.div
            key={currentSatireIdx}
            style={{ scale: totalCommentScale }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleMascotClick}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 mb-2 bg-[#0A0A0A] text-white p-4 rounded-2xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.4)] border border-neutral-700 max-w-sm cursor-pointer hover:border-neutral-400 transition-all group"
            title="Click to cycle scoldings!"
          >
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase font-bold">
                  MENTOR.ROAST // 0{currentSatireIdx + 1}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-[9px] group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors">
                <span>TAP SCOLD</span>
                <RotateCcw className="w-2.5 h-2.5" />
              </div>
            </div>

            <p className="text-white font-sans font-bold text-xs sm:text-[13.5px] leading-snug tracking-tight">
              {SATIRE_QUOTES[currentSatireIdx]}
            </p>

            {/* Speech Pointer Tail pointing down */}
            <div className="absolute -bottom-2 right-20 w-3.5 h-3.5 bg-[#0A0A0A] border-r border-b border-neutral-700 rotate-45 transform"></div>
          </motion.div>

          {/* ============================================================== */}
          {/* THE BIG PERSON IMAGE (Mascot) STANDS IN FRONT AT z-20         */}
          {/* ============================================================== */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.15 }}
            onClick={handleMascotClick}
            whileTap={{ scale: 0.94 }}
            className="relative z-20 w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[530px] cursor-pointer group"
            title="Click big mentor to scold you!"
          >
            {/* The Cutout Person without background - in front of comments */}
            <img
              src="/padhlo-mascot.png"
              alt="PadhloShawtys Mentor"
              className="w-full h-auto drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)] group-hover:drop-shadow-[0_35px_55px_rgba(0,0,0,0.35)] group-hover:scale-[1.02] transition-all duration-300 select-none pointer-events-auto"
              draggable={false}
            />

            {/* Tap indicator pill */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3.5 py-1 rounded-full shadow-lg font-mono border border-neutral-700 whitespace-nowrap flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>TAP MENTOR ({scoldCount > 0 ? `${scoldCount}x roasted` : 'CLICK TO SCOLD'})</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
