import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo } from 'react';
import { useGetAvailableSampleFiles } from '../../util/hooks/useGetAvailableSampleFiles';
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
  const { sampleFiles, isLoading } = useGetAvailableSampleFiles(userId);

  const disc = useMemo(() => discs[discIndex], [discIndex, discs]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return sampleFiles ? (
    <select
      value={disc.sample?.fullPath || ''} // todo is there a better way to not select anything?
      onChange={(event) => {
        // find the sample (we need the name, probably better ways to do this)
        const sample = [...sampleFiles.public, ...(sampleFiles?.user || [])].find(
          (s) => s.fullPath === event.target.value,
        );
        sample && setSampleOnDisc(discIndex, sample.name, sample.fullPath);
      }}
    >
      <option value={''}>Select a sample</option>
      {sampleGroups
        .filter((group) => !!sampleFiles[group.key])
        .map((group) => {
          const samplesInGroup = sampleFiles[group.key]!; // ! because we filtered above

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
