import { initStoreCommands } from 'util/storeUtils';

export const sampleStore = {
	mutations: {
		addSample: null,
		setSamples: null,
		setAudioBuffer: null,
	},
	local: {
		mutations: {
			addSample: null,
			setSamples: null,
			setAudioBuffer: null,
		},
	},
};

initStoreCommands(sampleStore, 'sample');

export default {
	namespaced: true,
	state: {
		samples: [],
	},
	getters: {},
	mutations: {
		[sampleStore.local.mutations.setSamples]: (state, samples) => {
			state.samples = samples;
		},
		[sampleStore.local.mutations.setAudioBuffer]: (state, payload) => {
			console.log('setAudioBuffer', payload);
			payload.sample.audioBuffer = payload.audioBuffer;
		},
	},
	actions: {},
};
