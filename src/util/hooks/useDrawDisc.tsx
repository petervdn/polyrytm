import { useEffect, useMemo, useState } from 'react';
import { DiscData, DiscSizeData, TimeData } from '../../data/interfaces';
import { getDiscSizeData } from '../miscUtils';
import { drawDisc } from '../drawUtils';

export const useDrawDisc = (disc: DiscData, size: number, timeData: TimeData) => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const discSizeData: DiscSizeData = useMemo(() => getDiscSizeData(size), [size]);

  useEffect(() => {
    if (context) {
      drawDisc(context, disc, discSizeData, timeData.currentRevolutionRadians);
    }
  }, [discSizeData, context, disc, size, timeData]);

  return { setContext };
};
