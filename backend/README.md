
# 📦 Projeto Atendimentos - Frontend (React + Vite + Clerk)

Este projeto é o frontend da aplicação de registro de atendimentos técnicos. Está pronto para ser publicado no **Vercel** e conectado com autenticação via **Clerk**.

---

## 🚀 Como Publicar no Vercel

### 1. Suba o projeto para um repositório no GitHub
- Recomendado: `atendimentos-frontend`

### 2. Crie uma conta em [https://vercel.com](https://vercel.com)
- Faça login com sua conta GitHub
- Clique em **"Add New Project"** > selecione o repositório

### 3. Configure o projeto
- **Framework**: Vite
- **Root directory**: padrão (deixe vazio)
- **Build command**: `npm run build`
- **Output directory**: `dist`

### 4. Adicione variáveis de ambiente
No painel de configuração da Vercel, vá até a aba **Environment Variables**:

| Key                         | Value                                  |
|----------------------------|----------------------------------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | sua chave Clerk frontend (`pk_live_...`) |

> Você encontra essa chave no [painel do Clerk](https://dashboard.clerk.com) na aba `API Keys`

---

## 🌐 Configurar domínio no Clerk

- Vá até o [painel do Clerk](https://dashboard.clerk.com)
- Acesse o app usado no projeto
- Adicione o domínio do Vercel (ex: `https://atendimentos-frontend.vercel.app`) em **Frontend settings > Allowed Origins**

---

## ✅ Deploy

Depois de salvar as configurações:
- Clique em **"Deploy"**
- Acesse o link fornecido pelo Vercel ao final do processo

---

## 🛠️ Observações

- O frontend está integrado com autenticação Clerk e usa `axios` com token JWT
- Certifique-se que o backend está acessível e CORS está liberado (`http://localhost:3001` em dev)

---

Pronto! Qualquer usuário autenticado poderá registrar atendimentos.
