import { useFirebaseStorage } from './useFirebase';
import * as firebase from 'firebase/app';

export type Upload = {
  file: File;
  task: firebase.storage.UploadTask;
};

export const useFirebaseFileUpload = () => {
  const { storageRef } = useFirebaseStorage();

  const upload = (file: File, path: string) => {
    const fileRef = storageRef.child(`${path}/${file.name}`);
    return fileRef.put(file);
  };

  return { upload };
};
