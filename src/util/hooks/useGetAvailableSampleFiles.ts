import { useFirebaseStorage } from './useFirebase';
import { AvailableSampleFiles, getAvailableSampleFiles } from '../firebaseUtils';
import { useCallback, useEffect, useState } from 'react';

export const useGetAvailableSampleFiles = (userId: string | undefined) => {
  const { storageRef } = useFirebaseStorage();
  const [sampleFiles, setSampleFiles] = useState<AvailableSampleFiles>();
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(() => {
    setIsLoading(true);

    getAvailableSampleFiles(storageRef, userId).then((result) => {
      setSampleFiles(result);
      setIsLoading(false);
    });
  }, [storageRef, userId]);

  useEffect(() => {
    if (!userId) return;

    load();
  }, [load, storageRef, userId]);

  return { sampleFiles, isLoading, load };
};
