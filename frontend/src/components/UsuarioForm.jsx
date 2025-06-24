import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function UsuarioForm() {
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo: 'SUPORTE',
    })

    const { getToken } = useAuth()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken()
            await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, form, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert('Usuário cadastrado com sucesso!')
            setForm({ nome: '', email: '', senha: '', tipo: 'SUPORTE' })
        } catch {
            alert('Erro ao cadastrar usuário')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded space-y-4">
            <h2 className="text-xl font-bold mb-2">Cadastrar novo usuário</h2>
            <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700" />
            <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700" />
            <input name="senha" placeholder="Senha" type="password" value={form.senha} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700" />
            <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full p-2 rounded bg-gray-700">
                <option value="SUPORTE">SUPORTE</option>
                <option value="ADMIN">ADMIN</option>
            </select>
            <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Cadastrar</button>
        </form>
    )
}
