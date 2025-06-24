import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@clerk/backend'
import fetch from 'node-fetch'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Middleware para autenticar com Clerk
async function autenticarClerk(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(403).json({ erro: 'Token ausente' })

        const { userId } = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY
        })

        // Buscar dados do usuário logado
        const resposta = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
            }
        })

        const dados = await resposta.json()
        const email = dados?.email_addresses?.[0]?.email_address || ''
        if (!email) return res.status(403).json({ erro: 'E-mail não encontrado' })

        // Verifica se já existe no banco, se não existir cria
        let usuario = await prisma.usuario.findUnique({ where: { email } })
        if (!usuario) {
            usuario = await prisma.usuario.create({
                data: {
                    email,
                    nome: '',
                    tipo: email === 'dev@sollos.ind.br' ? 'ADMIN' : 'SUPORTE',
                    clerkId: userId
                }
            })
        }

        req.usuario = usuario
        next()
    } catch (err) {
        console.error('❌ Erro ao validar token:', err)
        return res.status(403).json({ erro: 'Token inválido' })
    }
}

app.get('/me', autenticarClerk, (req, res) => {
    res.json({ nome: req.usuario.nome, tipo: req.usuario.tipo })
})

app.put('/me', autenticarClerk, async (req, res) => {
    const { nome } = req.body
    await prisma.usuario.update({
        where: { id: req.usuario.id },
        data: { nome }
    })
    res.sendStatus(204)
})

app.get('/atendimentos', autenticarClerk, async (req, res) => {
    const admin = req.usuario.tipo === 'ADMIN'
    const atendimentos = await prisma.atendimento.findMany({
        where: admin ? {} : { usuarioId: req.usuario.id },
        include: { usuario: true },
        orderBy: { dia: 'desc' }
    })
    res.json(atendimentos)
})

app.post('/atendimentos', autenticarClerk, async (req, res) => {
    const { dia, horaInicio, loja, contato, ocorrencia, horaFim } = req.body
    const atendimento = await prisma.atendimento.create({
        data: {
            dia: new Date(dia),
            horaInicio,
            horaFim,
            loja,
            contato,
            ocorrencia,
            usuarioId: req.usuario.id
        }
    })
    res.status(201).json(atendimento)
})

app.get('/usuarios', autenticarClerk, async (req, res) => {
    if (req.usuario.tipo !== 'ADMIN') return res.status(403).json({ erro: 'Acesso negado' })
    const usuarios = await prisma.usuario.findMany({ orderBy: { nome: 'asc' } })
    res.json(usuarios)
})

app.put('/usuarios/:id', autenticarClerk, async (req, res) => {
    if (req.usuario.tipo !== 'ADMIN') return res.status(403).json({ erro: 'Acesso negado' })
    const { nome, tipo } = req.body
    await prisma.usuario.update({
        where: { id: Number(req.params.id) },
        data: { nome, tipo }
    })
    res.sendStatus(204)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
