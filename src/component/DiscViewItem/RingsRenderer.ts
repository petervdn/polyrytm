import {
  ISizeData,
  IDisc,
  IStore,
  InteractableType,
  IRing,
  IRingItem,
  Interactable,
} from '../../data/interface';
import { createCanvas } from '../../util/DiscViewUtils';
import AbstractRenderer from './AbstractRenderer';
import {
  drawDiscHighlight,
  drawHighlightRing,
  drawHighlightRingItem,
  drawPlayhead,
  drawRing,
  drawRingItem,
  rasterizeCanvas,
} from '../../display/canvasRendererDrawUtils';
import Scheduler from '../../audio/Scheduler';
import AnimationFrame from '../../util/AnimationFrame';
import PlayMode from '../../data/enum/PlayMode';
import { interactionStore } from '../../store/module/interaction/interaction';
import { GlobalEvent, globalEventBus } from '../../data/globalEvents';
import { PI2 } from '../../util/miscUtils';
import { getRingItemColorForVolume } from '../../util/colorUtils';

export default class RingsRenderer extends AbstractRenderer {
  private ringsCanvas: HTMLCanvasElement;
  private ringsCanvasContext: CanvasRenderingContext2D;
  private cssRotate: boolean = false;
  private playingFrameUpdate: AnimationFrame;

  constructor(disc: IDisc, sizeData: ISizeData, store: IStore, scheduler: Scheduler) {
    super(disc, sizeData, store, scheduler);

    this.ringsCanvas = createCanvas(sizeData.squareSize, sizeData.squareSize);
    this.ringsCanvasContext = this.ringsCanvas.getContext('2d');

    this.playingFrameUpdate = new AnimationFrame(() => {
      this.updateRotation();
    });

    // watch rings change (add/remove)
    this.storeWatchDestructors.push(
      this.store.watch(
        () => this.disc.rings,
        () => {
          this.updateDisc();
          this.draw();
        },
      ),
    );

    // watch play/stop
    this.storeWatchDestructors.push(
      this.store.watch(
        state => state.app.isPlaying,
        isPlaying => {
          if (isPlaying) {
            this.playingFrameUpdate.start();
          } else {
            this.playingFrameUpdate.stop();
            this.updateRotation();
          }
        },
      ),
    );

    // watch selection change from no selection to this disc (from zoomed out view to zoomed-in on this disc)
    this.storeWatchDestructors.push(
      this.store.watch(
        state => state.interaction.selection && state.interaction.selection === this.disc,
        () => {
          this.updateDisc();
          this.draw();
        },
      ),
    );

    // watch selected ring
    this.storeWatchDestructors.push(
      this.store.watch(
        (state, getters) => getters[interactionStore.GET_SELECTED_RING],
        () => {
          this.updateDisc();
          this.draw();
        },
      ),
    );
    // todo: these two watchers (above, below) should be combined, they can now trigger more than necessary
    // todo: for example when you highlight while selecting, and then deselect => both selected & highlight
    // todo: will change
    // // watch ring highlight state
    this.storeWatchDestructors.push(
      this.store.watch(
        state => state.interaction.highlight,
        () => {
          this.draw();
        },
      ),
    );

    // // watch ring highlight state
    this.storeWatchDestructors.push(
      this.store.watch(
        state => state.app.activeTheme,
        () => {
          this.updateDisc();
          this.draw();
        },
      ),
    );

    globalEventBus.$on(GlobalEvent.RING_ITEM_VOLUME_CHANGE_BY_DRAGGING, (ringItem: IRingItem) => {
      if (ringItem.ring.disc === this.disc) {
        // quick redraw of ring, doesnt look perfect, but should be fast (is while dragging)
        // full discs will be redrawn when dragging is done (so it looks good again)
        // todo dragging down jumps to 1 (or at least shows brightest volume)
        drawRingItem(
          this.ringsCanvasContext,
          ringItem,
          this.sizeData,
          getRingItemColorForVolume(this.store.state.app.activeTheme, ringItem.volume),
        );
        this.draw();
      }
    });

    globalEventBus.$on(GlobalEvent.RING_ITEM_VOLUME_CHANGE, (ringItem: IRingItem) => {
      if (ringItem.ring.disc === this.disc) {
        this.updateDisc();
        this.draw();
      }
    });

    globalEventBus.$on(GlobalEvent.RING_ITEMS_CHANGE, (ring: IRing) => {
      if (ring.disc === this.disc) {
        this.updateDisc();
        this.draw();
      }
    });

    this.updateDisc();
    this.draw();
  }

  public setDisc(disc: IDisc) {
    this.disc = disc;
    this.updateDisc();
    this.draw();
  }

  private updateRotation(): void {
    if (this.cssRotate) {
      this.canvas.style.transform = `rotate(-${
        this.scheduler.timeData.currentRevolutionDegrees
      }deg)`;
    } else {
      this.draw();
    }
  }

  public resize(sizeData: ISizeData): void {
    super.resize(sizeData);

    // update the size of canvas holding the disc
    this.ringsCanvas.width = sizeData.squareSize;
    this.ringsCanvas.height = sizeData.squareSize;

    this.updateDisc();
    this.draw();
  }

  /**
   * Draws the buffer canvas (containing disc image) into the canvas
   */
  public draw(): void {
    this.clear();

    if (this.store.state.app.playMode === PlayMode.STATIC) {
      // static discs
      this.context.drawImage(this.ringsCanvas, 0, 0);
    } else {
      // rotating discs
      if (this.cssRotate) {
        // whole canvas has already been rotated by css, draw normally
        this.context.drawImage(this.ringsCanvas, 0, 0);
      } else {
        // rotate by applying transform before drawing
        // reset to identity matrix (otherwise transforms will stack on every frame)
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        if (this.scheduler.timeData.currentRevolutionRadians !== 0) {
          this.context.translate(this.sizeData.halfSquareSize, this.sizeData.halfSquareSize);
          this.context.rotate(-this.scheduler.timeData.currentRevolutionRadians);
          this.context.translate(-this.sizeData.halfSquareSize, -this.sizeData.halfSquareSize);
        }

        this.context.drawImage(this.ringsCanvas, 0, 0);
      }
    }

    // draw highlights
    const highlightedDisc = this.store.getters[interactionStore.GET_HIGHLIGHTED_DISC];
    const selectedDisc = this.store.getters[interactionStore.GET_SELECTED_DISC];
    if (highlightedDisc === this.disc) {
      if (!selectedDisc || selectedDisc !== this.disc) {
        //  nothing selected, but disc is highlighted => draw full disc highlight
        drawDiscHighlight(this.context, this.sizeData);
      } else {
        const highlight: Interactable = this.store.state.interaction.highlight;

        if (highlight.type === InteractableType.RING) {
          // highlight is a ring
          drawHighlightRing(this.context, this.disc.rings.indexOf(<IRing>highlight), this.sizeData);
        } else if (highlight.type === InteractableType.RING_ITEM) {
          // highlight is a ringitem
          drawHighlightRingItem(
            this.context,
            highlightedDisc,
            (<IRingItem>highlight).ring,
            <IRingItem>highlight,
            this.sizeData,
          );
        }
      }
    }

    // draw flashes in ringitems
    if (this.store.state.app.isPlaying) {
      this.disc.rings.forEach(ring => {
        const radiansPerRingItem = PI2 / ring.items.length;
        const playRadians = this.scheduler.timeData.currentRevolutionRadians;
        const activeItemIndex = Math.floor(playRadians / radiansPerRingItem);

        const itemStartRadians = activeItemIndex * radiansPerRingItem;
        const itemEndRadians = itemStartRadians + radiansPerRingItem;
        const progressInItemFactor =
          (playRadians - itemStartRadians) / (itemEndRadians - itemStartRadians);
        const opacity = (1 - progressInItemFactor) ** 2;

        if (opacity > 0.1) {
          drawRingItem(
            this.context,
            ring.items[activeItemIndex],
            this.sizeData,
            `rgba(0,0,0,${opacity}`,
          );
        }
      });
    }

    // reset matrix, so playhead is drawn correctly
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    // todo make lookahead time dependent of sec/rev and schedule-interval
    // drawScheduleIntervals(
    // 	this.context,
    // 	this.scheduler,
    // 	this.sizeData,
    // );

    drawPlayhead(
      this.context,
      this.sizeData,
      this.disc,
      this.store.state.app.playMode, // todo dont access stores from here
      this.scheduler,
    );
  }

  /**
   * Draws the current disc into the buffer canvas, will not update the visible canvas.
   */
  private updateDisc(): void {
    // todo bottom canvas can do a fillrect
    this.ringsCanvasContext.clearRect(0, 0, this.sizeData.squareSize, this.sizeData.squareSize);

    if (!this.disc) {
      return;
    }

    // draw all rings, check if there is a selected one in this ring
    const selectedRing = this.store.getters[interactionStore.GET_SELECTED_RING];
    if (selectedRing && selectedRing.disc === this.disc) {
      // if so,only draw the not-selected rings, because these will get a pixel-raster
      // and the highlighted ring will be drawn normally after that
      this.disc.rings.forEach((ring, index) => {
        if (ring !== selectedRing) {
          drawRing(
            this.ringsCanvasContext,
            ring,
            index,
            this.sizeData,
            this.store.state.app.activeTheme,
          );
        }
      });

      // raster over everything we've drawn
      rasterizeCanvas(
        this.ringsCanvasContext,
        this.sizeData.squareSize,
        this.sizeData.squareSize,
        this.rasterPattern,
      );

      // draw the highlighted one normally
      drawRing(
        this.ringsCanvasContext,
        selectedRing,
        this.disc.rings.indexOf(selectedRing), // todo move index to rings? (and ringitems)
        this.sizeData,
        this.store.state.app.activeTheme,
      );
    } else {
      this.disc.rings.forEach((ring, index) => {
        drawRing(
          this.ringsCanvasContext,
          ring,
          index,
          this.sizeData,
          this.store.state.app.activeTheme,
        );
      });
    }
  }

  // todo destruct
}
