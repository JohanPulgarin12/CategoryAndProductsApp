import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Package } from 'lucide-react'
import KpiCard from '../components/ui/KpiCard'

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Total productos" value={42} icon={Package} />)
    expect(screen.getByText('Total productos')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders string value', () => {
    render(<KpiCard label="Ocupación" value="85.5%" icon={Package} />)
    expect(screen.getByText('85.5%')).toBeInTheDocument()
  })

  it('renders sub text when provided', () => {
    render(<KpiCard label="Stock" value={10} icon={Package} sub="productos bajo mínimo" />)
    expect(screen.getByText('productos bajo mínimo')).toBeInTheDocument()
  })

  it('does not render sub text when not provided', () => {
    render(<KpiCard label="Stock" value={10} icon={Package} />)
    expect(screen.queryByText('productos bajo mínimo')).not.toBeInTheDocument()
  })

  it('applies accent styles when accent=true', () => {
    const { container } = render(<KpiCard label="Total" value={100} icon={Package} accent />)
    expect(container.firstChild).toHaveClass('bg-acid-400/10')
  })

  it('applies default styles when accent=false', () => {
    const { container } = render(<KpiCard label="Total" value={100} icon={Package} />)
    expect(container.firstChild).toHaveClass('bg-ink-800')
  })
})
