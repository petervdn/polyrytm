import React, { useEffect } from 'react';
import styled from 'styled-components';

import { observer } from 'mobx-react';
import { store } from './store/RootStore';
import Header from './components/layout/Header';
import DiscsView from './components/disc/DiscsView';

const MainView = styled.div`
  background-color: lightgray;
  height: 500px;
  display: flex;
`;

const DiscsWrapper = styled.div`
  background-color: olive;
  flex-grow: 1;
`;
const SidePanelWrapper = styled.div`
  background-color: paleturquoise;
  width: 400px;
  flex-grow: 0;
`;

const Wrapper = styled.div`
  //background-color: #282c34;
  //color: white;
`;

const App = () => {
  const { applicationStore, discStore } = store;
  const { timeData, isPlaying, stop, start } = applicationStore;
  const { addDisc } = discStore;

  useEffect(() => {
    addDisc();
  }, [addDisc]);

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
      <MainView>
        <DiscsWrapper>
          <DiscsView />
        </DiscsWrapper>
        <SidePanelWrapper>
          <h3>menu</h3>
        </SidePanelWrapper>
      </MainView>
    </Wrapper>
  );
};

export default observer(App);
