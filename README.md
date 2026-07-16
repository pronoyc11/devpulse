# DevPulse

Live URL: https://devpulse-4twr.onrender.com/

## Overview

DevPulse is a RESTful issue tracking backend built with Node.js, Express, TypeScript, PostgreSQL, and JWT authentication. It supports role-based access for contributors and maintainers, allowing teams to report, browse, update, and manage project issues.

## Features

- User registration and login
- User has two roles : contributor and maintainer
- Role based access control over query and operations
- Issues can be created, read, updated and deleted
- Control over above operations is authenticated properly by jwt token
- contributors can create accounts, issues, login or view all issues.
- maintainer has All contributor permissions along with additional access over issue operations and internal metrics
- Has feature of global error handling 

## Tech Stack

- node js as runtime
- typescript as language
- express js framwork
- PostgreSQL as database
- JSON Web Token (JWT) for authentication
- bcrypt for password hashing
- dotenv, cors as middleware
- tsup as build tool
- tsx as Development Runner
- Render for deployment

## Project Dependencies

### Dependencies

- bcrypt
- cors
- dotenv
- express
- jsonwebtoken
- pg
- tsup

### Development Dependencies

- @types/bcrypt
- @types/cors
- @types/express
- @types/jsonwebtoken
- @types/node
- @types/pg
- tsx
- typescript

## Setup Steps

### Prerequisites

- Node.js
- npm
- PostgreSQL database

### Installation

1. Clone the repository.

```bash
git clone <repository-url>
cd DevPulse
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root.

```env
PORT=3000
CONNECTION_STRING=your_postgresql_connection_string
SECRET=your_jwt_secret
```

4. Run the project in development mode.

```bash
npm run dev
```

5. Build the project for production.

```bash
npm run build
```

6. Start the production build.

```bash
npm start
```

## API Endpoints

Base URL:

```text
https://devpulse-4twr.onrender.com/
```

### Health Check

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/` | Public | Returns a welcome message for the API. |

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Public | Register a new user. |
| POST | `/api/auth/login` | Public | Login a user and return an access token. |

#### Signup Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "contributor"
}
```

`role` is optional. Allowed values are `contributor` and `maintainer`. If no role is provided, the user is created as a `contributor`.

#### Login Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Issues

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/issues` | Contributor, Maintainer | Create a new issue. |
| GET | `/api/issues` | Public | Get all issues. Supports filtering and sorting. |
| GET | `/api/issues/:id` | Public | Get a single issue by ID. |
| PATCH | `/api/issues/:id` | Contributor, Maintainer | Update an issue. |
| DELETE | `/api/issues/:id` | Maintainer | Delete an issue. |

Protected issue routes require an `Authorization` header containing the JWT token returned from login.

```text
Authorization: <token>
```

#### Create Issue Body

```json
{
  "title": "Login button is not working",
  "description": "Clicking the login button does not submit the form.",
  "type": "bug",
  "status": "open"
}
```

Required fields are `title`, `description`, and `type`.

Allowed `type` values:

- `bug`
- `feature_request`

Allowed `status` values:

- `open`
- `in_progress`
- `resolved`

If no status is provided during creation, the issue is created with `open` status.

#### Get Issues Query Parameters

| Query | Allowed Values | Description |
| --- | --- | --- |
| `sort` | `newest`, `oldest` | Sort issues by creation date. Defaults to `newest`. |
| `type` | `bug`, `feature_request` | Filter issues by type. |
| `status` | `open`, `in_progress`, `resolved` | Filter issues by status. |

Example:

```text
GET /api/issues?type=bug&status=open&sort=newest
```

#### Update Issue Body

Contributors can update only their own open issues and may update `title`, `description`, and `type`.

```json
{
  "title": "Updated issue title",
  "description": "Updated issue description",
  "type": "feature_request"
}
```

Maintainers can update issue details and status.

```json
{
  "title": "Updated issue title",
  "description": "Updated issue description",
  "type": "bug",
  "status": "in_progress"
}
```

## Database Schema Summary

The application uses PostgreSQL and creates the required tables when the server starts.

### users

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | SERIAL | Primary key |
| `name` | VARCHAR(20) | Required |
| `email` | VARCHAR(20) | Required, unique |
| `password` | TEXT | Required, stores hashed password |
| `role` | VARCHAR(20) | Defaults to `contributor`; must be `contributor` or `maintainer` |
| `created_at` | TIMESTAMP | Defaults to current timestamp |
| `updated_at` | TIMESTAMP | Defaults to current timestamp |

### issues

| Column | Type | Constraints |
| --- | --- | --- |
| `id` | SERIAL | Primary key |
| `title` | TEXT | Required |
| `description` | TEXT | Required |
| `type` | VARCHAR(20) | Required; must be `bug` or `feature_request` |
| `status` | VARCHAR(20) | Defaults to `open`; must be `open`, `in_progress`, or `resolved` |
| `reporter_id` | INT | References `users(id)` with cascade delete |
| `created_at` | TIMESTAMP | Defaults to current timestamp |
| `updated_at` | TIMESTAMP | Defaults to current timestamp |


### Happy Coding.
