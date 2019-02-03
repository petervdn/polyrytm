const namespace = 'user';

export const userStore = {
  SET_USER_ID: `${namespace}/setUserId`,
  SET_IS_ADMIN: `${namespace}/setIsAdmin`,
  IS_LOGGED_IN: `${namespace}/isLoggedIn`,
};

export default {
  state: {
    userId: null, // todo rename to id?
    isAdmin: false,
  },
  getters: {
    [userStore.IS_LOGGED_IN]: state => state.userId,
  },
  mutations: {
    [userStore.SET_IS_ADMIN]: (state, isAdmin) => {
      state.isAdmin = isAdmin;
    },
    [userStore.SET_USER_ID]: (state, userId) => {
      state.userId = userId;
    },
  },
};
