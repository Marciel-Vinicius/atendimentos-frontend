import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@clerk/backend'
import fetch from 'node-fetch'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

app.use(express.json())

// ✅ Libera o frontend hospedado na Vercel
app.use(cors({
    origin: 'https://atendimentos-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// ✅ Middleware para autenticar com Clerk
async function autenticarClerk(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.split(' ')[1]

        if (!token || token.split('.').length !== 3) {
            return res.status(401).json({ erro: 'Token JWT inválido ou ausente.' })
        }

        const { userId } = await verifyToken(token)

        let usuario = await prisma.usuario.findUnique({ where: { clerkId: userId } })

        // 🔐 Se não existir no banco, busca na API da Clerk e cria automaticamente
        if (!usuario) {
            const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_API_KEY}`
                }
            })

            const dados = await response.json()
            const email = dados?.email_addresses?.[0]?.email_address || ''
            const nome = dados?.first_name || ''
            const tipo = email === 'dev@sollos.ind.br' ? 'ADMIN' : 'SUPORTE'

            usuario = await prisma.usuario.create({
                data: { nome, email, tipo, clerkId: userId }
            })
        }

        req.usuario = usuario
        next()
    } catch (err) {
        console.error('❌ Erro ao validar token:', err)
        return res.status(403).json({ erro: 'Token inválido' })
    }
}

// 🔐 Rota para obter dados do usuário logado
app.get('/me', autenticarClerk, async (req, res) => {
    res.json({
        id: req.usuario.id,
        nome: req.usuario.nome,
        email: req.usuario.email,
        tipo: req.usuario.tipo
    })
})

// ✏️ Atualizar nome
app.put('/usuarios/nome', autenticarClerk, async (req, res) => {
    const { nome } = req.body
    const usuarioAtualizado = await prisma.usuario.update({
        where: { id: req.usuario.id },
        data: { nome }
    })
    res.json(usuarioAtualizado)
})

// ➕ Criar atendimento
app.post('/atendimentos', autenticarClerk, async (req, res) => {
    const novo = await prisma.atendimento.create({
        data: {
            ...req.body,
            usuarioId: req.usuario.id
        }
    })
    res.json(novo)
})

// 📄 Listar atendimentos (inclui nome do usuário)
app.get('/atendimentos', autenticarClerk, async (req, res) => {
    const lista = await prisma.atendimento.findMany({
        include: { usuario: true },
        orderBy: { data: 'desc' }
    })
    res.json(lista)
})

// 👤 Criar novo usuário manual (ADMIN)
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

// ✅ Inicializa o servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
