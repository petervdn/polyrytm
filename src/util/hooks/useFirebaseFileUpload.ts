import { useFirebaseStorage } from './useFirebase';

export const useFirebaseFileUpload = () => {
  const { storageRef } = useFirebaseStorage();

  const upload = (file: File, path = '') => {
    const fileRef = storageRef.child(`${path}/${file.name}`);
    return fileRef.put(file);
  };

  return { upload };
};
