import * as firebase from 'firebase/app';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot; // todo fix this imoprt?
import firebaseConfig from './enum/firebaseConfig';
import { ISample } from '../data/interface';
import { firebaseInstance } from './firebase';

// todo rename, this also removes from storage
export const removeSampleFromDatabase = (
  sample: ISample,
  fileRemovedFromStorageCallback: () => void,
) =>
  new Promise((resolve, reject) => {
    const samplesRef = firebaseInstance.firestore.collection(
      firebaseConfig.firestore.collection.SAMPLES,
    );
    const query = samplesRef.where('path', '==', sample.path);
    query.get().then(result => {
      if (result.size === 1) {
        // correct amount found in db. attach listener (so we know when cloud function has removed the db entry)
        const removeListener = query.onSnapshot(querySnapshot => {
          if (querySnapshot.size === 0) {
            // db entry has been removed
            removeListener();
            resolve();
          }
        });

        // remove file from store (will trigger cloud function)
        const storageRef = firebase.storage().ref();
        storageRef
          .child(sample.path)
          .delete()
          .then(() => {
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
    const folderRef = firebaseInstance.storage.ref(path);

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
