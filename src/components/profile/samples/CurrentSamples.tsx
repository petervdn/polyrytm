import React, { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle } from 'react';
import { StyledError } from '../../styles';
import { useListFirebaseStorageFiles } from '../../../util/hooks/useListFirebaseStorageFiles';

type Props = {
  path: string;
};

export type CurrentSamplesRef = { load: () => void };

const CurrentSamples: ForwardRefRenderFunction<CurrentSamplesRef, Props> = ({ path }, ref) => {
  // todo probably get rid of the forwardRef-construction for reloading from the parent
  const { items, load, isLoading, error } = useListFirebaseStorageFiles(path);

  useEffect(() => {
    load();
  }, [load]);

  useImperativeHandle(ref, () => ({
    load,
  }));

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

export default forwardRef(CurrentSamples);
