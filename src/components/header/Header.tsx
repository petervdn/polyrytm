import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';

const StyledHeader = styled.div`
  background-color: black;
  display: flex;
  color: white;
  padding: 0 20px;
`;

const Logo = styled.h1`
  flex-grow: 1;
`;
const LoginState = styled.div``;

const Header = () => {
  const { userStore } = store;
  const { user, signOut } = userStore;

  const [signingOut, setSigningOut] = useState(false);

  const onSignOutClick = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  return (
    <StyledHeader>
      <Logo>polyrytm</Logo>
      <LoginState>
        {user && (
          <>
            <p>Logged in as {user.displayName}</p>
            <button onClick={onSignOutClick} disabled={signingOut}>
              Sign out
            </button>
          </>
        )}
        {!user && <Link to={'/login'}>Sign in</Link>}
      </LoginState>
    </StyledHeader>
  );
};

export default observer(Header);
