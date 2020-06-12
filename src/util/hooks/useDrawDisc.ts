import { useEffect, useMemo, useRef, useState } from 'react';
import { DiscData, DiscSizeData, TimeData } from '../../data/interfaces';
import { getDiscSizeData } from '../miscUtils';
import { createCanvas, drawDisc } from '../drawUtils';

export const useDrawDisc = (disc: DiscData, size: number, timeData: TimeData) => {
  const waveformCanvasRef = useRef(createCanvas(size, size));

  const { sample, rings } = disc;

  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const discSizeData: DiscSizeData = useMemo(() => getDiscSizeData(size), [size]);

  const loadProgress = sample?.loadProgress;

  useEffect(() => {
    console.log('sample change', disc.sample?.loadProgress);
  }, [disc.sample]);

  useEffect(() => {
    console.log('load', loadProgress);
  }, [loadProgress]);

  useEffect(() => {
    console.log('rings change');
  }, [rings]);

  useEffect(() => {
    if (context) {
      drawDisc(context, disc, discSizeData, timeData.currentRevolutionRadians);
    }
  }, [discSizeData, context, disc, size, timeData]);

  return { setContext };
};
