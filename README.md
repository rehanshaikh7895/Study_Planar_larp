# ⚡ LockIn — Your Personal Study OS

> **"Lock in. No excuses. Your academic comeback starts right now."**

**LockIn** is a next-generation smart study planner web application engineered to transform studying from a stressful chore into an engaging, gamified flow state. Designed with a sleek, futuristic Gen-Z visual identity (deep midnight charcoal, electric purple, neon lime, cyan, and soft pink accents), LockIn combines deterministic algorithmic scheduling with distraction-free focus tools, syllabus tracking, interactive analytics, and momentum-building gamification.

---

## 🚀 Key Features

### 1. 🎛️ Command Center (Main Dashboard)
- **Contextual Welcome Header**: Time-of-day greeting ("Morning Grind", "Afternoon Flow", "Evening Comeback Arc"), date, editable scholar name, and dynamic motivational quotes.
- **Calculated Live Metrics**: Tasks completed vs. remaining, actual tracked focus minutes vs. planned minutes, daily study target progress bar, and active study streak (`🔥`).
- **Today’s Study Timeline**: Shows ordered study sessions with subject badges, durations, priority score tags, complete toggles, and lock controls.
- **Quick Actions**: Instant access to add tasks, rebalance schedule, start timer, or review weekly progress.

### 2. 🧠 Smart Study Scheduler (Algorithmic Engine)
- **Deterministic Scheduling Logic**: No fake AI guesses. Calculates priority scores using a transparent formula:
  $$\text{Priority Score} = \text{Urgency (Deadline)} + \text{Confidence Deficit } (6 - \text{Confidence}) + \text{Difficulty} + \text{Exam Weight}$$
- **Capacity Validation**: Warns users with specific hour breakdowns if their total exam workload cannot realistically fit within their daily target limits.
- **Manageable Session Chunking**: Automatically breaks multi-hour topics into optimal 30/45/60-minute blocks with short rest breaks between blocks.
- **Conflict Avoidance**: Automatically skips recurring commitments like lectures, gym sessions, or work slots.
- **Interactive Controls**: Move/reschedule sessions, lock sessions so regeneration does not alter them, mark finished, or adjust study constraints on the fly.

### 3. 📝 Tasks & Assignments Agenda
- **Full Assignment Management**: Title, subject, topic, due date & time, estimated duration, priority (urgent, high, medium, low), difficulty (1–5), notes, and completion status.
- **Smart Filtering & Sorting**: Filter by subject, priority, status (Incomplete, Completed, Overdue), and sort by deadline, priority, or duration.
- **Empathetic Overdue Handling**: Highlights overdue items with supportive, non-guilt microcopy to encourage immediate recovery.

### 4. ⏱️ Focus Mode ("Lock In") Pomodoro Timer
- **Drift-Proof Precision**: Uses timestamp delta tracking (`targetEndTime - Date.now()`) to ensure the timer remains 100% accurate even when browser tabs are inactive or minimized.
- **Modes**: Pomodoro Focus (customizable, default 25m), Short Chill (5m), and Deep Recharge (15m after 4 cycles).
- **Smooth SVG Circular Progress**: Glowing neon stroke animation with live percentage countdown.
- **Task & Subject Linkage**: Link the focus block directly to an assignment; upon completion, a reflection dialog prompts you to mark the task completed with bonus XP.
- **Web Audio API Synthesizer**: Zero external MP3/WAV dependencies. Plays pleasant synthesized chimes for clicks, session starts, timer ends, and level-ups.

### 5. 🎓 Exam Countdown & Syllabus Matrix
- **Live Digital Countdowns**: Real-time ticker tracking Days, Hours, Minutes, and Seconds until each exam.
- **Syllabus Confidence Matrix**: Tracks individual topics with difficulty ratings (1–5) and personal confidence levels (1–5: Lost to Mastered).
- **Target Grade & Weighting**: Calculates syllabus completion percentage and highlights low-confidence topics needing immediate attention.

### 6. 📈 "The Academic Comeback" Analytics
- **Interactive Recharts Visualizations**:
  - Daily Study Minutes bar chart with daily target reference line.
  - Planned vs. Actual study time comparison grouped chart.
  - Subject time allocation donut chart.
- **Calculated Insights**: Dynamically generates real insights (e.g. comparison against yesterday, top subject allocation, and peak flow time of day).

### 7. 🏆 Gamification Without The Cringe
- **XP Progression & Levels**: Progress from *Level 1: Procrastination Rookie* to *Level 10: Sigma Valedictorian*.
- **Daily Quests**: Objective challenges that award bonus XP upon completion.
- **Achievement Badges**: Unlockable achievements (e.g. "First Lock-In", "Consistency Merchant", "Academic Weapon", "Dawn Patrol").
- **Weekly Academic Recap**: Spotify Wrapped-style celebratory modal summarizing verified focus hours, top subjects, completed tasks, and streak records.

### 8. ⚙️ Privacy & Data Persistence
- **Client-Side Storage**: All state is stored in versioned `localStorage`.
- **JSON Backup & Restore**: One-click **Export JSON** and **Import JSON** tools.
- **Pre-Loaded Demo Data**: One-click "Load Demo Data" button instantly populates realistic college subjects (Calculus III, Systems Architecture, Organic Chemistry), tasks, exams, streaks, and focus history for instant demonstration.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom neon electric palette, glassmorphism, and dark/light modes
- **Icons**: Lucide React
- **Charts**: Recharts
- **Audio**: Web Audio API (native synthesized frequencies)
- **Effects**: Canvas Confetti

---

## 💻 Running the Application

### 1. Install Dependencies (Already Completed)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
Open your browser at `http://localhost:4173`.
