import { storeRytm } from '../../../firebase/firebaseUtils';
import { initStoreCommands } from '../../../util/storeUtils';

export const projectStore = {
  mutations: {
    updateName: null,
    updateAuthor: null,
    updateLink: null,
  },
  actions: {
    storeProject: null,
    setLoadedProject: null,
  },
  local: {
    mutations: {
      updateName: null,
      updateAuthor: null,
      updateLink: null,
    },
    actions: {
      storeProject: null,
      setLoadedProject: null,
    },
  },
};

initStoreCommands(projectStore, 'project');

export default {
  namespaced: true,
  state: {
    name: '', // todo rename to title
    author: '',
    link: '',
  },
  getters: {},
  mutations: {
    [projectStore.local.mutations.updateName]: (state, payload) => {
      state.name = payload;
    },
    [projectStore.local.mutations.updateAuthor]: (state, payload) => {
      state.author = payload;
    },
    [projectStore.local.mutations.updateLink]: (state, payload) => {
      state.link = payload;
    },
  },
  actions: {
    [projectStore.local.actions.storeProject]: context => {
      // todo move to some util file
      // stringify/parse so we no longer have references to store objects
      const data = {
        title: context.state.name,
        discs: JSON.parse(JSON.stringify(context.rootState.disc.discs)),
      };

      // todo move to save action? (now the data to store is generated/manipulated in two places)
      // remove unnecessary data from sequences
      data.discs.forEach(disc => {
        // remove sample buffers
        if (disc.sound.sample) {
          delete disc.sound.sample.audioBuffer;
        }

        // remove audio nodes on rings
        disc.rings.forEach(ring => {
          delete ring.gain;
          delete ring.lastScheduledRevolution;

          ring.items.forEach(ringItem => {
            delete ringItem.lastScheduledRevolution;
          });
        });
      });

      storeRytm(data, true, context.rootState.user.user);
    },
    // [projectStore.local.actions.setLoadedProject]: (context, projectData) => {
    // 	context.commit(projectStore.local.mutations.updateName, projectData.project.name);
    // 	context.commit(projectStore.local.mutations.updateAuthor, projectData.project.author);
    // 	context.commit(projectStore.local.mutations.updateLink, projectData.project.link);
    //
    // 	const sequencesWithSample = projectData.sequences.filter(sequence => !!sequence.sound.sample);
    //
    // 	// since the sample objects in the (loaded) projectData are NOT the actual objects in the store,
    // 	// we need to sync those things in the store:
    // 	// - look up the actual sample in the store, and use that to replace the 'fake' sample in loaded data
    // 	// - if it's not in the store (external sample), we need to add it first
    // 	sequencesWithSample.forEach(sequence => {
    // 		const sampleInLoadedSequence = sequence.sound.sample;
    // 		const sampleInStore = context.rootState.sample.samples.find(
    // 			sample => sample.uri === sampleInLoadedSequence.uri,
    // 		);
    //
    // 		if (sampleInStore) {
    // 			sequence.sound.sample = sampleInStore;
    // 		} else {
    // 			// todo we loaded a sample that is NOT in the store, add it
    // 			console.warn('Unknown sample!', sampleInLoadedSequence);
    // 		}
    // 	});
    //
    // 	// create actual rings (otherwise they will not have audionodes)
    // 	projectData.sequences.forEach(sequence => {
    // 		sequence.rings.forEach((ring, index) => {
    // 			sequence.rings[index] = createRing(ring.items, ring.sliceIndices);
    // 		});
    // 	});
    //
    // 	// now load all these
    // 	return Promise.all(sequencesWithSample.map(sequence => loadSample(sequence.sound.sample)))
    // 		.then(loadedAudioBuffers => {
    // 			// set results on sequences
    // 			sequencesWithSample.forEach((sequence, index) => {
    // 				context.commit(
    // 					discStore.mutations.setAudioBuffer,
    // 					{
    // 						sample: sequence.sound.sample,
    // 						audioBuffer: loadedAudioBuffers[index],
    // 					},
    // 					{ root: true },
    // 				);
    // 			});
    //
    // 			// set sequences
    // 			return context.dispatch(discStore.actions.setLoadedSequences, projectData.sequences, {
    // 				root: true,
    // 			});
    // 		})
    // 		.then(() => {
    // 			// todo no selection so camera is not zoomed
    // 		})
    // 		.catch(error => {
    // 			console.log(error);
    // 		});
    // },
    // loadExample(context, example) {
    // 	context.commit(mainStore.mutations.setNotification, 'loading example', { root: true });
    //
    // 	return new Promise((resolve, reject) => {
    // 		const request = new XMLHttpRequest();
    //
    // 		const uri = getValue(CONFIG_MANAGER).getURL(URLNames.EXAMPLES_PATH) + example.file;
    //
    // 		request.open('GET', uri, true);
    // 		request.onload = () => {
    // 			if (request.status === 200) {
    // 				context.dispatch('setLoadedProject', JSON.parse(request.response)).then(() => {
    // 					context.commit(mainStore.mutations.setNotification, null, { root: true });
    // 				});
    // 			} else {
    // 				// todo
    // 				context.commit(mainStore.mutations.setNotification, null, { root: true });
    // 				reject();
    // 			}
    // 		};
    //
    // 		request.send();
    // 	});
    // },
  },
};
