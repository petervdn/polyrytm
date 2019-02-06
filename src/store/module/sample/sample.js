import Vue from 'vue';
import SampleProcessingState from '../../../data/enum/SampleProcessingState';
import firebaseConfig from '../../../firebase/enum/firebaseConfig';
import { removeSampleFromDatabase, uploadToStorage } from '../../../firebase/storageUtils';
import { db } from '../../../firebase/firebaseUtils';

const namespace = 'sample';

export const sampleStore = {
  SET_SAMPLES: `${namespace}/setSamples`,
  ADD_SAMPLE: `${namespace}/addSample`,
  UPLOAD_FILE_AS_SAMPLE: `${namespace}/uploadFileAsSample`,
  SET_UPLOAD_PROGRESS: `${namespace}/setUploadProgress`,
  SET_PROCESSING_STATE: `${namespace}/setProcessingState`,
  SET_UPLOAD_COMPLETE: `${namespace}/setUploadComplete`,
  DELETE_SAMPLE: `${namespace}/deleteSample`,
  REMOVE_SAMPLE_FROM_LIST: `${namespace}/removeSampleFromList`, // todo better name? (nearly same as deleteSample)
};

const processingDataPropName = 'processingData';

export default {
  state: {
    samples: [],
  },
  getters: {},
  mutations: {
    [sampleStore.SET_SAMPLES]: (state, samples) => {
      state.samples = samples;
    },
    [sampleStore.ADD_SAMPLE]: (state, sample) => {
      state.samples.push(sample);
    },
    [sampleStore.SET_UPLOAD_PROGRESS]: (state, { sample, progress }) => {
      sample.processingData.progress = progress;
    },
    [sampleStore.SET_PROCESSING_STATE]: (state, { sample, processingState }) => {
      // todo find sample from state? (by path)
      if (!sample.processingData) {
        Vue.set(sample, processingDataPropName, {}); // otherwise this addition is not tracked
      }
      sample.processingData.state = processingState;
    },
    [sampleStore.REMOVE_SAMPLE_FROM_LIST]: (state, sample) => {
      const index = state.samples.indexOf(sample);
      if (index > -1) {
        state.samples.splice(index, 1);
      } else {
        throw new Error(`Sample not found in store: ${sample.name}`);
      }
    },
    [sampleStore.SET_UPLOAD_COMPLETE]: (state, { sample, dbDocData }) => {
      // todo better way to do this?
      Object.assign(sample, dbDocData);
      Vue.delete(sample, processingDataPropName); // otherwise this removal is not tracked
    },
  },
  actions: {
    [sampleStore.DELETE_SAMPLE]: (context, sample) => {
      context.commit(sampleStore.SET_PROCESSING_STATE, {
        sample,
        processingState: SampleProcessingState.DELETING_FILE,
      });
      return removeSampleFromDatabase(sample, () => {
        context.commit(sampleStore.SET_PROCESSING_STATE, {
          sample,
          processingState: SampleProcessingState.WAITING_FOR_DB_REMOVAL,
        });
      }).then(() => {
        context.commit(sampleStore.REMOVE_SAMPLE_FROM_LIST, sample);
      });
    },
    [sampleStore.UPLOAD_FILE_AS_SAMPLE]: (context, file) => {
      // todo check if new path does not exist in db/storage?
      const sample = {
        name: file.name,
        size: file.size,
        processingData: {
          file,
          progress: 0,
          state: SampleProcessingState.UPLOADING,
        },
      };
      context.commit(sampleStore.ADD_SAMPLE, sample);

      const { userId } = context.rootState.user;
      const storagePath = `${firebaseConfig.storage.SAMPLES}/${userId}`;

      uploadToStorage(file, storagePath, progress => {
        context.commit(sampleStore.SET_UPLOAD_PROGRESS, { sample, progress });
      }).then(() => {
        context.commit(sampleStore.SET_PROCESSING_STATE, {
          sample,
          uploadState: SampleProcessingState.WAITING_FOR_DB_ENTRY,
        });

        // todo move some of below stuff to util ts file?
        const samplesRef = db.collection(firebaseConfig.firestore.collection.SAMPLES);
        samplesRef.where('path', '==', `${storagePath}/${sample.name}`).onSnapshot(snapshot => {
          if (snapshot.size === 1) {
            snapshot.forEach(doc => {
              context.commit(sampleStore.SET_UPLOAD_COMPLETE, { sample, dbDocData: doc.data() });
            });
          }
        });
      });
    },
  },
};
