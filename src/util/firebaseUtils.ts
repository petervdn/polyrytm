import * as firebase from 'firebase/app';
import { getUserSamplePath, publicSamplePath } from '../firebase/firebase.config';
import { Await } from './typescript.util';

/**
 * Returns the public samples, and also the user's samples (if a userId is given).
 * @param storageRef
 * @param userId
 */
export const getAvailableSampleFiles = (
  storageRef: firebase.storage.Reference,
  userId: string | undefined,
) => {
  const paths = userId ? [publicSamplePath, getUserSamplePath(userId)] : [publicSamplePath];

  return Promise.all(paths.map((path) => listStorageFilesForPath(storageRef, path))).then(
    (results) => ({
      public: results[0].items,
      user: results[1] ? results[1].items : undefined,
    }),
  );
};

export type AvailableSampleFiles = Await<ReturnType<typeof getAvailableSampleFiles>>;
/**
 * Lists the files for a given path.
 * @param storageRef
 * @param path
 */
export const listStorageFilesForPath = (storageRef: firebase.storage.Reference, path: string) => {
  const listRef = storageRef.child(path);

  return listRef.listAll();
};

export type StoredFile = firebase.storage.Reference;
