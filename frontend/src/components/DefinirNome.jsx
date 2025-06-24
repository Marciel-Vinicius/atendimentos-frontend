import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function DefinirNome({ onDefinido }) {
    const [nome, setNome] = useState('')
    const { getToken } = useAuth()

    const salvar = async () => {
        const token = await getToken()
        await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/nome`, { nome }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        onDefinido()
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold mb-4">Informe seu nome</h1>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-gray-800 p-2 rounded mb-4 w-64"
            />
            <button onClick={salvar} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                Confirmar
            </button>
        </div>
    )
}
