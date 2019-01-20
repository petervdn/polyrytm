import { ISample } from '../data/interface';
import * as firebase from 'firebase';
import axios from 'axios';

export const audioContext = new AudioContext();

export function createSample(uri, name): ISample {
	return {
		uri,
		name: name || uri,
		audioBuffer: null,
	};
}

export function createSampleSlices(amount: number): number[] {
	if (amount === 0) {
		amount = 1; // tslint:disable-line no-param-reassign
	}

	const slices = [];
	const slicePart = 1 / amount;
	for (let i = 0; i < amount; i += 1) {
		slices.push(i * slicePart);
	}

	return slices;
}

// todo move this to sample store, and have it set audiobuffer itself
// todo type sample
export function loadSample(sample, onProgress?: (value: number) => void): Promise<AudioBuffer> {
	return new Promise((resolve, reject) => {
		if (sample.audioBuffer) {
			resolve(sample.audioBuffer);
		} else {
			firebase
				.storage()
				.ref(sample.path)
				.getDownloadURL()
				.then(url =>
					axios.get(url, {
						responseType: 'arraybuffer',
						onDownloadProgress: (event: ProgressEvent) => {
							if (onProgress) {
								onProgress(event.loaded / event.total);
							}
						},
					}),
				)
				.then(loadedResult => audioContext.decodeAudioData(loadedResult.data))
				.then(decodedAudioBuffer => resolve(decodedAudioBuffer))
				.catch(error => {
					// todo differentiate between different errors here?
					reject(error);
				});
		}
	});
}
