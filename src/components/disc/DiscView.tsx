import React from 'react';
import { DiscData } from '../../data/interfaces';

import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';
import { useDrawDisc } from '../../util/hooks/useDrawDisc';

type Props = {
  size: number;
  disc: DiscData;
  discIndex: number;
};

const DiscView: React.FC<Props> = ({ size, disc, discIndex }) => {
  const { applicationStore, interactionStore } = store;
  const { timeData } = applicationStore;
  const { hovered, setHovered, setHoverAsSelected } = interactionStore;

  const { setContext } = useDrawDisc(disc, size, timeData);

  const onMouseEnter = () => {
    setHovered({ discIndex });
  };

  const onMouseLeave = () => {
    setHovered(undefined);
  };

  const onMouseMove = () => {
    // setHovered({ discIndex });
  };
  const onClick = () => {
    setHoverAsSelected();
  };

  const isHovered = hovered && hovered.discIndex === discIndex;

  // todo: apply size directly on style width/height, use debounced value for width/height attrs (canvas is now fully cleared and flickers when size changes)
  // todo: pixelratio
  return (
    <div style={{ backgroundColor: isHovered ? 'rgba(0,0,0,0.1)' : undefined }}>
      <canvas
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={onClick}
        style={{ transform: `rotate(${timeData.currentRevolutionDegrees}deg)` }}
        width={size}
        height={size}
        ref={(canvas) => {
          canvas && setContext(canvas.getContext('2d'));
        }}
      />
    </div>
  );
};

export default observer(DiscView);
