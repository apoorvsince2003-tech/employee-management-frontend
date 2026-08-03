import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  status: Status;
}

// Generic data-fetching hook for the API-driven service layer.
// Returns loading/empty/error states plus a retry callback so every page
// can surface the three required states consistently.
export function useAsync<T>(
  factory: () => Promise<T>,
  deps: unknown[] = [],
): { data: T | null; loading: boolean; error: string | null; reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
  });

  // Keep the latest factory without re-running on every render while still
  // respecting the provided dependency list.
  const factoryRef = useRef(factory);
  factoryRef.current = factory;

  const run = useCallback(() => {
    let cancelled = false;
    setState({ data: null, error: null, status: 'loading' });
    factoryRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, status: 'success' });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load data.';
        setState({ data: null, error: message, status: 'error' });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cancel = run();
    return cancel;
  }, [run]);

  return {
    data: state.data,
    loading: state.status === 'loading',
    error: state.error,
    reload: run,
  };
}
