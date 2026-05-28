import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, BarChart2, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Productos' },
  { to: '/categories', icon: Tag, label: 'Categorías' },
  { to: '/reports', icon: BarChart2, label: 'Reportes' },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-6 py-6 border-b border-ink-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-acid-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-ink-950 font-mono font-bold text-sm">I</span>
          </div>
          <span className="text-white font-sans font-semibold text-lg tracking-tight">
            Inventory<span className="text-acid-400">OS</span>
          </span>
        </div>
        {/* Close button — solo en móvil */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${
                isActive
                  ? 'bg-acid-400/10 text-acid-400 border border-acid-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-ink-700'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-ink-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Botón hamburguesa — solo visible en móvil */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-ink-800 border border-ink-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Overlay — solo en móvil cuando está abierto */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar desktop — siempre visible en lg+ */}
      <aside className="hidden lg:flex w-60 min-h-screen bg-ink-900 border-r border-ink-700 flex-col fixed left-0 top-0 bottom-0 z-10">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil — slide in/out */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-ink-900 border-r border-ink-700 flex flex-col z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}