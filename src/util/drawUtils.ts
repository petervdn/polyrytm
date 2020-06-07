import { DiscData, DiscSizeData, RingData, RingItemData } from '../data/interfaces';
import { PI2 } from './miscUtils';

export const drawDisc = (
  context: CanvasRenderingContext2D,
  disc: DiscData,
  sizeData: DiscSizeData,
  rotateOffset: number,
) => {
  context.clearRect(0, 0, sizeData.size, sizeData.size);
  disc.rings.forEach((ring, index) => drawRing(context, ring, index, sizeData, rotateOffset));
};

export const drawRing = (
  context: CanvasRenderingContext2D,
  ring: RingData,
  ringIndex: number,
  sizeData: DiscSizeData,
  rotateOffset: number,
) => {
  ring.items.forEach((ringItem, itemIndex) =>
    drawRingItem(
      context,
      ringItem,
      sizeData,
      ring.items.length,
      itemIndex,
      ringIndex,
      rotateOffset,
    ),
  );
};

export const drawRingItem = (
  context: CanvasRenderingContext2D,
  ringItem: RingItemData,
  sizeData: DiscSizeData,
  totalItems: number,
  ringItemIndex: number,
  ringIndex: number,
  rotateOffset: number,
): void => {
  const radiansForRingItem = PI2 / totalItems;

  const startRadians = radiansForRingItem * ringItemIndex + rotateOffset;
  const endRadians = startRadians + radiansForRingItem;
  const outerRadius = sizeData.ringsOuterRadius - ringIndex * sizeData.ringSize;
  const innerRadius = outerRadius - sizeData.ringSize;

  drawArcPath(
    context,
    sizeData.halfSize,
    sizeData.halfSize,
    startRadians,
    endRadians,
    outerRadius,
    innerRadius,
  );

  context.fillStyle = `rgba(255,255,255,${ringItem.volume}`;
  context.fill();
};

export const drawArcPath = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  startRadians: number,
  endRadians: number,
  outerRadius: number,
  innerRadius: number,
): void => {
  if (outerRadius <= 0 || innerRadius <= 0) {
    return;
  }

  context.beginPath();
  context.arc(centerX, centerY, outerRadius, startRadians, endRadians);

  context.lineTo(
    centerX + Math.cos(endRadians) * innerRadius,
    centerY + Math.sin(endRadians) * innerRadius,
  );

  context.arc(centerX, centerY, innerRadius, endRadians, startRadians, true);

  context.lineTo(
    centerX + Math.cos(startRadians) * outerRadius,
    centerY + Math.sin(startRadians) * outerRadius,
  );
};

export const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d')!;

  return { canvas, context };
};
