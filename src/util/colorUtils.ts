import { ITheme } from '../data/themes';

export function blendColors(...args): number[] {
	// var args = [].prototype.slice.call(arguments);
	let base = [0, 0, 0, 0];
	let mix;
	let added;
	while ((added = args.shift())) {
		if (typeof added[3] === 'undefined') {
			added[3] = 1;
		}
		// check if both alpha channels exist.
		if (base[3] && added[3]) {
			mix = [0, 0, 0, 0];
			// alpha
			mix[3] = 1 - (1 - added[3]) * (1 - base[3]);
			// red
			mix[0] = Math.round(added[0] * added[3] / mix[3] + base[0] * base[3] * (1 - added[3]) / mix[3]);
			// green
			mix[1] = Math.round(added[1] * added[3] / mix[3] + base[1] * base[3] * (1 - added[3]) / mix[3]);
			// blue
			mix[2] = Math.round(added[2] * added[3] / mix[3] + base[2] * base[3] * (1 - added[3]) / mix[3]);
		} else if (added) {
			mix = added;
		} else {
			mix = base;
		}
		base = mix;
	}

	return mix;
}

export function hexToRgb(hex: string): IRgbColor {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
}

export interface IRgbColor {
	r: number;
	g: number;
	b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function getRingItemColorForVolume(theme: ITheme, volume: number): string {
	const color = blendColors(
		[theme.discVolumeOffColor.rgb.r, theme.discVolumeOffColor.rgb.g, theme.discVolumeOffColor.rgb.b, 1],
		[theme.discVolumeOnColor.rgb.r, theme.discVolumeOnColor.rgb.g, theme.discVolumeOnColor.rgb.b, volume],
	);
	return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

export const staticColors = {
	uiDark: '#333333',
	uiBright: '#FFFFFF',
};
