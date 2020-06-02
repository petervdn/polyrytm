import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { useListFirebaseStorageFiles } from '../../util/hooks/useListFirebaseStorageFiles';

type Props = {
  path: string;
};

export const CurrentSamples: FunctionComponent<Props> = ({ path }) => {
  const { items, load } = useListFirebaseStorageFiles(path);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <h3>Current samples</h3>
      <button onClick={load}>refresh</button>
      <ul>
        {items.map((item) => (
          <li key={item.fullPath}>
            {item.name} ({item.fullPath})
          </li>
        ))}
      </ul>
    </>
  );
};
