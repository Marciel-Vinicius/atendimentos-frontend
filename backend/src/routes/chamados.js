import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  const chamados = await prisma.chamado.findMany({
    where: {
      usuarioRelacionado: req.user.sub,
    },
  });
  res.json(chamados);
});

router.post('/', authenticate, async (req, res) => {
  const { cliente, descricao, status } = req.body;

  const chamado = await prisma.chamado.create({
    data: {
      cliente,
      descricao,
      status,
      usuarioRelacionado: req.user.sub,
    },
  });

  res.json(chamado);
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { cliente, descricao, status } = req.body;

  const chamado = await prisma.chamado.update({
    where: { id: Number(id) },
    data: { cliente, descricao, status },
  });

  res.json(chamado);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  await prisma.chamado.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Chamado deletado com sucesso' });
});

export default router;
