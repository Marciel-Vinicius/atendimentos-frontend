import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function AtendimentoForm({ onSuccess }) {
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

  useEffect(() => {
    async function carregarNome() {
      const token = await getToken()
      const res = await axios.get('http://localhost:3001/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setForm((prev) => ({ ...prev, atendente: res.data.nome }))
    }
    carregarNome()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      await axios.post('http://localhost:3001/atendimentos', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Atendimento registrado com sucesso!')
      setForm({
        atendente: form.atendente,
        data: '',
        horaInicio: '',
        horaFim: '',
        loja: '',
        contato: '',
        ocorrencia: ''
      })
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Erro ao registrar atendimento:', err)
      alert('Erro ao registrar atendimento')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white text-gray-900 shadow-md p-6 rounded space-y-4 mb-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Registrar Atendimento</h2>
      <input name="atendente" value={form.atendente} disabled className="w-full p-3 rounded bg-gray-100 border border-gray-300" />
      <input name="data" type="date" value={form.data} onChange={handleChange} className="w-full p-3 rounded border border-gray-300" required />
      <div className="flex gap-4">
        <input name="horaInicio" type="time" value={form.horaInicio} onChange={handleChange} className="w-full p-3 rounded border border-gray-300" required />
        <input name="horaFim" type="time" value={form.horaFim} onChange={handleChange} className="w-full p-3 rounded border border-gray-300" required />
      </div>
      <input name="loja" value={form.loja} onChange={handleChange} placeholder="Loja" className="w-full p-3 rounded border border-gray-300" required />
      <input name="contato" value={form.contato} onChange={handleChange} placeholder="Contato" className="w-full p-3 rounded border border-gray-300" required />
      <textarea name="ocorrencia" value={form.ocorrencia} onChange={handleChange} placeholder="Ocorrência" className="w-full p-3 rounded border border-gray-300 h-24" required />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-md">
        Registrar
      </button>
    </form>
  )
}
