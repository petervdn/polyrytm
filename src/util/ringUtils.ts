import { IRingItem } from '../data/interface';

// todo move to disctuils? or move ringstuff to here

export function generateVolumes(ringItems: IRingItem[], type: string): number[] {
	switch (type) {
		case 'random': {
			return ringItems.map(() => Math.random());
		}
		case 'alternate': {
			return ringItems.map((item, index) => (index % 2 ? 1 : 0));
		}
		case 'shift+1': {
			return ringItems.map((item, index, items) => {
				if (index === 0) {
					return items[items.length - 1].volume;
				} else {
					return items[index - 1].volume;
				}
			});
		}
		case 'shift-1': {
			return ringItems.map((item, index, items) => {
				if (index === items.length - 1) {
					return items[0].volume;
				} else {
					return items[index + 1].volume;
				}
			});
		}
		case 'all-0': {
			return ringItems.map(() => 0);
		}
		case 'all-1': {
			return ringItems.map(() => 1);
		}
		case 'x2': {
			return ringItems.map(item => Math.min(item.volume * 2, 1));
		}
		case 'x0.5': {
			return ringItems.map(item => item.volume * 0.5);
		}
		default: {
			console.error('Unknown type', type);
		}
	}

	return ringItems.map(item => item.volume);
}
