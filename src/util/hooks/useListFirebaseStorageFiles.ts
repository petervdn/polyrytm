import { useFirebaseStorage } from './useFirebase';
import { useCallback, useMemo, useState } from 'react';
import * as firebase from 'firebase/app';

export const useListFirebaseStorageFiles = (path: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Array<firebase.storage.Reference>>([]);
  const { storageRef } = useFirebaseStorage();

  const listRef = useMemo(() => storageRef.child(path), [path, storageRef]);

  const load = useCallback(() => {
    setItems([]);
    setIsLoading(true);
    listRef.listAll().then((result) => {
      setItems(result.items);
      setIsLoading(false);
    });
  }, [listRef]);

  return { items, load, isLoading };
};
