import { loadSample } from 'util/soundUtils';
import { initStoreCommands } from '../../../util/storeUtils';
import { createDefaultDisc, createRingItem, createSound } from '../../../util/discUtils';
import { interactionStore } from '../interaction/interaction';
import { constants } from '../../../data/constants';
import { sampleStore } from '../sample/sample';

export const discStore = {
	mutations: {
		setRingItemVolume: null,
		addDisc: null,
		addSoundToDisc: null,
		setAudioBuffer: null, // move to sample store?
		updateRingVolumes: null,
		addRing: null,
		toggleSliceInRing: null,
		resetScheduledRevolutionValues: null,
		updateNumberOfRingItems: null,
		removeRing: null,
		updateSlicesForDisc: null,
		update: null, // todo get rid of this
		// setSampleForDisc: null, // todo this is both mutation and an action => give better names
		// clearDiscs: null,
		// removeDisc: null,
	},
	actions: {
		clearDiscsAndSelections: null,
		initDiscs: null,
		setSampleForDisc: null,
		setLoadedDiscs: null,
		removeDisc: null,
		addSampleToDisc: null,
	},
	local: {
		mutations: {
			setRingItemVolume: null,
			addDisc: null,
			addSoundToDisc: null,
			setAudioBuffer: null, // move to sample store?
			updateRingVolumes: null,
			addRing: null,
			toggleSliceInRing: null,
			resetScheduledRevolutionValues: null,
			updateNumberOfRingItems: null,
			removeRing: null,
			updateSlicesForDisc: null,
			update: null, // todo get rid of this
			setSampleForDisc: null, // todo this is both mutation and an action => give better names
			clearDiscs: null,
			removeDisc: null,
		},
		actions: {
			clearDiscsAndSelections: null,
			initDiscs: null,
			setSampleForDisc: null,
			setLoadedDiscs: null,
			removeDisc: null,
			addSampleToDisc: null,
		},
	},
};

initStoreCommands(discStore, 'disc');

export default {
	namespaced: true,
	state: {
		discs: [],
	},
	getters: {},
	mutations: {
		[discStore.local.mutations.addSoundToDisc]: (state, payload) => {
			payload.disc.sounds.push(payload.sound);
		},
		[discStore.local.mutations.setRingItemVolume]: (state, payload) => {
			payload.ringItem.volume = payload.volume;
		},
		[discStore.local.mutations.clearDiscs]: state => {
			state.discs = [];
		},
		[discStore.local.mutations.removeDisc]: (state, payload) => {
			if (state.discs === 1) {
				console.error('Only one disc left, cannot remove');
			} else {
				state.discs.splice(state.discs.indexOf(payload), 1);
			}
		},
		[discStore.local.mutations.addDisc]: (state, payload) => {
			// no payload adds a default disc
			state.discs.push(payload || createDefaultDisc());
		},
		[discStore.local.mutations.setAudioBuffer]: (state, payload) => {
			// todo move to sample store
			payload.sample.audioBuffer = payload.audioBuffer;
		},
		[discStore.local.mutations.updateRingVolumes]: (state, payload) => {
			if (payload.ring.items.length !== payload.volumes.length) {
				console.error('Number of volumes doesnt match ring', payload);
				return;
			}
			payload.ring.items.forEach((item, index) => {
				let newVolume = payload.volumes[index];
				if (newVolume > 1 || newVolume < 0 || typeof newVolume === 'undefined' || Number.isNaN(newVolume)) {
					console.warn(`Skipping, invalid volume: ${newVolume}`);
					newVolume = item.volume;
				}
				item.volume = newVolume;
			});
		},
		[discStore.local.mutations.addRing]: (state, payload) => {
			payload.disc.rings.push(payload.ring);
		},
		// todo add description
		[discStore.local.mutations.toggleSliceInRing]: (state, payload) => {
			const { slice } = payload;
			const { ring } = payload;
			const indexInRingSlices = ring.slices.indexOf(slice);
			if (indexInRingSlices > -1) {
				// remove
				ring.slices.splice(indexInRingSlices, 1);
			} else {
				// add
				ring.slices.push(slice);
			}
		},

		// todo get rid of this shit
		[discStore.local.mutations.update]: (state, payload) => {
			Object.assign(payload.target, payload.source);
		},
		[discStore.local.mutations.resetScheduledRevolutionValues]: state => {
			state.discs.forEach(disc => {
				disc.rings.forEach(ring => {
					ring.items.forEach(ringItem => {
						ringItem.lastScheduledRevolution = -1;
					});
				});
			});
		},
		[discStore.local.mutations.updateNumberOfRingItems]: (state, payload) => {
			const { amount } = payload;
			const { ring } = payload;

			if (amount <= 0 || amount > constants.MAX_RING_ITEMS) {
				console.error('Invalid amountof ringitems', payload);
				return;
			}

			if (ring.items.length > amount) {
				// requested amount is less than what we have now -> remove items
				ring.items.splice(amount, ring.items.length - amount);

				// todo if ring-items become selectable, we need to check if we removed the selected one
				// todo right now we can set it as selectable, maybe prevent that
			} else if (ring.items.length < amount) {
				// requested amount is less than what we have -> add items
				const addItems = [];
				const addAmount = amount - ring.items.length;

				for (let i = 0; i < addAmount; i += 1) {
					const newRingItem = createRingItem(ring, ring.items.length + i, Math.random());
					addItems.push(newRingItem);
				}

				ring.items.push(...addItems);
			} else {
				// we already have the number of rings that is requested
			}
		},
		[discStore.local.mutations.setSampleForDisc]: (state, payload) => {
			payload.disc.sound.sample = payload.sample;
		},
		[discStore.local.mutations.removeRing]: () => {
			console.log('todo');
			// state.discs.forEach(disc => {
			// 	disc.rings.forEach((ring, index) => {
			// 		if (payload === ring) {
			// 			if (ring === state.selectedRing) {
			// 				state.selectedRing = null;
			// 				state.selectedRingItem = null;
			// 				state.highlightedRingItem = null;
			// 			}
			//
			// 			disc.rings.splice(index, 1);
			// 		}
			// 	});
			// });
		},
		[discStore.local.mutations.updateSlicesForDisc]: (state, payload) => {
			payload.disc.sound.slices = payload.slices;
		},
	},
	actions: {
		[discStore.local.actions.initDiscs]: context => {
			context.dispatch(discStore.local.actions.clearDiscsAndSelections);

			// create default disc and set as selection
			const disc = createDefaultDisc();
			context.commit(discStore.local.mutations.addDisc, disc);
			context.commit(interactionStore.mutations.setSelection, disc, { root: true });
		},
		[discStore.local.actions.setSampleForDisc]: (context, payload) => {
			const { sample } = payload;

			if (!sample) {
				// deselect a sample todo create a remove sample action?
				context.commit(discStore.local.mutations.setSampleForDisc, payload);
				return Promise.resolve();
			}

			return loadSample(sample, payload.onProgress).then(audioBuffer => {
				context.commit(discStore.local.mutations.setAudioBuffer, {
					sample,
					audioBuffer,
				});
				context.commit(discStore.local.mutations.setSampleForDisc, payload);
			});
		},
		[discStore.local.actions.setLoadedDiscs]: (context, discs) => {
			context.commit(discStore.local.actions.clearDiscsAndSelections);

			discs.forEach(disc => {
				context.dispatch(discStore.local.mutations.addDisc, disc);
			});
		},
		[discStore.local.actions.clearDiscsAndSelections]: context => {
			context.commit(discStore.local.mutations.clearDiscs);

			context.commit(interactionStore.mutations.clearSelection, null, { root: true });
		},
		/**
		 * Use this from outside, as opposed to the mutation. This one handles resulting selection changes
		 * @param context
		 */
		[discStore.local.actions.removeDisc]: (context, payload) => {
			context.commit(discStore.local.mutations.removeDisc, payload);

			if (context.rootState.interaction.selection === payload) {
				// removed disc was selected, set to first one todo set a closer one
				context.commit(interactionStore.mutations.setSelection, context.state.discs[0], { root: true });
			}
		},
		[discStore.local.actions.addSampleToDisc]: (context, payload) =>
			loadSample(payload.sample, payload.onProgress).then(audioBuffer => {
				context.commit(
					sampleStore.mutations.setAudioBuffer,
					{
						audioBuffer,
						sample: payload.sample,
					},
					{ root: true },
				);

				context.commit(discStore.local.mutations.addSoundToDisc, {
					disc: payload.disc,
					sound: createSound(payload.sample, payload.disc),
				});
			}),
	},
};
