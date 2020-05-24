import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { DiscData, DiscSizeData } from '../../data/interfaces';
import { getDiscSizeData } from '../../util/miscUtils';
import { drawDisc } from '../../util/drawUtils';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';

type Props = {
  size: number;
  disc: DiscData;
  discIndex: number;
};

const DiscView: React.FC<Props> = ({ size, disc, discIndex }) => {
  const { applicationStore, interactionStore } = store;
  const { timeData } = applicationStore;
  const { setHovered, setSelected } = interactionStore;
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  const discSizeData: DiscSizeData = useMemo(() => getDiscSizeData(size), [size]);

  useEffect(() => {
    if (context) {
      drawDisc(context, disc, discSizeData, timeData.currentRevolutionRadians);
    }
  }, [discSizeData, context, disc, size, timeData]);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    setHovered({ discIndex });
  };
  const onClick = (event: MouseEvent<HTMLElement>) => {
    setSelected({ discIndex });
  };

  // todo: apply size directly on style width/height, use debounced value for width/height attrs (canvas is now fully cleared and flickers when size changes)
  // todo: pixelratio
  return (
    <canvas
      onMouseMove={onMouseMove}
      onClick={onClick}
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
