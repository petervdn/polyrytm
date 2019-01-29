import { themes } from '../../../data/themes';

const namespace = 'theme';

export const themeStore = {
  SET_ACTIVE_THEME: `${namespace}/setActiveTheme`,
};

export default {
  state: {
    activeTheme: themes[0],
    themes,
  },
  getters: {},
  mutations: {
    [themeStore.SET_ACTIVE_THEME]: (state, payload) => {
      state.activeTheme = payload;
    },
  },
  actions: {},
};
