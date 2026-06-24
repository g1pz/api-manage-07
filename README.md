# Task Manager API

Production-ready REST API built with Node.js, Express and TypeScript. JWT auth, full CRUD for tasks with filtering and pagination, Zod validation, and interactive Swagger UI docs.

**Live API → [api-manage-07-production.up.railway.app](https://api-manage-07-production.up.railway.app)**  
**Swagger UI → [api-manage-07-production.up.railway.app/api/docs](https://api-manage-07-production.up.railway.app/api/docs)**

![Swagger UI](screenshots/swagger.png)

## Features

- JWT authentication — register and login, token expires in 7 days
- Task CRUD — create, read, update, delete
- Filtering by status (`TODO` / `IN_PROGRESS` / `DONE`) and priority (`LOW` / `MEDIUM` / `HIGH`)
- Pagination on list endpoints
- Stats endpoint — completion rate and counts by status
- Input validation with Zod — clean error messages on bad requests
- Global error handler — Prisma, JWT and validation errors all return consistent JSON
- Interactive Swagger UI — test every endpoint in the browser without any tools

## Tech stack

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger&logoColor=black)

## Screenshots

![Swagger UI docs](screenshots/swagger.png)
![Login endpoint](screenshots/login.png)
![Tasks list response](screenshots/tasks.png)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/tasks` | ✓ | List tasks (filter + paginate) |
| POST | `/api/tasks` | ✓ | Create task |
| GET | `/api/tasks/:id` | ✓ | Get task by ID |
| PUT | `/api/tasks/:id` | ✓ | Update task |
| DELETE | `/api/tasks/:id` | ✓ | Delete task |
| GET | `/api/tasks/stats` | ✓ | Completion rate + counts |
| GET | `/api/users/me` | ✓ | My profile |
| PATCH | `/api/users/me` | ✓ | Update name or password |

## Run locally

```bash
git clone https://github.com/g1pz/task-manager-api
cd task-manager-api
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL=postgresql://user:pass@host:5432/railway
JWT_SECRET=your-random-secret-32-chars-minimum
```

```bash
npm run db:migrate:dev -- --name init
npm run db:seed
npm run dev
```

API: `http://localhost:3000`  
Docs: `http://localhost:3000/api/docs`

## Testing with Swagger

1. Open `/api/docs`
2. Run **POST /api/auth/login** with `alice@example.com` / `password123`
3. Copy the `token` from the response
4. Click **Authorize** at the top → paste the token → **Authorize**
5. All protected endpoints are now unlocked

## Project structure

```
src/
├── app.ts                  — Express setup, routes, Swagger mount
├── swagger.ts              — Swagger spec config
├── routes/                 — auth, task, user routers with JSDoc annotations
├── controllers/            — request handlers
├── middleware/
│   ├── auth.middleware.ts  — JWT verification
│   ├── validate.middleware.ts — Zod request validation
│   └── error.middleware.ts — global error handler
├── schemas/                — Zod schemas for all inputs
└── lib/prisma.ts           — Prisma client singleton
prisma/
├── schema.prisma           — User + Task models with enums
└── seed.ts                 — 2 demo users, 10 tasks
```
