import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chamadosRoutes from './routes/chamados.js';
import { authenticate } from './middleware/auth.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'https://atendimentos-frontend.vercel.app/',
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Funcionando 🚀' });
});

app.get('/me', authenticate, async (req, res) => {
  res.json({
    message: 'Usuário autenticado com sucesso',
    user: req.user,
  });
});

app.use('/chamados', chamadosRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
