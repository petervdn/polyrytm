import React, { useEffect, useMemo, useState } from 'react';
import { DiscData, DiscSizeData } from '../../data/interfaces';
import { getDiscSizeData } from '../../util/miscUtils';
import { drawDisc } from '../../util/drawUtils';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';

type Props = {
  size: number;
  disc: DiscData;
};

const DiscView: React.FC<Props> = ({ size, disc }) => {
  const { applicationStore } = store;
  const { timeData } = applicationStore;
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  const discSizeData: DiscSizeData = useMemo(() => getDiscSizeData(size), [size]);

  useEffect(() => {
    if (context) {
      drawDisc(context, disc, discSizeData, timeData.currentRevolutionRadians);
    }
  }, [discSizeData, context, disc, size, timeData]);

  // todo: apply size directly on style width/height, debounced value for widtth/height attrs
  // todo: pixelratio
  return (
    <canvas
      style={{ transform: `rotate(${timeData.currentRevolutionDegrees}deg)` }}
      width={size}
      height={size}
      ref={(canvas) => {
        canvas && setContext(canvas.getContext('2d')!);
      }}
    />
  );
};

export default observer(DiscView);
