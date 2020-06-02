import React from 'react';
import { observer } from 'mobx-react';
import ProfileMenu from '../components/profile/ProfileMenu';
import { Route, Switch } from 'react-router-dom';
import { paths } from '../data/paths';
import UserDetails from '../components/profile/UserDetails';
import Samples from '../components/profile/Samples';

const ProfilePage = () => {
  return (
    <>
      <h2>Profile</h2>
      <ProfileMenu />
      <Switch>
        <Route path={paths.userDetails}>
          <UserDetails />
        </Route>
        <Route path={paths.samples}>
          <Samples />
        </Route>
      </Switch>
    </>
  );
};

export default observer(ProfilePage);
