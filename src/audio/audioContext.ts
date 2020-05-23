const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
export const audioContext = new AudioContext();
