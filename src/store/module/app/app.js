import PlayMode from '../../../data/enum/PlayMode';
import { themes } from '../../../data/themes';

const namespace = 'app';

export const appStore = {
  TOGGLE_PLAY_MODE: `${namespace}/togglePlayMode`,
  SET_DEVICE_STATE: `${namespace}/setDeviceState`,
  SET_ACTIVE_THEME: `${namespace}/setActiveTheme`,
  SET_IS_PLAYING: `${namespace}/setIsPlaying`,
  SET_SECONDS_PER_REVOLUTION: `${namespace}/setSecondsPerRevolution`,
};

export default {
  state: {
    themes,
    activeTheme: themes[0],
    deviceState: null,
    playMode: PlayMode.ROTATE,
    isPlaying: false, // controlled by the Scheduler, dont mutate (call scheduler.start/stop) todo or should scheduler listen to this state?
    secondsPerRevolution: 3,
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
    [appStore.SET_IS_PLAYING]: (state, payload) => {
      state.isPlaying = payload;
    },
    [appStore.SET_SECONDS_PER_REVOLUTION]: (state, payload) => {
      state.secondsPerRevolution = payload;
    },
  },
  actions: {},
};
