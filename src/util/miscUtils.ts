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

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
