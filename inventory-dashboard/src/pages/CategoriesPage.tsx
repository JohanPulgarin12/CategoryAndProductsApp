import { useState } from 'react'
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useCategories } from '../hooks/useCategories'
import { validateCategory, hasErrors } from '../utils/validators'
import type { CreateCategoryDto, ModalMode } from '../types'

const EMPTY: CreateCategoryDto = { name: '', description: '' }

export default function CategoriesPage() {
  const { categories, loading, error, create, update, remove } = useCategories()
  const [modal, setModal] = useState<ModalMode>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CreateCategoryDto>(EMPTY)
  const [formErrors, setFormErrors] = useState<Partial<CreateCategoryDto>>({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const openCreate = () => { setForm(EMPTY); setFormErrors({}); setEditId(null); setModal('create') }
  const openEdit = (id: number) => {
    const c = categories.find(x => x.id === id)
    if (!c) return
    setForm({ name: c.name, description: c.description })
    setFormErrors({})
    setEditId(id)
    setModal('edit')
  }

  const handleChange = (field: keyof CreateCategoryDto, value: string) => {
    const next = { ...form, [field]: value }
    setForm(next)
    setFormErrors(validateCategory(next) as Partial<CreateCategoryDto>)
  }

  const handleSave = async () => {
    const errs = validateCategory(form)
    if (hasErrors(errs)) { setFormErrors(errs as Partial<CreateCategoryDto>); return }
    setSaving(true)
    try {
      if (modal === 'create') await create(form)
      else if (editId) await update({ ...form, id: editId })
      setModal(null)
    } catch { /* handled */ }
    finally { setSaving(false) }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-sans font-bold text-2xl">Categorías</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} categorías registradas</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-acid-400 hover:bg-acid-500 text-ink-950 font-sans font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {loading && <div className="flex justify-center h-40 items-center"><div className="w-7 h-7 border-2 border-acid-400 border-t-transparent rounded-full animate-spin" /></div>}
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-ink-800 border border-ink-600 rounded-2xl p-5 hover:border-ink-500 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-acid-400/10 rounded-xl flex items-center justify-center">
                <span className="text-acid-400 font-sans font-bold text-base">{c.name[0]}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-acid-400 hover:bg-acid-400/10 transition-all">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <h3 className="text-white font-sans font-semibold text-sm mb-1">{c.name}</h3>
            <p className="text-slate-500 text-xs font-sans line-clamp-2">{c.description}</p>
            <div className="mt-3">
              <span className={`inline-flex items-center text-xs font-sans px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-400/10 text-green-400' : 'bg-slate-600/20 text-slate-500'}`}>
                {c.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-ink-800 border border-ink-600 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-600">
              <h2 className="text-white font-sans font-semibold text-base">
                {modal === 'create' ? 'Nueva categoría' : 'Editar categoría'}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {(['name', 'description'] as (keyof CreateCategoryDto)[]).map(field => (
                <div key={field}>
                  <label className="block text-xs text-slate-400 font-sans mb-1.5 capitalize">{field === 'name' ? 'Nombre' : 'Descripción'}</label>
                  <input
                    value={form[field]}
                    onChange={e => handleChange(field, e.target.value)}
                    className={`w-full bg-ink-700 border rounded-xl px-4 py-2.5 text-white font-sans text-sm focus:outline-none transition-colors ${formErrors[field] ? 'border-red-500' : 'border-ink-600 focus:border-acid-400'}`}
                  />
                  {formErrors[field] && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {formErrors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-ink-600">
              <button onClick={() => setModal(null)} className="flex-1 bg-ink-700 text-slate-300 font-sans text-sm py-2.5 rounded-xl hover:bg-ink-600 transition-colors">Cancelar</button>
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
            <h3 className="text-white font-sans font-semibold mb-2">¿Eliminar categoría?</h3>
            <p className="text-slate-500 text-sm mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-ink-700 text-slate-300 font-sans text-sm py-2.5 rounded-xl hover:bg-ink-600 transition-colors">Cancelar</button>
              <button onClick={() => remove(deleteId).then(() => setDeleteId(null))} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-sans text-sm font-semibold py-2.5 rounded-xl transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
