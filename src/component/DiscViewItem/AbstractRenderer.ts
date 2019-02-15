import { IDisc, ISizeData, IStore } from '../../data/interface';
import { createCanvas } from '../../util/DiscViewUtils';
import EventDispatcher from '../../audio/EventDispatcher';
import Scheduler from '../../audio/Scheduler';
import { getRasterPattern } from '../../display/canvasRendererDrawUtils';

/**
 * Is extended by both WaveformRenderer and RingsRenderer
 */
export default class AbstractRenderer extends EventDispatcher {
  public canvas: HTMLCanvasElement;

  protected sizeData: ISizeData;
  protected context: CanvasRenderingContext2D;
  protected disc: IDisc;
  protected store: IStore;
  protected scheduler: Scheduler;
  protected storeWatchDestructors: (() => void)[] = [];
  protected rasterPattern: CanvasPattern; // todo this is now created twice (waveform/rings-renderer)

  constructor(disc: IDisc, sizeData: ISizeData, store: IStore, scheduler: Scheduler) {
    super();
    this.disc = disc;
    this.sizeData = sizeData;
    this.store = store;
    this.scheduler = scheduler;

    this.canvas = createCanvas(this.sizeData.squareSize, this.sizeData.squareSize, {
      position: 'absolute',
      left: 0,
      top: 0,
    });

    this.context = this.canvas.getContext('2d');
    getRasterPattern().then(pattern => {
      // watch out: this is a async callback, even though the pattern is inline base64
      // so in constructor this is not yet available
      this.rasterPattern = pattern;
    });
  }

  public resize(sizeData: ISizeData): void {
    this.sizeData = sizeData;
    this.canvas.width = sizeData.squareSize;
    this.canvas.height = sizeData.squareSize;
  }

  public clear() {
    this.context.clearRect(0, 0, this.sizeData.squareSize, this.sizeData.squareSize);
  }

  public destruct() {
    this.storeWatchDestructors.forEach(destructor => destructor()); // todo check if this works
    this.canvas = null;
    this.sizeData = null;
    this.context = null;
    this.disc = null;

    super.destruct();
  }
}
