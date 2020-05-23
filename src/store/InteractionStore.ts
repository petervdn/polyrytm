import { observable, action } from 'mobx';
import AbstractStore from './AbstractStore';
import { DiscData } from '../data/interfaces';

type Selection = DiscData | undefined;

export default class InteractionStore extends AbstractStore {
  @observable selection: Selection;

  @action.bound setSelection(value: Selection) {
    this.selection = value;
  }
}
