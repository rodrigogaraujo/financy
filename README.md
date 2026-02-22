# Financy

Aplicação fullstack de gerenciamento de finanças pessoais com autenticação JWT, CRUD de categorias e transações.

## Tech Stack

**Backend**: Apollo Server 5, Express 5, Prisma ORM, SQLite, TypeScript
**Frontend**: React 18, Vite, Apollo Client, TailwindCSS v4, Shadcn/ui, React Hook Form
**Infra**: Docker, Docker Compose

## Setup

### Com Docker (Recomendado)

```bash
# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Desenvolvimento (hot reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Produção
docker compose up --build -d
```

- Backend: http://localhost:4000/graphql
- Frontend: http://localhost:5173 (dev) | http://localhost:3000 (prod)

### Sem Docker

```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate deploy
npm run dev

# Frontend (outro terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Variáveis de Ambiente

### Backend (.env)
| Variável | Descrição | Default |
|----------|-----------|---------|
| JWT_SECRET | Chave para assinar JWTs | - |
| DATABASE_URL | Connection string SQLite | `file:./data/financy.db` |
| PORT | Porta do servidor | `4000` |

### Frontend (.env)
| Variável | Descrição | Default |
|----------|-----------|---------|
| VITE_BACKEND_URL | URL da API GraphQL | `http://localhost:4000/graphql` |

## Funcionalidades

- Registro e login com JWT
- CRUD de categorias (nome, tipo, cor)
- CRUD de transações (título, valor, tipo, data, categoria)
- Dashboard com resumo financeiro
- Interface responsiva seguindo design Figma
