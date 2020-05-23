import React from 'react';
import styled from 'styled-components';

import { observer } from 'mobx-react';
import { store } from './store/RootStore';
import Header from './components/layout/Header';
import DiscView from './components/disc/Disc';

const Wrapper = styled.div`
  //background-color: #282c34;
  //color: white;
`;
const DiscsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const App = () => {
  const { applicationStore, discStore } = store;
  const { timeData, isPlaying, stop, start } = applicationStore;
  const { discs, addDisc } = discStore;

  return (
    <Wrapper>
      <Header />
      <h2>{timeData.playTime.toFixed(2)}</h2>
      <h2>{timeData.currentRevolution}</h2>
      <h2>{timeData.currentRevolutionFactor.toFixed(2)}</h2>
      {isPlaying ? <button onClick={stop}>stop</button> : <button onClick={start}>start</button>}
      <div>
        <button onClick={addDisc}>Add disc</button>
      </div>
      <DiscsWrap>
        {discs.map((disc, index) => (
          <DiscView size={500} disc={disc} key={index} />
        ))}
      </DiscsWrap>
    </Wrapper>
  );
};

export default observer(App);
