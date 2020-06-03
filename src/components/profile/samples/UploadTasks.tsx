import React, { FunctionComponent } from 'react';
import { Upload } from '../../../util/hooks/useFirebaseFileUpload';
import UploadTask from './UploadTask';

type Props = {
  uploads: Array<Upload>;
};

const UploadTasks: FunctionComponent<Props> = ({ uploads }) => {
  return (
    <div>
      {uploads.map((upload) => {
        return <UploadTask key={upload.task.snapshot.ref.fullPath} upload={upload} />;
      })}
    </div>
  );
};

export default UploadTasks;
