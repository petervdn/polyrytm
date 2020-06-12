export interface LoadAudioBufferResult {
  audioBuffer: AudioBuffer;
  fileSize: number;
}

/**
 * Loads and decodes an audio-file, resulting in an AudioBuffer and the fileSize of the loaded file.
 * @param {AudioContext} context
 * @param {string} url
 * @param {(value: number) => void} onProgress
 * @returns {Promise<LoadAudioBufferResult>}
 */
export function loadAudioBuffer(
  context: AudioContext,
  url: string,
  onProgress?: (value: number) => void,
): Promise<LoadAudioBufferResult> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // listen to onprogress events if onProgress was supplied
    if (onProgress) {
      request.onprogress = (event) => {
        onProgress(event.loaded / event.total);
      };
    }

    request.onload = () => {
      if (request.status === 200) {
        const fileSize = request.response.byteLength;
        const decodePromise = context.decodeAudioData(
          request.response,
          (audioBuffer) => {
            resolve({
              audioBuffer,
              fileSize,
            });
          },
          (error) => {
            reject(error);
          },
        );

        // not all implementations use this promise (was later added to the API). if they do
        // we're catching (and ignoring) errors that may occur through here. these errors are
        // handled by the onError method in the decodeAudioData call (3rd param)
        if (decodePromise) {
          decodePromise.catch(() => {});
        }
      } else {
        reject(`Error loading '${url}' (${request.status})`);
      }
    };

    request.onerror = (error) => {
      reject(error);
    };

    request.send();
  });
}
