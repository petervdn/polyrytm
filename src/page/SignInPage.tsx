import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { paths } from '../data/paths';
import { useFirebaseAuth } from '../util/hooks/useFirebase';

const ErrorMessage = styled.p`
  color: darkred;
`;
const SignInPage = () => {
  const history = useHistory();
  const { auth } = useFirebaseAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSigningIn(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push(paths.home);
      })
      .catch((e) => {
        setErrorMessage(e.message);
        setIsSigningIn(false);
      });
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
