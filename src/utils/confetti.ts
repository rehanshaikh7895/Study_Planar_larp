import confetti from 'canvas-confetti';

export const triggerConfetti = (mode: 'standard' | 'level_up' | 'streak' = 'standard') => {
  try {
    if (mode === 'standard') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#10b981', '#06b6d4', '#ec4899', '#f59e0b'],
        disableForReducedMotion: true,
      });
    } else if (mode === 'level_up') {
      const end = Date.now() + 1500;
      const colors = ['#8b5cf6', '#22c55e', '#06b6d4', '#f43f5e', '#fbbf24'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          disableForReducedMotion: true,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else if (mode === 'streak') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff5722', '#f59e0b', '#fbbf24', '#ff8a65'],
        disableForReducedMotion: true,
      });
    }
  } catch (err) {
    console.debug('Confetti failed silently:', err);
  }
};

