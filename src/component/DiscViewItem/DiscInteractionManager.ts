import {
  getDistanceToCenterFactorForPoint,
  getMousePositionByMouseEvent,
  getRingIndexForPosition,
  getRingItemIndexForPosition,
  getSliceForPosition,
} from '../../util/interactionUtils';
import {
  IDisc,
  IInteractable,
  InteractableType,
  IPoint,
  IRingItem,
  ISizeData,
  IStore,
} from '../../data/interface';
import EventDispatcher from '../../audio/EventDispatcher';
import { interactionStore } from '../../store/module/interaction/interaction';
import { discStore } from '../../store/module/disc/disc';
import { ValueDragger } from '../../util/DiscViewUtils';
import { GlobalEvent, globalEventBus } from '../../data/globalEvents';

export default class DiscInteractionManager extends EventDispatcher {
  private element: HTMLElement;
  private mousePosition: IPoint = null;
  private sizeData: ISizeData;
  private disc: IDisc;
  private store: IStore;
  private mouseDownData: IMouseDownData;
  private isDraggingAValue = false;

  constructor(element: HTMLElement, sizeData: ISizeData, disc: IDisc, store: IStore) {
    super();

    this.element = element;
    this.sizeData = sizeData;
    this.disc = disc;
    this.store = store;

    this.element.addEventListener('mousemove', this.onMouseMove);
    this.element.addEventListener('mouseleave', this.onMouseLeave);
    this.element.addEventListener('mouseup', this.onMouseUp); // mouseup instead of click, so we can both drag and click todo what??
    this.element.addEventListener('mousedown', this.onMouseDown);
  }

  public setDisc(disc: IDisc): void {
    this.disc = disc;
    this.updateHighlight();
  }

  public resize(sizeData: ISizeData): void {
    this.sizeData = sizeData;
  }

  // todo what does this do exactly -> add description (probably rename into something like: find highlight for position)
  private updateHighlight(): void {
    if (this.isDraggingAValue) {
      return;
    }

    const distanceToCenterFactor = getDistanceToCenterFactorForPoint(
      this.mousePosition,
      this.sizeData,
    );

    if (!this.store.state.interaction.selection) {
      // nothing selected => overview todo does this also trigger when outside disc?
      this.setHighlight(this.disc);
    } else if (distanceToCenterFactor > this.sizeData.waveformOuterRadius.factor) {
      // outside waveform
      this.setHighlight(this.disc);
    } else if (distanceToCenterFactor > this.sizeData.waveformInnerRadius.factor) {
      // inside waveform, only set data when there is actually a sample
      if (this.disc.sound.sample) {
        const slice = getSliceForPosition(
          this.mousePosition,
          this.sizeData,
          this.disc.sound.slices,
        );
        this.setHighlight(slice);
      } else {
        this.setHighlight(this.disc);
      }
    } else if (distanceToCenterFactor < this.sizeData.ringsOuterRadius.factor) {
      // inside rings
      const mouseOverRingIndex = getRingIndexForPosition(this.mousePosition, this.sizeData);

      if (mouseOverRingIndex >= this.disc.rings.length) {
        // too far inside existing rings range (near inner radius)
        this.setHighlight(this.disc);
      } else {
        // we're hovering over rings area, things can change depending on a selected ring
        const selectedRing = this.store.getters[interactionStore.GET_SELECTED_RING];

        if (selectedRing && selectedRing.disc === this.disc) {
          // ring selected in this disc, highlight ring-items
          const mouseOverRingItemIndex = getRingItemIndexForPosition(
            this.mousePosition,
            this.disc.rings.indexOf(selectedRing),
            this.disc,
            this.sizeData,
          );

          if (mouseOverRingItemIndex === -1) {
            this.setHighlight(this.disc);
          } else {
            this.setHighlight(this.disc.rings[mouseOverRingIndex].items[mouseOverRingItemIndex]);
          }
        } else {
          // either no ring selected OR selected ring is in another disc => highlight ring
          this.setHighlight(this.disc.rings[mouseOverRingIndex]);
        }
      }
    } else {
      // all other cases (between waveform and rings, or over waveform when there is no sample)
      this.setHighlight(this.disc);
    }
  }

  private setHighlight(item: IInteractable): void {
    // only commit when changed (prevents commits on every mousemove)
    if (this.store.state.interaction.highlight !== item) {
      this.store.commit(interactionStore.SET_HIGHLIGHT, item);
    }
  }

  onMouseMove = (event: MouseEvent) => {
    if (this.mouseDownData) {
      // only after a mousedown
      this.mouseDownData.mouseMoved = true;
    }

    this.mousePosition = getMousePositionByMouseEvent(event);
    this.updateHighlight();
  };

  onMouseLeave = () => {
    this.setHighlight(null);
  };

  onMouseDown = event => {
    this.mouseDownData = getMouseDownData(event);
    const highlight = this.store.state.interaction.highlight;

    if (highlight && highlight.type === InteractableType.RING_ITEM) {
      // prevents highlights from updating
      this.isDraggingAValue = true; // todo this should probably change, way too specific
      // todo fix mouse leaving window while dragging
      new ValueDragger(
        (<IRingItem>highlight).volume,
        0,
        1,
        0.005,
        event,
        volume => {
          // clear the highlight when dragging
          if (this.store.state.interaction.highlight) {
            this.store.commit(interactionStore.SET_HIGHLIGHT, null);
          }

          this.store.commit(discStore.SET_RING_ITEM_VOLUME, {
            volume,
            ringItem: highlight,
          });
          globalEventBus.$emit(GlobalEvent.RING_ITEM_VOLUME_CHANGE_BY_DRAGGING, highlight);
        },
        () => {
          globalEventBus.$emit(GlobalEvent.RING_ITEM_VOLUME_CHANGE, highlight);
          this.isDraggingAValue = false;
        },
      );
    }
  };

  onMouseUp = () => {
    this.isDraggingAValue = false; // just to be sure

    if (!isClick(this.mouseDownData)) {
      // is mouse-up after dragging, dont treat as a click
      return;
    }
    const highlight = this.store.state.interaction.highlight;
    const selection = this.store.state.interaction.selection;

    if (!highlight) {
      return;
    }

    switch (highlight.type) {
      case InteractableType.DISC: {
        // todo when is this exactly
        this.store.commit(interactionStore.SET_HIGHLIGHT_AS_SELECTION);
        break;
      }
      case InteractableType.RING: {
        this.store.commit(interactionStore.SET_HIGHLIGHT_AS_SELECTION);
        break;
      }
      case InteractableType.RING_ITEM: {
        this.store.commit(discStore.SET_RING_ITEM_VOLUME, {
          volume: (<IRingItem>highlight).volume > 0 ? 0 : 1,
          ringItem: highlight,
        });

        globalEventBus.$emit(GlobalEvent.RING_ITEM_VOLUME_CHANGE, highlight);
        break;
      }
      case InteractableType.SLICE: {
        if (selection) {
          if (selection.type === InteractableType.DISC) {
            // playing aslice in disc-view => play sample todo
          } else if (selection.type === InteractableType.RING) {
            // clicking on a slice when a ring is selected => toggle slice in ring
            this.store.commit(discStore.TOGGLE_SLICE_IN_RING, {
              ring: selection,
              slice: highlight,
            });
          }
        } else {
          // nothing selected, overview of discs
        }

        break;
      }
      default: {
        throw new Error(`'Unknown highlight type ${highlight}`);
      }
    }

    this.updateHighlight();
  };

  destruct() {
    this.sizeData = null;

    this.element.removeEventListener('mousemove', this.onMouseMove);
    this.element.removeEventListener('mouseleave', this.onMouseLeave);
    this.element.removeEventListener('onmouseup', this.onMouseUp);
    this.element.removeEventListener('onmousedown', this.onMouseDown);

    super.destruct();
  }
}

function isClick(mouseDownData: IMouseDownData): boolean {
  // todo apparently, mouseDwonData can be null. fixxxxx het
  // this happens when starting a drag from outside into this element and then release
  return !mouseDownData.mouseMoved || Date.now() - mouseDownData.time < 100;
}

function getMouseDownData(event: MouseEvent): IMouseDownData {
  return {
    position: {
      x: event.pageX,
      y: event.pageY,
    },
    time: Date.now(),
    mouseMoved: false,
  };
}

interface IMouseDownData {
  position: IPoint;
  time: number;
  mouseMoved: boolean;
}
