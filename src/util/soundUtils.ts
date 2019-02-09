export const audioContext = new AudioContext(); // todo move elsewhere

// export function createSample(uri, name): ISample {
//   return {
//     uri,
//     name: name || uri,
//     audioBuffer: null,
//   };
// }
//
// export function createSampleSlices(amount: number): number[] {
//   if (amount === 0) {
//     throw new Error('Invalid amount of slices');
//   }
//
//   const slices = [];
//   const slicePart = 1 / amount;
//   for (let i = 0; i < amount; i += 1) {
//     slices.push(i * slicePart);
//   }
//
//   return slices;
// }

// todo move this to sample store, and have it set audiobuffer itself
// todo type sample
