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
  @observable selected: Selectable | undefined;
  @observable hovered: Selectable | undefined;

  @action.bound setSelected(value: Selectable) {
    this.selected = value;
    console.log(this.selected);
  }

  @action.bound setHovered(value: Selectable) {
    this.hovered = value;
  }
}
