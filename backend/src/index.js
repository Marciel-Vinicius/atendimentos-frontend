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

async function autenticarClerk(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) return res.status(401).json({ erro: 'Sem token' })

    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY
        })

        req.clerkUser = payload
        const { sub } = payload

        const email =
            payload.email_addresses?.[0]?.email_address ||
            payload.email ||
            payload.primary_email_address?.email_address ||
            'sem-email@clerk.dev'

        let usuario = await prisma.usuario.findUnique({ where: { clerkId: sub } })

        if (!usuario) {
            const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })

            if (usuarioExistente) {
                usuario = await prisma.usuario.update({
                    where: { id: usuarioExistente.id },
                    data: { clerkId: sub }
                })
            } else {
                const tipo = email === 'dev@sollos.ind.br' ? 'ADMIN' : 'SUPORTE'
                usuario = await prisma.usuario.create({
                    data: { clerkId: sub, email, nome: '', tipo }
                })
            }
        }

        req.usuarioId = usuario.id
        req.usuarioTipo = usuario.tipo
        req.usuarioNome = usuario.nome
        next()
    } catch (err) {
        console.error('Erro ao validar token:', err)
        return res.status(403).json({ erro: 'Token inválido' })
    }
}

app.get('/me', autenticarClerk, async (req, res) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id: req.usuarioId },
        select: { nome: true, tipo: true }
    })
    res.json(usuario)
})

app.put('/usuarios/nome', autenticarClerk, async (req, res) => {
    const { nome } = req.body
    const atualizado = await prisma.usuario.update({
        where: { id: req.usuarioId },
        data: { nome }
    })
    res.json(atualizado)
})

app.post('/atendimentos', autenticarClerk, async (req, res) => {
    const { atendente, data, horaInicio, horaFim, loja, contato, ocorrencia } = req.body
    const novo = await prisma.atendimento.create({
        data: {
            atendente,
            data: new Date(data),
            horaInicio,
            horaFim,
            loja,
            contato,
            ocorrencia,
            usuarioId: req.usuarioId
        }
    })
    res.status(201).json(novo)
})

app.get('/atendimentos', autenticarClerk, async (req, res) => {
    const lista = await prisma.atendimento.findMany({
        orderBy: { data: 'desc' },
        include: { usuario: { select: { nome: true, email: true } } }
    })
    res.json(lista)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})
