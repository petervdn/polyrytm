import { observable, action, computed } from 'mobx';
import AbstractStore from './AbstractStore';
import { DiscData } from '../data/interfaces';

type Selectable =
  | {
      discIndex: number;
    }
  | {
      discIndex: number;
      ringIndex: number;
    }
  | {
      discIndex: number;
      ringIndex: number;
      ringItemIndex: number;
    };

export default class InteractionStore extends AbstractStore {
  @observable selected: Selectable | undefined; // rename -> selection
  @observable hovered: Selectable | undefined; // rename -> ....something

  @action.bound setHoverAsSelected() {
    this.selected = this.hovered;
  }

  @action.bound setHovered(value: Selectable | undefined) {
    this.hovered = value;
  }

  @computed get selectedDisc(): DiscData | undefined {
    return this.selected ? this.rootStore.discStore.discs[this.selected.discIndex] : undefined;
  }
}
