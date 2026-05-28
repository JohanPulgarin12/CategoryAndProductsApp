import { useState, useEffect, useCallback } from 'react'
import { categoriesApi } from '../api/services'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriesApi.getAll()
      setCategories(data ?? [])
    } catch {
      setError('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (dto: CreateCategoryDto) => {
    await categoriesApi.create(dto)
    await fetch()
  }

  const update = async (dto: UpdateCategoryDto) => {
    await categoriesApi.update(dto)
    await fetch()
  }

  const remove = async (id: number) => {
    await categoriesApi.delete(id)
    await fetch()
  }

  return { categories, loading, error, refetch: fetch, create, update, remove }
}
