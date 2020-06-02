import * as firebase from 'firebase/app';
import { useMemo } from 'react';

export const useFirebaseAuth = () => {
  const auth = useMemo(() => {
    return firebase.auth();
  }, []);

  return { auth };
};

export const useFirebaseStorage = () => {
  const storage = useMemo(() => {
    return firebase.storage();
  }, []);

  const storageRef = useMemo(() => storage.ref(), [storage]);

  return { storage, storageRef };
};
