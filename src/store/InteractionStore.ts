import { observable, action } from 'mobx';
import AbstractStore from './AbstractStore';

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
}
