import { loadAudioBuffer } from 'audiobuffer-loader';
import SampleState from '../../../data/enum/SampleState';
import { audioContext } from '../../../util/soundUtils';
import { firebaseInstance, firebasePath } from '../../../firebase/firebase';
import { removeSampleFromDatabase, uploadToStorage } from '../../../util/firebase/storageUtils';
import { getNormalizeFactorForSample } from '../../../util/sampleUtils';

const namespace = 'sample';

export const sampleStore = {
  SET_SAMPLES: `${namespace}/setSamples`,
  SET_AUDIOBUFFER: `${namespace}/setAudioBuffer`,
  ADD_SAMPLE: `${namespace}/addSample`,
  UPLOAD_FILE_AS_SAMPLE: `${namespace}/uploadFileAsSample`, // todo better name (should match DELETE_SAMPLE_FROM_DATABASE somewhat)
  SET_UPLOAD_PROGRESS: `${namespace}/setUploadProgress`,
  SET_SAMPLE_STATE: `${namespace}/setSampleState`,
  SET_UPLOAD_COMPLETE: `${namespace}/setUploadComplete`,
  DELETE_SAMPLE_FROM_DATABASE: `${namespace}/deleteSampleFromDatabase`,
  REMOVE_SAMPLE: `${namespace}/removeSample`, // todo better name? (delete from store)
  LOAD_SAMPLE: `${namespace}loadSample`,
  SET_NORMALIZE_FACTOR: `${namespace}/setNormalizeFactor`,
};

export default {
  state: {
    samples: [], // todo make object with keys
  },
  mutations: {
    [sampleStore.SET_NORMALIZE_FACTOR]: (state, { sample, factor }) => {
      // todo get sample from list
      // todo maybe store this value in database
      sample.normalizeFactor = factor;
    },
    [sampleStore.SET_AUDIOBUFFER]: (state, { sample, audioBuffer }) => {
      // todo get sample from list
      sample.audioBuffer = audioBuffer;
    },
    [sampleStore.ADD_SAMPLE]: (state, sample) => {
      // todo check if path exists?
      if (!sample.state) {
        sample.state = SampleState.READY;
      }

      state.samples.push(sample);
    },
    [sampleStore.SET_UPLOAD_PROGRESS]: (state, { sample, progress }) => {
      sample.uploadProgress = progress;
    },
    [sampleStore.SET_SAMPLE_STATE]: (state, { sample, sampleState }) => {
      sample.state = sampleState;
    },
    [sampleStore.REMOVE_SAMPLE]: (state, sample) => {
      const index = state.samples.indexOf(sample);
      if (index > -1) {
        state.samples.splice(index, 1);
      } else {
        throw new Error(`Sample not found in store: ${sample.name}`);
      }
    },
    [sampleStore.SET_UPLOAD_COMPLETE]: (state, { sample, dbDocData }) => {
      // todo move all these create-sample-from-whatever functions to ts
      // assign all props from database entry
      Object.assign(sample, dbDocData);
      sample.state = SampleState.READY;
    },
  },
  actions: {
    [sampleStore.LOAD_SAMPLE]: (context, sample) => {
      if (sample.audioBuffer) {
        return Promise.resolve();
      }

      return firebaseInstance.storage
        .ref(sample.path)
        .getDownloadURL()
        .then(url => loadAudioBuffer(audioContext, url))
        .then(result => result.audioBuffer)
        .then(audioBuffer => context.commit(sampleStore.SET_AUDIOBUFFER, { sample, audioBuffer }))
        .then(() =>
          context.commit(sampleStore.SET_NORMALIZE_FACTOR, {
            sample,
            factor: getNormalizeFactorForSample(sample),
          }),
        );
    },
    [sampleStore.SET_SAMPLES]: (context, samples) => {
      samples.forEach(sample => context.commit(sampleStore.ADD_SAMPLE, sample));
    },
    [sampleStore.DELETE_SAMPLE_FROM_DATABASE]: (context, sample) => {
      context.commit(sampleStore.SET_SAMPLE_STATE, {
        sample,
        sampleState: SampleState.DELETING_FILE,
      });
      return removeSampleFromDatabase(sample, () => {
        context.commit(sampleStore.SET_SAMPLE_STATE, {
          sample,
          sampleState: SampleState.WAITING_FOR_DB_REMOVAL,
        });
      }).then(() => {
        context.commit(sampleStore.REMOVE_SAMPLE, sample);
      });
    },
    [sampleStore.UPLOAD_FILE_AS_SAMPLE]: (context, file) => {
      // todo check if new path does not exist in db/storage?
      // todo move all these create-sample-from-whatever functions to ts
      const sample = {
        name: file.name,
        size: file.size,
        state: SampleState.UPLOADING,
        uploadProgress: 0,
      };
      context.commit(sampleStore.ADD_SAMPLE, sample);

      const { userId } = context.rootState.user;
      const storagePath = `${firebasePath.storage.SAMPLES}/${userId}`;

      uploadToStorage(file, storagePath, progress => {
        context.commit(sampleStore.SET_UPLOAD_PROGRESS, { sample, progress });
      }).then(() => {
        context.commit(sampleStore.SET_SAMPLE_STATE, {
          sample,
          sampleState: SampleState.WAITING_FOR_DB_ENTRY,
        });

        // todo move some of below stuff to util ts file?
        const samplesRef = firebaseInstance.firestore.collection(
          firebasePath.firestore.collection.SAMPLES,
        );
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
