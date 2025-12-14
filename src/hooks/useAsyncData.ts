import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncDataResult<T> extends AsyncDataState<T> {
  refetch: () => Promise<void>;
}

interface UseAsyncDataOptions {
  immediate?: boolean;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions = { immediate: true }
): UseAsyncDataResult<T> {
  const [state, setState] = useState<AsyncDataState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  });

  const isMountedRef = useRef<boolean>(true);
  const fetchFnRef = useRef(fetchFn);

  // Update the ref in an effect to avoid updating during render
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const fetchData = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFnRef.current();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    if (options.immediate) {
      const runFetch = async (): Promise<void> => {
        if (cancelled) return;
        await fetchData();
      };
      void runFetch();
    }

    return () => {
      cancelled = true;
      isMountedRef.current = false;
    };
  }, [fetchData, options.immediate]);

  return {
    ...state,
    refetch: fetchData,
  };
}

export default useAsyncData;
