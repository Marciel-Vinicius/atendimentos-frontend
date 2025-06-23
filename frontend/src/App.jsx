
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from '@clerk/clerk-react'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardSuporte from './pages/DashboardSuporte'
import DefinirNome from './pages/DefinirNome'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

export default function App() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  const [nomeDefinido, setNomeDefinido] = useState(true)

  useEffect(() => {
    async function verificarNome() {
      const token = await getToken()
      const res = await axios.get('http://localhost:3001/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.data.nome) setNomeDefinido(false)
    }
    verificarNome()
  }, [])

  return (
    <>
      <SignedIn>
        {!nomeDefinido ? (
          <DefinirNome onDefinido={() => setNomeDefinido(true)} />
        ) : (
          <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Painel do Sistema</h1>
              <button onClick={() => signOut()} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                Sair
              </button>
            </div>
            {user?.publicMetadata?.tipo === 'ADMIN' ? <DashboardAdmin /> : <DashboardSuporte />}
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
