# Panini

A local-first Kanban board web application built with TypeScript, Fastify, React, and MySQL. Designed to run on macOS and easily deployable to Amazon EC2.

## Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Fastify (TypeScript) |
| Frontend | React + Vite (TypeScript) |
| Database | MySQL + Prisma ORM |
| Styling | Tailwind CSS |
| Drag & Drop | @dnd-kit/core |
| Auth | Session-based (fastify-session + bcrypt) |

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+ (see below)
- npm 9+

### MySQL Setup (macOS)

```bash
brew install mysql
brew services start mysql
mysql_secure_installation
mysql -u root -p -e "CREATE DATABASE panini; CREATE USER 'panini'@'localhost' IDENTIFIED BY 'yourpassword'; GRANT ALL PRIVILEGES ON panini.* TO 'panini'@'localhost'; FLUSH PRIVILEGES;"
```

### Install & Run

```bash
git clone https://github.com/Robert-Liam-Walker/panini.git
cd panini
cp .env.example .env
# Edit .env with your DB credentials
npm install
npm run db:migrate
npm run dev
```

App runs at `http://localhost:3000`

## Project Structure

```
panini/
  server/          # Fastify API
    src/
      routes/      # boards, columns, cards, labels, comments, auth
      middleware/  # auth guard
    prisma/
      schema.prisma
  client/          # React + Vite
    src/
      components/  # Board, Column, Card, Modal, etc.
      pages/       # Login, BoardList, BoardView
      hooks/
      api/         # API client functions
  package.json     # npm workspaces root
  .env.example
```

## EC2 Deployment

1. Launch an Amazon Linux 2 or Ubuntu 22.04 AMI (t3.micro or larger)
2. Install Node.js 18, MySQL 8, and git
3. Clone the repo, copy `.env`, run `npm install && npm run build`
4. Use `pm2` to keep the server running: `pm2 start npm --name panini -- run start`
5. Open port 3000 (or 80 via nginx reverse proxy) in your EC2 security group
6. Point your MySQL connection string to `localhost` (same instance) or an RDS endpoint

## Environment Variables

See `.env.example` for all required variables.

```
DATABASE_URL=mysql://panini:password@localhost:3306/panini
SESSION_SECRET=changeme
PORT=3000
NODE_ENV=development
```

## Development

```bash
npm run dev          # start both server and client in watch mode
npm run build        # production build
npm run db:migrate   # run Prisma migrations
npm run db:studio    # open Prisma Studio (DB GUI)
```
