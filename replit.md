# ServiceConnect - Drop Service Platform

## Overview

A drop-service lead generation platform for the Irish market. Customers browse 20 ranked local service categories, submit quote requests, and the business owner receives email notifications to forward leads to trusted local providers. Includes a full admin dashboard.

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

- **services** - Service categories (plumbing, cleaning, handyman, etc.)
- **leads** - Customer quote requests with `referenceCode`, `photoUrl`, status tracking
- **providers** - Trusted local service providers

## Features

### Public-facing
- Home page: hero, social proof stats bar, "How It Works" section, service grid (20 services), testimonials (6 reviews), service area (all 26 counties), FAQ accordion, trust section
- Service request form: service selection, contact details, timeframe dropdown, budget slider, AI description helper ("Suggest with AI" button), optional photo upload
- Thank you page: shows reference code (e.g. SC3F7A) with copy button and link to track quote
- Quote status tracker: `/quote-status` — customer enters reference code to see real-time status
- Pricing guides: `/pricing/:slug` — SEO-targeted pricing content for each service (plumbing, cleaning, handyman, electrician, landscaping)
- Cookie consent banner (localStorage-based, GDPR)
- WhatsApp floating button (bottom-right, configurable number)
- "Track Quote" link in navbar

### Admin (password: `admin123`, stored in localStorage)
- Route: `/admin/login`
- Dashboard with lead statistics
- Leads management: view, update status, add notes, assign to providers, see reference codes
- Providers management: add/edit/delete trusted service providers
- Services management: add/remove service categories

## API Endpoints

All under `/api`:
- `GET/POST /services` - List or create service categories
- `DELETE /services/:id` - Delete a service
- `GET /leads` - List all leads (admin)
- `GET /leads/status?ref=SCXXXXXX` - Public quote status lookup by reference code
- `POST /leads` - Submit new lead (generates referenceCode, handles photoUrl)
- `PATCH/DELETE /leads/:id` - Update or delete a lead
- `GET/POST /providers` - List or add providers
- `PATCH/DELETE /providers/:id` - Update or delete a provider
- `POST /ai/describe` - AI-powered job description suggestion (OpenAI gpt-4o-mini)
- `POST /storage/uploads/request-url` - Get presigned URL for direct-to-GCS photo upload

## Lead Status Flow

`new` → `contacted` → `forwarded` → `completed` | `cancelled`

## Running Locally

- Frontend: `pnpm --filter @workspace/drop-service run dev`
- API server: `pnpm --filter @workspace/api-server run dev`
- DB push: `pnpm --filter @workspace/db run push`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`

## Email Notifications

Active. New leads trigger an email to `Aaronc7240@gmail.com` from `serviceconnectlead@gmail.com` via Gmail integration. Email includes service, customer details, timeframe, budget, and reference code.
- Gmail client: `artifacts/api-server/src/gmail.ts`
- Connection ID: `conn_google-mail_01KMG6QB4K64CJM1K1P419275A`

## Integrations

- **Gmail**: email notifications for new leads
- **OpenAI** (`AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`): AI description suggestions
- **Object Storage** (`DEFAULT_OBJECT_STORAGE_BUCKET_ID`): Photo uploads via presigned URL to GCS

## Important Notes

- Admin password: `admin123` (hardcoded in AdminLogin.tsx)
- WhatsApp number placeholder in `WhatsAppButton.tsx`: update `WHATSAPP_NUMBER` const
- SEO domain: `https://serviceconnect.ie` — update when live domain confirmed
- Photo uploads: stored in GCS via presigned URL, objectPath saved in `leads.photoUrl`
- Reference codes: 8-char alphanumeric (e.g. `SC3F7A`) auto-generated on lead creation
- After OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`
