import AtendimentoForm from '../components/AtendimentoForm'
import AtendimentoList from '../components/AtendimentoList'

export default function DashboardAdmin() {
  return (
    <>
      <AtendimentoForm />
      <hr className="my-6 border-gray-700" />
      <AtendimentoList />
    </>
  )
}
