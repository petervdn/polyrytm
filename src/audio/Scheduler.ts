import SamplePlayer, { SamplePlayerEvent } from './SamplePlayer';
import EventDispatcher from './EventDispatcher';
import { PI2 } from '../util/miscUtils';

import { audioContext } from '../util/soundUtils';
import { schedulerStore } from '../store/module/scheduler/scheduler';
import { discStore } from '../store/module/disc/disc';
import { IRing, IRingItem, IDisc } from '../data/interface';
import AnimationFrame from '../util/AnimationFrame';

export const SchedulerEvent = {
  SCHEDULER_START: 'start',
  SCHEDULER_STOP: 'stop',
};

export default class Scheduler extends EventDispatcher {
  public secondsPerRevolution = 0.1;
  public discs: Array<IDisc> = [];
  public samplePlayer = new SamplePlayer();
  public timeData: ITimeData;
  public lookAheadTime = 0.4;
  public scheduleInterval = 0.3;

  private startTime = -1;
  private scheduleIntervalId: number;
  private timeDataUpdater: AnimationFrame;

  constructor() {
    super();

    this.timeDataUpdater = new AnimationFrame(() => {
      this.updateTimeData();
    });

    this.resetTimeData();
  }

  public start(): void {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // set time that we started
    this.startTime = audioContext.currentTime;

    // start scheduling (and do a schedule)
    this.scheduleIntervalId = window.setInterval(
      this.schedule.bind(this),
      this.scheduleInterval * 1000,
    );
    this.schedule();

    // start updating timedata on every frame
    this.timeDataUpdater.start();

    this.dispatchEvent(SchedulerEvent.SCHEDULER_START);
  }

  public stop(): void {
    // stop every sample that is currently playing
    this.samplePlayer.playingSamples.forEach(playingSample => {
      if (playingSample.bufferSource['isFinished'] !== true) {
        playingSample.bufferSource.stop(0);
      }
    });

    // top schedule intervals
    clearInterval(this.scheduleIntervalId);

    // stop updating timedata
    this.timeDataUpdater.stop();

    this.resetTimeData();

    this.dispatchEvent(SchedulerEvent.SCHEDULER_STOP);
  }

  public schedule(): void {
    // console.time('schedule');
    this.updateTimeData(); // todo hmm, is this necessary? why is timedata used for scheduling

    const numberOfDiscs = this.discs.length;
    for (let d = 0; d < numberOfDiscs; d += 1) {
      const numberOfRings = this.discs[d].rings.length;
      for (let r = 0; r < numberOfRings; r += 1) {
        const scheduleDataList = this.getScheduleDataListForRing(
          this.discs[d],
          this.discs[d].rings[r],
          this.timeData.playTime,
          this.timeData.currentRevolution,
          this.timeData.secondsPerRevolution,
        );

        scheduleDataList.forEach(data => this.samplePlayer.scheduleRingItem(data));
      }
    }
    // console.timeEnd('schedule');

    /*
		PC:
		8 lege ringen: 0.10 - 0.15 (heel soms naar 1.0)
		8 ringen, allemaal 1 slice: 2 - 8 (soms naar 12)
		 */
  }

  private resetTimeData(): void {
    this.timeData = {
      playTime: -1,
      currentRevolution: -1,
      currentRevolutionFactor: 0,
      currentRevolutionRadians: 0,
      secondsPerRevolution: this.secondsPerRevolution,
      currentRevolutionDegrees: 0,
    };
  }

  private updateTimeData(): void {
    const playTime = audioContext.currentTime - this.startTime;
    const currentRevolution = Math.floor(playTime / this.secondsPerRevolution);
    const currentRevolutionFactor = (playTime / this.secondsPerRevolution) % 1;
    const currentRevolutionRadians = currentRevolutionFactor * PI2;

    this.timeData = {
      playTime,
      currentRevolution,
      currentRevolutionFactor,
      currentRevolutionRadians,
      secondsPerRevolution: this.secondsPerRevolution,
      currentRevolutionDegrees: (currentRevolutionRadians * 180) / Math.PI,
    };
  }

  public getScheduleDataListForRing(
    disc: IDisc,
    ring: IRing,
    playTime: number,
    currentRevolution: number,
    secondsPerRevolution: number,
  ): IRingItemScheduleData[] {
    const timePerItem = secondsPerRevolution / ring.items.length;
    const results: IRingItemScheduleData[] = [];

    let ringItemIndexIterator = 0;

    // todo add explanation about 100
    while (ringItemIndexIterator < 100) {
      const ringItem = ring.items[ringItemIndexIterator % ring.items.length];
      const itemRevolution =
        currentRevolution + Math.floor(ringItemIndexIterator / ring.items.length);
      const itemTime = itemRevolution * secondsPerRevolution + timePerItem * ringItem.index;
      const futureBoundary = playTime + this.lookAheadTime;

      if (itemTime > futureBoundary) {
        // we're too far ahead, stop looking
        // (items are chronologically, so everything after this will also be too far in th future)
        break;
      } else if (
        itemTime >= playTime &&
        itemTime < futureBoundary &&
        ringItem.lastScheduledRevolution < itemRevolution
      ) {
        // item falls between playtime and lookahead time
        // (and hasnt been scheduled for that revolution)
        results.push({
          disc,
          ring,
          ringItem,
          secondsPerRevolution,
          revolution: itemRevolution,
          startTime: itemTime + this.startTime,
        });
      }

      ringItemIndexIterator += 1;
    }

    return results;
  }
}
export interface ITimeData {
  playTime: number;
  currentRevolution: number;
  currentRevolutionFactor: number;
  secondsPerRevolution: number; // todo should this be in here? (also in scheduler)
  currentRevolutionRadians: number;
  currentRevolutionDegrees: number;
}

export interface IRingItemScheduleData {
  disc: IDisc;
  ring: IRing;
  ringItem: IRingItem;
  secondsPerRevolution: number;
  revolution: number;
  startTime: number;
}

export const setupSchedulerStoreCommunication = (scheduler: Scheduler, store): void => {
  // listen to play-state changes from scheduler
  scheduler.addEventListener(SchedulerEvent.SCHEDULER_START, () => {
    store.commit(schedulerStore.mutations.setIsPlaying, true);
  });
  scheduler.addEventListener(SchedulerEvent.SCHEDULER_STOP, () => {
    store.commit(schedulerStore.mutations.setIsPlaying, false);
    store.commit(discStore.RESET_SCHEDULED_REVOLUTION_VALUES);
  });

  // discs change
  store.watch(
    state => state.disc.discs,
    newDiscs => {
      scheduler.discs = newDiscs;
    },
  );

  // secs/rev init and change
  scheduler.secondsPerRevolution = store.state.scheduler.secondsPerRevolution;
  store.watch(
    state => state.scheduler.secondsPerRevolution,
    newValue => {
      scheduler.secondsPerRevolution = newValue;
    },
  );

  scheduler.samplePlayer.addEventListener(
    SamplePlayerEvent.UPDATE_LAST_SCHEDULED_REVOLUTION,
    event => {
      store.commit(discStore.UPDATE, {
        // todo rename mutations.update?
        target: event.data.ringItem,
        source: {
          lastScheduledRevolution: event.data.value,
        },
      });
    },
  );
};
