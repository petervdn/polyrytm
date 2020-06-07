import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { DiscData } from '../../data/interfaces';
import { useGetAvailableSamples } from '../../util/hooks/useGetAvailableSamples';
import { store } from '../../store/RootStore';

type Props = {
  disc: DiscData;
};

const DiscSampleSelect: FunctionComponent<Props> = () => {
  const { userStore } = store;
  const { userId } = userStore;

  const { samples } = useGetAvailableSamples(userId);

  return samples ? (
    <select>
      <option>Select a sample</option>
      {(samples.user ? [samples.public, samples.user] : [samples.public]).map(
        (samplesInCategory, index) => {
          return (
            <>
              <option disabled={true}>{index === 0 ? 'Public samples' : 'Your samples'}</option>
              {samplesInCategory.map((sample) => (
                <option key={sample.fullPath} value={sample.fullPath}>
                  {sample.name}
                </option>
              ))}
            </>
          );
        },
      )}
    </select>
  ) : null;
};

export default observer(DiscSampleSelect);
