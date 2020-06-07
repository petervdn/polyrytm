import React, { FunctionComponent, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import { StyledError } from '../../styles';
import { Upload } from '../../../util/hooks/useFirebaseFileUpload';
import styled from 'styled-components';

type Props = {
  upload: Upload;
  onComplete: () => void;
};

const barHeight = 20;

const Wrapper = styled.div`
  background-color: lightgray;
  position: relative;
  height: ${barHeight}px;
`;

const BarText = styled.div`
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 10;
`;

const UploadTask: FunctionComponent<Props> = ({ upload, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const dispose = upload.task.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      setError,
      () => {
        setProgress(100);
        setTimeout(onComplete, 1000); // todo: not sure if this is the best approach
      },
    );

    return () => {
      dispose();
    };
  }, [onComplete, upload.task]);

  return (
    <Wrapper>
      {error && <StyledError>{error.message}</StyledError>}
      {!error && (
        <>
          <BarText>
            Uploading {upload.task.snapshot.ref.name} ({progress.toFixed(0)}%)
          </BarText>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'slategrey',
            }}
          />
        </>
      )}
    </Wrapper>
  );
};

export default UploadTask;
