import React, { useMemo } from 'react';
import DiscView from './Disc';
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

  const { ref, rect } = useGetClientRect();

  const discSize = useMemo(() => {
    return rect ? Math.min(rect.width, rect.height) : 0;
  }, [rect]);

  const discPositions = useMemo(() => {
    return discs.map((_, index) => index * discSize);
  }, [discSize, discs.length]);

  return (
    <Wrapper ref={ref}>
      {discs.map((disc, index) => (
        <div style={{ position: 'absolute', left: discPositions[index], top: 0 }} key={index}>
          <DiscView size={discSize} disc={disc} />
        </div>
      ))}
    </Wrapper>
  );
};

export default observer(DiscsView);
