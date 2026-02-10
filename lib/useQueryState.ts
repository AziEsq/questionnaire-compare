'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const getQuery = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getQueryArray = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      return value ? value.split(',') : [];
    },
    [searchParams]
  );

  return { updateQuery, getQuery, getQueryArray };
}
