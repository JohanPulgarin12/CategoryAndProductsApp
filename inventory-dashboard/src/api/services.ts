import api from './axiosInstance'
import type {
  TokenRequest, AuthResponse,
  Product, ProductDto, UpdateProductDto,
  Category, CreateCategoryDto, UpdateCategoryDto,
  InventorySummaryDto,
} from '../types'

// Auth
export const authApi = {
  login: (data: TokenRequest) =>
    api.post<AuthResponse>('/api/Token/Authentication', data).then(r => r.data),
}

// Products
export const productsApi = {
  getAll: () =>
    api.get<Product[]>('/api/Products/GetProducts').then(r => r.data),
  getById: (id: number) =>
    api.get<Product>(`/api/Products/GetProductById/${id}`).then(r => r.data),
  create: (dto: ProductDto) =>
    api.post('/api/Products/CreateProduct', dto).then(r => r.data),
  update: (dto: UpdateProductDto) =>
    api.patch('/api/Products/UpdateProduct', dto).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/api/Products/DeleteProduct/${id}`).then(r => r.data),
}

// Categories
export const categoriesApi = {
  getAll: () =>
    api.get<Category[]>('/api/Categories/GetCategories').then(r => r.data),
  getById: (id: number) =>
    api.get<Category>(`/api/Categories/GetCategoryById/${id}`).then(r => r.data),
  create: (dto: CreateCategoryDto) =>
    api.post('/api/Categories/CreateCategory', dto).then(r => r.data),
  update: (dto: UpdateCategoryDto) =>
    api.put('/api/Categories/UpdateCategory', dto).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/api/Categories/DeleteCategory/${id}`).then(r => r.data),
}

// Inventory
export const inventoryApi = {
  getSummary: () =>
    api.get<InventorySummaryDto>('/api/Inventory/summary').then(r => r.data),
}
