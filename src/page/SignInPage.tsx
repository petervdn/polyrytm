import React, { useState } from 'react';

import { store } from '../store/RootStore';
import styled from 'styled-components';

const ErrorMessage = styled.p`
  color: darkred;
`;
const SignInPage = () => {
  const { userStore } = store;
  const { signIn } = userStore;
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSigningIn(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setErrorMessage(e.message);
    }
    setIsSigningIn(false);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          disabled={isSigningIn}
          value={email}
          name='email'
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          type='text'
        />
        <input
          value={password}
          disabled={isSigningIn}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          name='password'
          type='password'
        />
        <button type={'submit'}>Sign in</button>
      </form>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </>
  );
};

export default SignInPage;
