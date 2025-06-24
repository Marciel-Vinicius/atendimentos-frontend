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

// Middleware de autenticação Clerk
async function autenticarClerk(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        console.log('🔑 Token recebido do frontend:', token)

        const { userId } = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY // ✅ Define a chave corretamente
        })
        console.log('✅ Token válido! userId:', userId)

        let usuario = await prisma.usuario.findUnique({
            where: { clerkId: userId }
        })

        if (!usuario) {
            const dados = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
                }
            }).then(res => res.json())

            const email = dados?.email_addresses?.[0]?.email_address || ''
            const nome = dados?.first_name || ''
            const tipo = email === 'dev@sollos.ind.br' ? 'ADMIN' : 'SUPORTE'

            let existente = await prisma.usuario.findUnique({ where: { email } })

            if (existente) {
                usuario = await prisma.usuario.update({
                    where: { email },
                    data: { clerkId: userId }
                })
            } else {
                usuario = await prisma.usuario.create({
                    data: { nome, email, tipo, clerkId: userId }
                })
            }
        }

        req.usuario = usuario
        next()
    } catch (erro) {
        console.error('❌ Erro ao validar token:', erro)
        return res.status(403).json({ erro: 'Token inválido' })
    }
}

// Rotas protegidas
app.get('/me', autenticarClerk, (req, res) => {
    res.json(req.usuario)
})

app.get('/atendimentos', autenticarClerk, async (req, res) => {
    const atendimentos = await prisma.atendimento.findMany({
        include: { usuario: true },
        orderBy: { id: 'desc' }
    })
    res.json(atendimentos)
})

app.post('/atendimentos', autenticarClerk, async (req, res) => {
    const novo = await prisma.atendimento.create({
        data: {
            ...req.body,
            usuarioId: req.usuario.id
        }
    })
    res.json(novo)
})

app.put('/usuarios/:id', autenticarClerk, async (req, res) => {
    const usuario = await prisma.usuario.update({
        where: { id: Number(req.params.id) },
        data: req.body
    })
    res.json(usuario)
})

app.get('/usuarios', autenticarClerk, async (req, res) => {
    const usuarios = await prisma.usuario.findMany({ orderBy: { nome: 'asc' } })
    res.json(usuarios)
})

app.listen(3001, () => {
    console.log('🚀 Backend rodando em http://localhost:3001')
})
