import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo } from 'react';
import { useGetAvailableSamples } from '../../util/hooks/useGetAvailableSamples';
import { store } from '../../store/RootStore';

type Props = {
  discIndex: number;
};

const sampleGroups = [
  { key: 'public' as const, label: 'Public samples' },
  { key: 'user' as const, label: 'User samples' },
];

const DiscSampleSelect: FunctionComponent<Props> = ({ discIndex }) => {
  const { userStore, discStore } = store;
  const { userId } = userStore;
  const { discs, setSampleOnDisc } = discStore;
  const { samples } = useGetAvailableSamples(userId);

  const disc = useMemo(() => discs[discIndex], [discIndex, discs]);

  return samples ? (
    <select
      value={disc.sample?.fullPath || ''} // todo is there a better way to not select anything?
      onChange={(event) => {
        setSampleOnDisc(discIndex, event.target.value);
        event.preventDefault();
      }}
    >
      <option value={''}>Select a sample</option>
      {sampleGroups
        .filter((group) => !!samples[group.key])
        .map((group) => {
          const samplesInGroup = samples[group.key]!; // ! because we filtered above

          return samplesInGroup.map((sample, index) => (
            <React.Fragment key={index}>
              {index === 0 && <option disabled={true}>{group.label}</option>}
              <option key={sample.fullPath} value={sample.fullPath}>
                {sample.name}
              </option>
            </React.Fragment>
          ));
        })}
    </select>
  ) : null;
};

export default observer(DiscSampleSelect);
