# Team Task Manager

Full-stack collaborative task management with project-based RBAC — built with Next.js 16 and Express.

## Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui, recharts, react-hook-form + zod |
| Backend | Express 5, TypeScript, Prisma ORM, Neon PostgreSQL, bcryptjs, jsonwebtoken |
| Auth | JWT in httpOnly cookies |

## Folder Structure

```
/
├── frontend/          Next.js 16 App Router frontend
│   ├── app/           Routes: (auth), (dashboard)
│   ├── components/    auth/, projects/, tasks/, dashboard/, ui/
│   ├── hooks/         useAuth, useProjects, useTasks
│   ├── lib/           api.ts, auth.ts, utils.ts
│   └── types/         Shared TypeScript interfaces
│
└── backend/           Express REST API
    ├── prisma/        schema.prisma
    └── src/
        ├── config/    env.ts (Zod-validated)
        ├── lib/       prisma.ts (singleton)
        ├── middleware/ auth, role (RBAC), error
        ├── modules/   auth, projects, tasks, dashboard
        └── utils/     jwt, hash, response helpers
```

## Setup

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env   # or edit .env directly

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start dev server (port 4000)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create env file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local

# Start dev server (port 3000)
npm run dev
```

Visit http://localhost:3000 → redirects to /login → sign up → /dashboard.

## Environment Variables

### `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) | `supersecretjwtkey32charsminimum` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |

### `frontend/.env.local`

| Variable | Description | Example |
|---|---|---|
| `BACKEND_URL` | Backend API base URL | `http://localhost:4000` |

## API Reference

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register — sets JWT cookie, returns user |
| POST | `/login` | No | Login — sets JWT cookie, returns user |
| POST | `/logout` | No | Clears auth cookie |
| GET | `/me` | Yes | Returns current user |

### Projects — `/api/projects`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Member | List projects where user is a member |
| POST | `/` | Member | Create project (caller auto-added as ADMIN) |
| GET | `/:id` | Member | Project detail + members |
| DELETE | `/:id` | Admin | Delete project |
| POST | `/:id/members` | Admin | Add member `{ userId, role }` |
| DELETE | `/:id/members/:userId` | Admin | Remove member |

### Tasks — `/api/tasks`

| Method | Path | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | `/` | Member | `projectId`, `status`, `priority`, `assignedToMe=true` | List tasks |
| POST | `/` | Admin | — | Create task |
| GET | `/:id` | Member | — | Task detail |
| PATCH | `/:id` | Member/Admin | — | Admin: any field; Member: status only (if assigned) |
| DELETE | `/:id` | Admin | — | Delete task |

### Dashboard — `/api/dashboard`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/stats` | Member | Total tasks, by-status counts, overdue count, tasks per user |

