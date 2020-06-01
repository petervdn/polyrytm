import * as firebase from 'firebase/app';

export const useFirebaseAuth = () => {
  return firebase.auth();
};
