import { useCallback } from 'react';
import { store } from '../../store/RootStore';

export const useDiscInteraction = (discIndex: number) => {
  const { interactionStore } = store;
  const { setHovered, setHoverAsSelected } = interactionStore;

  const onMouseEnter = useCallback(() => {
    setHovered({ discIndex });
  }, [discIndex, setHovered]);

  const onMouseLeave = () => {
    setHovered(undefined);
  };

  const onMouseMove = () => {
    // setHovered({ discIndex });
  };
  const onClick = () => {
    setHoverAsSelected();
  };

  return { onMouseEnter, onMouseLeave, onClick, onMouseMove };
};
