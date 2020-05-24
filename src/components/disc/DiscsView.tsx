import React, { useMemo, useState, useEffect } from 'react';
import DiscView from './DiscView';
import styled from 'styled-components';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';
import { useGetClientRect } from '../../util/hooks/useGetClientRect';

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

  const [xOffset, setXOffset] = useState(0);

  useEffect(() => {
    if (!wrapperRect) return;
    const focusedDiscIndex = selected ? selected.discIndex : 0;
    setXOffset(focusedDiscIndex * -discSize + wrapperRect.width * 0.5 - discSize * 0.5);
  }, [selected, wrapperRect]);

  const discSize = useMemo(() => {
    return wrapperRect ? Math.min(wrapperRect.width, wrapperRect.height) : 0;
  }, [wrapperRect]);

  const discPositions = useMemo(() => {
    return discs.map((_, index) => index * discSize);
  }, [discSize, discs, wrapperRect]);

  return (
    <Wrapper ref={wrapperRef}>
      {discs.map((disc, index) => (
        <div
          style={{
            position: 'absolute',
            left: discPositions[index] + xOffset,
            top: 0,
            border: '1px solid red',
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
