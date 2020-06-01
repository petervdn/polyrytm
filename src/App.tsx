import React, { useEffect } from 'react';
import styled from 'styled-components';

import { observer } from 'mobx-react';
import { store } from './store/RootStore';
import Header from './components/header/Header';
import DiscsView from './components/disc/DiscsView';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SignInPage from './page/SignInPage';
import { paths } from './data/paths';
import ProfilePage from './page/ProfilePage';

const MainView = styled.div`
  background-color: lightgray;
  height: 500px;
  display: flex;
`;

const DiscsContainer = styled.div`
  background-color: cadetblue;
  flex-grow: 1;
`;
const SidePanelContainer = styled.div`
  background-color: paleturquoise;
  width: 400px;
  flex-grow: 0;
`;
const RouteContainer = styled.div`
  background-color: lightgrey;
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const App = () => {
  const { applicationStore, discStore } = store;
  const { timeData, isPlaying, stop, start } = applicationStore;
  const { addDisc } = discStore;

  useEffect(() => {
    addDisc();
  }, [addDisc]);

  return (
    <BrowserRouter>
      <Header />

      <MainView>
        <DiscsContainer>
          <DiscsView />
        </DiscsContainer>
        <SidePanelContainer>
          <h3>menu</h3>
        </SidePanelContainer>
      </MainView>
      <RouteContainer>
        <Switch>
          <Route path={paths.login}>
            <SignInPage />
          </Route>
          <Route path={paths.profile}>
            <ProfilePage />
          </Route>
          <Route>
            <h2>{timeData.playTime.toFixed(2)}</h2>
            <h2>{timeData.currentRevolution}</h2>
            <h2>{timeData.currentRevolutionFactor.toFixed(2)}</h2>
            {isPlaying ? (
              <button onClick={stop}>stop</button>
            ) : (
              <button onClick={start}>start</button>
            )}
            <div>
              <button onClick={addDisc}>Add disc</button>
            </div>
          </Route>
        </Switch>
      </RouteContainer>
    </BrowserRouter>
  );
};

export default observer(App);
