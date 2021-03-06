import React from 'react';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';
import DiscSampleSelect from './DiscSampleSelect';
import styled from 'styled-components';

const StyledContainer = styled.div`
  padding: 10px;
`;

const Inspector = () => {
  const { interactionStore } = store;
  const { selected, hovered } = interactionStore;

  return (
    <StyledContainer>
      <h2>inspector</h2>
      <div>selection: {selected && JSON.stringify(selected)}</div>
      <div>hovered: {hovered && JSON.stringify(hovered)}</div>
      {selected && <DiscSampleSelect discIndex={selected.discIndex} />}
    </StyledContainer>
  );
};

export default observer(Inspector);
