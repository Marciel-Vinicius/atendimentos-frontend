import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function AtendimentoList() {
  const [lista, setLista] = useState([])
  const { getToken } = useAuth()

  useEffect(() => {
    async function carregar() {
      try {
        const token = await getToken()
        const res = await axios.get('http://localhost:3001/atendimentos', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setLista(res.data)
      } catch (err) {
        console.error('Erro ao buscar atendimentos:', err)
        alert('Erro ao buscar atendimentos')
      }
    }

    carregar()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">Atendimentos registrados</h2>
      <ul className="space-y-4">
        {lista.map((item) => (
          <li key={item.id} className="bg-white p-5 rounded shadow-md text-gray-800">
            <div className="font-semibold text-lg">{item.atendente} - {item.loja}</div>
            <div className="text-sm text-gray-600 mb-1">{item.ocorrencia}</div>
            <div className="text-sm">{new Date(item.data).toLocaleDateString()} | {item.horaInicio} às {item.horaFim}</div>
            <div className="text-xs text-gray-500 mt-1">Autor: {item.usuario?.nome || 'Desconhecido'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
