import Vue from 'vue';
import SampleManagerItemState from '../../../data/enum/SampleManagerItemState';
import firebaseConfig from '../../../firebase/enum/firebaseConfig';
import { uploadToStorage } from '../../../firebase/storageUtils';
import { db } from '../../../firebase/firebaseUtils';

const namespace = 'sample';

export const sampleStore = {
  SET_SAMPLES: `${namespace}/setSamples`,
  ADD_SAMPLE: `${namespace}/addSample`,
  UPLOAD_FILE_AS_SAMPLE: `${namespace}/uploadFileAsSample`,
  SET_UPLOAD_PROGRESS: `${namespace}/setUploadProgress`,
  SET_UPLOAD_STATE: `${namespace}/setUploadState`,
  SET_UPLOAD_COMPLETE: `${namespace}/setUploadComplete`,
};

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
      sample.uploadData.progress = progress;
    },
    [sampleStore.SET_UPLOAD_STATE]: (state, { sample, uploadState }) => {
      sample.uploadData.state = uploadState;
    },
    [sampleStore.SET_UPLOAD_COMPLETE]: (state, { sample }) => {
      Vue.delete(sample, 'uploadData');
    },
  },
  actions: {
    [sampleStore.UPLOAD_FILE_AS_SAMPLE]: (context, file) => {
      const sample = {
        name: file.name,
        size: file.size,
        uploadData: {
          file,
          progress: 0,
          state: SampleManagerItemState.UPLOADING,
        },
      };
      context.commit(sampleStore.ADD_SAMPLE, sample);

      const { userId } = context.rootState.user;
      const storagePath = `${firebaseConfig.storage.SAMPLES}/${userId}`;

      uploadToStorage(file, storagePath, progress => {
        context.commit(sampleStore.SET_UPLOAD_PROGRESS, { sample, progress });
      }).then(() => {
        context.commit(sampleStore.SET_UPLOAD_STATE, {
          sample,
          uploadState: SampleManagerItemState.WAITING_FOR_DB_ENTRY,
        });
        const samplesRef = db.collection(firebaseConfig.firestore.collection.SAMPLES);
        samplesRef.where('path', '==', `${storagePath}/${sample.name}`).onSnapshot(snapshot => {
          if (snapshot.size === 1) {
            context.commit(sampleStore.SET_UPLOAD_COMPLETE, { sample });
          }
        });
      });
    },
  },
};
