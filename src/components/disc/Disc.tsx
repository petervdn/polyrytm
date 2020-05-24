import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DiscData, DiscSizeData } from '../../data/interfaces';
import { getDiscSizeData } from '../../util/miscUtils';
import { drawDisc } from '../../util/drawUtils';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';

type Props = {
  size: number;
  disc: DiscData;
};

const StyledWrapper = styled.div<{ size: number; rotation?: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  //background-color: antiquewhite;
  // transform: rotate(${(p) => p.rotation}deg);
`;

const DiscView: React.FC<Props> = ({ size, disc }) => {
  const { applicationStore } = store;
  const { timeData } = applicationStore;
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  const discSizeData: DiscSizeData = useMemo(() => getDiscSizeData(size), [size]);

  useEffect(() => {
    if (context) {
      drawDisc(context, disc, discSizeData, timeData.currentRevolutionRadians);

      // context.fillStyle = 'blue';
      // context.fillRect(20, 20, size - 40, size - 40);
    }
  }, [discSizeData, context, disc, size, timeData]);

  return (
    // <StyledWrapper size={size}>
    <canvas
      style={{ transform: `rotate(${timeData.currentRevolutionDegrees}deg)` }}
      width={size}
      height={size}
      ref={(canvas) => {
        canvas && setContext(canvas.getContext('2d')!);
      }}
    />
    // </StyledWrapper>
  );
};

export default observer(DiscView);
