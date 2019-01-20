import { initStoreCommands } from 'util/storeUtils';
import { getHint } from '../../../util/interactionUtils';
import { getDiscForInteractable, getRingForInteractable } from '../../../util/discUtils';

export const interactionStore = {
	mutations: {
		setSelection: null,
		setHighlight: null,
		clearSelection: null,
		setHighlightAsSelection: null,
		setForceHint: null,
	},
	getters: {
		hint: null,
		selectedDisc: null,
		selectedRing: null,
		highlightedDisc: null,
		highlightedRing: null,
	},
	local: {
		mutations: {
			setSelection: null,
			setHighlight: null,
			clearSelection: null,
			setHighlightAsSelection: null,
			setForceHint: null,
		},
		getters: {
			hint: null,
			selectedDisc: null,
			selectedRing: null,
			highlightedDisc: null,
			highlightedRing: null,
		},
	},
};

initStoreCommands(interactionStore, 'interaction');

export default {
	namespaced: true,
	state: {
		selection: null, // IInteractable
		highlight: null, // IInteractable
		forceHint: null, // a hint (string) that overrides hints resulting from selection/interaction
	},
	getters: {
		[interactionStore.local.getters.hint]: state => getHint(state),
		[interactionStore.local.getters.selectedDisc]: state => getDiscForInteractable(state.selection),
		[interactionStore.local.getters.selectedRing]: state => getRingForInteractable(state.selection),
		[interactionStore.local.getters.highlightedDisc]: state => getDiscForInteractable(state.highlight),
		[interactionStore.local.getters.highlightedRing]: state => getRingForInteractable(state.highlight),
	},
	mutations: {
		[interactionStore.local.mutations.setForceHint]: (state, payload) => {
			state.forceHint = payload;
		},
		[interactionStore.local.mutations.setHighlightAsSelection]: state => {
			state.selection = state.highlight;
		},
		[interactionStore.local.mutations.clearSelection]: state => {
			state.selection = null;
		},
		[interactionStore.local.mutations.setSelection]: (state, payload) => {
			state.selection = payload;
		},
		[interactionStore.local.mutations.setHighlight]: (state, payload) => {
			state.highlight = payload;
		},
	},
};
