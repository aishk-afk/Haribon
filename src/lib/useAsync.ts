import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "./api";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  setData: (value: T | null) => void;
}

/**
 * Runs `fetcher` on mount and whenever `reload()` is called.
 * `fetcher` must be a stable function (declared outside the component or wrapped in useCallback).
 */
export function useAsync<T>(fetcher: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, version]);

  const reload = useCallback(() => {
    setLoading(true);
    setVersion((v) => v + 1);
  }, []);

  return { data, loading, error, reload, setData };
}
