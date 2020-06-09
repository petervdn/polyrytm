import * as firebase from 'firebase/app';
import AbstractStore from './AbstractStore';
import { action, observable } from 'mobx';
import { loadAudioBuffer } from '../util/audioUtils';
import { audioContext } from '../audio/audioContext';
import { Sample } from '../data/interfaces';

export default class SampleStore extends AbstractStore {
  @observable samples: Record<string, Sample> = {};

  @action.bound getSample(fullPath: string): Promise<Sample> {
    if (this.samples[fullPath]) {
      return Promise.resolve(this.samples[fullPath]);
    }

    return new Promise((resolve) => {
      const fileRef = firebase.storage().ref().child(fullPath);

      const sample: Sample = {
        fullPath,
        name: fileRef.name,
        audioBuffer: null,
        loadProgress: 0,
      };

      this.samples[fullPath] = sample;

      fileRef
        .getDownloadURL()
        .then((downloadUrl) => loadAudioBuffer(downloadUrl, audioContext))
        .then((audioBuffer) => {
          sample.audioBuffer = audioBuffer;
          resolve(sample);
        })
        .catch(console.log);
    });
  }
}
