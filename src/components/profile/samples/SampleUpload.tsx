import React, { useState } from 'react';
import { useFirebaseFileUpload } from '../../../util/hooks/useFirebaseFileUpload';
import * as firebase from 'firebase';

type Upload = {
  file: File;
  task: firebase.storage.UploadTask;
};

const SampleUpload = () => {
  const { upload } = useFirebaseFileUpload();
  const [uploadTasks, setUploadTasks] = useState<Array<Upload>>([]);
  const [file, setFile] = useState<File | null>();
  const onUploadClick = () => {
    if (!file) return;
    setUploadTasks([...uploadTasks, { file, task: upload(file, 'samples') }]);
  };

  return <>
    <h3>Upload</h3>
    <input
      type={'file'}
      onChange={(e) => {
        setFile(e.target.files ? e.target.files[0] : null);
      }}
    />
    <button onClick={onUploadClick}>Upload</button>
  </>;
}

export default SampleUpload;