import { DiscSizeData } from '../data/interfaces';

export const PI2: number = Math.PI * 2;

export const getDiscSizeData = (size: number): DiscSizeData => {
  const outerMargin = 0;
  const waveformSize = 0.1;
  const ringsOuterMargin = 0.05;
  const ringSize = 0.1;
  const waveformOuterRadius = 1 - outerMargin;
  const waveformInnerRadius = waveformOuterRadius - waveformSize;
  const ringsOuterRadius = waveformInnerRadius - ringsOuterMargin;
  const halfSize = size * 0.5;
  return {
    size,
    halfSize,
    waveformOuterRadius: waveformOuterRadius * halfSize,
    waveformInnerRadius: waveformInnerRadius * halfSize,
    ringsOuterRadius: ringsOuterRadius * halfSize,
    ringSize: ringSize * halfSize,
  };
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
