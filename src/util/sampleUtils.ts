import SampleManagerItemState from '../data/enum/SampleManagerItemState';

interface ISampleInDatabase {
  name: string;
  size: number;
  path: string;
}

interface ISampleManagerItem {
  name: string;
  file?: File;
  size: number;
  state: string;
}

export const createSampleManagerItemFromFile = (file: File): ISampleManagerItem => ({
  file,
  name: file.name,
  size: file.size,
  state: SampleManagerItemState.WAITING_TO_UPLOAD,
});

export const createSampleManagerItemFromSample = (
  sample: ISampleInDatabase,
): ISampleManagerItem => ({
  name: sample.name,
  size: sample.size,
  state: SampleManagerItemState.ADDED,
});
