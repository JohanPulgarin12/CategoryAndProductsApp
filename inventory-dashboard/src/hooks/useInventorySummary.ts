import { useState, useEffect, useCallback } from 'react'
import { inventoryApi } from '../api/services'
import type { InventorySummaryDto } from '../types'

export function useInventorySummary() {
  const [summary, setSummary] = useState<InventorySummaryDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await inventoryApi.getSummary()
      setSummary(data)
    } catch {
      setError('Error al cargar el resumen de inventario')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { summary, loading, error, refetch: fetch }
}
