import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import firebasePath from './firebasePath';
import { sampleStore } from '../store/module/sample/sample';
import { userStore } from '../store/module/user/user';

// todo move file to utils?

export const getFirebaseValue = path =>
  firebase
    .database()
    .ref(path)
    .once('value')
    .then(snap => snap.val());

// const setUser = (store, user) => store.dispatch('user/setUser', user);

// todo better name for this method
export const initUserLogin = store =>
  new Promise(resolve => {
    firebase.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        const firebaseUserRef = firebase
          .database()
          .ref(`/${firebasePath.database.USERS}/${authUser.uid}`);

        firebaseUserRef.once('value').then(snapshot => {
          const firebaseUser = snapshot.val();
          firebaseUser.uid = authUser.uid;
          if (firebaseUser) {
            // user logged in with existing user
            console.log('Logged in with existing user');
            store.dispatch(userStore.SET_USER, firebaseUser).then(() => {
              resolve();
            });
          } else {
            // user logged in with non-existing user, so create the new user
            // eslint-disable-next-line
            console.log('Logged in with new user');
            const newUser = {
              name: 'New user',
              uid: authUser.uid,
            };
            firebaseUserRef.set(newUser).then(() => {
              // todo test by removing user form db
              store.dispatch(userStore.SET_USER, newUser).then(() => {
                resolve();
              });
            });
          }
        });
      } else {
        // user is not logged in
        store.commit('user/clearUser'); // todo user store obj

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

export const loadPublicSamples = store =>
  new Promise(resolve => {
    getFirebaseValue(firebasePath.database.PUBLIC_SAMPLES).then(samplesObject => {
      const samples = Object.keys(samplesObject).map(key => ({
        name: samplesObject[key].name,
        path: `${samplesObject[key].path}/${samplesObject[key].name}`,
        // uri: samplesObject[key].link, todo remove link in database and set full path there
      }));

      store.commit(sampleStore.mutations.setSamples, samples);
      resolve();
    });
  });
