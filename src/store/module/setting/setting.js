import { initStoreCommands } from '../../../util/storeUtils';
import PlayMode from '../../../data/enum/PlayMode';

export const settingStore = {
  mutations: {
    setPlayMode: null,
  },
  local: {
    mutations: {
      setPlayMode: null,
    },
  },
};

initStoreCommands(settingStore, 'setting');

export default {
  namespaced: true,
  state: {
    playMode: PlayMode.ROTATE,
  },
  getters: {},
  mutations: {
    [settingStore.local.mutations.setPlayMode]: (state, payload) => {
      state.playMode = payload;
    },
  },
  actions: {},
};
