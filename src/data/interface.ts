import { ITheme } from './themes';

export interface ISize {
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IRingItem {
  type: InteractableType.RING_ITEM;
  ring: IRing;
  volume: number;
  index: number;
  lastScheduledRevolution: number;
}

export type Interactable = IRing | IRingItem | IDisc | IDiscSound | ISoundSlice;

export interface IRing {
  type: InteractableType.RING;
  disc: IDisc;
  items: IRingItem[];
  slices: ISoundSlice[];
  gain: GainNode;
}

export interface IDisc {
  type: InteractableType.DISC;
  rings: IRing[];
  sounds: IDiscSound[];
}

export interface IDiscSound {
  type: InteractableType.DISC_SOUND;
  sample: ISample;
  slices: ISoundSlice[];
  disc: IDisc;
}

// todo rename discsoundslice?
export interface ISoundSlice {
  type: InteractableType.SLICE;
  discSound: IDiscSound;
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
  RING_ITEM = 'ring-item',
  SLICE = 'slice',
  DISC_SOUND = 'disc-sound',
}

export interface IStore {
  state: IStoreState;
  getters: { [key: string]: any };
  commit: (type: string, data?: any) => void;
  dispatch: (type: string, data?: any) => Promise<any>;
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

// export type Interactable = IDiscSound | IDisc | IRing | ISoundSlice;

export interface IInteractionStoreState {
  selection: Interactable;
  highlight: Interactable;
  edit: Interactable;
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
