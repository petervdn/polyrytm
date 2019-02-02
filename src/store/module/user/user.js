const namespace = 'user';

export const userStore = {
  SET_USER_ID: `${namespace}/setUserId`,
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
    [userStore.SET_USER_ID]: (state, userId) => {
      state.userId = userId;
    },
  },
};
