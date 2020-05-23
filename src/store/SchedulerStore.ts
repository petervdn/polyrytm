import { observable, action } from 'mobx';
import AbstractStore from './AbstractStore';
import { DiscData } from '../data/interfaces';

export default class SchedulerStore extends AbstractStore {
  @action.bound setSelection(value: Selection) {
    // this.selection = value;
  }
}

/*
playTime: number;
  currentRevolution: number;
  currentRevolutionFactor: number;
  secondsPerRevolution: number; // todo should this be in here? (also in scheduler)
  currentRevolutionRadians: number;
  currentRevolutionDegrees: number;
 */
