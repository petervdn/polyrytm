import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo } from 'react';
import { useGetAvailableSamples } from '../../util/hooks/useGetAvailableSamples';
import { store } from '../../store/RootStore';

type Props = {
  discIndex: number;
};

const DiscSampleSelect: FunctionComponent<Props> = ({ discIndex }) => {
  const { userStore, discStore } = store;
  const { userId } = userStore;
  const { discs, setSampleOnDisc } = discStore;
  const { samples } = useGetAvailableSamples(userId);

  const disc = useMemo(() => discs[discIndex], [discIndex, discs]);

  const sampleGroups = samples
    ? samples.user
      ? [samples.public, samples.user]
      : [samples.public]
    : [];
  return samples ? (
    <select
      value={disc.sample?.fullPath || ''} // todo is there a better way to not select anything?
      onChange={(event) => {
        setSampleOnDisc(discIndex, event.target.value);
        event.preventDefault();
      }}
    >
      <option value={''}>Select a sample</option>
      {sampleGroups.map((samplesInGroup, index) => {
        return (
          <React.Fragment key={index}>
            <option disabled={true}>{index === 0 ? 'Public samples' : 'Your samples'}</option>
            {samplesInGroup.map((sample) => (
              <option key={sample.fullPath} value={sample.fullPath}>
                {sample.name}
              </option>
            ))}
          </React.Fragment>
        );
      })}
    </select>
  ) : null;
};

export default observer(DiscSampleSelect);
