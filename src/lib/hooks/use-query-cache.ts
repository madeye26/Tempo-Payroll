import { useState, useEffect } from "react";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiry: number;
};

type QueryCache = {
  [key: string]: CacheEntry<any>;
};

// In-memory cache
const cache: QueryCache = {};

/**
 * Custom hook for data fetching with caching
 * @param key Unique key for the query
 * @param fetchFn Function that returns a promise with the data
 * @param options Configuration options
 * @returns Query result with loading, error, and data states
 */
export function useQueryCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    refetchInterval?: number | false;
    staleTime?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    initialData?: T;
  } = {},
) {
  const {
    enabled = true,
    refetchInterval = false,
    staleTime = 5 * 60 * 1000, // 5 minutes by default
    onSuccess,
    onError,
    initialData,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (skipCache = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first if not skipping cache
      if (!skipCache && cache[key]) {
        const cacheEntry = cache[key];
        const now = Date.now();

        // If cache is still valid
        if (now < cacheEntry.expiry) {
          setData(cacheEntry.data);
          setIsLoading(false);
          onSuccess?.(cacheEntry.data);
          return;
        }
      }

      // Fetch fresh data
      const result = await fetchFn();

      // Update cache
      cache[key] = {
        data: result,
        timestamp: Date.now(),
        expiry: Date.now() + staleTime,
      };

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [key, enabled]);

  // Set up refetch interval if specified
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, key, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchData(true), // Force refetch
    invalidateCache: () => {
      if (cache[key]) {
        delete cache[key];
      }
    },
  };
}

/**
 * Manually invalidate a cache entry
 * @param key The cache key to invalidate
 */
export function invalidateCache(key: string) {
  if (cache[key]) {
    delete cache[key];
  }
}

/**
 * Manually invalidate all cache entries
 */
export function invalidateAllCache() {
  Object.keys(cache).forEach((key) => {
    delete cache[key];
  });
}

/**
 * Manually set a cache entry
 * @param key The cache key
 * @param data The data to cache
 * @param staleTime Time in milliseconds until the cache expires
 */
export function setCache<T>(key: string, data: T, staleTime = 5 * 60 * 1000) {
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + staleTime,
  };
}
