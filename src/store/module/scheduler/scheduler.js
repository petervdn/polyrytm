import { initStoreCommands } from '../../../util/storeUtils';

export const schedulerStore = {
  mutations: {
    setIsPlaying: null,
    setSecondsPerRevolution: null,
  },
  local: {
    mutations: {
      setIsPlaying: null,
      setSecondsPerRevolution: null,
    },
  },
};

initStoreCommands(schedulerStore, 'scheduler');

export default {
  namespaced: true,
  state: {
    isPlaying: false, // controlled by the Scheduler, dont mutate (call scheduler.start/stop)
    secondsPerRevolution: 3, // can be mutated
  },
  getters: {},
  mutations: {
    [schedulerStore.local.mutations.setIsPlaying]: (state, payload) => {
      state.isPlaying = payload;
    },
    [schedulerStore.local.mutations.setSecondsPerRevolution]: (state, payload) => {
      state.secondsPerRevolution = payload;
    },
  },
};
