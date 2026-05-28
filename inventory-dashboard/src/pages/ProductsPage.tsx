import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { validateProduct, hasErrors } from '../utils/validators'
import type { ProductDto, UpdateProductDto, ModalMode } from '../types'

const STATUSES = [
  { id: 1, name: 'Activo' },
  { id: 2, name: 'Inactivo' },
  { id: 3, name: 'Agotado' },
  { id: 4, name: 'Descontinuado' },
]
const PAGE_SIZE = 8

const EMPTY: ProductDto = { name: '', sku: '', description: '', price: 0, stock: 0, criticalStock: 5, categoryId: 0, statusId: 1 }

export default function ProductsPage() {
  const { products, loading, error, create, update, remove } = useProducts()
  const { categories } = useCategories()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<ModalMode>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductDto>(EMPTY)
  const [formErrors, setFormErrors] = useState<Partial<ProductDto>>({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

const filtered = useMemo(() => {
  const q = search.toLowerCase()

  return products.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.sku || '').toLowerCase().includes(q) ||
    (p.category?.name || '').toLowerCase().includes(q)
  )
}, [products, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => {
    setForm(EMPTY)
    setFormErrors({})
    setEditId(null)
    setModal('create')
  }

  const openEdit = (id: number) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    setForm({ name: p.name, sku: p.sku, description: p.description, price: p.price, stock: p.stock, criticalStock: p.criticalStock, categoryId: p.categoryId, statusId: p.statusId })
    setFormErrors({})
    setEditId(id)
    setModal('edit')
  }

  const handleChange = (field: keyof ProductDto, value: string | number) => {
    const next = { ...form, [field]: value }
    setForm(next)
    const errs = validateProduct(next)
    setFormErrors(errs as Partial<ProductDto>)
  }

  const handleSave = async () => {
    const errs = validateProduct(form)
    if (hasErrors(errs)) { setFormErrors(errs as Partial<ProductDto>); return }
    setSaving(true)
    try {
      if (modal === 'create') await create(form)
      else if (modal === 'edit' && editId) await update({ ...form, id: editId } as UpdateProductDto)
      setModal(null)
    } catch { /* handled by hook */ }
    finally { setSaving(false) }
  }

const handleDelete = async (id: number) => {
  try {
    await remove(id)
    setDeleteId(null)
  } catch {
    console.error('Error al eliminar')
  }
}

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-sans font-bold text-2xl">Productos</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} productos en inventario</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-acid-400 hover:bg-acid-500 text-ink-950 font-sans font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por nombre, SKU o categoría..."
          className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-4 py-3 text-white font-sans text-sm placeholder-slate-600 focus:outline-none focus:border-acid-400 transition-colors"
        />
      </div>

      {loading && <div className="flex justify-center h-40 items-center"><div className="w-7 h-7 border-2 border-acid-400 border-t-transparent rounded-full animate-spin" /></div>}
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Table */}
      {!loading && (
        <div className="bg-ink-800 border border-ink-600 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-600">
                {['Nombre', 'SKU', 'Categoría', 'Precio', 'Stock', 'Estado', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-sans font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-slate-600 text-sm">Sin resultados</td></tr>
              )}
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-ink-700 hover:bg-ink-700/40 transition-colors">
                  <td className="px-5 py-4 text-white text-sm font-sans font-medium">{p.name}</td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-xs">{p.sku}</td>
                  <td className="px-5 py-4 text-slate-400 text-sm">{p.category?.name ?? `Cat. ${p.categoryId}`}</td>
                  <td className="px-5 py-4 text-acid-400 font-mono text-sm">{fmt(p.price)}</td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-sm font-medium ${p.stock <= p.criticalStock ? 'text-red-400' : 'text-green-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-sans px-2.5 py-1 rounded-lg ${
                      !p.isActive
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-ink-700 text-slate-300'
                    }`}>
                      {!p.isActive ? 'Inactivo' : (p.status?.name ?? `Estado ${p.statusId}`)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-acid-400 hover:bg-acid-400/10 transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-ink-600">
              <span className="text-slate-500 text-xs font-sans">
                Página {page} de {totalPages} · {filtered.length} resultados
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans text-slate-400 hover:text-white hover:bg-ink-700 disabled:opacity-30 transition-all">
                  ← Anterior
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans text-slate-400 hover:text-white hover:bg-ink-700 disabled:opacity-30 transition-all">
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-ink-800 border border-ink-600 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-600">
              <h2 className="text-white font-sans font-semibold text-base">
                {modal === 'create' ? 'Nuevo producto' : 'Editar producto'}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Fields */}
              {([
                ['name', 'Nombre', 'text'],
                ['sku', 'SKU', 'text'],
                ['description', 'Descripción', 'text'],
                ['price', 'Precio', 'number'],
                ['stock', 'Stock', 'number'],
                ['criticalStock', 'Stock crítico', 'number'],
              ] as [keyof ProductDto, string, string][]).map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-xs text-slate-400 font-sans mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[field] as string | number}
                    onChange={e => handleChange(field, type === 'number' ? +e.target.value : e.target.value)}
                    onFocus={e => { if (type === 'number' && +e.target.value === 0) e.target.value = '' }}
                    onBlur={e => { if (type === 'number' && e.target.value === '') handleChange(field, 0) }}
                    className={`w-full bg-ink-700 border rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none transition-colors ${
                      (formErrors as Record<string, string>)[field] ? 'border-red-500' : 'border-ink-600 focus:border-acid-400'
                    }`}
                  />
                  {(formErrors as Record<string, string>)[field] && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {(formErrors as Record<string, string>)[field]}
                    </p>
                  )}
                </div>
              ))}

              {/* Category */}
              <div>
                <label className="block text-xs text-slate-400 font-sans mb-1.5">Categoría</label>
                <select
                  value={form.categoryId}
                  onChange={e => handleChange('categoryId', +e.target.value)}
                  className="w-full bg-ink-700 border border-ink-600 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:border-acid-400 transition-colors"
                >
                  <option value={0}>Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs text-slate-400 font-sans mb-1.5">Estado</label>
                <select
                  value={form.statusId}
                  onChange={e => handleChange('statusId', +e.target.value)}
                  className="w-full bg-ink-700 border border-ink-600 rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:border-acid-400 transition-colors"
                >
                  {STATUSES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-ink-600">
              <button onClick={() => setModal(null)} className="flex-1 bg-ink-700 hover:bg-ink-600 text-slate-300 font-sans text-sm font-medium py-2.5 rounded-xl transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-acid-400 hover:bg-acid-500 disabled:opacity-50 text-ink-950 font-sans text-sm font-semibold py-2.5 rounded-xl transition-colors">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-ink-800 border border-ink-600 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-sans font-semibold text-base">Desactivar producto</h3>
                <p className="text-slate-500 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-ink-700 text-slate-300 font-sans text-sm py-2.5 rounded-xl hover:bg-ink-600 transition-colors">Cancelar</button>
<button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-sans text-sm font-semibold py-2.5 rounded-xl transition-colors">Desactivar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
