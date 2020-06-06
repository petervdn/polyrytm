import React, { FunctionComponent, useRef, useState } from 'react';
import { Upload, useFirebaseFileUpload } from '../../../util/hooks/useFirebaseFileUpload';
import { store } from '../../../store/RootStore';
import { observer } from 'mobx-react';
import { getUserSamplePath, publicSamplePath } from '../../../firebase/firebase.config';
import UploadTasks from './UploadTasks';

type Props = {
  onComplete?: (isPublic: boolean) => void;
};

const SampleUpload: FunctionComponent<Props> = ({ onComplete }) => {
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
    const path = isPublicUpload ? publicSamplePath : getUserSamplePath(userId);
    setUploads([...uploads, { file, task: upload(file, path) }]);
  };

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublicUpload(event.target.checked);
  };

  const onUploadComplete = (completedUpload: Upload) => {
    setUploads(uploads.filter((upload) => upload !== completedUpload));

    onComplete && onComplete(isPublicUpload);
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
      <UploadTasks uploads={uploads} onUploadComplete={onUploadComplete} />
    </>
  );
};

export default observer(SampleUpload);
