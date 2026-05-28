import { describe, it, expect } from 'vitest'
import { validateProduct, validateCategory, hasErrors } from '../utils/validators'

describe('validateProduct', () => {
  const valid = {
    name: 'Laptop',
    sku: 'LAP-001',
    description: 'Test',
    price: 1500000,
    stock: 10,
    criticalStock: 3,
    categoryId: 1,
    statusId: 1,
  }

  it('passes with valid data', () => {
    const errors = validateProduct(valid)
    expect(hasErrors(errors)).toBe(false)
  })

  it('requires name', () => {
    const errors = validateProduct({ ...valid, name: '' })
    expect(errors.name).toBeDefined()
  })

  it('rejects name too short', () => {
    const errors = validateProduct({ ...valid, name: 'A' })
    expect(errors.name).toBeDefined()
  })

  it('requires SKU', () => {
    const errors = validateProduct({ ...valid, sku: '' })
    expect(errors.sku).toBeDefined()
  })

  it('rejects invalid SKU characters', () => {
    const errors = validateProduct({ ...valid, sku: 'SKU con espacios!' })
    expect(errors.sku).toBeDefined()
  })

  it('rejects negative price', () => {
    const errors = validateProduct({ ...valid, price: -1 })
    expect(errors.price).toBeDefined()
  })

  it('rejects negative stock', () => {
    const errors = validateProduct({ ...valid, stock: -5 })
    expect(errors.stock).toBeDefined()
  })

  it('requires categoryId', () => {
    const errors = validateProduct({ ...valid, categoryId: 0 })
    expect(errors.categoryId).toBeDefined()
  })

  it('requires statusId', () => {
    const errors = validateProduct({ ...valid, statusId: 0 })
    expect(errors.statusId).toBeDefined()
  })

  it('allows stock of 0', () => {
    const errors = validateProduct({ ...valid, stock: 0 })
    expect(errors.stock).toBeUndefined()
  })

  it('allows price of 0', () => {
    const errors = validateProduct({ ...valid, price: 0 })
    expect(errors.price).toBeUndefined()
  })
})

describe('validateCategory', () => {
  const valid = { name: 'Electrónica', description: 'Dispositivos electrónicos' }

  it('passes with valid data', () => {
    expect(hasErrors(validateCategory(valid))).toBe(false)
  })

  it('requires name', () => {
    const errors = validateCategory({ ...valid, name: '' })
    expect(errors.name).toBeDefined()
  })

  it('requires description', () => {
    const errors = validateCategory({ ...valid, description: '' })
    expect(errors.description).toBeDefined()
  })

  it('rejects name too short', () => {
    const errors = validateCategory({ ...valid, name: 'A' })
    expect(errors.name).toBeDefined()
  })
})

describe('hasErrors', () => {
  it('returns false when no errors', () => {
    expect(hasErrors({})).toBe(false)
    expect(hasErrors({ name: undefined })).toBe(false)
  })

  it('returns true when there are errors', () => {
    expect(hasErrors({ name: 'El nombre es requerido' })).toBe(true)
  })
})
