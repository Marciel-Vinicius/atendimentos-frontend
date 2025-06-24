import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@clerk/backend'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// 🔐 Middleware para autenticar via Clerk
async function autenticarClerk(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.split(' ')[1]

        if (!token || token.split('.').length !== 3) {
            return res.status(401).json({ erro: 'Token JWT inválido ou ausente.' })
        }

        const { userId } = await verifyToken(token)
        const usuario = await prisma.usuario.findUnique({ where: { clerkId: userId } })

        if (!usuario) return res.status(403).json({ erro: 'Usuário não encontrado' })

        req.usuario = usuario
        next()
    } catch (err) {
        console.error('Erro ao validar token:', err)
        return res.status(403).json({ erro: 'Token inválido' })
    }
}

// 🧑 Retorna dados do usuário logado
app.get('/me', autenticarClerk, async (req, res) => {
    res.json({ nome: req.usuario.nome, email: req.usuario.email, tipo: req.usuario.tipo })
})

// ✏️ Define o nome do usuário
app.put('/usuarios/nome', autenticarClerk, async (req, res) => {
    const { nome } = req.body
    const usuarioAtualizado = await prisma.usuario.update({
        where: { id: req.usuario.id },
        data: { nome }
    })
    res.json(usuarioAtualizado)
})

// ➕ Cria novo atendimento
app.post('/atendimentos', autenticarClerk, async (req, res) => {
    const novo = await prisma.atendimento.create({
        data: {
            ...req.body,
            usuarioId: req.usuario.id
        }
    })
    res.json(novo)
})

// 📃 Lista atendimentos
app.get('/atendimentos', autenticarClerk, async (req, res) => {
    const lista = await prisma.atendimento.findMany({
        include: { usuario: true },
        orderBy: { data: 'desc' }
    })
    res.json(lista)
})

// ➕ Cadastrar novo usuário (ADMIN)
app.post('/usuarios', autenticarClerk, async (req, res) => {
    if (req.usuario.tipo !== 'ADMIN') {
        return res.status(403).json({ erro: 'Apenas administradores podem cadastrar usuários.' })
    }

    const { nome, email, senha, tipo } = req.body
    try {
        const novoUsuario = await prisma.usuario.create({
            data: { nome, email, senha, tipo }
        })
        res.json(novoUsuario)
    } catch (err) {
        console.error('Erro ao criar usuário:', err)
        res.status(400).json({ erro: 'Erro ao criar usuário.' })
    }
})

// ✅ Inicialização do servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
