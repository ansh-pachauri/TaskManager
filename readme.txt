TEAM TASK MANAGER
=================

Full-stack collaborative task management with project-based RBAC,
built with Next.js 16 and Express.


STACK
-----

  Frontend  : Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui,
              recharts, react-hook-form + zod
  Backend   : Express 5, TypeScript, Prisma ORM, Neon PostgreSQL,
              bcryptjs, jsonwebtoken
  Auth      : JWT in httpOnly cookies


FOLDER STRUCTURE
----------------

  /
  |-- frontend/           Next.js 16 App Router frontend
  |   |-- app/            Routes: (auth), (dashboard)
  |   |-- components/     auth/, projects/, tasks/, dashboard/, ui/
  |   |-- hooks/          useAuth, useProjects, useTasks
  |   |-- lib/            api.ts, auth.ts, utils.ts
  |   +-- types/          Shared TypeScript interfaces
  |
  +-- backend/            Express REST API
      |-- prisma/         schema.prisma
      +-- src/
          |-- config/     env.ts (Zod-validated)
          |-- lib/        prisma.ts (singleton)
          |-- middleware/  auth, role (RBAC), error
          |-- modules/    auth, projects, tasks, dashboard
          +-- utils/      jwt, hash, response helpers


SETUP
-----

1. Backend

    cd backend
    npm install
    cp .env.example .env      # fill in your values
    npx prisma generate
    npx prisma db push
    npm run dev               # starts on port 4000

2. Frontend

    cd frontend
    npm install
    echo "BACKEND_URL=http://localhost:4000" > .env.local
    npm run dev               # starts on port 3000

    Visit http://localhost:3000 -- sign up -- /dashboard


ENVIRONMENT VARIABLES
---------------------

backend/.env

  DATABASE_URL    Neon PostgreSQL connection string
                  e.g. postgresql://user:pass@host/db?sslmode=require

  JWT_SECRET      Secret for signing JWTs (min 32 chars)
                  e.g. supersecretjwtkey32charsminimum

  PORT            Server port (default: 4000)

  NODE_ENV        Environment: development | production

  FRONTEND_URL    CORS allowed origin
                  e.g. http://localhost:3000

frontend/.env.local

  BACKEND_URL     Backend base URL -- server-side only, no NEXT_PUBLIC prefix
                  e.g. http://localhost:4000

  Note: The frontend proxies all /api/* requests to the backend via
  Next.js rewrites, so there are no cross-origin cookie issues.


DEPLOYMENT (RAILWAY)
--------------------

  1. Deploy the backend service.
     Note the Railway URL, e.g. https://your-backend.up.railway.app

  2. Deploy the frontend service.
     Add env var: BACKEND_URL=https://your-backend.up.railway.app

  3. On the backend service add:
     FRONTEND_URL=https://your-frontend.up.railway.app


API REFERENCE
-------------

Auth  --  /api/auth

  POST  /signup       Register. Sets JWT cookie, returns user.
  POST  /login        Login. Sets JWT cookie, returns user.
  POST  /logout       Clears auth cookie.
  GET   /me           Returns current authenticated user.

Projects  --  /api/projects

  GET     /                   List projects where user is a member.
  POST    /                   Create project (caller auto-added as ADMIN).
  GET     /:id                Project detail with members.
  DELETE  /:id                Delete project (Admin only).
  POST    /:id/members        Add member by email { email, role } (Admin only).
  DELETE  /:id/members/:uid   Remove member (Admin only).

Tasks  --  /api/tasks

  GET     /       List tasks.
                  Query params: projectId, status, priority, assignedToMe=true
  POST    /       Create task (Admin only).
  GET     /:id    Task detail.
  PATCH   /:id    Update task.
                  Admin: any field. Member: status only (if assigned).
  DELETE  /:id    Delete task (Admin only).

Dashboard  --  /api/dashboard

  GET  /stats     Total tasks, by-status counts, overdue count, tasks per user.
