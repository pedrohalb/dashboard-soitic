# Clínica Bem Viver — Dashboard Clínico

Dashboard de gestão de agendamentos desenvolvido como teste técnico para o **Grupo SOITIC**.

---

## Visão Geral

Interface clínica construída com o design system **"The Clinical Curator"**: paleta com primary (#5E00FF) e secondary (#A100FF), tipografia Manrope (headlines) + Inter (body), dark mode por padrão com toggle claro/escuro, e sombras "editorial shadow" com tonalidade roxa.

O frontend opera com **fallback automático para dados simulados** quando o backend está indisponível.

---

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI com componentes funcionais e hooks |
| TypeScript | ~6.0 | Tipagem estática |
| Vite | 8 | Dev server com HMR e build otimizado |
| Tailwind CSS | v4 | Utility-first com design tokens via `@theme` |
| React Router DOM | v7 | Roteamento SPA |
| Recharts | v3 | AreaChart de volume semanal/mensal |
| Axios | v1 | Cliente HTTP com fallback para mock |

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| NestJS | v11 | Framework com módulos, decorators e DI |
| Prisma | v6 | ORM com schema declarativo e migrations |
| PostgreSQL | 16 | Banco relacional (via Docker Alpine) |
| class-validator | v0.15 | Validação de DTOs via decorators |
| class-transformer | v0.5 | Transformação de objetos |

### Infraestrutura

| Tecnologia | Uso |
|---|---|
| Docker + Docker Compose | Containerização multi-serviço |
| Nginx | Servidor de produção do frontend + proxy reverso |
| Multi-stage builds | Imagens otimizadas (node:20-alpine, nginx:alpine) |

---

## Arquitetura

```
dashboard-soitic/
├── docker-compose.yml          # PostgreSQL + Backend + Frontend
├── backend/                    # API NestJS (porta 3001)
│   ├── Dockerfile
│   ├── .env / .env.example
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco com enums e modelo Agendamento
│   │   └── migrations/         # Migrations do Prisma
│   └── src/
│       ├── main.ts             # Bootstrap: CORS, ValidationPipe, prefixo /api
│       ├── app.module.ts       # ConfigModule + PrismaModule + AppointmentsModule
│       ├── prisma/
│       │   ├── prisma.module.ts    # Módulo global do Prisma
│       │   └── prisma.service.ts   # PrismaClient com lifecycle hooks
│       └── appointments/
│           ├── appointment.enums.ts        # Enums de status e tipo
│           ├── appointments.controller.ts  # REST controller (CRUD + stats + paginação)
│           ├── appointments.service.ts     # Lógica de negócio + seed automático
│           ├── appointments.module.ts
│           └── dto/
│               ├── create-appointment.dto.ts
│               └── update-appointment.dto.ts
│
└── frontend/                   # SPA React (porta 5173 dev / 80 prod)
    ├── Dockerfile
    ├── nginx.conf              # Proxy /api → backend + SPA fallback
    └── src/
        ├── main.tsx
        ├── App.tsx             # Router + layout (Sidebar + TopBar + MobileNav)
        ├── index.css           # Design tokens Tailwind v4 (@theme) + dark mode
        ├── components/
        │   ├── Sidebar.tsx             # Nav lateral colapsável (desktop)
        │   ├── TopBar.tsx              # Header com toggle tema + perfil
        │   ├── MobileNav.tsx           # Nav inferior (mobile)
        │   ├── StatCard.tsx            # Card de métrica reutilizável
        │   ├── PatientVolumeChart.tsx  # AreaChart semana/mês com Recharts
        │   ├── UpcomingAppointments.tsx
        │   ├── AppointmentCard.tsx     # Card individual de agendamento
        │   ├── InsightsCard.tsx        # Card de insights com gradiente
        │   └── NewAppointmentModal.tsx # Modal para criar novo agendamento
        ├── pages/
        │   ├── DashboardPage.tsx       # Página principal com stats + gráfico
        │   ├── AppointmentsPage.tsx    # Tabela com filtros, paginação, edit/delete
        │   └── PlaceholderPage.tsx     # Placeholder para rotas futuras
        ├── hooks/
        │   └── useDashboard.ts         # Hook de fetch com Promise.all
        ├── services/
        │   └── api.ts                  # Axios + withFallback para mock
        ├── data/
        │   └── mockData.ts            # Dados simulados para fallback
        ├── types/
        │   └── index.ts               # Interfaces e tipos compartilhados
        └── utils/
            └── appointmentUtils.ts    # Formatadores + configs de status/tipo
```

### Decisões Técnicas

- **Fallback para mock**: O frontend detecta quando o backend está indisponível e serve dados simulados locais, permitindo rodar apenas o frontend.
- **Seed automático**: Na primeira inicialização, o backend popula o banco com 59 agendamentos de exemplo via `OnModuleInit`.
- **Prisma ORM**: Schema declarativo com migrations versionadas. Enums mapeados entre Prisma e a aplicação via `statusMap`/`tipoMap`.
- **Design tokens via CSS**: O Tailwind v4 consome tokens de cor/fonte via `@theme {}` no `index.css`, com override por variáveis CSS para dark mode.
- **CORS**: Configurado para aceitar requests de `http://localhost:5173`.
- **Proxy em dev**: Vite redireciona `/api/*` para `http://localhost:3001`.

---

## Como Rodar

### Opção 1: Docker Compose (recomendado)

```bash
cd soitic-test-repo/src/dashboard-soitic/backend
cp .env.example .env
cd ..
docker-compose up -d --build
# App em http://localhost:5173
```

Isso sobe os 3 serviços:
- **PostgreSQL** na porta `5432` (banco: `clinica_bem_viver`)
- **Backend** na porta `3001`
- **Frontend** na porta `5173`

### Opção 2: Local

**Pré-requisitos:** Node.js >= 18, PostgreSQL rodando.

```bash
# 1. Banco de dados
psql -U postgres -c "CREATE DATABASE clinica_bem_viver;"

# 2. Backend
cd backend
cp .env.example .env
# Edite .env se necessário (ajuste DATABASE_URL para seu ambiente)
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
# API em http://localhost:3001/api

# 3. Frontend (em outro terminal)
cd frontend
npm install
npm run dev
# App em http://localhost:5173
```

> O frontend funciona sem o backend — dados simulados são carregados automaticamente via fallback.

---

## Endpoints da API

Base: `http://localhost:3001/api`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/appointments` | Lista todos os agendamentos (ordenados por data) |
| `GET` | `/appointments/stats` | Métricas: consultas hoje, novos pacientes, pendentes, cancelados, taxa de comparecimento |
| `GET` | `/appointments/weekly-volume` | Volume de agendamentos por dia da semana atual (seg-dom) |
| `GET` | `/appointments/monthly-volume` | Volume de agendamentos por dia do mês atual |
| `GET` | `/appointments/paginated` | Lista paginada com filtros (search, status, tipo, dateFrom, dateTo, sortBy, sortOrder) |
| `GET` | `/appointments/upcoming?limit=N` | Próximos N agendamentos  |
| `GET` | `/appointments/:id` | Busca agendamento por ID |
| `POST` | `/appointments` | Cria agendamento (body: `CreateAppointmentDto`) |
| `PATCH` | `/appointments/:id` | Atualiza parcialmente (body: `UpdateAppointmentDto`) |
| `DELETE` | `/appointments/:id` | Remove agendamento |

### Modelo de Dados

```typescript
// Status: 'confirmado' | 'pendente' | 'cancelado' | 'em espera' | 'a caminho' | 'atrasado'
// Tipo:   'primeira consulta' | 'retorno' | 'exame' | 'urgência'

interface Agendamento {
  id: number;
  nomePaciente: string;
  dataAgendamento: Date;       // timestamptz
  status: StatusAgendamento;
  tipo: TipoAgendamento;
  criadoEm: Date;
  atualizadoEm: Date;
}
```

---

## Funcionalidades

- [x] Dashboard com métricas em tempo real (consultas hoje, novos pacientes, pendentes, taxa de comparecimento)
- [x] Gráfico de volume de pacientes com alternância semana/mês (Recharts AreaChart)
- [x] Lista de próximos agendamentos com status colorido e avatar determinístico
- [x] Card de insights da clínica
- [x] Página de agendamentos com tabela, filtros, paginação, edição e exclusão
- [x] Modal para criação de novo agendamento
- [x] Sidebar colapsável (desktop) + bottom nav (mobile)
- [x] Dark mode / light mode com persistência em localStorage
- [x] Fallback automático para dados simulados (frontend sem backend)
- [x] API REST completa (CRUD) com validação de DTOs
- [x] Seed automático de 59 agendamentos na primeira execução
- [x] Prisma ORM com migrations versionadas
- [x] Docker Compose com PostgreSQL, backend e frontend
- [x] Multi-stage Docker builds (node:20-alpine + nginx:alpine)

> **Nota sobre os dados de exemplo:** Tomei a liberdade de expandir o seed inicial com novos pacientes e status adicionais além dos requisitos originais. O objetivo foi tornar a visualização do dashboard mais dinâmica e realista, simulando um fluxo clínico ativo e variado — o que permite avaliar melhor o comportamento dos componentes visuais (gráficos, badges de status, filtros) em condições próximas ao uso real.

---

## Scripts Disponíveis

### Backend

| Script | Descrição |
|---|---|
| `npm run start:dev` | Dev server com watch mode |
| `npm run build` | Compila para `dist/` |
| `npm run start:prod` | Executa build compilado |
| `npm run lint` | Lint com autofix |
| `npm test` | Testes unitários (Jest) |
| `npm run test:e2e` | Testes end-to-end |
| `npx prisma generate` | Gera o Prisma Client |
| `npx prisma migrate dev` | Roda migrations em dev |
| `npx prisma studio` | Interface visual do banco |

### Frontend

| Script | Descrição |
|---|---|
| `npm run dev` | Dev server na porta 5173 |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |