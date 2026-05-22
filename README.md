# DevPulse

Live: https://dev-pulse-ivory.vercel.app/

## Overview

DevPulse is a lightweight issue-tracking and collaboration backend that provides RESTful APIs for authentication and issue management. It is designed for small teams and projects needing a simple, extensible tracker with token-based authentication.

## Features

- User authentication (register, login, JWT)
- Create, read, update, and delete issues
- Issue assignment and status tracking
- Pagination and basic filtering for issue lists
- Centralized error handling and middleware support

## Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Server: Express (or compatible HTTP framework)
- Build: tsup / TypeScript
- Deployment: Vercel
- Database: PostgreSQL / MySQL / SQLite (via an ORM) or MongoDB (document store)

## Setup

Prerequisites:

- Node.js >= 16
- npm or yarn
- A running database (Postgres/MySQL/SQLite/MongoDB) if using persistence

Local setup:

1. Install dependencies

```bash
npm install
```

2. Create an `.env` file based on the environment variables used by the project (example keys):

```
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/devpulse
JWT_SECRET=your_jwt_secret
```

3. Build and run (development)

```bash
npm run dev
```

3a. Build for production

```bash
npm run build
npm start
```

## API Endpoints

Authentication

- POST /api/auth/register — Register a new user (public)
	- Body: { "name", "email", "password" }

- POST /api/auth/login — Authenticate and receive JWT (public)
	- Body: { "email", "password" }

- GET /api/auth/me — Get current user (requires `Authorization: Bearer <token>`)

Issues

- GET /api/issues — List issues (supports pagination & filters)
	- Query: `page`, `limit`, `status`, `assigneeId`

- GET /api/issues/:id — Get issue by ID

- POST /api/issues — Create a new issue (requires auth)
	- Body: { "title", "description", "priority", "assigneeId" }

- PUT /api/issues/:id — Update an issue (requires auth)
	- Body: partial issue fields to update

- DELETE /api/issues/:id — Delete an issue (requires auth/roles)

Notes:

- All protected endpoints require `Authorization: Bearer <JWT>` header.
- Responses follow a consistent response wrapper via `utility/sendResponse.ts`.

## Database Schema (Summary)

Users

- `users` collection/table
	- `id` (PK)
	- `name` (string)
	- `email` (string, unique)
	- `password_hash` (string)
	- `created_at` (timestamp)

Issues

- `issues` collection/table
	- `id` (PK)
	- `title` (string)
	- `description` (text)
	- `status` (enum: open|in_progress|closed)
	- `priority` (enum: low|medium|high)
	- `reporter_id` (FK -> users.id)
	- `assignee_id` (FK -> users.id, nullable)
	- `created_at` (timestamp)
	- `updated_at` (timestamp)

Optional (Comments / Activity)

- `comments` (if implemented)
	- `id`, `issue_id`, `author_id`, `body`, `created_at`

## Notes & Conventions

- API routes are organized under `modules/` by feature (`auth`, `Issues`).
- Middleware includes authentication and global error handling (`middlewares/`).
- Replace the database adapter/config in `db/index.ts` to match your chosen datastore.

---

If you'd like, I can also add example cURL requests or Postman collection entries for the endpoints, or wire a simple database example to `db/index.ts`.