'use client'

import { useState, useCallback } from 'react'

interface FetchOptions extends RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}

export function useFetch<T = unknown>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (url: string, options: FetchOptions = {}): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = (await response.json()) as T
        return data
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { execute, loading, error }
}
