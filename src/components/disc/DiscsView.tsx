import React, { useEffect, useMemo, useState } from 'react';
import DiscView from './DiscView';
import styled from 'styled-components';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';
import { useGetClientRect } from '../../util/hooks/useGetClientRect';
import { useValueTween } from '../../util/hooks/useValueTween';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const DiscsView = () => {
  const { discStore, interactionStore } = store;
  const { discs } = discStore;
  const { selected } = interactionStore;
  const { ref: wrapperRef, rect: wrapperRect } = useGetClientRect();

  const discSize = useMemo(
    () => (wrapperRect ? Math.min(wrapperRect.width, wrapperRect.height) : 0),
    [wrapperRect],
  );

  const [selectedDiscOffset, setSelectedDiscOffset] = useState(
    (selected ? selected.discIndex : 0) * -discSize,
  );
  const tween = useValueTween((value) => {
    setSelectedDiscOffset(value);
  });

  useEffect(() => {
    tween((selected ? selected.discIndex : 0) * -discSize);
  }, [discSize, selected, tween]);

  // offset needed to center a disc
  const centeredOffset = useMemo(() => {
    if (!wrapperRect) return 0;
    return wrapperRect.width * 0.5 - discSize * 0.5;
  }, [wrapperRect, discSize]);

  // list of x-positions, used to position the discs next to each other
  const discPositions = useMemo(() => {
    return discs.map((_, index) => index * discSize);
  }, [discSize, discs]);

  return (
    <Wrapper ref={wrapperRef}>
      {discs.map((disc, index) => (
        <div
          style={{
            position: 'absolute',
            left: discPositions[index] + selectedDiscOffset + centeredOffset,
            top: 0,
          }}
          key={index}
        >
          <DiscView size={discSize} disc={disc} discIndex={index} />
        </div>
      ))}
    </Wrapper>
  );
};

export default observer(DiscsView);
