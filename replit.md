# ServiceConnect - Drop Service Platform

## Overview

A drop-service lead generation platform where customers can browse local services (locksmith, power washing, car cleaning, etc.), submit a service request, and the business owner forwards the lead to trusted local providers.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/drop-service)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Styling**: Tailwind CSS v4

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── drop-service/       # React frontend (served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- **services** - Service categories (locksmith, power washing, etc.)
- **leads** - Customer service requests/leads with status tracking
- **providers** - Trusted local service providers

## Features

### Public-facing
- Home page with hero section and service category cards
- Service request form (fill in name, email, phone, address, description)
- Thank you page after form submission

### Admin (password: `admin123`, stored in localStorage)
- Route: `/admin/login`
- Dashboard with lead statistics
- Leads management: view, update status, add notes, assign to providers
- Providers management: add/edit/delete trusted service providers
- Services management: add/remove service categories

## API Endpoints

All under `/api`:
- `GET/POST /services` - List or create service categories
- `DELETE /services/:id` - Delete a service
- `GET/POST /leads` - List all leads or submit a new lead
- `PATCH /DELETE /leads/:id` - Update or delete a lead
- `GET/POST /providers` - List or add providers
- `PATCH/DELETE /providers/:id` - Update or delete a provider

## Lead Status Flow

`new` → `contacted` → `forwarded` → `completed` | `cancelled`

## Running Locally

- Frontend: `pnpm --filter @workspace/drop-service run dev`
- API server: `pnpm --filter @workspace/api-server run dev`
- DB push: `pnpm --filter @workspace/db run push`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`

## Email Notifications (Pending Setup)

Lead notification emails to `Aaronc7240@gmail.com` are not yet configured.
The user wants to send FROM `serviceconnectlead@gmail.com`.
The Gmail integration was proposed but dismissed — next time, either retry the Gmail integration or use Resend (connector:ccfg_resend_01K69QKYK789WN202XSE3QS17V) with a free account at resend.com and store the API key as a secret.
The notification email should be sent from the API server's lead submission route (`artifacts/api-server/src/routes/leads.ts`) after a lead is successfully inserted.

## Default Seeded Services

Locksmith, Power Washing, Car Cleaning, Plumbing, Electrician, Gardening, House Cleaning, Handyman
