import type { ProductDto, CreateCategoryDto } from '../types'

export type ValidationErrors<T> = Partial<Record<keyof T, string>>

export function validateProduct(data: Partial<ProductDto>): ValidationErrors<ProductDto> {
  const errors: ValidationErrors<ProductDto> = {}

  if (!data.name?.trim()) errors.name = 'El nombre es requerido'
  else if (data.name.trim().length < 2) errors.name = 'Mínimo 2 caracteres'

  if (!data.sku?.trim()) errors.sku = 'El SKU es requerido'
  else if (!/^[A-Z0-9-_]+$/i.test(data.sku.trim())) errors.sku = 'Solo letras, números, guiones'

  if (data.price === undefined || data.price === null) errors.price = 'El precio es requerido'
  else if (data.price < 0) errors.price = 'El precio no puede ser negativo'

  if (data.stock === undefined || data.stock === null) errors.stock = 'El stock es requerido'
  else if (data.stock < 0) errors.stock = 'El stock no puede ser negativo'

  if (!data.categoryId) errors.categoryId = 'Selecciona una categoría'
  if (!data.statusId) errors.statusId = 'Selecciona un estado'

  return errors
}

export function validateCategory(data: Partial<CreateCategoryDto>): ValidationErrors<CreateCategoryDto> {
  const errors: ValidationErrors<CreateCategoryDto> = {}

  if (!data.name?.trim()) errors.name = 'El nombre es requerido'
  else if (data.name.trim().length < 2) errors.name = 'Mínimo 2 caracteres'

  if (!data.description?.trim()) errors.description = 'La descripción es requerida'

  return errors
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean)
}
