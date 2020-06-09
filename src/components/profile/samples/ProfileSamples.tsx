import React from 'react';
import SampleUpload from './SampleUpload';
import { store } from '../../../store/RootStore';
import { observer } from 'mobx-react';
import SamplesList from './SamplesList';
import { useGetAvailableSampleFiles } from '../../../util/hooks/useGetAvailableSampleFiles';

const ProfileSamples = () => {
  const { userStore } = store;
  const { isAdmin, userId } = userStore;

  const { sampleFiles } = useGetAvailableSampleFiles(userId);

  return (
    <>
      <h2>Samples</h2>
      {sampleFiles && (
        <>
          {sampleFiles.user && <SamplesList label={'User'} samples={sampleFiles.user} />}
          {isAdmin && <SamplesList label={'Public'} samples={sampleFiles.public} />}
        </>
      )}
      <h3>Upload</h3>
      <SampleUpload onComplete={() => {}} />
    </>
  );
};

export default observer(ProfileSamples);
