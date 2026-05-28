import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ user, password })
      navigate('/dashboard')
    } catch {
      setError('Credenciales inválidas. Verifica usuario y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-acid-400 rounded-lg flex items-center justify-center">
              <span className="text-ink-950 font-mono font-bold text-lg">I</span>
            </div>
            <span className="text-white font-sans font-semibold text-2xl tracking-tight">
              Inventory<span className="text-acid-400">OS</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm font-sans mt-1">Sistema de Gestión de Inventario</p>
        </div>

        {/* Card */}
        <div className="bg-ink-800 border border-ink-600 rounded-2xl p-8">
          <h1 className="text-white font-sans font-semibold text-xl mb-1">Iniciar sesión</h1>
          <p className="text-slate-500 text-sm mb-6">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 font-sans mb-1.5">Usuario</label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Tu usuario"
                required
                className="w-full bg-ink-700 border border-ink-600 rounded-xl px-4 py-3 text-white font-sans text-sm placeholder-slate-600 focus:outline-none focus:border-acid-400 focus:ring-1 focus:ring-acid-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 font-sans mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                className="w-full bg-ink-700 border border-ink-600 rounded-xl px-4 py-3 text-white font-sans text-sm placeholder-slate-600 focus:outline-none focus:border-acid-400 focus:ring-1 focus:ring-acid-400 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm font-sans">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-acid-400 hover:bg-acid-500 disabled:opacity-50 disabled:cursor-not-allowed text-ink-950 font-sans font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
            >
              {loading ? 'Autenticando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs font-mono mt-6">
          v1.0.0 · Backend .NET 8
        </p>
      </div>
    </div>
  )
}
