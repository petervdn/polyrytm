import React, { useState } from 'react';
import { useFirebaseFileUpload } from '../../util/hooks/useFirebaseFileUpload';
import * as firebase from 'firebase/app';
import { formatBytes } from '../../util/miscUtils';
import { CurrentSamples } from './CurrentSamples';

type Upload = {
  file: File;
  task: firebase.storage.UploadTask;
};

const Samples = () => {
  const { upload } = useFirebaseFileUpload();
  const [uploadTasks, setUploadTasks] = useState<Array<Upload>>([]);
  const [file, setFile] = useState<File | null>();
  const onUploadClick = () => {
    if (!file) return;
    setUploadTasks([...uploadTasks, { file, task: upload(file, 'samples') }]);
  };
  return (
    <>
      <h2>Samples</h2>

      <h3>Upload</h3>
      <input
        type={'file'}
        onChange={(e) => {
          setFile(e.target.files ? e.target.files[0] : null);
        }}
      />
      <button onClick={onUploadClick}>Upload</button>
      <ul>
        {uploadTasks.map((task, index) => (
          <li key={index}>
            {task.file.name} ({formatBytes(task.file.size)})
          </li>
        ))}
      </ul>

      <CurrentSamples path={'samples'} />
    </>
  );
};

export default Samples;
