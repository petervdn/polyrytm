import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyBWrdFVFh_NQXVQT5PA6y330n82ner3VbI', // todo move to startup and set props in config (so we can have a staging)
  authDomain: 'polyrytm.firebaseapp.com',
  projectId: 'polyrytm',
  storageBucket: 'polyrytm.appspot.com',
});

export const firebaseInstance = {
  firestore: firebase.firestore(),
  storage: firebase.storage(),
  auth: firebase.auth(),
};

export const firebasePath = {
  firestore: {
    collection: {
      ADMINS: 'admins',
      SAMPLES: 'samples',
    },
  },
  storage: {
    SAMPLES: 'samples',
  },
};
