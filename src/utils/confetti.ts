import { triggerEmojiBurst } from './emojiPop';

export const triggerConfetti = (mode: 'standard' | 'level_up' | 'streak' = 'standard') => {
  try {
    if (mode === 'level_up') {
      triggerEmojiBurst({ intensity: 'frenzy' });
    } else if (mode === 'streak') {
      triggerEmojiBurst({ intensity: 'streak' });
    } else {
      triggerEmojiBurst({ intensity: 'normal' });
    }
  } catch (err) {
    console.debug('Emoji burst failed silently:', err);
  }
};


