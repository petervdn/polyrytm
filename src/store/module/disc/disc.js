import { loadSample } from '../../../util/soundUtils';
import { createDefaultDisc, createRingItem, createSound } from '../../../util/discUtils';
import { interactionStore } from '../interaction/interaction';
import { constants } from '../../../data/constants';
import { sampleStore } from '../sample/sample';

const namespace = 'disc';

export const discStore = {
  SET_RING_ITEM_VOLUME: `${namespace}/setRingItemVolume`,
  ADD_DISC: `${namespace}/addDisc`,
  ADD_SOUND_TO_DISC: `${namespace}/addSoundToDisc`,
  SET_AUDIO_BUFFER: `${namespace}/setAudioBuffer`, // move to sample store?
  SET_RING_VOLUMES: `${namespace}/setRingVolumes`,
  ADD_RING: `${namespace}/addRing`,
  TOGGLE_SLICE_IN_RING: `${namespace}/toggleSliceInRing`,
  RESET_SCHEDULED_REVOLUTION_VALUES: `${namespace}/resetScheduledRevolutionValues`,
  SET_NUMBER_OF_RING_ITEMS: `${namespace}/setNumberOfRingItems`,
  REMOVE_RING: `${namespace}/removeRing`,
  UPDATE_SLICES_FOR_DISC: `${namespace}/updateSlicesForDisc`,
  CLEAR_DISCS: `${namespace}/clearDiscs`,
  SET_SLICES_FOR_DISC: `${namespace}/setSlicesForDisc`,
  UPDATE: `${namespace}/update`, // todo remove
  CLEAR_DISCS_AND_SELECTIONS: `${namespace}/clearDiscsAndSelections`, // todo what is this compared to clearDiscs?
  INIT_DISCS: `${namespace}/initDiscs`, // a
  SET_SAMPLE_FOR_DISC: `${namespace}/setSampleForDisc`, // a
  SET_LOADED_DISCS: `${namespace}/setLoadedDiscs`, // a
  REMOVE_DISC: `${namespace}/removeDisc`, // a
  ADD_SAMPLE_TO_DISC: `${namespace}/addSampleToDisc`, // a
};

export default {
  state: {
    discs: [],
  },
  getters: {},
  mutations: {
    [discStore.ADD_SOUND_TO_DISC]: (state, payload) => {
      payload.disc.sounds.push(payload.sound);
    },
    [discStore.SET_RING_ITEM_VOLUME]: (state, payload) => {
      // todo payload should be volume
      payload.ringItem.volume = payload.volume;
    },
    [discStore.CLEAR_DISCS]: state => {
      // todo rename remove?
      state.discs = [];
    },
    [discStore.REMOVE_DISC]: (state, payload) => {
      if (state.discs === 1) {
        console.error('Only one disc left, cannot remove'); // todo should this be possible?
      } else {
        state.discs.splice(state.discs.indexOf(payload), 1);
      }
    },
    [discStore.ADD_DISC]: (state, payload) => {
      // no payload adds a default disc
      state.discs.push(payload || createDefaultDisc()); // todo move defaultDisc method to where this is called?
    },
    [discStore.SET_AUDIO_BUFFER]: (state, payload) => {
      // todo move to sample store
      payload.sample.audioBuffer = payload.audioBuffer;
    },
    [discStore.SET_RING_VOLUMES]: (state, payload) => {
      if (payload.ring.items.length !== payload.volumes.length) {
        throw new Error('Number of volumes doesnt match ring');
      }
      payload.ring.items.forEach((item, index) => {
        let newVolume = payload.volumes[index];
        if (
          newVolume > 1 ||
          newVolume < 0 ||
          typeof newVolume === 'undefined' ||
          Number.isNaN(newVolume)
        ) {
          console.warn(`Skipping, invalid volume: ${newVolume}`);
          newVolume = item.volume;
        }
        item.volume = newVolume;
      });
    },
    [discStore.ADD_RING]: (state, payload) => {
      payload.disc.rings.push(payload.ring);
    },
    // todo add description
    [discStore.TOGGLE_SLICE_IN_RING]: (state, payload) => {
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
    [discStore.UPDATE]: (state, payload) => {
      Object.assign(payload.target, payload.source);
    },
    [discStore.RESET_SCHEDULED_REVOLUTION_VALUES]: state => {
      // todo move to scheduler?
      state.discs.forEach(disc => {
        disc.rings.forEach(ring => {
          ring.items.forEach(ringItem => {
            ringItem.lastScheduledRevolution = -1;
          });
        });
      });
    },
    [discStore.SET_NUMBER_OF_RING_ITEMS]: (state, payload) => {
      const { amount } = payload;
      const { ring } = payload;

      if (amount <= 0 || amount > constants.MAX_RING_ITEMS) {
        console.error('Invalid amountof ringitems', payload); // todo throw error
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
    [discStore.SET_SAMPLE_FOR_DISC]: (state, payload) => {
      payload.disc.sound.sample = payload.sample;
    },
    [discStore.REMOVE_RING]: () => {
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
    [discStore.SET_SLICES_FOR_DISC]: (state, payload) => {
      payload.disc.sound.slices = payload.slices;
    },
  },
  actions: {
    [discStore.INIT_DISCS]: context => {
      context.dispatch(discStore.CLEAR_DISCS_AND_SELECTIONS);

      // create default disc and set as selection
      const disc = createDefaultDisc();
      context.commit(discStore.ADD_DISC, disc);
      context.commit(interactionStore.mutations.setSelection, disc, { root: true });
    },
    [discStore.SET_SAMPLE_FOR_DISC]: (context, payload) => {
      const { sample } = payload;

      if (!sample) {
        // deselect a sample todo create a remove sample action?
        context.commit(discStore.SET_SAMPLE_FOR_DISC, payload);
        return Promise.resolve();
      }

      return loadSample(sample, payload.onProgress).then(audioBuffer => {
        context.commit(discStore.SET_AUDIO_BUFFER, {
          sample,
          audioBuffer,
        });
        context.commit(discStore.SET_SAMPLE_FOR_DISC, payload);
      });
    },
    [discStore.SET_LOADED_DISCS]: (context, discs) => {
      context.commit(discStore.CLEAR_DISCS_AND_SELECTIONS);

      discs.forEach(disc => {
        context.dispatch(discStore.ADD_DISC, disc);
      });
    },
    [discStore.CLEAR_DISCS_AND_SELECTIONS]: context => {
      // todo do we need this? why not call both separately
      context.commit(discStore.CLEAR_DISCS);

      // context.commit(interactionStore.mutations.clearSelection, null, { root: true }); todo
    },
    /**
     * Use this from outside, as opposed to the mutation. This one handles resulting selection changes
     * @param context
     */
    [discStore.REMOVE_DISC]: (context, payload) => {
      context.commit(discStore.REMOVE_DISC, payload);

      if (context.rootState.interaction.selection === payload) {
        // removed disc was selected, set to first one todo set a closer one
        context.commit(interactionStore.mutations.setSelection, context.state.discs[0], {
          root: true,
        });
      }
    },
    [discStore.ADD_SAMPLE_TO_DISC]: (context, payload) =>
      loadSample(payload.sample, payload.onProgress).then(audioBuffer => {
        context.commit(
          sampleStore.mutations.setAudioBuffer,
          {
            audioBuffer,
            sample: payload.sample,
          },
          { root: true },
        );

        context.commit(discStore.ADD_SOUND_TO_DISC, {
          disc: payload.disc,
          sound: createSound(payload.sample, payload.disc),
        });
      }),
  },
};
