// import * as firebase from 'firebase/app';
// import 'firebase/storage';
// import axios from 'axios';
//
// export function loadSample(sample, onProgress?: (value: number) => void): Promise<AudioBuffer> {
//   return new Promise((resolve, reject) => {
//     if (sample.audioBuffer) {
//       resolve(sample.audioBuffer);
//     } else {
//       firebase
//         .storage()
//         .ref(sample.path)
//         .getDownloadURL()
//         .then(url =>
//           axios.get(url, {
//             responseType: 'arraybuffer',
//             onDownloadProgress: (event: ProgressEvent) => {
//               if (onProgress) {
//                 onProgress(event.loaded / event.total);
//               }
//             },
//           }),
//         )
//         .then(loadedResult => audioContext.decodeAudioData(loadedResult.data))
//         .then(decodedAudioBuffer => resolve(decodedAudioBuffer))
//         .catch(error => {
//           // todo differentiate between different errors here?
//           reject(error);
//         });
//     }
//   });
// }
