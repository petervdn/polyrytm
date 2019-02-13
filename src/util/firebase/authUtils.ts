import { firebaseInstance, firebasePath } from '../../firebase/firebase';
import { userStore } from '../../store/module/user/user';
import { IStore } from '../../data/interface';

export const initUserLogin = (store: IStore) =>
  new Promise(resolve => {
    // listen to auth state changes. this listener will stay active (so when user logs out later, this is called)
    firebaseInstance.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        firebaseInstance.firestore
          .collection(firebasePath.firestore.collection.ADMINS)
          .doc(authUser.uid)
          .get()
          .then(doc => {
            store.commit(userStore.SET_IS_ADMIN, doc.exists);
            store.commit(userStore.SET_USER_ID, authUser.uid);
            // tslint:disable-next-line
            console.log('initUserLogin done');
            resolve();
          });
      } else {
        // user is not logged in (or logs out)
        store.commit(userStore.SET_USER_ID, null);
        resolve();
      }
    });
  });
