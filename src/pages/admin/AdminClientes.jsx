import { useEffect, useState } from 'react'
import { listarClientes, historialCliente } from '../../api/admin'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

const COP = n => '$' + new Intl.NumberFormat('es-CO').format(n ?? 0)

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

function getInitials(nombre = '') {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

function hashColor(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function HistorialModal({ cliente, onClose }) {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    historialCliente(cliente.id)
      .then(r => setPedidos([...r.data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cliente.id])

  const totalGastado = pedidos.reduce((acc, p) => acc + Number(p.totalNeto ?? 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: hashColor(cliente.nombre) }}>
              {getInitials(cliente.nombre)}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">{cliente.nombre}</h2>
              <p className="text-xs text-gray-400">{cliente.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4 px-6 py-4 border-b border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total pedidos</p>
            <p className="text-xl font-black text-gray-800">{pedidos.length}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total gastado</p>
            <p className="text-xl font-black" style={{ color: '#C0392B' }}>{COP(totalGastado)}</p>
          </div>
        </div>

        {/* Historial */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Historial de pedidos</p>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : pedidos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Este cliente no tiene pedidos aún.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['ID', 'FECHA', 'TOTAL', 'ESTADO'].map(h => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-mono text-xs text-gray-500">#QS-2026-{String(p.id).padStart(4,'0')}</td>
                    <td className="py-3 text-gray-600">{formatFecha(p.fecha)}</td>
                    <td className="py-3 font-semibold text-gray-800">{COP(p.totalNeto)}</td>
                    <td className="py-3"><Badge estado={p.estadoActual} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminClientes() {
  const [clientes, setClientes]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [query, setQuery]         = useState('')
  const [selected, setSelected]   = useState(null)

  useEffect(() => {
    listarClientes()
      .then(r => setClientes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = clientes.filter(c => {
    const q = query.toLowerCase()
    return c.nombre?.toLowerCase().includes(q) || c.telefono?.includes(q)
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>Clientes Registrados</h1>
        <p className="text-sm text-gray-400 mt-0.5">Consulta el historial de cada cliente</p>
      </div>

      {/* Buscador */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full max-w-sm pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none"
          onFocus={e => e.target.style.borderColor = '#C0392B'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['CLIENTE', 'TELÉFONO', 'REGISTRO', ''].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: hashColor(c.nombre) }}
                        >
                          {getInitials(c.nombre)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.nombre}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{c.telefono ?? '—'}</td>
                    <td className="px-6 py-3.5 text-gray-500">{formatFecha(c.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => setSelected(c)}
                        className="px-3.5 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        Ver historial
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No hay clientes registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <HistorialModal cliente={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
