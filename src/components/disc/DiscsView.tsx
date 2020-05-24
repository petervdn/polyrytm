import React, { useMemo } from 'react';
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
  const { discStore } = store;
  const { discs } = discStore;

  const { ref: wrapperRef, rect: wrapperRect } = useGetClientRect();

  const discSize = useMemo(() => {
    return wrapperRect ? Math.min(wrapperRect.width, wrapperRect.height) : 0;
  }, [wrapperRect]);

  const discPositions = useMemo(() => {
    const totalDiscsWidth = discs.length * discSize;
    const offset = wrapperRect ? -0.5 * (wrapperRect.width - totalDiscsWidth) : 0;
    return discs.map((_, index) => index * discSize - offset);
  }, [discSize, discs]);

  return (
    <Wrapper ref={wrapperRef}>
      {discs.map((disc, index) => (
        <div style={{ position: 'absolute', left: discPositions[index], top: 0 }} key={index}>
          <DiscView size={discSize} disc={disc} />
        </div>
      ))}
    </Wrapper>
  );
};

export default observer(DiscsView);
