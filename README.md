# 🎓 School Management System

A comprehensive, state-of-the-art School Management System built with modern technologies.

## 🏗️ Architecture

This project uses a **Monorepo** structure with **pnpm workspaces**.

### Technology Stack
- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **Package Manager**: pnpm

## 📁 Project Structure

```
school-management-system/
├── apps/
│   ├── api-server/          # Node.js Express API
│   └── school-frontend/     # React + Vite Frontend
├── packages/
│   ├── db/                  # Drizzle ORM Database
│   └── shared/              # Shared utilities
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment files
cp .env.example .env

# Generate database schema
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### Development

```bash
# Start all services in development mode
pnpm dev

# Start specific service
pnpm -F @school/api-server dev
pnpm -F @school/school-frontend dev
```

## 📦 Core Modules

### 1. Attendance & Geofencing
- GPS coordinate validation
- Radius checking for self-check-ins
- Real-time attendance tracking

### 2. Behavior & Counselor Workflow
- Student behavioral violation logging
- Vice-Principal dashboard
- Counselor escalation system

### 3. Smart Communication
- Real-time chat system
- Read receipts and delivery status
- Push notifications
- WebRTC audio/video call placeholders

### 4. Noor System Integration
- Import attendance data
- Compare with official records
- Data synchronization

### 5. Teacher Schedule Management
- Weekly schedule builder
- Substitute class pickup
- Real-time availability

### 6. Parent Visitor Portal
- QR code generation
- Visitor authorization
- Guard validation system

## 🔐 Role-Based Access Control (RBAC)

Supported roles:
- Principal
- Vice-Principal
- Counselor
- Teacher
- Admin Staff
- Guard
- Student
- Parent

## 📝 License

MIT
