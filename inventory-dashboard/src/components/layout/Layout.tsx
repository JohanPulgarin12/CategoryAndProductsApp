import { type ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 flex">
      <Sidebar />
      {/* En desktop tiene margen por el sidebar fijo, en móvil no */}
      <main className="flex-1 lg:ml-60 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto w-full">
        {children}
      </main>
    </div>
  )
}