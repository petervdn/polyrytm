import React, { useEffect } from 'react';
import { StyledError } from '../../styles';
import { FunctionComponent } from 'react';
import { useListFirebaseStorageFiles } from '../../../util/hooks/useListFirebaseStorageFiles';

type Props = {
  path: string;
};

export const CurrentSamples: FunctionComponent<Props> = ({ path }) => {
  const { items, load, isLoading, error } = useListFirebaseStorageFiles(path);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      {!isLoading && (
        <>
          <p>
            <strong>{path}</strong>
            <button onClick={load}>refresh</button>
          </p>
          {error && <StyledError>{error.message}</StyledError>}
          {!error && (
            <>
              {items.length > 0 ? (
                <ul>
                  {items.map((item) => (
                    <li key={item.fullPath}>
                      {item.name} ({item.fullPath})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No samples found</p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
