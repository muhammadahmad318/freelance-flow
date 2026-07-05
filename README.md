# ⚡ Electric Pulse: AI-Powered Business Development Platform

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

An enterprise-grade CRM and AI orchestration platform designed to automate business development workflows, manage client relationships, and track project lifecycles. Built with a strict adherence to Clean Architecture, Domain-Driven Design (DDD), and SOLID principles.

## 📖 Project Overview

As software engineering and business development scale, the administrative overhead of tracking clients, managing relational project data, and generating actionable insights grows exponentially.

This platform serves as a high-performance foundation for multi-agent AI orchestration. Currently, it acts as a highly optimized, zero-trust CRM. In upcoming phases, it will integrate automated AI solutions capable of researching client needs and generating meeting minutes autonomously.

## 🎯 Problem Statement

1. **Fragmented Data Ecosystems:** Traditional CRMs often separate client data from actual project execution, leading to "dirty writes" and out-of-sync information.
2. **Heavy UI/UX:** Bloated dashboards with excessive DOM nesting cause severe performance bottlenecks on large datasets.
3. **Lack of AI Native Orchestration:** Most tools bolt AI on as an afterthought rather than architecting the data layer to be consumable by autonomous agents.
4. **Poor Error Handling:** Database constraints (like Foreign Key violations) often crash frontend clients or display raw, confusing JSON to end users.

## 🏗️ Architecture & Design Philosophy

This repository is built utilizing **Feature-Sliced Design**. Every domain (e.g., Auth, Clients, Projects) is encapsulated with its own types, API services, UI components, and state management hooks.

- **Dumb UI, Smart Hooks:** UI primitives (Tables, Modals) contain zero business logic. All data fetching and caching is handled by isolated TanStack Query hooks.
- **Optimistic Caching:** Instant UI feedback powered by aggressive local cache invalidation.
- **Strict API Contracts:** End-to-end type safety using TypeScript interfaces mapped directly to PostgreSQL schemas.
- **Zero-Trust Security:** Row Level Security (RLS) enforced at the database level. No tenant can ever access another tenant's data, even if the frontend is compromised.
- **Graceful Error Interception:** A global error mapper translates raw PostgreSQL error codes (e.g., `23503`, `PGRST103`) into human-readable UI toasts.

## 💻 Tech Stack

### Frontend Core

- **Framework:** React 18 (Vite)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 (Custom "Electric Pulse" Design System)
- **Icons:** Lucide React

### State & Data Management

- **Server State:** TanStack Query (React Query)
- **Form State:** React Hook Form
- **Schema Validation:** Zod

### Backend & Infrastructure (BaaS)

- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Security:** Row Level Security (RLS)
- **Search:** PostgreSQL `pg_trgm` (Trigram indexing for fuzzy search)

## 📂 Folder Structure

```text
src/
├── components/          # Global, dumb UI primitives
│   ├── ui/              # Buttons, Inputs, Modals, Tables, Toasts
│   └── EmptyState.tsx
├── contexts/            # Global React Contexts (e.g., ToastContext)
├── features/            # Feature-sliced domain modules
│   ├── auth/            # Authentication logic & context
│   ├── clients/         # Client Management Domain
│   │   ├── components/  # Domain-specific UI (ClientList, ClientModal)
│   │   ├── hooks/       # useClients, useCreateClient
│   │   ├── pages/       # ClientsPage (Dashboard View)
│   │   ├── services/    # clientService (Supabase API calls)
│   │   ├── types/       # DTOs and exact DB interfaces
│   │   └── validation/  # Zod schemas
│   └── projects/        # Project Management Domain
├── hooks/               # Global utility hooks (useDebounce)
├── lib/                 # Utility functions (errorMapper, supabase client)
├── styles/              # Global CSS & Tailwind configuration
├── App.tsx              # Root Router
└── main.tsx             # Provider Tree (QueryClient, Auth, Toast)

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account with an active project

### Installation

1. **Clone the repository:**

```bash
git clone [https://github.com/your-username/electric-pulse-crm.git](https://github.com/your-username/electric-pulse-crm.git)
cd electric-pulse-crm

```

2. **Install dependencies:**

```bash
npm install

```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```

4. **Start the development server:**

```bash
npm run dev

```

## 🛡️ Database Migrations

SQL migration scripts are located in the `/supabase/migrations` directory.

- `01_auth.sql` - User profiles and triggers.
- `03_clients.sql` - Client tables, RLS, and Trigram search indexes.
- `04_projects.sql` - Relational project schemas and foreign key constraints.

Execute these via the Supabase SQL Editor or the Supabase CLI to synchronize your local environment.

## 📄 License

This project is licensed under the MIT License.

