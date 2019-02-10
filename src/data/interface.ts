import { ITheme } from './themes';

export interface ISize {
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IBasicRingItem extends IInteractable {
  ring: IRing;
  volume: number;
  index: number;
}
// todo explain these two
export interface IRingItem extends IBasicRingItem {
  lastScheduledRevolution: number;
}

export interface IInteractable {
  type: InteractableType;
}

export interface IRing extends IInteractable {
  disc: IDisc;
  items: IRingItem[];
  slices: ISoundSlice[];
  gain: GainNode;
}

export interface IDisc extends IInteractable {
  rings: IRing[];
  sound: IDiscSound; // todo why single en multiple? probably remove single one
  sounds: IDiscSound[];
}

export interface IDiscSound {
  sample: ISample;
  slices: ISoundSlice[];
}

// todo rename discsoundslice?
export interface ISoundSlice extends IInteractable {
  disc: IDisc;
  startFactor: number;
  nextSlice: ISoundSlice; // ref to the next slice (null on last)
}

// todo describe each
export interface ISizeData {
  size: ISize;
  squareSize: number;
  squareSizeLeftTop: IPoint;
  halfSquareSize: number;
  center: IPoint;
  rotateOffset: number;
  outerMargin: ISizeDataEntry;
  waveformOuterRadius: ISizeDataEntry;
  waveformSize: ISizeDataEntry;
  waveformInnerRadius: ISizeDataEntry;
  ringsOuterMargin: ISizeDataEntry;
  ringsOuterRadius: ISizeDataEntry;
  ringSize: ISizeDataEntry;
}

interface ISizeDataEntry {
  pixels: number;
  factor: number;
}

export enum InteractableType { // todo rename without type?
  DISC = 'disc', // these should match the props of IInteractionData
  RING = 'ring',
  RING_ITEM = 'ringItem',
  SLICE = 'slice',
}

export interface IStore {
  state: IStoreState;
  getters: { [key: string]: any };
  commit: (type: string, data?: any) => void;
  dispatch: (type: string, data?: any) => void; // todo returns promise
  watch: (
    state: (state: IStoreState, getters?: any) => any,
    handler: (newValue: any, oldValue?: any) => void,
    options?: IStoreWatchOptions,
  ) => () => void;
}

interface IStoreState {
  interaction: IInteractionStoreState;
  app: IAppStoreState;
  disc: IDiscStoreState;
}

interface IStoreWatchOptions {
  immediate?: boolean;
  deep?: boolean;
}

export interface IInteractionStoreState {
  selection: IInteractable;
  highlight: IInteractable;
  edit: IInteractable;
  forceHint: string;
}

export interface IDiscStoreState {
  discs: IDisc[];
}
export interface IAppStoreState {
  playMode: string;
  activeTheme: ITheme;
  themes: ITheme[];
  isPlaying: boolean;
  secondsPerRevolution: number;
}

// export interface INotification {
//   title?: string;
//   message?: string;
//   okButton?: string;
//   cancelButton?: string;
//   progress?: number;
// }
export interface ISampleInDatabase {
  name: string;
  path: string;
  size: number;
}

export interface ISample extends ISampleInDatabase {
  state?: string; // SampleState
  uploadProgress: number;
  audioBuffer?: AudioBuffer;
  normalizeFactor: number; // set after loading, so we can always draw the best looking wave
}
