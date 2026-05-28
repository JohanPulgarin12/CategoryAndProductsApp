import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useInventorySummary } from '../hooks/useInventorySummary'
import * as services from '../api/services'
import type { InventorySummaryDto } from '../types'

const mockSummary: InventorySummaryDto = {
  totalInventoryValue: 5000000,
  occupationPercentage: 72.5,
  inventoryByCategory: [
    { category: 'Electrónica', totalValue: 3000000 },
    { category: 'Ropa', totalValue: 2000000 },
  ],
  criticalProducts: [
    { product: 'Laptop', stock: 2, criticalStock: 5 },
  ],
}

describe('useInventorySummary', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads summary data on mount', async () => {
    vi.spyOn(services.inventoryApi, 'getSummary').mockResolvedValue(mockSummary)

    const { result } = renderHook(() => useInventorySummary())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.summary).toEqual(mockSummary)
    expect(result.current.error).toBeNull()
  })

  it('sets error when API fails', async () => {
    vi.spyOn(services.inventoryApi, 'getSummary').mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useInventorySummary())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.summary).toBeNull()
    expect(result.current.error).toBe('Error al cargar el resumen de inventario')
  })

  it('refetch reloads data', async () => {
    const spy = vi.spyOn(services.inventoryApi, 'getSummary').mockResolvedValue(mockSummary)

    const { result } = renderHook(() => useInventorySummary())
    await waitFor(() => expect(result.current.loading).toBe(false))

    result.current.refetch()
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(spy).toHaveBeenCalledTimes(2)
  })
})
