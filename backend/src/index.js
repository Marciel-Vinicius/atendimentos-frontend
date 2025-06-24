import express from 'express';
import cors from 'cors';
import chamadosRoutes from './routes/chamados.routes.js';
import { authMiddleware } from './middlewares/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ativando CORS corretamente ANTES de qualquer middleware
app.use(cors({
  origin: 'https://atendimentos-frontend.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Middleware para interpretar JSON
app.use(express.json());

// ✅ Middleware de autenticação
app.use(authMiddleware);

// ✅ Rotas
app.use('/chamados', chamadosRoutes);

// ✅ Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

