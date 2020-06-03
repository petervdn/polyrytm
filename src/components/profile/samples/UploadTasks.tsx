import React, { FunctionComponent } from 'react';
import { Upload } from '../../../util/hooks/useFirebaseFileUpload';
import UploadTask from './UploadTask';

type Props = {
  uploads: Array<Upload>;
  onComplete: (upload: Upload) => void;
};

const UploadTasks: FunctionComponent<Props> = ({ uploads, onComplete }) => {
  return (
    <div>
      {uploads.map((upload) => {
        return (
          <UploadTask
            key={upload.task.snapshot.ref.fullPath}
            upload={upload}
            onComplete={() => onComplete(upload)}
          />
        );
      })}
    </div>
  );
};

export default UploadTasks;
