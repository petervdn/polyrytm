import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { useListFirebaseStorageFiles } from '../../../util/hooks/useListFirebaseStorageFiles';
import styled from 'styled-components';

type Props = {
  path: string;
};

const StyledError = styled.div`
  background-color: palevioletred;
  padding: 10px;
`;

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
  );
};
