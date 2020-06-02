import React, { useRef, useState } from 'react';
import { Upload, useFirebaseFileUpload } from '../../../util/hooks/useFirebaseFileUpload';
import * as firebase from 'firebase';
import { store } from '../../../store/RootStore';
import { observer } from 'mobx-react';
import { getUserSamplePath, publicSamplePath } from '../../../firebase/firebase.config';
import UploadTasks from './UploadTasks';

const SampleUpload = () => {
  const { userStore } = store;
  const { isAdmin, userId } = userStore;
  const { upload } = useFirebaseFileUpload();
  const [isPublicUpload, setIsPublicUpload] = useState(false);
  const [uploads, setUploads] = useState<Array<Upload>>([]);
  const [file, setFile] = useState<File | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = () => {
    if (!file || !userId || !fileInputRef.current) return;
    fileInputRef.current.value = ''; // clears the file input
    const uploadPath = isPublicUpload ? publicSamplePath : getUserSamplePath(userId);
    setUploads([...uploads, upload(file, uploadPath)]);
  };

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublicUpload(event.target.checked);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type={'file'}
        onChange={(event) => {
          setFile(event.target.files ? event.target.files[0] : null);
        }}
      />
      {isAdmin && (
        <label>
          <input type={'checkbox'} checked={isPublicUpload} onChange={onCheckboxChange} />
          public
        </label>
      )}
      <button onClick={onUploadClick}>Upload</button>
      <UploadTasks uploads={uploads} />
    </>
  );
};

export default observer(SampleUpload);
