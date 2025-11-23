// Create sound effects using Web Audio API

// Type for webkit prefixed AudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const playCorrectSound = () => {
  const AudioContextClass =
    window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  // Create a "duh duh" sound for correct answers - two quick notes
  const createNote = (startTime: number, frequency: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, startTime + 0.12);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.12);
  };

  // First "duh" - lower note
  createNote(audioContext.currentTime, 400);
  // Second "duh" - higher note
  createNote(audioContext.currentTime + 0.15, 600);
};

export const playIncorrectSound = () => {
  const AudioContextClass =
    window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  // Create a light buzzer sound for incorrect answers
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Use a square wave for a buzzer-like sound
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(250, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.25);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.25);
};
