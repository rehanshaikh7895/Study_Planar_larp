// High-performance, zero-lag Apple Emoji Burst particle engine
// Replaces standard party-popper confetti with authentic Apple Fire & Meme Emojis

const EMOJI_IMAGES = [
  '/emoji-fire.png',         // Primary: Apple 3D Fire 🔥
  '/emoji-fire.png',         // Weighted heavily for fire
  '/emoji-fire.png',
  '/emoji-crying-shush.png', // The custom Apple crying-shush / mewing emoji uploaded by user
  '/emoji-crying.png',       // Apple 3D Crying 😭
  '/emoji-skull.png',        // Apple 3D Skull 💀
];

let particleContainer: HTMLDivElement | null = null;

function getParticleContainer(): HTMLDivElement {
  if (!particleContainer || !document.body.contains(particleContainer)) {
    particleContainer = document.createElement('div');
    particleContainer.id = 'emoji-pop-container';
    particleContainer.style.position = 'fixed';
    particleContainer.style.inset = '0';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '99999';
    particleContainer.style.overflow = 'hidden';
    document.body.appendChild(particleContainer);
  }
  return particleContainer;
}

export interface EmojiBurstOptions {
  x?: number;
  y?: number;
  count?: number;
  intensity?: 'normal' | 'streak' | 'frenzy';
}

/**
 * Triggers an explosive burst of authentic Apple 3D Fire and Meme emojis
 * popping outward from the click coordinate or element center.
 */
export function triggerEmojiBurst(
  eventOrOptions?: React.MouseEvent | MouseEvent | EmojiBurstOptions | number,
  maybeY?: number
) {
  if (typeof window === 'undefined') return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.45;
  let count = 14;
  let intensity: 'normal' | 'streak' | 'frenzy' = 'normal';

  if (typeof eventOrOptions === 'number') {
    x = eventOrOptions;
    if (typeof maybeY === 'number') y = maybeY;
  } else if (eventOrOptions && 'clientX' in eventOrOptions) {
    x = eventOrOptions.clientX;
    y = eventOrOptions.clientY;
  } else if (eventOrOptions && typeof eventOrOptions === 'object') {
    if (typeof eventOrOptions.x === 'number') x = eventOrOptions.x;
    if (typeof eventOrOptions.y === 'number') y = eventOrOptions.y;
    if (typeof eventOrOptions.count === 'number') count = eventOrOptions.count;
    if (eventOrOptions.intensity) intensity = eventOrOptions.intensity;
  }

  if (intensity === 'frenzy') count = 24;
  else if (intensity === 'streak') count = 18;

  const container = getParticleContainer();

  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    const randomSrc = EMOJI_IMAGES[Math.floor(Math.random() * EMOJI_IMAGES.length)];
    img.src = randomSrc;
    img.alt = 'emoji';

    // Randomize particle size (32px to 54px for fire, up to 58px for crying-shush)
    const isShush = randomSrc.includes('shush');
    const baseSize = isShush ? 46 + Math.random() * 16 : 34 + Math.random() * 20;
    const size = Math.round(baseSize * (intensity === 'frenzy' ? 1.15 : 1));

    img.style.position = 'absolute';
    img.style.left = `${x - size / 2}px`;
    img.style.top = `${y - size / 2}px`;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain';
    img.style.pointerEvents = 'none';
    img.style.userSelect = 'none';
    img.style.willChange = 'transform, opacity';
    img.style.filter = 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))';

    // Trajectory calculation (upward cone with wide spread)
    const angle = (Math.PI / 180) * (270 + (Math.random() * 160 - 80)); // 190° to 350°
    const speed = (180 + Math.random() * 320) * (intensity === 'frenzy' ? 1.3 : 1);
    const distanceX = Math.cos(angle) * speed * (0.6 + Math.random() * 0.5);
    const distanceY = Math.sin(angle) * speed * (0.8 + Math.random() * 0.4) - 60; // Upward bias

    const initialRotate = (Math.random() * 40 - 20);
    const finalRotate = initialRotate + (Math.random() * 180 - 90);

    const duration = 850 + Math.random() * 450;

    container.appendChild(img);

    // Native Web Animations API for 60fps/120fps hardware acceleration
    const animation = img.animate(
      [
        {
          transform: `translate(0px, 0px) scale(0.2) rotate(${initialRotate}deg)`,
          opacity: 0,
        },
        {
          transform: `translate(${distanceX * 0.3}px, ${distanceY * 0.3}px) scale(1.3) rotate(${initialRotate + 15}deg)`,
          opacity: 1,
          offset: 0.2,
        },
        {
          transform: `translate(${distanceX * 0.7}px, ${distanceY * 0.75}px) scale(1.05) rotate(${finalRotate * 0.7}deg)`,
          opacity: 0.95,
          offset: 0.6,
        },
        {
          transform: `translate(${distanceX}px, ${distanceY + 30}px) scale(0.85) rotate(${finalRotate}deg)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );

    animation.onfinish = () => {
      img.remove();
    };
  }
}

