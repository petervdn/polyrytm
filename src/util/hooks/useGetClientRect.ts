import { useCallback, useRef, useState } from 'react';
import { useOnWindowResize } from './useOnWindowResize';

const getRect = (element: HTMLElement | null): ClientRect | undefined =>
  element ? element.getBoundingClientRect() : undefined;

export const useGetClientRect = () => {
  const [rect, setRect] = useState<ClientRect | undefined>();
  const elementRef = useRef<HTMLElement | null>();
  const ref = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;

    setRect(getRect(element));
  }, []);

  useOnWindowResize(() => {
    setRect(elementRef.current ? getRect(elementRef.current) : undefined);
  });

  return { ref, rect };
};
