
export interface TokenRequest {
  user: string
  password: string
}

export interface AuthResponse {
  token: string
}


export interface Product {
  id: number
  name: string
  sku: string
  description: string
  price: number
  stock: number
  criticalStock: number
  categoryId: number
  statusId: number
  category?: { id: number; name: string; description: string; isActive: boolean }
  status?: { id: number; name: string }
  createdAt: string
  isActive: boolean
}

export interface ProductDto {
  name: string
  sku: string
  description: string
  price: number
  stock: number
  criticalStock: number
  categoryId: number
  statusId: number
}

export interface UpdateProductDto extends ProductDto {
  id: number
}

// Categories
export interface Category {
  id: number
  name: string
  description: string
  isActive: boolean
}

export interface CreateCategoryDto {
  name: string
  description: string
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  id: number
}


export interface CategoryInventoryDto {
  category: string
  totalValue: number
}

export interface CriticalStockDto {
  product: string
  stock: number
  criticalStock: number
}

export interface InventorySummaryDto {
  totalInventoryValue: number
  inventoryByCategory: CategoryInventoryDto[]
  criticalProducts: CriticalStockDto[]
  occupationPercentage: number
}


export type ViewMode = 'list' | 'grid'
export type ModalMode = 'create' | 'edit' | null
