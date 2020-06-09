export const loadAudioBuffer = (url: string, audioContext: AudioContext) =>
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      console.log(arrayBuffer);
      return audioContext.decodeAudioData(arrayBuffer);
    })
    .catch((error) => {
      throw Error(`Error: ${error.message}`);
    });
