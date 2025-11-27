# LifeSync - Wiki

> **Personal Organization Platform** | Azure DevOps Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Component Design](#component-design)
5. [Infrastructure Diagram](#infrastructure-diagram)
6. [Deployment Diagram](#deployment-diagram)
7. [Branch Strategy](#branch-strategy)
8. [CI/CD Pipelines](#cicd-pipelines)
9. [Environments](#environments)
10. [Monitoring & Observability](#monitoring--observability)

---

## Project Overview

### Description

**LifeSync** is a minimalist personal organization web application designed to help users manage their daily tasks and notes efficiently. The project serves as a demonstration of modern DevOps practices and cloud-native application development.

### Key Features

| Feature | Description |
|---------|-------------|
| **Task Management** | Create, update, and track tasks with priorities, due dates, and completion status |
| **Quick Notes** | Capture and organize notes with full Markdown support |
| **Calendar View** | Visualize scheduled tasks in an intuitive calendar interface |
| **Secure Authentication** | User authentication and authorization powered by Clerk |
| **Multi-Environment** | Separate Development and Production environments |

### Project Objectives

- Demonstrate separation of concerns with independent Frontend and Backend services
- Implement containerization with Docker
- Deploy infrastructure using Terraform (IaC)
- Automate CI/CD with Azure DevOps Pipelines
- Enable observability with Application Insights (APM)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Clerk | @clerk/nextjs | Authentication client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | JavaScript runtime |
| Express.js | 4.x | Web application framework |
| Prisma | 5.x | Database ORM |
| TypeScript | 5.x | Type-safe JavaScript |
| Jest | 29.x | Testing framework |

### Infrastructure & DevOps

| Technology | Purpose |
|------------|---------|
| Terraform | Infrastructure as Code |
| Docker | Containerization |
| Docker Hub | Container registry |
| Azure App Service | Application hosting |
| Azure PostgreSQL | Database (Flexible Server) |
| Azure Application Insights | APM & Monitoring |
| Azure DevOps Pipelines | CI/CD automation |

---

## System Architecture

```
                                 ┌─────────────────┐
                                 │      Users      │
                                 └────────┬────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │        Clerk          │
                              │   (Authentication)    │
                              └───────────┬───────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
         ┌─────────────────┐                         ┌─────────────────┐
         │    Frontend     │                         │    Frontend     │
         │   (Dev Env)     │                         │   (Prod Env)    │
         │   Next.js 14    │                         │   Next.js 14    │
         │   App Service   │                         │   App Service   │
         └────────┬────────┘                         └────────┬────────┘
                  │                                           │
                  │ REST API                                  │ REST API
                  ▼                                           ▼
         ┌─────────────────┐                         ┌─────────────────┐
         │    Backend      │                         │    Backend      │
         │   (Dev Env)     │                         │   (Prod Env)    │
         │   Express.js    │                         │   Express.js    │
         │   App Service   │                         │   App Service   │
         └────────┬────────┘                         └────────┬────────┘
                  │                                           │
                  └──────────────────┬────────────────────────┘
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │     PostgreSQL      │
                          │   Flexible Server   │
                          │ ┌───────┐ ┌───────┐ │
                          │ │  Dev  │ │ Prod  │ │
                          │ │  DB   │ │  DB   │ │
                          │ └───────┘ └───────┘ │
                          └─────────────────────┘
```

---

## Component Design

### Backend Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (Express)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │   Middleware    │     │     Routes      │                    │
│  ├─────────────────┤     ├─────────────────┤                    │
│  │ + authMiddleware│     │ /api/health     │                    │
│  │ + errorHandler  │     │ /api/v1/tasks   │                    │
│  │ + cors          │     │ /api/v1/notes   │                    │
│  │ + helmet        │     │ /api/simulate-  │                    │
│  │ + morgan        │     │   error         │                    │
│  └────────┬────────┘     └────────┬────────┘                    │
│           │                       │                              │
│           └───────────┬───────────┘                              │
│                       ▼                                          │
│            ┌─────────────────┐                                   │
│            │    Services     │                                   │
│            ├─────────────────┤                                   │
│            │ + TaskService   │                                   │
│            │   - create()    │                                   │
│            │   - findAll()   │                                   │
│            │   - update()    │                                   │
│            │   - delete()    │                                   │
│            │                 │                                   │
│            │ + NoteService   │                                   │
│            │   - create()    │                                   │
│            │   - findAll()   │                                   │
│            │   - update()    │                                   │
│            │   - delete()    │                                   │
│            └────────┬────────┘                                   │
│                     │                                            │
│                     ▼                                            │
│            ┌─────────────────┐                                   │
│            │     Prisma      │                                   │
│            │      ORM        │                                   │
│            ├─────────────────┤                                   │
│            │ + Task Model    │                                   │
│            │ + Note Model    │                                   │
│            └─────────────────┘                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Models

```
┌─────────────────────────────────────────────────────────────────┐
│                        Database Schema                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────┐     │
│  │         Task            │    │          Note           │     │
│  ├─────────────────────────┤    ├─────────────────────────┤     │
│  │ + id: String (PK)       │    │ + id: String (PK)       │     │
│  │ + userId: String        │    │ + userId: String        │     │
│  │ + title: String         │    │ + title: String         │     │
│  │ + description: String?  │    │ + content: String       │     │
│  │ + dueDate: DateTime?    │    │ + createdAt: DateTime   │     │
│  │ + priority: Priority    │    │ + updatedAt: DateTime   │     │
│  │ + status: TaskStatus    │    └─────────────────────────┘     │
│  │ + createdAt: DateTime   │                                    │
│  │ + updatedAt: DateTime   │    ┌─────────────────────────┐     │
│  └─────────────────────────┘    │       Enums             │     │
│                                  ├─────────────────────────┤     │
│                                  │ Priority:               │     │
│                                  │   - LOW                 │     │
│                                  │   - MEDIUM              │     │
│                                  │   - HIGH                │     │
│                                  │                         │     │
│                                  │ TaskStatus:             │     │
│                                  │   - PENDING             │     │
│                                  │   - COMPLETED           │     │
│                                  └─────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Components

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        App Router                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  /                    → Landing Page                      │   │
│  │  /sign-in             → Clerk Sign In                     │   │
│  │  /sign-up             → Clerk Sign Up                     │   │
│  │  /dashboard           → Main Dashboard                    │   │
│  │  /dashboard/tasks     → Task Management                   │   │
│  │  /dashboard/notes     → Notes Management                  │   │
│  │  /dashboard/calendar  → Calendar View                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    Layout       │  │   Components    │  │      Lib        │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ + Navbar        │  │ + TaskList      │  │ + api-client    │  │
│  │ + Sidebar       │  │ + TaskCard      │  │ + utils         │  │
│  │ + Footer        │  │ + TaskForm      │  │ + types         │  │
│  │ + UserButton    │  │ + NoteList      │  │ + hooks         │  │
│  │                 │  │ + NoteEditor    │  │                 │  │
│  │                 │  │ + Calendar      │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Azure Resource Group                              │
│                         rg-lifesync                                      │
│                         Region: eastus2                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     App Service Plan (Linux)                        │ │
│  │                          plan-lifesync                              │ │
│  │                          SKU: B1 (Basic)                            │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │ │
│  │  │  Frontend Dev  │  │ Frontend Prod  │  │  Backend Dev   │        │ │
│  │  │lifesync-fe-dev │  │lifesync-fe-prod│  │lifesync-be-dev │        │ │
│  │  │   Container    │  │   Container    │  │   Container    │        │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │ │
│  │  ┌────────────────┐                                                 │ │
│  │  │  Backend Prod  │                                                 │ │
│  │  │lifesync-be-prod│                                                 │ │
│  │  │   Container    │                                                 │ │
│  │  └────────────────┘                                                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  PostgreSQL Flexible Server    │  │     Application Insights       │ │
│  │       psql-lifesync            │  │        appi-lifesync           │ │
│  │   Tier: Burstable B1ms         │  │                                │ │
│  │  ┌──────────┐  ┌──────────┐   │  │   - Traces                     │ │
│  │  │lifesync  │  │lifesync  │   │  │   - Exceptions                 │ │
│  │  │  _dev    │  │  _prod   │   │  │   - Metrics                    │ │
│  │  └──────────┘  └──────────┘   │  │   - Live Metrics               │ │
│  └────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

                    External Services
    ┌────────────────────┐          ┌────────────────────┐
    │     Docker Hub     │          │       Clerk        │
    │  Container Images  │          │  Authentication    │
    │ - lifesync-frontend│          │    - OAuth 2.0     │
    │ - lifesync-backend │          │    - JWT tokens    │
    └────────────────────┘          └────────────────────┘
```

---

## Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEPLOYMENT FLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Developer                                                              │
│      │                                                                   │
│      │ git push                                                          │
│      ▼                                                                   │
│  ┌──────────┐                                                           │
│  │  GitHub  │                                                           │
│  │   Repo   │                                                           │
│  └────┬─────┘                                                           │
│       │                                                                  │
│       │ Webhook Trigger                                                  │
│       ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Azure DevOps Pipeline                         │    │
│  │                                                                  │    │
│  │  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌───────────────┐   │    │
│  │  │  Build  │──▶│  Test   │──▶│ Docker  │──▶│ Push to       │   │    │
│  │  │         │   │  + Lint │   │  Build  │   │ Docker Hub    │   │    │
│  │  └─────────┘   └─────────┘   └─────────┘   └───────┬───────┘   │    │
│  │                                                     │           │    │
│  │                     ┌───────────────────────────────┘           │    │
│  │                     │                                           │    │
│  │                     ▼                                           │    │
│  │  ┌─────────────────────┐          ┌─────────────────────┐      │    │
│  │  │    Deploy to Dev    │          │   Deploy to Prod    │      │    │
│  │  │    (Automatic)      │─────────▶│   (With Approval)   │      │    │
│  │  │                     │          │                     │      │    │
│  │  │  lifesync-*-dev     │          │  lifesync-*-prod    │      │    │
│  │  └─────────────────────┘          └─────────────────────┘      │    │
│  │                                            │                    │    │
│  │                                            │ Approval Gate      │    │
│  │                                            ▼                    │    │
│  │                                   ┌────────────────┐            │    │
│  │                                   │    Approver    │            │    │
│  │                                   │   (Manual)     │            │    │
│  │                                   └────────────────┘            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│                     ┌─────────────────────────────────┐                 │
│                     │        Azure App Service        │                 │
│                     │                                 │                 │
│                     │  Dev Environment   Prod Env    │                 │
│                     │  ┌─────────────┐  ┌──────────┐ │                 │
│                     │  │   Auto      │  │ Approved │ │                 │
│                     │  │   Deploy    │  │  Deploy  │ │                 │
│                     │  └─────────────┘  └──────────┘ │                 │
│                     └─────────────────────────────────┘                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Branch Strategy

### GitFlow (Simplified)

```
    ┌─────────────────────────────────────────────────────────────────┐
    │                         BRANCH STRATEGY                          │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                  │
    │   main (Production)                                              │
    │   ═══════════════════════════════════════════════════════════   │
    │         │                           ▲                            │
    │         │                           │ PR (with approval)         │
    │         ▼                           │                            │
    │   develop (Integration)                                          │
    │   ───────────────────────────────────────────────────────────   │
    │         │           ▲               ▲                            │
    │         │           │               │                            │
    │         ▼           │ PR            │ PR                         │
    │      feature/       │               │                            │
    │      new-task-ui────┘               │                            │
    │                                     │                            │
    │      feature/                       │                            │
    │      add-calendar───────────────────┘                            │
    │                                                                  │
    │   hotfix/* ─────────────────────────────────────────▶ main      │
    │   (Emergency fixes go directly to main)                         │
    │                                                                  │
    └─────────────────────────────────────────────────────────────────┘
```

### Branch Policies

| Branch | Policy |
|--------|--------|
| `main` | Protected, requires PR, 1 reviewer, successful build |
| `develop` | Requires PR, successful build |
| `feature/*` | Created from develop, merged via PR |
| `hotfix/*` | Created from main, merged to main AND develop |

### Commit Convention

```
<type>(<scope>): <description>

Examples:
- feat(frontend): add task creation form
- fix(backend): resolve database connection issue
- docs(wiki): update deployment diagram
- test(backend): add unit tests for TaskService
- chore(pipeline): update Node.js version
```

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

---

## CI/CD Pipelines

### Backend Pipeline

**Trigger:** Changes to `backend/**` on `main` or `develop`

```yaml
Stages:
  1. Build & Test
     - Install dependencies (npm ci)
     - Run linting
     - Execute unit tests with coverage
     - Publish test results

  2. Package
     - Build Docker image
     - Push to Docker Hub

  3. Deploy Dev
     - Deploy container to App Service (Dev)
     - Health check validation

  4. Deploy Prod (main branch only)
     - Wait for approval
     - Deploy container to App Service (Prod)
     - Health check validation
```

### Frontend Pipeline

**Trigger:** Changes to `frontend/**` on `main` or `develop`

```yaml
Stages:
  1. Build
     - Install dependencies
     - Build Next.js application
     - Build Docker image with build args

  2. Package
     - Push to Docker Hub

  3. Deploy Dev
     - Deploy container to App Service (Dev)

  4. Deploy Prod (main branch only)
     - Wait for approval
     - Deploy container to App Service (Prod)
```

---

## Environments

### Development (Dev)

| Component | URL |
|-----------|-----|
| Frontend | `https://lifesync-fe-dev.azurewebsites.net` |
| Backend | `https://lifesync-be-dev.azurewebsites.net` |
| Database | `lifesync_dev` |

**Purpose:** Testing and integration of new features

### Production (Prod)

| Component | URL |
|-----------|-----|
| Frontend | `https://lifesync-fe-prod.azurewebsites.net` |
| Backend | `https://lifesync-be-prod.azurewebsites.net` |
| Database | `lifesync_prod` |

**Purpose:** Live application for end users

---

## Monitoring & Observability

### Application Insights Integration

| Metric | Description |
|--------|-------------|
| **Request Traces** | Track all API calls and their duration |
| **Exceptions** | Automatic capture of errors and stack traces |
| **Dependencies** | Monitor database and external service calls |
| **Custom Events** | Application-specific telemetry |

### Key Metrics

| Metric | Location in Azure Portal |
|--------|--------------------------|
| CPU Usage | App Service → Metrics |
| Memory Usage | App Service → Metrics |
| Request Count | Application Insights → Metrics |
| Failed Requests | Application Insights → Failures |
| Response Time | Application Insights → Performance |

### Demo Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Verify application is running |
| `GET /api/simulate-error` | Generate error for APM demonstration |

---

## Quick Links

| Resource | Link |
|----------|------|
| Azure Portal | [portal.azure.com](https://portal.azure.com) |
| Azure DevOps | [dev.azure.com](https://dev.azure.com) |
| Clerk Dashboard | [dashboard.clerk.com](https://dashboard.clerk.com) |
| Docker Hub | [hub.docker.com](https://hub.docker.com) |

---

*Last Updated: November 2024*
