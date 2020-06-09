import * as firebase from 'firebase/app';
import AbstractStore from './AbstractStore';
import { action, observable } from 'mobx';
import { loadAudioBuffer } from '../util/audioUtils';
import { audioContext } from '../audio/audioContext';

export default class SampleStore extends AbstractStore {
  @observable samples: Record<string, AudioBuffer> = {};

  @action.bound getSample(fullPath: string) {
    return new Promise((resolve) => {
      if (this.samples[fullPath]) {
        resolve(this.samples[fullPath]);
      } else {
        const storageRef = firebase.storage().ref();
        storageRef
          .child(fullPath)
          .getDownloadURL()
          .then((downloadUrl) => {
            console.log(downloadUrl);
            return loadAudioBuffer(downloadUrl, audioContext);
          })
          .then((result) => {
            console.log('done', result);
            // this.samples[fullPath] = result.audioBuffer;
            // return result.audioBuffer;
          })
          .catch(console.log);
      }
    });
  }
}
