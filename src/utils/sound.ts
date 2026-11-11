class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private async ensureCtx() {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume failed', e);
      }
    }

    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public async playNormalBeep() {
    if (!this.enabled) return;
    const ctx = await this.ensureCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Normal beep error', e);
    }
  }

  public playIncrement() {
    this.playNormalBeep();
  }

  // Infoproduto Sales Push Sound ("KA-CHING! 💰")
  public async playInfoprodutoSaleSound() {
    if (!this.enabled) return;
    const ctx = await this.ensureCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Soft Notification Pop
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(800, now);
      popOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.02);

      popGain.gain.setValueAtTime(0.3, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.03);

      // Mechanical "KA-" Latch
      const kaOsc = ctx.createOscillator();
      const kaGain = ctx.createGain();
      kaOsc.type = 'triangle';
      kaOsc.frequency.setValueAtTime(1320, now + 0.02);
      kaOsc.frequency.exponentialRampToValueAtTime(1760, now + 0.06);

      kaGain.gain.setValueAtTime(0.5, now + 0.02);
      kaGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      kaOsc.connect(kaGain);
      kaGain.connect(ctx.destination);
      kaOsc.start(now + 0.02);
      kaOsc.stop(now + 0.07);

      // Sparkling "-CHING! 💰" Bell Ring
      const bellTime = now + 0.05;
      const b1 = ctx.createOscillator();
      const b2 = ctx.createOscillator();
      const b3 = ctx.createOscillator();
      const bGain = ctx.createGain();

      b1.type = 'sine';
      b2.type = 'sine';
      b3.type = 'sine';

      b1.frequency.setValueAtTime(3520.00, bellTime);
      b2.frequency.setValueAtTime(5274.00, bellTime);
      b3.frequency.setValueAtTime(7040.00, bellTime);

      bGain.gain.setValueAtTime(0.7, bellTime);
      bGain.gain.exponentialRampToValueAtTime(0.0001, bellTime + 2.0);

      b1.connect(bGain);
      b2.connect(bGain);
      b3.connect(bGain);
      bGain.connect(ctx.destination);

      b1.start(bellTime);
      b2.start(bellTime);
      b3.start(bellTime);

      b1.stop(bellTime + 2.0);
      b2.stop(bellTime + 2.0);
      b3.stop(bellTime + 2.0);

      // Metallic Coin Drop Cascade
      const coinPitches = [2093, 2793, 3520, 4186];
      coinPitches.forEach((pitch, i) => {
        const cOsc = ctx.createOscillator();
        const cGain = ctx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(pitch, bellTime + 0.08 + i * 0.05);

        cGain.gain.setValueAtTime(0.35, bellTime + 0.08 + i * 0.05);
        cGain.gain.exponentialRampToValueAtTime(0.001, bellTime + 0.08 + i * 0.05 + 0.25);

        cOsc.connect(cGain);
        cGain.connect(ctx.destination);
        cOsc.start(bellTime + 0.08 + i * 0.05);
        cOsc.stop(bellTime + 0.08 + i * 0.05 + 0.25);
      });
    } catch (e) {
      console.warn('Infoproduto sale sound error', e);
    }
  }

  public playFanfare() {
    this.playInfoprodutoSaleSound();
  }

  // Super Party Sound Atmosphere: Crowd Cheer Horns + Multi Cha-Ching + Thrusters
  public async playSuperPartyAtmosphere() {
    if (!this.enabled) return;
    const ctx = await this.ensureCtx();
    if (!ctx) return;

    try {
      // 1. Initial Cha-Ching 💰
      this.playInfoprodutoSaleSound();

      // 2. Party Horns / Triumph Fanfare Chords (C, E, G, C, E harmonics)
      const partyNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      partyNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
      });

      // 3. Rocket Thruster Sound Effect
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 4.0);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 4.5);

      // 4. Repeated Cha-Chings throughout the party!
      setTimeout(() => {
        this.playInfoprodutoSaleSound();
      }, 1500);

      setTimeout(() => {
        this.playInfoprodutoSaleSound();
      }, 3000);
    } catch (e) {
      console.warn('Party sound error', e);
    }
  }

  public playRocketRumble() {
    this.playSuperPartyAtmosphere();
  }
}

export const soundManager = new SoundManager();
