import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function AtendimentoList() {
  const [atendimentos, setAtendimentos] = useState([])
  const { getToken } = useAuth()

  useEffect(() => {
    async function carregar() {
      try {
        const token = await getToken()
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/atendimentos`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAtendimentos(res.data)
      } catch (err) {
        console.error('Erro ao buscar atendimentos:', err)
      }
    }
    carregar()
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Atendimentos Registrados</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Atendente</th>
              <th className="p-2">Loja</th>
              <th className="p-2">Contato</th>
              <th className="p-2">Ocorrência</th>
              <th className="p-2">Início</th>
              <th className="p-2">Fim</th>
              <th className="p-2">Usuário</th>
            </tr>
          </thead>
          <tbody>
            {atendimentos.map((a) => (
              <tr key={a.id} className="border-b border-gray-700">
                <td className="p-2">{new Date(a.data).toLocaleDateString()}</td>
                <td className="p-2">{a.atendente}</td>
                <td className="p-2">{a.loja}</td>
                <td className="p-2">{a.contato}</td>
                <td className="p-2">{a.ocorrencia}</td>
                <td className="p-2">{a.horaInicio}</td>
                <td className="p-2">{a.horaFim}</td>
                <td className="p-2">{a.usuario?.nome || a.usuario?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
