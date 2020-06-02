import React, { FunctionComponent } from 'react';
import { Upload } from '../../../util/hooks/useFirebaseFileUpload';

type Props = {
  uploads: Array<Upload>;
};

const UploadTasks: FunctionComponent<Props> = ({ uploads }) => {
  return (
    <ul>
      {uploads.map((upload) => {
        return <li>{upload.file.name}</li>;
      })}
    </ul>
  );
};

export default UploadTasks;
