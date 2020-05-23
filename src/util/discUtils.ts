import { DiscData, RingData } from '../data/interfaces';
import { getRandomInt } from './miscUtils';

export const createRandomDisc = () => {
  const disc: DiscData = { rings: [] };
  const numRings = getRandomInt(3, 7);
  for (let r = 0; r < numRings; r++) {
    const numItems = getRandomInt(3, 20);
    const ring: RingData = { items: [] };
    for (let i = 0; i < numItems; i++) {
      ring.items.push({ volume: Math.random() });
    }

    disc.rings.push(ring);
  }
  return disc;
};
