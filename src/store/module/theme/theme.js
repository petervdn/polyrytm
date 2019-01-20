import { initStoreCommands } from '../../../util/storeUtils';
import { themes } from '../../../data/themes';

export const themeStore = {
	mutations: {
		updateActiveTheme: null,
	},
	local: {
		mutations: {
			updateActiveTheme: null,
		},
	},
};

initStoreCommands(themeStore, 'theme');

export default {
	namespaced: true,
	state: {
		activeTheme: themes[0],
		themes,
	},
	getters: {},
	mutations: {
		[themeStore.local.mutations.updateActiveTheme]: (state, payload) => {
			state.activeTheme = payload;
		},
	},
	actions: {},
};
