import { SoundType } from "./types";

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private volume: number = 0.5;
  private enabled: boolean = true;
  private isInitialized = false;
  private debug = false;

  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await this.preloadSounds();
      this.isInitialized = true;
    } catch (error) {
      if (this.debug) console.warn("Sound initialization failed:", error);
    }
  }

  private async preloadSounds(): Promise<void> {
    const soundPromises = Object.values(SoundType).map(async (soundType) => {
      try {
        const audio = new Audio(`/sounds/${soundType}.mp3`);
        audio.preload = "auto";
        audio.volume = this.volume;

        // Wait for the audio to be ready
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener("canplaythrough", onCanPlay);
            audio.removeEventListener("error", onError);
            resolve();
          };

          const onError = () => {
            audio.removeEventListener("canplaythrough", onCanPlay);
            audio.removeEventListener("error", onError);
            reject(new Error(`Failed to load ${soundType}`));
          };

          audio.addEventListener("canplaythrough", onCanPlay);
          audio.addEventListener("error", onError);

          // Fallback timeout
          setTimeout(() => {
            audio.removeEventListener("canplaythrough", onCanPlay);
            audio.removeEventListener("error", onError);
            resolve(); // Resolve anyway to not block initialization
          }, 2000);
        });

        this.sounds.set(soundType, audio);
      } catch (error) {
        if (this.debug) console.warn(`Failed to preload sound ${soundType}:`, error);
      }
    });

    await Promise.allSettled(soundPromises);
  }

  play(soundType: SoundType): void {
    if (!this.enabled || !this.isInitialized) return;

    const audio = this.sounds.get(soundType);
    if (!audio) {
      if (this.debug) console.warn(`Sound ${soundType} not found`);
      return;
    }

    try {
      // Reset audio to beginning and play
      audio.currentTime = 0;
      audio.volume = this.volume;
      audio.play().catch((error) => {
        if (this.debug) console.warn(`Failed to play sound ${soundType}:`, error);
      });
    } catch (error) {
      if (this.debug) console.warn(`Error playing sound ${soundType}:`, error);
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((audio) => {
      audio.volume = this.volume;
    });
  }

  getVolume(): number {
    return this.volume;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Initialize sound system
soundManager.initialize().catch(() => {
  // Sound system initialization failed
});

if (typeof window !== "undefined") {
  (window as any).soundManager = soundManager;
}

export default soundManager;
