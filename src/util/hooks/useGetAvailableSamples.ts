import { useFirebaseStorage } from './useFirebase';
import { AvailableSamples, getAvailableSamples } from '../firebaseUtils';
import { useCallback, useEffect, useState } from 'react';

export const useGetAvailableSamples = (userId: string | undefined) => {
  const { storageRef } = useFirebaseStorage();
  const [samples, setSamples] = useState<AvailableSamples>();
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(() => {
    setIsLoading(true);

    getAvailableSamples(storageRef, userId).then((result) => {
      setSamples(result);
      setIsLoading(false);
    });
  }, [storageRef, userId]);

  useEffect(() => {
    if (!userId) return;

    load();
  }, [load, storageRef, userId]);

  return { samples, isLoading, load };
};
