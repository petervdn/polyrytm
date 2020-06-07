import React, { FunctionComponent } from 'react';
import { StoredFile } from '../../../util/firebaseUtils';

type Props = {
  label: string;
  samples: Array<StoredFile>;
};

const SamplesList: FunctionComponent<Props> = ({ samples, label }) => {
  return (
    <>
      <p>
        <strong>{label}</strong>
      </p>
      {samples.length > 0 ? (
        <ul>
          {samples.map((sample) => (
            <li key={sample.fullPath}>
              {sample.name} ({sample.fullPath})
            </li>
          ))}
        </ul>
      ) : (
        <p>No samples found</p>
      )}
    </>
  );
};

export default SamplesList;
