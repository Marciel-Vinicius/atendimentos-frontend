import { useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

export default function DefinirNome({ onDefinido }) {
  const [nome, setNome] = useState("")
  const { getToken } = useAuth()

  const enviar = async () => {
    const token = await getToken()
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    onDefinido()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded space-y-4 w-96">
        <h2 className="text-xl font-bold">Defina seu nome</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          className="w-full p-2 rounded bg-gray-700"
        />
        <button onClick={enviar} className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Salvar
        </button>
      </div>
    </div>
  )
}
