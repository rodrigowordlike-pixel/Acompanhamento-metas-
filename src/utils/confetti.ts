import confetti from 'canvas-confetti';

export function fireSuperPartyConfetti(durationMs: number = 12000) {
  const animationEnd = Date.now() + durationMs;

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / durationMs);

    // Left Cannon
    confetti({
      particleCount,
      startVelocity: 45,
      spread: 90,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#10b981', '#fbbf24', '#34d399', '#f59e0b', '#ffffff'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });

    // Right Cannon
    confetti({
      particleCount,
      startVelocity: 45,
      spread: 90,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#10b981', '#fbbf24', '#34d399', '#f59e0b', '#ffffff'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });

    // Center Burst
    confetti({
      particleCount: 25,
      startVelocity: 35,
      spread: 360,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#10b981', '#fbbf24', '#34d399', '#ffffff'],
    });
  }, 250);

  return () => clearInterval(interval);
}

export function fireGoalConfetti() {
  fireSuperPartyConfetti(12000);
}

export function fireBurstConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#10b981', '#059669', '#34d399', '#fbbf24'],
  });
}
