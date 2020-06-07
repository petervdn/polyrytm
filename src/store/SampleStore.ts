import AbstractStore from './AbstractStore';
import { observable } from 'mobx';

type Sample = {
  fullPath: string;
  name: string;
  audioBuffer?: AudioBuffer;
};

export default class SampleStore extends AbstractStore {
  @observable samples: { user: Array<Sample>; public: Array<Sample> } = { public: [], user: [] };

  // @action.bound getSamples() {}
}
