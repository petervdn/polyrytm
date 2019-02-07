import * as firebase from 'firebase/app';
import 'firebase/storage';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
import { db } from './firebaseUtils';
import firebaseConfig from './enum/firebaseConfig';

interface ISampleInDatabase {
  name: string;
  path: string;
  size: number;
}

interface ISampleProcessData {
  state: string;
  progress?: number; // todo rename uploadProgress?
}

interface ISampleInStore extends ISampleInDatabase {
  processData?: ISampleProcessData;
}

export const removeFileFromStorage = (path: string) => {
  const storageRef = firebase.storage().ref();
  return storageRef.child(path).delete();
};

export const removeSampleFromDatabase = (
  sample: ISampleInStore,
  fileRemovedFromStorageCallback: () => void,
) =>
  new Promise((resolve, reject) => {
    const samplesRef = db.collection(firebaseConfig.firestore.collection.SAMPLES);
    const query = samplesRef.where('path', '==', sample.path);
    query.get().then(result => {
      if (result.size === 1) {
        // there is 1 sample found in db, attach listener (so we know when cloud function has removed the db entry)
        const removeListener = query.onSnapshot(querySnapshot => {
          if (querySnapshot.size === 0) {
            // db entry has been removed
            removeListener();
            resolve();
          }
        });

        // remove file from store (will trigger cloud function)
        removeFileFromStorage(sample.path).then(() => {
          if (fileRemovedFromStorageCallback) {
            fileRemovedFromStorageCallback();
          }
        });
      } else if (result.size === 0) {
        reject(`Cannot find path ${sample.path} in database`);
      } else {
        reject(`Multiple entries (${result.size}) found in database for path ${sample.path}`);
      }
    });
  });

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
