import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function AtendimentoForm() {
  const [form, setForm] = useState({
    atendente: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    loja: '',
    contato: '',
    ocorrencia: ''
  })

  const { getToken } = useAuth()

  const enviar = async () => {
    const token = await getToken()
    await axios.post(`${import.meta.env.VITE_API_URL}/atendimentos`, form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert('Atendimento registrado com sucesso!')
  }

  const atualizar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Registrar Atendimento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['atendente', 'loja', 'contato', 'ocorrencia'].map((campo) => (
          <input
            key={campo}
            type="text"
            name={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            value={form[campo]}
            onChange={atualizar}
            className="bg-gray-700 p-2 rounded"
          />
        ))}
        <input type="date" name="data" value={form.data} onChange={atualizar} className="bg-gray-700 p-2 rounded" />
        <input type="time" name="horaInicio" value={form.horaInicio} onChange={atualizar} className="bg-gray-700 p-2 rounded" />
        <input type="time" name="horaFim" value={form.horaFim} onChange={atualizar} className="bg-gray-700 p-2 rounded" />
      </div>
      <button onClick={enviar} className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700">
        Enviar
      </button>
    </div>
  )
}
