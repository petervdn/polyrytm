export type Sample = {
  fullPath: string;
  name: string;
  audioBuffer?: AudioBuffer;
  // loadProgress: number;
};

export interface DiscData {
  rings: RingData[];
  sample?: Sample;
}

export interface RingItemData {
  volume: number;
}
export interface RingData {
  items: RingItemData[];
}

export interface DiscSizeData {
  size: number;
  halfSize: number;
  // rotateOffset: number;
  // outerMargin: number;
  waveformOuterRadius: number;
  waveformInnerRadius: number;
  // ringsOuterMargin: number;
  ringsOuterRadius: number;
  ringSize: number;
}
export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface TimeData {
  playTime: number;
  currentRevolution: number;
  currentRevolutionFactor: number;
  currentRevolutionRadians: number;
  currentRevolutionDegrees: number;
}
