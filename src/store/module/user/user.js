import * as firebase from 'firebase';
import { getFirebaseValue } from 'firebase/firebaseUtils';
import firebasePath from 'firebase/firebasePath';

export default {
	namespaced: true,
	state: {
		user: null,
	},
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
		clearUser: state => {
			state.user = null;
		},
	},
	actions: {
		setUser: (context, payload) => {
			getFirebaseValue(`${firebasePath.database.ADMINS}/${firebase.auth().currentUser.uid}`).then(isAdmin => {
				payload.isAdmin = isAdmin;
				context.commit('setUser', payload);
			});
		},
	},
};
