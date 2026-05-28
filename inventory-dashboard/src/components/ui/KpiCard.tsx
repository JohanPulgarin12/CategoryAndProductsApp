import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: boolean
  sub?: string
}

export default function KpiCard({ label, value, icon: Icon, accent, sub }: KpiCardProps) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'bg-acid-400/10 border-acid-400/30' : 'bg-ink-800 border-ink-600'}`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-sans font-medium uppercase tracking-widest ${accent ? 'text-acid-400' : 'text-slate-500'}`}>
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-acid-400/20' : 'bg-ink-700'}`}>
          <Icon size={14} className={accent ? 'text-acid-400' : 'text-slate-400'} />
        </div>
      </div>
      <p className={`text-2xl font-sans font-bold ${accent ? 'text-acid-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs font-sans mt-1">{sub}</p>}
    </div>
  )
}
