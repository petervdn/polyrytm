import { PI2 } from '../util/miscUtils';
import { ISizeData, IRing, IDisc, IRingItem, ISize, ISoundSlice } from '../data/interface';
import { drawArcPath } from '../util/drawUtils';
import { blendColors, getRingItemColorForVolume, IRgbColor } from '../util/colorUtils';
import Scheduler from '../audio/Scheduler';
import PlayMode from '../data/enum/PlayMode';
import { ITheme } from '../data/themes';
import { getChannelDataToDraw } from '../util/sampleUtils';

// todo combine all draw utils classes

export function drawPlayhead(
  context: CanvasRenderingContext2D,
  sizeData: ISizeData,
  disc: IDisc,
  playMode: string,
  scheduler: Scheduler,
): void {
  const outerRadius = sizeData.ringsOuterRadius.pixels - 1;
  const innerRadius =
    1 + sizeData.ringsOuterRadius.pixels - disc.rings.length * sizeData.ringSize.pixels;

  let playheadRadians;
  if (playMode === PlayMode.ROTATE) {
    playheadRadians = sizeData.rotateOffset;
  } else {
    playheadRadians = scheduler.timeData.currentRevolutionFactor * PI2 + sizeData.rotateOffset;
  }

  // console.log(playheadRadians);

  context.beginPath();
  context.moveTo(
    sizeData.halfSquareSize + Math.cos(playheadRadians) * innerRadius,
    sizeData.halfSquareSize + Math.sin(playheadRadians) * innerRadius,
  );
  context.lineTo(
    sizeData.halfSquareSize + Math.cos(playheadRadians) * outerRadius,
    sizeData.halfSquareSize + Math.sin(playheadRadians) * outerRadius,
  );

  context.strokeStyle = 'black'; // 'rgba(255,255,255, 0.5)';
  context.lineWidth = 1;
  context.stroke();
  context.closePath();
}

/**
 * Loads the pattern that is used for rasterizing non-selected elements.
 * @returns {Promise<CanvasPattern>}
 */
export function getRasterPattern(): Promise<CanvasPattern> {
  return new Promise<CanvasPattern>(resolve => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      resolve(context.createPattern(image, 'repeat'));
    };

    // tslint:disable
    // image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQYV2NkYGD4z8DAwMjIAAUADikBA/gvnngAAAAASUVORK5CYII=';
    // dots
    image.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAF0lEQVQYV2NkYGD4z8DAwMgAI0AMDA4AI3EBBMY7CTgAAAAASUVORK5CYII=';
    // diagonal lines
    // image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAG0lEQVQYV2NkYGD4z8DAwMgAI0AMkCBYBCYLADZfAwNf8vqnAAAAAElFTkSuQmCC';
    // diagonal more spacing
    //image.src= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQYV2NkgID/DAwMjCAGiIBzYAJQRRCVYGXI2gCC0AQEXXOMTwAAAABJRU5ErkJggg==';
    // diagnoal self try
    //image.src =
    //	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAKElEQVQYV2NkwA7+M2IR/8/AwMCILgEWBClGloALIkugCMIkMARBEgC7IAYGchlNYwAAAABJRU5ErkJggg==';
    // tslint:enable
  });
}

export function drawRingItem(
  context: CanvasRenderingContext2D,
  ringItem: IRingItem,
  sizeData: ISizeData,
  color: string,
): void {
  const radiansForRingItem = PI2 / ringItem.ring.items.length;
  const ringIndex = ringItem.ring.disc.rings.indexOf(ringItem.ring); // todo set indices
  const ringItemIndex = ringItem.ring.items.indexOf(ringItem); // todo set indices

  const startRadians = radiansForRingItem * ringItemIndex + sizeData.rotateOffset;
  const endRadians = startRadians + radiansForRingItem;
  const outerRadius = sizeData.ringsOuterRadius.pixels - ringIndex * sizeData.ringSize.pixels;
  const innerRadius = outerRadius - sizeData.ringSize.pixels;

  drawArcPath(
    context,
    sizeData.halfSquareSize,
    sizeData.halfSquareSize,
    startRadians,
    endRadians,
    outerRadius,
    innerRadius,
  );

  context.fillStyle = color;
  context.fill();
}

/**
 * Draws a ring onto a canvas.
 * @param {CanvasRenderingContext2D} context
 * @param {IRing} ring
 * @param {number} ringIndex
 * @param {ISizeData} sizeData
 * @param {ITheme} theme
 */
export function drawRing(
  context: CanvasRenderingContext2D,
  ring: IRing,
  ringIndex: number,
  sizeData: ISizeData,
  theme: ITheme,
) {
  ring.items.forEach(ringItem => {
    drawRingItem(context, ringItem, sizeData, getRingItemColorForVolume(theme, ringItem.volume));
  });
}

export function drawSliceEdgeMarkers(
  context: CanvasRenderingContext2D,
  sizeData: ISizeData,
  slices: ISoundSlice[],
  soundIndex: number,
  totalSounds: number,
  color: string = 'black',
  lineWidth: number = 1,
  lineDash: number[] = [],
): void {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;

  const radiansPerSound = PI2 / totalSounds;
  const startRadians = radiansPerSound * soundIndex;

  for (let i = 0; i < slices.length; i += 1) {
    const radians = startRadians + slices[i].startFactor * PI2 + sizeData.rotateOffset;

    context.beginPath();
    context.moveTo(
      sizeData.halfSquareSize + Math.cos(radians) * sizeData.waveformInnerRadius.pixels,
      sizeData.halfSquareSize + Math.sin(radians) * sizeData.waveformInnerRadius.pixels,
    );
    context.lineTo(
      sizeData.halfSquareSize + Math.cos(radians) * sizeData.waveformOuterRadius.pixels,
      sizeData.halfSquareSize + Math.sin(radians) * sizeData.waveformOuterRadius.pixels,
    );

    context.setLineDash(lineDash);

    context.stroke();
  }
}

/**
 * Draws a circular waveform on a new canvas.
 * @param {CanvasRenderingContext2D} context
 * @param {number} startRadians
 * @param {number} endRadians
 * @param {AudioBuffer} buffer
 * @param {number} width
 * @param {number} height
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} outerRadius
 * @param {number} innerRadius
 * @param {number} rotateOffset
 * @param {string} color
 * @param {string} magnify
 */
export function drawWaveformCanvas(
  context: CanvasRenderingContext2D,
  startRadians: number,
  endRadians: number,
  buffer: AudioBuffer,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  rotateOffset: number,
  color: string,
  magnify: number,
): void {
  if (!buffer) {
    return;
  }
  // tslint:disable-next-line
  // console.error('draw');
  const steps = buffer.length;
  const channelData = getChannelDataToDraw(buffer);

  const radiansStep = (endRadians - startRadians) / steps;
  const halfGraphHeight = (outerRadius - innerRadius) * 0.5;
  const baseRadius = innerRadius + halfGraphHeight;

  context.beginPath();

  for (let i = 0; i < steps; i += 1) {
    const radians = startRadians + (i * radiansStep + rotateOffset);
    const radius = baseRadius + channelData[i] * halfGraphHeight * magnify;
    const position = {
      x: centerX + Math.cos(radians) * radius,
      y: centerY + Math.sin(radians) * radius,
    };

    if (i === 0) {
      context.moveTo(position.x, position.y);
    } else {
      context.lineTo(position.x, position.y);
    }
  }

  context.lineWidth = 1;
  context.strokeStyle = color;
  context.stroke();
}

const defaultHighlightColor = 'rgba(0,0,0,0.1)';

/**
 * Draws a ring that is highlighted by hovering with the mouse.
 * @param {CanvasRenderingContext2D} context
 * @param {number} ringIndex
 * @param {ISizeData} sizeData
 * @param {string} color
 */
export function drawHighlightRing( // todo name
  context: CanvasRenderingContext2D,
  ringIndex: number,
  sizeData: ISizeData,
  color?: string,
): void {
  const outerRadius = sizeData.ringsOuterRadius.pixels - ringIndex * sizeData.ringSize.pixels;
  const innerRadius = outerRadius - sizeData.ringSize.pixels;

  context.beginPath();
  context.arc(sizeData.halfSquareSize, sizeData.halfSquareSize, outerRadius, 0, PI2, false);
  context.arc(sizeData.halfSquareSize, sizeData.halfSquareSize, innerRadius, 0, PI2, true);
  context.fillStyle = color || defaultHighlightColor;
  context.fill();
}

/**
 * Draws a highlighted sample slice.
 * @param {CanvasRenderingContext2D} context
 * @param {number} sliceIndex
 * @param {number[]} slices
 * @param {ISizeData} sizeData
 * @param {string} color
 */
export function drawHighlightSlice( // todo rename, not only for highlights
  context: CanvasRenderingContext2D,
  sliceInRing: ISoundSlice,
  soundSlices: ISoundSlice[],
  sizeData: ISizeData,
  color?: string,
) {
  const startFactor = sliceInRing.startFactor;
  const sliceIndex = soundSlices.indexOf(sliceInRing);
  let endFactor;
  if (sliceIndex < soundSlices.length - 1) {
    // not the last one
    endFactor = soundSlices[sliceIndex + 1].startFactor;
  } else {
    endFactor = 1;
  }

  drawArcPath(
    context,
    sizeData.halfSquareSize,
    sizeData.halfSquareSize,
    startFactor * PI2 + sizeData.rotateOffset,
    endFactor * PI2 + sizeData.rotateOffset,
    sizeData.waveformOuterRadius.pixels,
    sizeData.waveformInnerRadius.pixels,
  );

  context.fillStyle = color || defaultHighlightColor;
  context.fill();
}

/**
 * Draws a ringitem
 * @param {CanvasRenderingContext2D} context
 * @param {IDisc} disc
 * @param {IRing} ring
 * @param {IRingItem} ringItem
 * @param {ISizeData} sizeData
 * @param {string} color
 */
export function drawHighlightRingItem( // todo change name, not just highlight
  context: CanvasRenderingContext2D,
  disc: IDisc,
  ring: IRing,
  ringItem: IRingItem,
  sizeData: ISizeData,
  color?: string,
) {
  const ringIndex = disc.rings.indexOf(ring);
  const ringItemIndex = ring.items.indexOf(ringItem);
  const outerRadius = sizeData.ringsOuterRadius.pixels - ringIndex * sizeData.ringSize.pixels;
  const innerRadius = outerRadius - sizeData.ringSize.pixels;
  const radiansForRingItem = PI2 / ring.items.length;
  const startRadians = radiansForRingItem * ringItemIndex + sizeData.rotateOffset;
  const endRadians = startRadians + radiansForRingItem;

  drawArcPath(
    context,
    sizeData.halfSquareSize,
    sizeData.halfSquareSize,
    startRadians,
    endRadians,
    outerRadius,
    innerRadius,
  );
  context.fillStyle = color || defaultHighlightColor;
  context.fill();
}

/**
 * Applies a pattern to a canvas.
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 * @param {CanvasPattern} pattern
 */
export function rasterizeCanvas(
  context: CanvasRenderingContext2D,
  width: number, // todo get from context?
  height: number,
  pattern: CanvasPattern,
): void {
  context.globalCompositeOperation = 'destination-in';
  context.fillStyle = pattern;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = 'source-over';
}

/**
 * Applies a alpha raster/pattern for a waveform, leaving out only the active slices.
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 * @param {ISizeData} sizeData
 * @param {CanvasPattern} pattern
 * @param {number[]} allSlices
 * @param {number[]} activeSlices
 */
// export function rasterizeWaveformSlicesCanvas( // todo better name
// 	context: CanvasRenderingContext2D,
// 	width: number,
// 	height: number,
// 	sizeData: ISizeData,
// 	pattern: CanvasPattern,
// 	allSlices: number[],
// 	activeSlices: number[],
// ): void {
// 	// create new canvas
// 	const bufferCanvas = createCanvas(width, height);
// 	const bufferContext = bufferCanvas.getContext('2d');
//
// 	// fill with pattern
// 	bufferContext.fillStyle = pattern;
// 	bufferContext.fillRect(0, 0, width, height);
//
// 	// draw all slices on top of that
// 	activeSlices.forEach(slice => {
// 		drawHighlightSlice(bufferContext, slice, allSlices, sizeData, 'black');
// 	});
//
// 	// use as mask for existing canvas (with  waveform)
// 	context.globalCompositeOperation = 'destination-in';
// 	context.drawImage(bufferCanvas, 0, 0, width, height);
// 	context.globalCompositeOperation = 'source-over';
// }

/**
 * Draws a graphical display of the schedule interval and lookahead time.
 * @param {CanvasRenderingContext2D} context
 * @param {Scheduler} scheduler
 * @param {ISizeData} sizeData
 */
export function drawScheduleIntervals(
  context: CanvasRenderingContext2D,
  scheduler: Scheduler,
  sizeData: ISizeData,
): void {
  const schedulesPerRevolution = scheduler.secondsPerRevolution / scheduler.scheduleInterval;
  const radiansLookahead = PI2 / (scheduler.secondsPerRevolution / scheduler.lookAheadTime);

  // console.log('sec/rev', scheduler.secondsPerRevolution, 'interval', scheduler.scheduleInterval,
  // 'ahead', scheduler.lookAheadTime);
  const floored = Math.floor(schedulesPerRevolution);
  for (let i = 0; i < schedulesPerRevolution; i += 1) {
    const radians = i * (PI2 / schedulesPerRevolution);
    drawArcPath(
      context,
      sizeData.halfSquareSize,
      sizeData.halfSquareSize,
      radians,
      radians + radiansLookahead,
      (i + 1) * (sizeData.ringsOuterRadius.pixels / floored),
      0.0001,
    );
    context.fillStyle = 'rgba(0,255,0, .2)';
    context.fill();
  }
}

export function drawDiscHighlight(context: CanvasRenderingContext2D, sizeData: ISizeData): void {
  context.fillStyle = defaultHighlightColor;
  context.arc(sizeData.halfSquareSize, sizeData.halfSquareSize, sizeData.halfSquareSize, 0, PI2);
  context.fill();
}
