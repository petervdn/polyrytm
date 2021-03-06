import React, { FunctionComponent } from 'react';
import { Upload } from '../../../util/hooks/useFirebaseFileUpload';
import UploadTask from './UploadTask';

type Props = {
  uploads: Array<Upload>;
  onUploadComplete: (upload: Upload) => void;
};

const UploadTasks: FunctionComponent<Props> = ({ uploads, onUploadComplete }) => {
  return (
    <div>
      {uploads.map((upload) => {
        return (
          <UploadTask
            key={upload.task.snapshot.ref.fullPath}
            upload={upload}
            onComplete={() => onUploadComplete(upload)}
          />
        );
      })}
    </div>
  );
};

export default UploadTasks;
