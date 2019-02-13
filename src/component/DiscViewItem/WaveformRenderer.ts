import AbstractRenderer from './AbstractRenderer';
import {
  ISizeData,
  IDisc,
  IStore,
  InteractableType,
  IRing,
  IInteractable,
  ISoundSlice,
} from '../../data/interface';
import {
  drawWaveformCanvas,
  drawHighlightSlice,
  drawSliceEdgeMarkers,
} from '../../display/canvasRendererDrawUtils';
import { createCanvas } from '../../util/DiscViewUtils';
import { debounce, PI2 } from '../../util/miscUtils';
import Scheduler from '../../audio/Scheduler';
import { interactionStore } from '../../store/module/interaction/interaction';

export default class WaveformRenderer extends AbstractRenderer {
  // todo describe these
  private originalWaveformContext: CanvasRenderingContext2D;
  private resultingWaveformContext: CanvasRenderingContext2D;

  private debouncedUpdateWaveform = debounce(() => {
    // update the buffersizes here, since this is NOT immediately changed on resize (what you would expect)
    // because we keep the incorrect size then, and scale while resizing. we actually redraw on debounce
    this.originalWaveformContext.canvas.width = this.sizeData.squareSize;
    this.originalWaveformContext.canvas.height = this.sizeData.squareSize;

    this.resultingWaveformContext.canvas.width = this.sizeData.squareSize;
    this.resultingWaveformContext.canvas.height = this.sizeData.squareSize;

    this.updateAll();
  }, 500);

  constructor(disc: IDisc, sizeData: ISizeData, store: IStore, scheduler: Scheduler) {
    super(disc, sizeData, store, scheduler);

    this.originalWaveformContext = createCanvas(
      sizeData.squareSize,
      sizeData.squareSize,
    ).getContext('2d');

    this.resultingWaveformContext = createCanvas(
      sizeData.squareSize,
      sizeData.squareSize,
    ).getContext('2d');

    this.updateAll();

    // watch sounds with loaded audioBuffers
    this.storeWatchDestructors.push(
      this.store.watch(
        () => this.disc.sounds.filter(sound => !!sound.sample.audioBuffer).length,
        () => {
          this.updateAll();
        },
      ),
    );

    // watch slices todo watches unused sond property (now soundS)
    this.storeWatchDestructors.push(
      this.store.watch(
        () => this.disc.sound.slices,
        () => {
          this.draw();
        },
      ),
    );

    // watch highlighted slices changes
    this.storeWatchDestructors.push(
      this.store.watch(
        state => {
          if (
            state.interaction.highlight &&
            state.interaction.highlight.type === InteractableType.SLICE
          ) {
            return state.interaction.highlight;
          }
          return null;
        },
        () => {
          this.draw();
        },
      ),
    );

    // // watch slices for selected ring change (this also catches when a selected ring changes)
    this.storeWatchDestructors.push(
      this.store.watch(
        state => {
          const selection = state.interaction.selection;
          if (
            selection &&
            selection.type === InteractableType.RING &&
            (<IRing>selection).disc === this.disc
          ) {
            return (<IRing>selection).slices;
          }
          return null;
        },
        () => {
          this.updateResultWaveform();
          this.draw();
        },
      ),
    );
  }

  private updateAll(): void {
    this.updateWaveform();
    this.updateResultWaveform();
    this.draw();
  }

  public setDisc(disc: IDisc): void {
    this.disc = disc;

    this.updateAll();
  }

  private updateResultWaveform(): void {
    // copy waveform
    this.resultingWaveformContext.clearRect(
      0,
      0,
      this.sizeData.squareSize,
      this.sizeData.squareSize,
    );

    this.resultingWaveformContext.drawImage(
      this.originalWaveformContext.canvas,
      0,
      0,
      this.sizeData.squareSize,
      this.sizeData.squareSize,
    );

    // if needed, rasterize
    const selection = this.store.state.interaction.selection;
    const selectedDisc = this.store.getters[interactionStore.GET_SELECTED_DISC];
    if (selectedDisc === this.disc && selection.type === InteractableType.RING) {
      // create new canvas
      const canvas = createCanvas(this.sizeData.squareSize, this.sizeData.squareSize);
      const context = canvas.getContext('2d');

      // fill with pattern
      context.fillStyle = this.rasterPattern;
      context.fillRect(0, 0, this.sizeData.squareSize, this.sizeData.squareSize);

      // draw all slices on top of that
      (<IRing>selection).slices.forEach(slice => {
        drawHighlightSlice(context, slice, this.disc.sound.slices, this.sizeData, 'black');
      });

      // apply as mask on result canvas
      this.resultingWaveformContext.globalCompositeOperation = 'destination-in';
      this.resultingWaveformContext.drawImage(
        canvas,
        0,
        0,
        this.sizeData.squareSize,
        this.sizeData.squareSize,
      );
      this.resultingWaveformContext.globalCompositeOperation = 'source-over';
    }
  }

  public draw(): void {
    this.clear();

    if (this.disc.sounds.length === 0) {
      return;
    }

    // stretch whatever image we have (buffer might not be correct size yet) to the canvas size
    this.context.drawImage(
      this.resultingWaveformContext.canvas,
      0,
      0,
      this.sizeData.squareSize,
      this.sizeData.squareSize,
    );

    // if (this.disc.sound.sample) {
    //   // todo we now have sounds (REMOVE .SOUND!!)
    //   // we dont have a buffered canvas for the slices, probably faster to just draw these few lines every time
    //   drawSliceEdgeMarkers(this.context, this.sizeData, this.disc.sound.slices);
    // }
    this.disc.sounds.forEach((discSound, index) => {
      drawSliceEdgeMarkers(
        this.context,
        this.sizeData,
        discSound.slices,
        index,
        this.disc.sounds.length,
      );
    });

    // draw highlight if needed
    const highlight: IInteractable = this.store.state.interaction.highlight;
    if (
      highlight &&
      highlight.type === InteractableType.SLICE &&
      (<ISoundSlice>highlight).discSound.disc === this.disc
    ) {
      drawHighlightSlice(
        this.context,
        <ISoundSlice>highlight,
        this.disc.sound.slices,
        this.sizeData,
      );
    }
  }

  public resize(sizeData: ISizeData): void {
    super.resize(sizeData);

    this.draw();

    this.debouncedUpdateWaveform();
  }

  updateWaveform(): void {
    this.originalWaveformContext.clearRect(
      0,
      0,
      this.sizeData.squareSize,
      this.sizeData.squareSize,
    );

    // drawArcPath(
    //   this.originalWaveformContext,
    //   this.sizeData.halfSquareSize,
    //   this.sizeData.halfSquareSize,
    //   0,
    //   PI2,
    //   this.sizeData.waveformOuterRadius.pixels,
    //   this.sizeData.waveformInnerRadius.pixels,
    // );
    // this.originalWaveformContext.fillStyle = 'green';
    // this.originalWaveformContext.fill();

    const radiansPerSound = PI2 / this.disc.sounds.length;
    for (let i = 0; i < this.disc.sounds.length; i += 1) {
      const startRadians = i * radiansPerSound;
      drawWaveformCanvas(
        this.originalWaveformContext,
        startRadians,
        startRadians + radiansPerSound,
        this.disc.sounds[i].sample.audioBuffer,
        this.sizeData.squareSize, // width
        this.sizeData.squareSize, // height
        this.sizeData.halfSquareSize, // center x
        this.sizeData.halfSquareSize, // center y
        this.sizeData.waveformOuterRadius.pixels,
        this.sizeData.waveformInnerRadius.pixels,
        this.sizeData.rotateOffset,
        'white',
        this.disc.sounds[i].sample.normalizeFactor,
      );
    }
  }

  // todo destruct
}
