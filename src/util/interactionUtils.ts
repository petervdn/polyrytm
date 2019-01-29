import { PI2 } from './miscUtils';
import {
  IDisc,
  IInteractionStoreState,
  InteractableType,
  IPoint,
  ISizeData,
  ISoundSlice,
  IStore,
} from '../data/interface';
import { interactionStore } from '../store/module/interaction/interaction';
import { getSliceForFactor } from './discUtils';

/**
 * Calcualtes distance for two points.
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/**
 * Returns ringIndex for a given position
 * todo: pass disc as well, so it can check rings range itself?
 * @param {IPoint} position
 * @param {ISizeData} sizeData
 * @returns {number}
 */
export function getRingIndexForPosition(position: IPoint, sizeData: ISizeData): number {
  const distanceToCenter = distance(
    position.x,
    position.y,
    sizeData.halfSquareSize,
    sizeData.halfSquareSize,
  );
  const distanceToOuterRing = sizeData.ringsOuterRadius.pixels - distanceToCenter;

  return Math.floor(distanceToOuterRing / sizeData.ringSize.pixels);
}

/**
 * Returns the distance as factor (0-1) for a given point with relation to the center.
 * @param {IPoint} point
 * @param {ISizeData} sizeData
 * @returns {number}
 */
export function getDistanceToCenterFactorForPoint(point: IPoint, sizeData: ISizeData): number {
  return (
    distance(point.x, point.y, sizeData.halfSquareSize, sizeData.halfSquareSize) /
    sizeData.halfSquareSize
  );
}

/**
 * Returns radians for a given offset.
 * @param {number} x
 * @param {number} y
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radiansOffset
 * @returns {number}
 */
function getRadiansForPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiansOffset: number,
): number {
  const dx = x - centerX;
  const dy = y - centerY;
  let radians = Math.atan2(dy, dx) - radiansOffset; // todo this should be +offset ?!?
  if (radians < 0) {
    radians = Math.PI + (Math.PI - Math.abs(radians));
  }

  return radians;
}

/**
 * Returns the ringItem index for a given position.
 * @param {IPoint} position
 * @param {number} ringIndex
 * @param {IDisc} disc
 * @param {ISizeData} sizeData
 * @returns {number}
 */
export function getRingItemIndexForPosition(
  position: IPoint,
  ringIndex: number,
  disc: IDisc,
  sizeData: ISizeData,
): number {
  const distanceToCenter = distance(
    position.x,
    position.y,
    sizeData.halfSquareSize,
    sizeData.halfSquareSize,
  );

  const outerRadius = sizeData.ringsOuterRadius.pixels - ringIndex * sizeData.ringSize.pixels;
  const innerRadius = outerRadius - sizeData.ringSize.pixels;

  if (distanceToCenter < innerRadius || distanceToCenter > outerRadius) {
    // not in ring bounds
    return -1;
  }

  const radians = getRadiansForPosition(
    position.x,
    position.y,
    sizeData.halfSquareSize,
    sizeData.halfSquareSize,
    sizeData.rotateOffset,
  );
  const itemRadians = (Math.PI * 2) / disc.rings[ringIndex].items.length;

  return Math.floor(radians / itemRadians);
}

/**
 * Converts a mouse-event into a mouse-position.
 * Todo: this can maybe be more efficient if getBoundingClientRect can be given as well
 * @param {MouseEvent} event
 * @returns {IPoint}
 */
export function getMousePositionByMouseEvent(event: MouseEvent): IPoint {
  const rect = (<HTMLElement>event.target).getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Returns the soundslice-index for a given position.
 * @param {IPoint} position
 * @param {ISizeData} sizeData
 * @param {number[]} slices
 * @returns {number}
 */
export function getSliceForPosition(
  position: IPoint,
  sizeData: ISizeData,
  slices: ISoundSlice[],
): ISoundSlice {
  const radiansFactor =
    getRadiansForPosition(
      position.x,
      position.y,
      sizeData.halfSquareSize,
      sizeData.halfSquareSize,
      sizeData.rotateOffset,
    ) / PI2;

  return getSliceForFactor(slices, radiansFactor);
}

export function getHint(state: IInteractionStoreState): string {
  const highlight = state.highlight;
  const selection = state.selection;
  const nothingOrDiscHighlighted = !highlight || highlight.type === InteractableType.DISC;

  if (state.forceHint) {
    // forced hints always override everything else (usually from hovering over htm elements)
    return state.forceHint;
  }

  if (selection) {
    switch (state.selection.type) {
      case InteractableType.DISC: {
        if (nothingOrDiscHighlighted) {
          return null;
        }

        switch (highlight.type) {
          case InteractableType.RING: {
            return 'click to select ring';
          }
          case InteractableType.RING_ITEM: {
            return 'disc selected, hover ring-item ** NOT POSSIBLE';
          }
          case InteractableType.SLICE: {
            return 'click to preview sample-slice';
          }
          default: {
            return 'disc selected, default??';
          }
        }
      }
      case InteractableType.RING: {
        if (nothingOrDiscHighlighted) {
          // todo add text if no sound in ring
          return 'drag on a ring-item to change volume, click a sample-slice to add to ring';
        }

        switch (highlight.type) {
          case InteractableType.RING: {
            return 'ring selected, hover ring ** NOT POSSIBLE';
          }
          case InteractableType.RING_ITEM: {
            return 'click and drag up/down to change volume';
          }
          case InteractableType.SLICE: {
            return 'click to add this slice to the selected ring';
          }
          default: {
            return 'ring selected, default??';
          }
        }
      }
      case InteractableType.RING_ITEM: {
        // todo
        return 'ringitem';
      }
      case InteractableType.SLICE: {
        // todo
        return 'slice';
      }
    }
  } else {
    // no selection, currently not possible (will be for overview of all discs)
  }
}

export function attachHintToElement(element: HTMLElement, hint: string, store: IStore): () => void {
  // todo set as custom directive
  // todo get store here instead of passing as arg every time
  const mouseEnter = event => {
    store.commit(interactionStore.mutations.setForceHint, hint || '&nbsp;');
    event.stopImmediatePropagation(); // todo check is this necessary?
  };
  const mouseLeave = event => {
    store.commit(interactionStore.mutations.setForceHint, null);
    event.stopImmediatePropagation();
  };

  element.addEventListener('mouseover', mouseEnter);
  element.addEventListener('mouseout', mouseLeave);

  // return destructor
  return () => {
    element.removeEventListener('mouseover', mouseEnter);
    element.removeEventListener('mouseout', mouseLeave);
  };
}
