import {
	IBasicRingItem,
	IDisc,
	IDiscSound,
	IInteractable,
	InteractableType,
	IRing,
	IRingItem,
	ISample,
	ISoundSlice,
} from '../data/interface';
import { audioContext } from './soundUtils';
import { constants } from '../data/constants';
import { getRandomInt } from './numberUtils';

/**
 * Creates a ring item.
 * @param {number} index
 * @param {number} volume
 * @returns {IRingItem}
 */
export function createRingItem(ring: IRing, index: number, volume: number): IRingItem {
	return {
		ring,
		volume,
		index,
		type: InteractableType.RING_ITEM,
		lastScheduledRevolution: -1,
	};
}

/**
 * Creates a ring. Can be given ringitems (if left out, you get a default amount with random volumes)
 * and sliceIndices (if left out, will be an empty list).
 * @param {IBasicRingItem[]} items
 * @param {number[]} sliceIndices
 * @returns {IRing}
 */
// todo create separate createDefaultRing function
// export function createRing(disc: IDisc, items?: IBasicRingItem[], sliceIndices?: number[]): IRing {
export function createDefaultRing(disc: IDisc): IRing {
	const gain = audioContext.createGain();
	gain.connect(audioContext.destination);

	const ring: IRing = {
		disc,
		gain,
		type: InteractableType.RING,
		items: [],
		slices: [],
	};

	// if (items) {
	// 	// create rings from given items (which only have vol and index) -> will add lastScheduledRevolution
	// 	ring.items = items.map(item => createRingItem(ring, item.index, item.volume));
	// } else {
	// 	// no items given, create default amount
	// 	for (let i = 0; i < 8; i += 1) {
	// 		ring.items.push(createRingItem(ring, i, Math.random()));
	// 	}
	// }

	for (let i = 0; i < getRandomInt(3, 16); i += 1) {
		ring.items.push(createRingItem(ring, i, Math.random()));
	}

	return ring;
}

export function createSound(sample: ISample, disc: IDisc): IDiscSound {
	return {
		sample,
		slices: [],
	};
}

function createDefaultSound(disc: IDisc): IDiscSound {
	const sound: IDiscSound = {
		sample: null,
		slices: [],
	};

	sound.slices.push({
		disc,
		nextSlice: null,
		type: InteractableType.SLICE,
		startFactor: 0,
	});

	return sound;
}

/**
 * Based on the positions of the slices (which devide the 0-1 range into parts), return the slice fora given factor
 * @param {ISoundSlice[]} slices
 * @param {number} factor
 * @returns {ISoundSlice}
 */
export function getSliceForFactor(slices: ISoundSlice[], factor: number): ISoundSlice {
	for (let i = 0; i < slices.length; i += 1) {
		if (slices[i].nextSlice) {
			if (factor >= slices[i].startFactor && factor < slices[i].nextSlice.startFactor) {
				return slices[i];
			}
		} else {
			// if we got to the last slice (which has no next), then that's the one
			return slices[i];
		}
	}
}

/**
 * Creates a default disc, consisting of 1 default ring.
 * @returns {IDisc}
 */
export function createDefaultDisc(): IDisc {
	const disc = {
		sound: null,
		sounds: [],
		type: InteractableType.DISC,
		rings: [],
	};

	// both rings and slcies need references to the parent disc
	disc.sound = createDefaultSound(disc);
	disc.rings.push(createDefaultRing(disc));

	return disc;
}

/**
 * Creates a list of evenly spaced slice-positions (values between 0 and 1).
 * @param {number} amount
 * @returns {number[]}
 */
export function createSlices(disc: IDisc, amount: number): ISoundSlice[] {
	const slices: ISoundSlice[] = [];
	for (let i = 0; i < amount; i += 1) {
		const slice = {
			disc,
			startFactor: i * (1 / amount),
			type: InteractableType.SLICE,
			nextSlice: null,
		};

		slices.push(slice);

		// create linked list
		if (i > 0) {
			slices[i - 1].nextSlice = slice;
		}
	}

	return slices;
}

export function getSliceDurationFactor(slice: ISoundSlice): number {
	return (slice.nextSlice ? slice.nextSlice.startFactor : 1) - slice.startFactor;
}

export function getDiscForInteractable(item: IInteractable): IDisc {
	if (item) {
		switch (item.type) {
			case InteractableType.SLICE: {
				return (<ISoundSlice>item).disc;
			}
			case InteractableType.RING_ITEM: {
				return (<IRingItem>item).ring.disc;
			}
			case InteractableType.RING: {
				return (<IRing>item).disc;
			}
			case InteractableType.DISC: {
				return <IDisc>item;
			}
			default: {
				console.error('Unknown item type', item);
			}
		}
	} else {
		return null;
	}
}

export function getRingForInteractable(item: IInteractable): IRing {
	if (item) {
		switch (item.type) {
			case InteractableType.SLICE: {
				// a slice is not intself related to a ring, although slices can be assigned to a ring
				// at the moment we do not need the ref to the ring they belong to
				return null;
			}
			case InteractableType.RING_ITEM: {
				return (<IRingItem>item).ring;
			}
			case InteractableType.RING: {
				return <IRing>item;
			}
			case InteractableType.DISC: {
				return null;
			}
			default: {
				console.error('Unknown item type', item);
			}
		}
	} else {
		return null;
	}
}

//
// export function createRandomRingItems(amount:number): IRingItem[] {
// 	const rings: IRingItem[] = [];
// 	for (let i = 0; i < amount; i += 1) {
// 		rings.push(createRingItem(i, Math.random()));
// 	}
//
// 	return rings;
// }

//
// export function findRingIndexForRingItem(sequence: ISequence, ringItem: IRingItem): number {
// 	for (let i = 0; i < sequence.rings.length; i += 1) {
// 		for (let j = 0; j < sequence.rings[i].items.length; j += 1) {
// 			if (sequence.rings[i].items[j] === ringItem) {
// 				return i;
// 			}
// 		}
// 	}
//
// 	return -1;
// // }
//
// export function createVolumesList(ringItems: IRingItem[], fillType: string): number[] {
// 	const volumes = [];
//
// 	let fillFunction;
// 	switch (fillType) {
// 		case 'random': {
// 			// todo make enum
// 			fillFunction = () => Math.random();
// 			break;
// 		}
// 		case '*2': {
// 			fillFunction = (index, current) => Math.min(1, current * 2);
// 			break;
// 		}
// 		case '/2': {
// 			fillFunction = (index, current) => Math.max(0, current / 2);
// 			break;
// 		}
// 		case 'alternate': {
// 			fillFunction = index => (index % 2 === 0 ? 1 : 0);
// 			break;
// 		}
// 		case '1': {
// 			fillFunction = () => 1;
// 			break;
// 		}
// 		case '0': {
// 			fillFunction = () => 0;
// 			break;
// 		}
// 		default: {
// 			console.error('Unknown filltype (setting all volumes to 1)', fillType);
// 			fillFunction = () => 1;
// 		}
// 	}
//
// 	for (let i = 0; i < ringItems.length; i += 1) {
// 		volumes.push(fillFunction(i, ringItems[i].volume));
// 	}
//
// 	return volumes;
// }
