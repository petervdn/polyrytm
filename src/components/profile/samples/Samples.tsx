import React from 'react';
import { CurrentSamples } from './CurrentSamples';
import SampleUpload from './SampleUpload';
import { store } from '../../../store/RootStore';
import { observer } from 'mobx-react';
import { getUserSamplePath, publicSamplePath } from '../../../firebase/firebase.config';

const Samples = () => {
  const { userStore } = store;
  const { isAdmin, userId } = userStore;

  return (
    <>
      <h2>Samples</h2>

      <h3>Upload</h3>
      <SampleUpload />
      <h3>Current samples</h3>
      {isAdmin && <CurrentSamples path={publicSamplePath} />}
      {userId && <CurrentSamples path={getUserSamplePath(userId)} />}
    </>
  );
};

export default observer(Samples);
