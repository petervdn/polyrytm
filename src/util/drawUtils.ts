import { PI2 } from 'util/miscUtils';

// todo move to other drawutils class (or that to here)

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

	context.lineTo(centerX + Math.cos(endRadians) * innerRadius, centerY + Math.sin(endRadians) * innerRadius);

	context.arc(centerX, centerY, innerRadius, endRadians, startRadians, true);

	context.lineTo(centerX + Math.cos(startRadians) * outerRadius, centerY + Math.sin(startRadians) * outerRadius);
}
