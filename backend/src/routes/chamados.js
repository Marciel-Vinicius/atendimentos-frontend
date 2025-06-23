const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar chamado
router.post('/', async (req, res) => {
    const { atendente, dia, horaInicio, loja, contato, ocorrencia, horaFim, horario } = req.body;

    try {
        const chamado = await prisma.chamado.create({
            data: {
                atendente,
                dia: new Date(dia),
                horaInicio,
                loja,
                contato,
                ocorrencia,
                horaFim,
                horario,
            },
        });
        res.json(chamado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar chamado', details: error });
    }
});

// Listar chamados
router.get('/', async (req, res) => {
    try {
        const chamados = await prisma.chamado.findMany({
            orderBy: { dia: 'desc' }
        });
        res.json(chamados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar chamados' });
    }
});

module.exports = router;
