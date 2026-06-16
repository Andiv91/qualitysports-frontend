import { useEffect, useState } from 'react'
import { listarAsesores } from '../../api/admin'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

export default function AdminAsesores() {
  const [asesores, setAsesores] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    listarAsesores()
      .then(r => setAsesores(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1C1E' }}>Asesores de Ventas</h1>
        <p className="text-sm text-gray-400 mt-0.5">{asesores.length} asesor{asesores.length !== 1 ? 'es' : ''} registrado{asesores.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['ASESOR', 'ZONA ASIGNADA', 'TELÉFONO', 'ESTADO'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {asesores.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div>
                        <p className="font-medium text-gray-800">{a.nombre}</p>
                        <p className="text-xs text-gray-400">{a.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{a.zonaAsignada ?? '—'}</td>
                    <td className="px-6 py-3.5 text-gray-600">{a.telefono ?? '—'}</td>
                    <td className="px-6 py-3.5"><Badge estado={a.activo ? 'Activo' : 'Inactivo'} /></td>
                  </tr>
                ))}
                {asesores.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No hay asesores registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
