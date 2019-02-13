import EventDispatcher from './EventDispatcher';
import { getRandomItemFromArray, removeFromArray } from '../util/miscUtils';
import { audioContext } from '../util/soundUtils';
import { IRingItemScheduleData } from './Scheduler';
import { IDisc, ISoundSlice } from '../data/interface';
import { getSliceDurationFactor } from '../util/discUtils';

export default class SamplePlayer extends EventDispatcher {
  public playingSamples: IPlayingSampleData[] = [];

  constructor() {
    super();
  }

  scheduleRingItem(scheduleData: IRingItemScheduleData): void {
    if (scheduleData.ring.slices.length === 0) {
      // nothing to schedule
      return;
    }

    // const sound = scheduleData.disc.sound;
    const sound = scheduleData.disc.sounds[0]; // todo just temporary
    const randomSlice: ISoundSlice = getRandomItemFromArray(scheduleData.ring.slices);

    if (sound.sample) {
      const sliceStartFactor: number = randomSlice.startFactor;
      const sliceStart: number = sound.sample.audioBuffer.duration * sliceStartFactor;
      const sliceDurationFactor: number = getSliceDurationFactor(randomSlice);
      const sliceDuration = sliceDurationFactor * sound.sample.audioBuffer.duration;

      // schedule the sample
      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = sound.sample.audioBuffer;
      bufferSource.start(scheduleData.startTime, sliceStart, sliceDuration);

      const gain = audioContext.createGain(); // todo move gain to ringitem, so we make it once (check time)
      gain.gain.value = scheduleData.ringItem.volume;

      bufferSource.connect(gain);
      gain.connect(scheduleData.ring.gain);

      // todo clean this up, lots of stuff just thrown in because we need it
      const playingSample: IPlayingSampleData = {
        bufferSource,
        sliceStartFactor,
        sliceDurationFactor,
        startTime: scheduleData.startTime,
        offset: sliceStart,
        duration: sliceDuration,
        secondsPerRevolution: scheduleData.secondsPerRevolution,
        disc: scheduleData.disc,
      };
      this.playingSamples.push(playingSample);

      bufferSource.onended = () => {
        removeFromArray(playingSample, this.playingSamples);
      };
    } else {
      throw new Error(`No sample, cannot schedule`);
    }

    // mark as being scheduled for this revolution (so it wont be scheduled again)
    this.dispatchEvent(SamplePlayerEvent.UPDATE_LAST_SCHEDULED_REVOLUTION, {
      ringItem: scheduleData.ringItem,
      value: scheduleData.revolution,
    });
  }
}

interface IPlayingSampleData {
  bufferSource: AudioBufferSourceNode;
  sliceStartFactor: number;
  sliceDurationFactor: number;
  startTime: number;
  offset: number;
  duration: number;
  secondsPerRevolution: number;
  disc: IDisc;
}

export const SamplePlayerEvent = {
  UPDATE_LAST_SCHEDULED_REVOLUTION: 'update-last-scheduled-revolution',
};
