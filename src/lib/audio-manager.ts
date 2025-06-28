'use client';

// This singleton object manages the currently playing audio across all components
// to ensure only one sound plays at a time.
export const audioPlayerManager = {
  current: null as HTMLAudioElement | null,

  play(element: HTMLAudioElement) {
    if (this.current && this.current !== element) {
      // Pause the currently playing audio before starting a new one.
      this.current.pause();
    }
    
    // If we are asked to play the same element and it's already playing, do nothing.
    // This prevents the audio from restarting from the beginning on re-renders.
    if (this.current === element && !element.paused) {
      return Promise.resolve();
    }

    this.current = element;
    // The play() method returns a promise, which should be handled by the caller.
    return element.play();
  },

  pause() {
    if (this.current) {
      this.current.pause();
    }
  },
};
