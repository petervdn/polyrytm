import { useFirebaseStorage } from './useFirebase';
import * as firebase from 'firebase';
import { useState } from 'react';

export type Upload = {
  file: File;
  task: firebase.storage.UploadTask;
};

export const useFirebaseFileUpload = () => {
  const { storageRef } = useFirebaseStorage();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<any>(null); // todo type

  const upload = (file: File, path: string) => {
    const fileRef = storageRef.child(`${path}/${file.name}`);
    // return { file, task: fileRef.put(file) };
    return fileRef.put(file);
  };

  return { upload };
};
