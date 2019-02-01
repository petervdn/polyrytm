import * as firebase from 'firebase/app';
import { getFirebaseValue } from '../../../firebase/firebaseUtils';
import firebasePath from '../../../firebase/firebasePath';

const namespace = 'user';

export const userStore = {
  SET_USER: `${namespace}/setUser`, // todo used for both mutation and action, a bit confusing
  CLEAR_USER: `${namespace}/clearUser`,
};

export default {
  state: {
    user: null,
  },
  mutations: {
    [userStore.SET_USER]: (state, user) => {
      state.user = user;
    },
    [userStore.CLEAR_USER]: state => {
      state.user = null;
    },
  },
  actions: {
    [userStore.SET_USER]: (context, payload) => {
      getFirebaseValue(`${firebasePath.database.ADMINS}/${firebase.auth().currentUser.uid}`).then(
        isAdmin => {
          payload.isAdmin = isAdmin; // todo move to separate state prop?
          context.commit(userStore.SET_USER, payload);
        },
      );
    },
  },
};
