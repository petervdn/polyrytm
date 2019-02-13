import AbstractRenderer from './AbstractRenderer';
import { IDisc, InteractableType, IRing, ISizeData, IStore } from '../../data/interface';
import {
  defaultHighlightColor,
  drawSliceEdgeMarkers,
  drawWaveformCanvas,
  fillRingPartInWaveformRing,
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

    // watch number of sounds with loaded audioBuffers
    this.storeWatchDestructors.push(
      this.store.watch(
        () => this.disc.sounds.filter(sound => !!sound.sample.audioBuffer).length,
        () => {
          this.updateAll();
        },
      ),
    );

    // watch slices todo watches unused sond property (now soundS)
    // this.storeWatchDestructors.push(
    //   this.store.watch(
    //     () => this.disc.sound.slices,
    //     () => {
    //       this.draw();
    //     },
    //   ),
    // );

    // watch highlighted slices or discsound changes
    this.storeWatchDestructors.push(
      this.store.watch(
        state =>
          state.interaction.highlight &&
          (state.interaction.highlight.type === InteractableType.SLICE ||
            state.interaction.highlight.type === InteractableType.DISC_SOUND)
            ? state.interaction.highlight.type
            : null,
        value => {
          this.draw();
        },
      ),
    );

    // watch selection change todo can be better optimized, new selection might not need a redraw (ratsterize doesnt have to change)
    this.storeWatchDestructors.push(
      this.store.watch(
        state => state.interaction.selection,
        () => {
          this.updateResultWaveform();
          this.draw();
        },
      ),
    );

    // watch slices for selected ring change (this also catches when a selected ring changes)
    // this.storeWatchDestructors.push(
    //   this.store.watch(
    //     state => {
    //       const selection = state.interaction.selection;
    //       if (
    //         selection &&
    //         selection.type === InteractableType.RING &&
    //         (<IRing>selection).disc === this.disc
    //       ) {
    //         return (<IRing>selection).slices;
    //       }
    //       return null;
    //     },
    //     (v) => {
    //       console.log(v);
    //       this.updateResultWaveform();
    //       this.draw();
    //     },
    //   ),
    // );
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
    if (
      selectedDisc === this.disc &&
      (selection.type === InteractableType.RING || selection.type === InteractableType.DISC_SOUND)
    ) {
      // create new canvas
      const canvas = createCanvas(this.sizeData.squareSize, this.sizeData.squareSize);
      const context = canvas.getContext('2d');

      if (selection.type === InteractableType.RING) {
        // all waveforms need a raster, so fully fill the whole canvas
        context.fillStyle = this.rasterPattern;
        context.fillRect(0, 0, this.sizeData.squareSize, this.sizeData.squareSize);
      } else {
        // give all other sounds except for the selected a raster
        fillRingPartInWaveformRing(context, selection, this.sizeData, this.rasterPattern, true);
        // selected gets a full fill
        fillRingPartInWaveformRing(context, selection, this.sizeData, 'white', false);
      }

      // draw all slices on top of that
      (<IRing>selection).slices.forEach(slice => {
        // drawHighlightSlice(context, slice, this.disc.sound.slices, this.sizeData, 'black'); todo
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

  // todo describe what this does. draw what exactly
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

    // draw edge markers for each sound
    this.disc.sounds.forEach((discSound, index) => {
      drawSliceEdgeMarkers(
        this.context,
        this.sizeData,
        discSound.slices,
        index,
        this.disc.sounds.length,
      );
    });

    // draw highlight for discsound or slice
    const highlight = this.store.state.interaction.highlight;
    if (
      highlight &&
      (highlight.type === InteractableType.SLICE || highlight.type === InteractableType.DISC_SOUND)
    ) {
      fillRingPartInWaveformRing(this.context, highlight, this.sizeData, defaultHighlightColor);
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
