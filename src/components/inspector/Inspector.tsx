import React from 'react';
import { store } from '../../store/RootStore';
import { observer } from 'mobx-react';

const Inspector = () => {
  const { interactionStore } = store;
  const { selected, hovered } = interactionStore;

  return (
    <>
      <h2>inspector</h2>
      <div>selection: {selected && JSON.stringify(selected)}</div>
      <div>hovered: {hovered && JSON.stringify(hovered)}</div>
    </>
  );
};

export default observer(Inspector);
