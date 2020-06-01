import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';
import { paths } from '../../data/paths';
import { useFirebaseAuth } from '../../util/hooks/useFirebase';

const StyledHeader = styled.div`
  background-color: black;
  display: flex;
  color: white;
  padding: 0 20px;

  a,
  a:visited {
    color: white;
  }
`;

const Logo = styled.h1`
  flex-grow: 1;
`;
const LoginState = styled.div``;

const Header = () => {
  const { userStore } = store;
  const auth = useFirebaseAuth();
  const { user } = userStore;

  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignOutClick = () => {
    setIsSigningOut(true);
    auth.signOut().then(() => {
      setIsSigningOut(false);
    });
  };

  return (
    <StyledHeader>
      <Logo>polyrytm</Logo>
      <LoginState>
        {user && (
          <>
            <p>
              <Link to={paths.profile}>Profile</Link>
            </p>
            <button onClick={onSignOutClick} disabled={isSigningOut}>
              Sign out
            </button>
          </>
        )}
        {!user && <Link to={paths.login}>Sign in</Link>}
      </LoginState>
    </StyledHeader>
  );
};

export default observer(Header);
