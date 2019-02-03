const namespace = 'sample';

export const sampleStore = {
  SET_SAMPLES: `${namespace}/setSamples`,
};

// export const sampleStore = {
//   mutations: {
//     addSample: null,
//     setSamples: null,
//     setAudioBuffer: null,
//   },
//   local: {
//     mutations: {
//       addSample: null,
//       setSamples: null,
//       setAudioBuffer: null,
//     },
//   },
// };
//

export default {
  state: {
    samples: [],
  },
  getters: {},
  mutations: {
    [sampleStore.SET_SAMPLES]: (state, samples) => {
      state.samples = samples;
    },
    // [sampleStore.local.mutations.setAudioBuffer]: (state, payload) => {
    //   console.log('setAudioBuffer', payload);
    //   payload.sample.audioBuffer = payload.audioBuffer;
    // },
  },
  actions: {},
};
