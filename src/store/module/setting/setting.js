import PlayMode from '../../../data/enum/PlayMode';

const namespace = 'theme';

export const settingStore = {
  TOGGLE_PLAY_MODE: `${namespace}/togglePlayMode`,
};

export default {
  state: {
    playMode: PlayMode.ROTATE,
  },
  getters: {},
  mutations: {
    [settingStore.TOGGLE_PLAY_MODE]: state => {
      state.playMode = state.playMode === PlayMode.ROTATE ? PlayMode.STATIC : PlayMode.ROTATE;
    },
  },
  actions: {},
};
