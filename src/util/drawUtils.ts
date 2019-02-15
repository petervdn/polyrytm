import { PI2 } from 'util/miscUtils';

// todo move to other drawutils class (or that to here)
// todo use mpm package
export function drawArcPath(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  startRadians: number,
  endRadians: number,
  outerRadius: number,
  innerRadius: number,
): void {
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
}

export const circularText = (
  context: CanvasRenderingContext2D,
  text: string,
  font: string,
  x: number,
  y: number,
  radius: number,
  space: number = 1.2,
) => {
  context.textAlign = 'center';
  context.textBaseline = !top ? 'top' : 'bottom';
  context.font = font;

  const numRadsPerLetter = (Math.PI - space * 2) / text.length;
  context.save();
  context.translate(x, y);
  const k = 1;
  context.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));
  for (let i = 0; i < text.length; i += 1) {
    context.save();
    context.rotate(k * i * numRadsPerLetter);
    context.fillText(text[i], 0, -k * radius);
    context.restore();
  }
  context.restore();
};
