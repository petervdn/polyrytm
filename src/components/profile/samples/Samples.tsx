import React, { useRef } from 'react';
import CurrentSamples, { CurrentSamplesRef } from './CurrentSamples';
import SampleUpload from './SampleUpload';
import { store } from '../../../store/RootStore';
import { observer } from 'mobx-react';
import { getUserSamplePath, publicSamplePath } from '../../../firebase/firebase.config';

const Samples = () => {
  const { userStore } = store;
  const { isAdmin, userId } = userStore;
  const publicSamplesRef = useRef<CurrentSamplesRef>(null);
  const userSamplesRef = useRef<CurrentSamplesRef>(null);

  return (
    <>
      <h2>Samples</h2>

      <h3>Upload</h3>
      <SampleUpload
        onComplete={(isPublic) => {
          const ref = isPublic ? publicSamplesRef : userSamplesRef;
          ref.current && ref.current.load();
        }}
      />
      <h3>Current samples</h3>
      {isAdmin && <CurrentSamples path={publicSamplePath} ref={publicSamplesRef} />}
      {userId && <CurrentSamples path={getUserSamplePath(userId)} ref={userSamplesRef} />}
    </>
  );
};

export default observer(Samples);
