import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '../api/services'
import type { Product, ProductDto, UpdateProductDto } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsApi.getAll()
      setProducts(data ?? [])
    } catch {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (dto: ProductDto) => {
    await productsApi.create(dto)
    await fetch()
  }

  const update = async (dto: UpdateProductDto) => {
    await productsApi.update(dto)
    await fetch()
  }

  const remove = async (id: number) => {
    await productsApi.delete(id)
    await fetch()
  }

  return { products, loading, error, refetch: fetch, create, update, remove }
}
