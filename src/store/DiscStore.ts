import { observable, action } from 'mobx';

import AbstractStore from './AbstractStore';
import { DiscData } from '../data/interfaces';

import { createRandomDisc } from '../util/discUtils';

export default class DiscStore extends AbstractStore {
  @observable discs: DiscData[] = [];

  @action.bound addDisc() {
    this.discs = [...this.discs, createRandomDisc()];
  }
}
