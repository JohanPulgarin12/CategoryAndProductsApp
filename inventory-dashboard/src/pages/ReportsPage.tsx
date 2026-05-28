import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import Layout from '../components/layout/Layout'
import { useInventorySummary } from '../hooks/useInventorySummary'
import { RefreshCw } from 'lucide-react'

const COLORS = ['#C8F135', '#4ADE80', '#60A5FA', '#F472B6', '#FB923C', '#A78BFA']

export default function ReportsPage() {
  const { summary, loading, error, refetch } = useInventorySummary()

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-sans font-bold text-2xl">Reportes</h1>
          <p className="text-slate-500 text-sm mt-1">Visualización del estado del inventario</p>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 bg-ink-700 hover:bg-ink-600 text-slate-300 font-sans text-sm px-4 py-2.5 rounded-xl transition-colors border border-ink-600">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {loading && <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-2 border-acid-400 border-t-transparent rounded-full animate-spin" /></div>}
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {summary && (
        <div className="space-y-6">
          {/* Summary strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Valor total', value: fmt(summary.totalInventoryValue) },
              { label: 'Categorías', value: summary.inventoryByCategory?.length ?? 0 },
              { label: 'Stock crítico', value: summary.criticalProducts?.length ?? 0 },
              { label: 'Ocupación', value: `${(summary.occupationPercentage ?? 0).toFixed(1)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-ink-800 border border-ink-600 rounded-2xl p-4 text-center">
                <p className="text-slate-500 text-xs font-sans mb-1">{label}</p>
                <p className="text-white font-sans font-bold text-lg">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Pie */}
            <div className="bg-ink-800 border border-ink-600 rounded-2xl p-6">
              <h2 className="text-white font-sans font-semibold text-base mb-1">Distribución por categoría</h2>
              <p className="text-slate-500 text-xs mb-5">% del valor total por categoría</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={summary.inventoryByCategory} dataKey="totalValue" nameKey="category" cx="50%" cy="50%" outerRadius={100} paddingAngle={3} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {summary.inventoryByCategory?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: '#2f9644', border: '1px solid #252E42', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  <Legend formatter={(v) => <span style={{ color: '#8896A8', fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar */}
            <div className="bg-ink-800 border border-ink-600 rounded-2xl p-6">
              <h2 className="text-white font-sans font-semibold text-base mb-1">Valor por categoría</h2>
              <p className="text-slate-500 text-xs mb-5">Comparativa de valor en inventario</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={summary.inventoryByCategory} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                  <XAxis dataKey="category" tick={{ fill: '#8896A8', fontSize: 11, fontFamily: 'Sora' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8896A8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ background: '#161B24', border: '1px solid #252E42', borderRadius: 12, color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="totalValue" fill="#C8F135" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical products table */}
          {(summary.criticalProducts?.length ?? 0) > 0 && (
            <div className="bg-ink-800 border border-red-500/20 rounded-2xl p-6">
              <h2 className="text-white font-sans font-semibold text-base mb-1">⚠️ Productos con stock crítico</h2>
              <p className="text-slate-500 text-xs mb-4">Requieren reposición inmediata</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ink-600">
                      <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-sans uppercase tracking-wider">Producto</th>
                      <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-sans uppercase tracking-wider">Stock actual</th>
                      <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-sans uppercase tracking-wider">Mínimo</th>
                      <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-sans uppercase tracking-wider">Déficit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.criticalProducts.map((p, i) => (
                      <tr key={i} className="border-b border-ink-700">
                        <td className="px-4 py-3 text-white text-sm font-sans">{p.product}</td>
                        <td className="px-4 py-3 text-red-400 font-mono text-sm font-medium">{p.stock}</td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-sm">{p.criticalStock}</td>
                        <td className="px-4 py-3">
                          <span className="bg-red-500/10 text-red-400 font-mono text-xs px-2 py-1 rounded-lg">
                            -{p.criticalStock - p.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
