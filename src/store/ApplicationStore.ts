import { observable, action, computed } from 'mobx';
import { audioContext } from '../audio/audioContext';
import AbstractStore from './AbstractStore';
import { TimeData } from '../data/interfaces';
import { PI2 } from '../util/miscUtils';
import AnimationFrame from '../util/AnimationFrame';

const NOT_PLAYING_CONTEXT_TIME = -1;
const initialTimeData: TimeData = {
  currentRevolution: 0,
  currentRevolutionDegrees: 0,
  currentRevolutionFactor: 0,
  currentRevolutionRadians: 0,
  playTime: 0,
};
export default class ApplicationStore extends AbstractStore {
  @observable contextTimeAtPlayStart = NOT_PLAYING_CONTEXT_TIME;
  @observable secondsPerRevolution = 2;
  @observable timeData: TimeData = initialTimeData;

  private frame = new AnimationFrame(this.updateTimeData);

  @computed get isPlaying() {
    return this.contextTimeAtPlayStart !== NOT_PLAYING_CONTEXT_TIME;
  }

  @action.bound start() {
    if (this.isPlaying) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    this.contextTimeAtPlayStart = audioContext.currentTime;

    this.frame.start();
  }

  @action.bound updateTimeData(): void {
    const playTime = audioContext.currentTime - this.contextTimeAtPlayStart;
    const currentRevolution = Math.floor(playTime / this.secondsPerRevolution);
    const currentRevolutionFactor = (playTime / this.secondsPerRevolution) % 1;
    const currentRevolutionRadians = currentRevolutionFactor * PI2;

    this.timeData = {
      playTime,
      currentRevolution,
      currentRevolutionFactor,
      currentRevolutionRadians,
      currentRevolutionDegrees: (currentRevolutionRadians * 180) / Math.PI,
    };
  }

  @action.bound stop() {
    if (!this.isPlaying) return;

    this.contextTimeAtPlayStart = NOT_PLAYING_CONTEXT_TIME;
    this.timeData = initialTimeData;
    this.frame.stop();
  }
}
