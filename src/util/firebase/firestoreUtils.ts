import { firebaseInstance, firebasePath } from '../../firebase/firebase';
import { sampleStore } from '../../store/module/sample/sample';
import { IStore } from '../../data/interface';

export const getSamples = (store: IStore) => {
  const startTime = Date.now();
  return new Promise(resolve => {
    firebaseInstance.firestore
      .collection(firebasePath.firestore.collection.SAMPLES)
      .get()
      .then(snapshot => {
        const samples = [];
        snapshot.forEach(doc => {
          samples.push(doc.data());
        });
        store.dispatch(sampleStore.SET_SAMPLES, samples);
        // tslint:disable-next-line
        console.log(`Loading samples took ${(Date.now() - startTime) / 1000} seconds`);
        resolve();
      });
  });
};
