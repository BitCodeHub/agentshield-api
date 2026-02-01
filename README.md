# 🛡️ AgentShield API

> **Governance, identity, and control plane for AI agent deployments.**

*"Know your agents. Control your risk."*

## Overview

AgentShield API is the governance layer for agentic AI. Every company is deploying AI agents—but nobody knows which humans are responsible for them.

AgentShield solves:
- **Zero inventory** → Agent registry with auto-discovery
- **No accountability** → Human-agent binding
- **Security blindspots** → Real-time audit trails
- **Compliance nightmares** → Governance policies + export

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Agents
```
POST   /v1/agents          # Register a new agent
GET    /v1/agents          # List all agents
GET    /v1/agents/:id      # Get agent by ID
POST   /v1/agents/:id/owner  # Bind human owner to agent
```

## Architecture

```
┌─────────────────┐
│  AI Agents      │
│  (Any Platform) │
└────────┬────────┘
         │
         │ Register + Report
         ↓
┌─────────────────────────────┐
│   AgentShield API Gateway   │
│   - Auth/Rate Limiting      │
│   - Agent Registry          │
│   - Policy Enforcement      │
└────────┬────────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌──────────────┐
│ Stream │ │ PostgreSQL   │
│ (WS)   │ │ Database     │
└────────┘ └──────────────┘
```

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL + Prisma ORM
- **Validation:** Zod
- **Security:** Helmet, CORS, API Key auth

## Project Structure

```
src/
├── index.ts           # Entry point
├── config/            # Configuration
├── routes/            # API routes
│   └── v1/
│       └── agents.ts  # Agent endpoints
├── models/            # Prisma schema + types
├── middleware/        # Auth, validation, error handling
└── utils/             # Helpers
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `API_KEY_SECRET` | Secret for API key generation | Yes |

## License

MIT © BitCodeHub

---

*Part of the AgentShield product suite by BitCodeHub*
