import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser, SignOutButton } from '@clerk/clerk-react';

const api = axios.create({
    baseURL: 'https://atendimentos-backend.onrender.com', // Altere aqui se necessário
});

function Dashboard() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [chamados, setChamados] = useState([]);
    const [cliente, setCliente] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState('Pendente');

    useEffect(() => {
        const fetchChamados = async () => {
            const token = await getToken();
            const res = await api.get('/chamados', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChamados(res.data);
        };
        fetchChamados();
    }, [getToken]);

    const criarChamado = async () => {
        const token = await getToken();
        const res = await api.post(
            '/chamados',
            { cliente, descricao, status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setChamados([...chamados, res.data]);
        setCliente('');
        setDescricao('');
        setStatus('Pendente');
    };

    const deletarChamado = async (id) => {
        const token = await getToken();
        await api.delete(`/chamados/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setChamados(chamados.filter((c) => c.id !== id));
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Bem-vindo, {user?.fullName}</h1>
            <SignOutButton />

            <h2>Criar Chamado</h2>
            <input placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizado">Finalizado</option>
            </select>
            <button onClick={criarChamado}>Criar</button>

            <h2>Lista de Chamados</h2>
            <ul>
                {chamados.map((c) => (
                    <li key={c.id}>
                        {c.cliente} - {c.descricao} - {c.status}
                        <button onClick={() => deletarChamado(c.id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
