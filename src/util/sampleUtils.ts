import { ISample } from '../data/interface';

export const getChannelDataToDraw = (audioBuffer: AudioBuffer): Float32Array =>
  audioBuffer.getChannelData(0);

export const getNormalizeFactorForSample = (sample: ISample) => {
  let max = 0;
  const channelData = getChannelDataToDraw(sample.audioBuffer);
  for (let i = 0; i < channelData.length; i += 1) {
    const abs = Math.abs(channelData[i]);
    if (abs > max) max = abs;
  }

  return 1 / max;
};
