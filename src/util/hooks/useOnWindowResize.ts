import { useEffect } from 'react';

export const useOnWindowResize = (callback: () => void) => {
  useEffect(() => {
    window.addEventListener('resize', callback);

    return () => {
      window.removeEventListener('resize', callback);
    };
  }, [callback]);
};
