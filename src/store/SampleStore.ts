import * as firebase from 'firebase/app';
import AbstractStore from './AbstractStore';
import { action, observable } from 'mobx';
import { loadAudioBuffer } from '../util/audioUtils';
import { audioContext } from '../audio/audioContext';
import { Sample } from '../data/interfaces';

export default class SampleStore extends AbstractStore {
  @observable samples: Record<string, Sample> = {}; // samples are stored by their fullPath

  @action.bound getSample(fullPath: string): Sample {
    if (!this.samples[fullPath]) {
      const fileRef = firebase.storage().ref().child(fullPath);
      const sample: Sample = observable.object({
        fullPath,
        name: fileRef.name,
        audioBuffer: null,
        loadProgress: -1,
      });

      const onProgress = (progress: number) => {
        sample.loadProgress = progress;
      };

      this.samples[fullPath] = sample;
      fileRef
        .getDownloadURL()
        .then((downloadUrl) => loadAudioBuffer(audioContext, downloadUrl, onProgress))
        .then(({ audioBuffer }) => {
          sample.audioBuffer = audioBuffer;
        })
        .catch(console.log);
    }

    return this.samples[fullPath];
  }
}
