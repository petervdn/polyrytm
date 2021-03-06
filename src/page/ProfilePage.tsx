import React from 'react';
import { observer } from 'mobx-react';
import ProfileMenu from '../components/profile/ProfileMenu';
import { Route, Switch } from 'react-router-dom';
import { paths } from '../data/paths';
import UserDetails from '../components/profile/UserDetails';
import { store } from '../store/RootStore';
import ProfileSamples from '../components/profile/samples/ProfileSamples';

const ProfilePage = () => {
  const { userStore } = store;
  const { isAdmin } = userStore;
  return (
    <>
      <h2>Profile {isAdmin ? '(admin)' : ''}</h2>
      <ProfileMenu />
      <Switch>
        <Route path={paths.userDetails}>
          <UserDetails />
        </Route>
        <Route path={paths.samples}>
          <ProfileSamples />
        </Route>
      </Switch>
    </>
  );
};

export default observer(ProfilePage);
