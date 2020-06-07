import { useEffect, useRef } from 'react';
import { Circ, TweenLite } from 'gsap';

export const useValueTween = (onUpdate?: (value: number) => void) => {
  // set the tween value as an object, because that's how gsap tweens
  const tweenValueRef = useRef({ value: 0 });

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      TweenLite.killTweensOf(tweenValueRef.current);
    };
  }, []);

  return (to: number, duration = 0.3) => {
    TweenLite.killTweensOf(tweenValueRef.current);

    // set current values
    // tweenValueRef.current.value = from;

    // and tween to destination
    TweenLite.to(tweenValueRef.current, duration, {
      value: to,
      ease: Circ.easeOut,
      onUpdate: () => {
        onUpdate && onUpdate(tweenValueRef.current.value);
      },
    });
  };
};
