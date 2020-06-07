import React from 'react';
import SampleUpload from './SampleUpload';
import { store } from '../../../store/RootStore';
import { observer } from 'mobx-react';
import SamplesList from './SamplesList';
import { useGetAvailableSamples } from '../../../util/hooks/useGetAvailableSamples';

const ProfileSamples = () => {
  const { userStore } = store;
  const { isAdmin, userId } = userStore;

  const { samples } = useGetAvailableSamples(userId);

  return (
    <>
      <h2>Samples</h2>
      {samples && (
        <>
          {samples.user && <SamplesList label={'User'} samples={samples.user} />}
          {isAdmin && <SamplesList label={'Public'} samples={samples.public} />}
        </>
      )}
      <h3>Upload</h3>
      <SampleUpload onComplete={() => {}} />
    </>
  );
};

export default observer(ProfileSamples);
