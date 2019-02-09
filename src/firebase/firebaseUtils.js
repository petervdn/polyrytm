import { userStore } from '../store/module/user/user';
import { sampleStore } from '../store/module/sample/sample';
import { firebaseInstance, firebasePath } from './firebase';

// todo rename to firestore utils? and split up into auth utils?
// todo make TS file
// todo look at what's in storageutils

export const getSamples = store => {
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
        console.log(`Loading samples took ${(Date.now() - startTime) / 1000} seconds`);
        resolve();
      });
  });
};
// todo better name for this method
export const initUserLogin = store =>
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
            resolve();
          });
      } else {
        // user is not logged in (or logs out)
        store.commit(userStore.SET_USER_ID, null);
        resolve();
      }
    });
  });

/**
 * Stores a rytm in the firebase database. Can be connected to a user, or anonymous (user = null),
 * @param rytm
 * @param user
 */
export const storeRytm = () => {}; // todo
// export const storeRytm = (rytm, isPublic, user) =>
// new Promise((resolve, reject) => {
//   const authUser = firebaseInstance.auth.currentUser;
//   if (user && !authUser) {
//     reject(new Error('Logged in but no auth user??'));
//     return;
//   }
//   if (!user && authUser) {
//     reject(new Error('Logged out but there is an auth user??'));
//     return;
//   }
//
//   // const database = firebase.database();
//   // const updates = {};
//
//   const rytmsPath = isPublic
//     ? firebasePath.database.PUBLIC_RYTMS
//     : firebasePath.database.PRIVATE_RYTMS;
//   const rytmsShortPath = isPublic
//     ? firebasePath.database.PUBLIC_RYTMS_SHORT
//     : firebasePath.database.PRIVATE_RYTMS_SHORT;
//   const rytmsRef = database.ref(rytmsPath);
//   const newRytmKey = rytmsRef.push().key;
//
//   // create the atual write parhs
//   const newRytmPath = `${rytmsPath}/${newRytmKey}`;
//   const newRytmShortPath = `${rytmsShortPath}/${newRytmKey}`;
//
//   const shortRytm = { title: rytm.title };
//
//   if (user) {
//     const userData = {
//       id: authUser.uid,
//       name: user.name,
//     };
//     // todo do this short stuff in cloud functions?
//     // add short rytm to user (stringify, so this shortrytm wont have the added user, which is done below)
//     const shortRytmInUserPath = `${firebasePath.database.USERS}/${
//       authUser.uid
//     }/${rytmsShortPath}/${newRytmKey}`;
//     updates[shortRytmInUserPath] = JSON.parse(JSON.stringify(shortRytm));
//
//     // add user to full & short rytm
//     rytm.user = userData;
//     shortRytm.user = userData;
//   }
//
//   updates[newRytmPath] = rytm; // the full rytm
//   updates[newRytmShortPath] = shortRytm;
//
//   // send updates to db
//   database
//     .ref()
//     .update(updates)
//     .then(() => {
//       resolve();
//     })
//     .catch(error => {
//       reject(error);
//     });
// });
//
// export const loadPublicSamples = store =>
//   new Promise(resolve => {
//     getFirebaseValue(firebasePath.database.PUBLIC_SAMPLES).then(samplesObject => {
//       const samples = Object.keys(samplesObject).map(key => ({
//         name: samplesObject[key].name,
//         path: `${samplesObject[key].path}/${samplesObject[key].name}`,
//         // uri: samplesObject[key].link, todo remove link in database and set full path there
//       }));
//
//       store.commit(sampleStore.mutations.setSamples, samples);
//       resolve();
//     });
//   });
