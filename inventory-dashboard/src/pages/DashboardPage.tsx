import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Layout from '../components/layout/Layout'
import KpiCard from '../components/ui/KpiCard'
import { useInventorySummary } from '../hooks/useInventorySummary'

const COLORS = ['#C8F135', '#4ADE80', '#60A5FA', '#F472B6', '#FB923C', '#A78BFA']

export default function DashboardPage() {
  const { summary, loading, error } = useInventorySummary()

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-white font-sans font-bold text-2xl">Dashboard</h1>
        <p className="text-slate-500 text-sm font-sans mt-1">Resumen general del inventario</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-acid-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {summary && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <KpiCard
              label="Valor total inventario"
              value={fmt(summary.totalInventoryValue)}
              icon={DollarSign}
              accent
            />
            <KpiCard
              label="Categorías"
              value={summary.inventoryByCategory?.length ?? 0}
              icon={Package}
              sub="categorías activas"
            />
            <KpiCard
              label="Stock crítico"
              value={summary.criticalProducts?.length ?? 0}
              icon={AlertTriangle}
              sub="productos bajo mínimo"
            />
            <KpiCard
              label="Ocupación"
              value={`${(summary.occupationPercentage ?? 0).toFixed(1)}%`}
              icon={TrendingUp}
              sub="del inventario ocupado"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Pie chart */}
            <div className="bg-ink-800 border border-ink-600 rounded-2xl p-6">
              <h2 className="text-white font-sans font-semibold text-base mb-1">Valor por categoría</h2>
              <p className="text-slate-500 text-xs font-sans mb-4">Distribución del valor de inventario</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={summary.inventoryByCategory}
                    dataKey="totalValue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {summary.inventoryByCategory?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => fmt(v)}
                    contentStyle={{ background: '#43b83d', border: '1px solid #252E42', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  />
                  <Legend
                    formatter={(v) => <span style={{ color: '#8896A8', fontSize: 12 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Critical stock table */}
            <div className="bg-ink-800 border border-ink-600 rounded-2xl p-6">
              <h2 className="text-white font-sans font-semibold text-base mb-1">Productos críticos</h2>
              <p className="text-slate-500 text-xs font-sans mb-4">Stock por debajo del mínimo</p>
              {!summary.criticalProducts?.length ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-slate-600 text-sm font-sans">Sin productos críticos 🎉</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-52">
                  {summary.criticalProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-ink-700 rounded-xl px-4 py-3">
                      <span className="text-white text-sm font-sans truncate max-w-[55%]">{p.product}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-mono text-sm font-medium">{p.stock}</span>
                        <span className="text-slate-500 text-xs">/ min {p.criticalStock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}
