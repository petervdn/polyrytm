import * as firebase from 'firebase/app';
import 'firebase/storage';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

export const uploadToStorage = (file: File, path: string, onProgress?: (value: number) => void) =>
  new Promise(resolve => {
    const storage = firebase.storage();

    const folderRef = storage.ref(path);
    const fileRef = folderRef.child(file.name);
    const uploadTask = fileRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: UploadTaskSnapshot) => {
      if (onProgress) {
        onProgress(snapshot.bytesTransferred / snapshot.totalBytes);
      }

      if (snapshot.bytesTransferred === snapshot.totalBytes) {
        resolve();
      }
    });
  });
