import SampleManagerItemState from '../data/enum/SampleManagerItemState';

// todo better name
interface ISampleInDatabase {
  name: string;
  size: number;
  path?: string;
}

// todo better name
interface ISampleManagerItemData extends ISampleInDatabase {
  uploadData?: IUploadData;
}

interface IUploadData {
  file?: File;
  state: string;
}

export const createSampleManagerItemFromFile = (file: File): ISampleManagerItemData => ({
  name: file.name,
  size: file.size,
  uploadData: {
    file,
    state: SampleManagerItemState.WAITING_TO_UPLOAD,
  },
});
