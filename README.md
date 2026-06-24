# Task Manager API

Production-ready REST API built with Node.js, Express and TypeScript. JWT auth, full CRUD for tasks, filtering, pagination, and interactive Swagger docs.

**Live API → [your-app.up.railway.app](https://your-app.up.railway.app)**
**Swagger UI → [/api/docs](https://your-app.up.railway.app/api/docs)**

## Features

- JWT authentication (register / login)
- Task CRUD — create, read, update, delete
- Filtering by status and priority, pagination
- Task stats endpoint (completion rate)
- Input validation with Zod
- Interactive Swagger UI documentation
- Global error handling (Prisma, JWT, Zod errors)

## Tech stack

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Get JWT token |
| GET | /api/tasks | ✓ | List tasks (filter + paginate) |
| POST | /api/tasks | ✓ | Create task |
| GET | /api/tasks/:id | ✓ | Get task by ID |
| PUT | /api/tasks/:id | ✓ | Update task |
| DELETE | /api/tasks/:id | ✓ | Delete task |
| GET | /api/tasks/stats | ✓ | Completion stats |
| GET | /api/users/me | ✓ | My profile |
| PATCH | /api/users/me | ✓ | Update profile |

## Run locally

```bash
git clone https://github.com/YOUR_USERNAME/task-manager-api
cd task-manager-api
npm install
```

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_32_chars_min
```

```bash
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run dev
```

API runs at `http://localhost:3000`, docs at `http://localhost:3000/api/docs`.

## Demo

Register → grab token from response → click Authorize in Swagger UI → paste token → use all endpoints.

```bash
# register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","name":"Your Name","password":"password123"}'

# use the token
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```
