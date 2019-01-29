import PlayMode from '../../../data/enum/PlayMode';
import { themes } from '../../../data/themes';

const namespace = 'app';

export const appStore = {
  TOGGLE_PLAY_MODE: `${namespace}/togglePlayMode`,
  SET_DEVICE_STATE: `${namespace}/setDeviceState`,
  SET_ACTIVE_THEME: `${namespace}/setActiveTheme`,
};

export default {
  state: {
    themes,
    activeTheme: themes[0],
    deviceState: null,
    playMode: PlayMode.ROTATE,
  },
  getters: {},
  mutations: {
    [appStore.SET_DEVICE_STATE](state, deviceState) {
      state.deviceState = deviceState;
    },
    [appStore.TOGGLE_PLAY_MODE]: state => {
      state.playMode = state.playMode === PlayMode.ROTATE ? PlayMode.STATIC : PlayMode.ROTATE;
    },
    [appStore.SET_ACTIVE_THEME]: (state, payload) => {
      state.activeTheme = payload;
    },
  },
  actions: {},
};
