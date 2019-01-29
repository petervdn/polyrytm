// import { PlayMode } from "./enum/PlayMode";

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
  sound: IDiscSound;
  sounds: IDiscSound[];
}

export interface IDiscSound {
  // todo rename to sound?
  sample: ISample;
  slices: ISoundSlice[];
}

export interface ISoundSlice extends IInteractable {
  disc: IDisc;
  startFactor: number;
  nextSlice: ISoundSlice; // ref to the next slice (null on last)
}

export interface ISample {
  name: string;
  uri: string;
  audioBuffer?: AudioBuffer;
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
  scheduler: ISchedulerStoreState;
  app: IAppStoreState;
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

export interface ISchedulerStoreState {
  isPlaying: boolean;
}

export interface IAppStoreState {
  playMode: string;
  activeTheme: ITheme;
  themes: ITheme[];
}

export interface INotification {
  title?: string;
  message?: string;
  okButton?: string;
  cancelButton?: string;
  progress?: number;
}
