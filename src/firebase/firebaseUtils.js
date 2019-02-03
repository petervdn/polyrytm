import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebasePath from './firebasePath';
import { userStore } from '../store/module/user/user';
import firestore from './enum/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyBWrdFVFh_NQXVQT5PA6y330n82ner3VbI',
  authDomain: 'polyrytm.firebaseapp.com',
  // databaseURL: 'https://polyrytm.firebaseio.com',
  projectId: 'polyrytm',
  // storageBucket: 'polyrytm.appspot.com',
  // messagingSenderId: '137282098627',
});

export const db = firebase.firestore();

// todo better name for this method
export const initUserLogin = store =>
  new Promise(resolve => {
    // listen to auth state changes. this listener will stay active (so when user logs out later, this is called)
    firebase.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        db.collection(firestore.collection.ADMINS)
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
export const storeRytm = (rytm, isPublic, user) =>
  new Promise((resolve, reject) => {
    const authUser = firebase.auth().currentUser;
    if (user && !authUser) {
      reject(new Error('Logged in but no auth user??'));
      return;
    }
    if (!user && authUser) {
      reject(new Error('Logged out but there is an auth user??'));
      return;
    }

    const database = firebase.database();
    const updates = {};

    const rytmsPath = isPublic
      ? firebasePath.database.PUBLIC_RYTMS
      : firebasePath.database.PRIVATE_RYTMS;
    const rytmsShortPath = isPublic
      ? firebasePath.database.PUBLIC_RYTMS_SHORT
      : firebasePath.database.PRIVATE_RYTMS_SHORT;
    const rytmsRef = database.ref(rytmsPath);
    const newRytmKey = rytmsRef.push().key;

    // create the atual write parhs
    const newRytmPath = `${rytmsPath}/${newRytmKey}`;
    const newRytmShortPath = `${rytmsShortPath}/${newRytmKey}`;

    const shortRytm = { title: rytm.title };

    if (user) {
      const userData = {
        id: authUser.uid,
        name: user.name,
      };
      // todo do this short stuff in cloud functions?
      // add short rytm to user (stringify, so this shortrytm wont have the added user, which is done below)
      const shortRytmInUserPath = `${firebasePath.database.USERS}/${
        authUser.uid
      }/${rytmsShortPath}/${newRytmKey}`;
      updates[shortRytmInUserPath] = JSON.parse(JSON.stringify(shortRytm));

      // add user to full & short rytm
      rytm.user = userData;
      shortRytm.user = userData;
    }

    updates[newRytmPath] = rytm; // the full rytm
    updates[newRytmShortPath] = shortRytm;

    // send updates to db
    database
      .ref()
      .update(updates)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
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
