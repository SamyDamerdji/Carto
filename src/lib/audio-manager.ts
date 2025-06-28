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
    this.current = element;
    // The play() method returns a promise, which can be useful.
    return element.play();
  },

  pause() {
    if (this.current) {
      this.current.pause();
    }
  },
};
