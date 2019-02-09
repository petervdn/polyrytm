import { ISizeData } from '../data/interface';
import { valueBetween } from './numberUtils';

// todo move to canvasrenderer utils? or the stuff there to here
export const createCanvas = (width: number, height: number, cssProps?: any): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  if (cssProps) {
    Object.keys(cssProps).forEach(key => {
      canvas.style[key] = cssProps[key];
    });
  }

  return canvas;
};

// todo rename sizedata? and also: function instead of const
export const getSizeData: (element: HTMLElement) => ISizeData = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const size = { width: rect.width, height: rect.height };
  const squareSize = Math.min(size.width, size.height);
  const halfSquareSize = squareSize * 0.5;
  const center = { x: rect.width * 0.5, y: rect.height * 0.5 };
  const squareSizeLeftTop = {
    x: center.x - halfSquareSize,
    y: center.y - halfSquareSize,
  };

  // these are all factors (between 0-1)
  const outerMargin = { factor: 0.0, pixels: 0 };
  const waveformOuterRadius = { factor: 1 - outerMargin.factor, pixels: 0 };
  const waveformSize = { factor: 0.1, pixels: 0 };
  const waveformInnerRadius = {
    factor: waveformOuterRadius.factor - waveformSize.factor,
    pixels: 0,
  };
  const ringsOuterMargin = { factor: 0.05, pixels: 0 };
  const ringsOuterRadius = {
    factor: waveformInnerRadius.factor - ringsOuterMargin.factor,
    pixels: 0,
  };
  const ringSize = { factor: 0.1, pixels: 0 };

  // calculate pixels
  [
    outerMargin,
    waveformOuterRadius,
    waveformSize,
    waveformInnerRadius,
    ringsOuterMargin,
    ringsOuterRadius,
    ringSize,
  ].forEach(item => {
    item.pixels = item.factor * halfSquareSize;
  });

  const rotateOffset = -0.25 * (Math.PI * 2);

  return {
    size,
    center,
    squareSize,
    squareSizeLeftTop,
    halfSquareSize,
    rotateOffset,
    outerMargin,
    waveformOuterRadius,
    waveformSize,
    waveformInnerRadius,
    ringsOuterMargin,
    ringsOuterRadius,
    ringSize,
  };
};

export class ValueDragger {
  private startY: number;
  private moveCallback: (value: number) => void;
  private doneCallback: () => void;
  private startValue: number;
  private min: number;
  private max: number;
  private amountPerPixel: number;

  constructor(
    startValue: number,
    min: number,
    max: number,
    amountPerPixel: number,
    mouseDownEvent: MouseEvent,
    moveCallback: (value: number) => void,
    doneCallback: () => void,
  ) {
    this.startValue = startValue;
    this.min = min;
    this.max = max;
    this.amountPerPixel = amountPerPixel;
    this.startY = mouseDownEvent.pageY; // todo use screen values?
    this.moveCallback = moveCallback;
    this.doneCallback = doneCallback;
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (event: MouseEvent) => {
    const newAmount = this.startValue + (this.startY - event.pageY) * this.amountPerPixel;

    this.moveCallback(valueBetween(newAmount, this.min, this.max));
  };

  onMouseUp = event => {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.moveCallback = null;
    this.doneCallback();
    this.doneCallback = null;
  };
}
