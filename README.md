# LifeSync

**A minimalist personal organization web application built with modern DevOps practices.**

LifeSync is a full-stack application designed to demonstrate advanced DevOps competencies including containerization, CI/CD pipelines, infrastructure as code, and observability.

---

## Features

- **Task Management** - Create, organize, and track tasks with priorities and due dates
- **Quick Notes** - Capture notes with Markdown support
- **Calendar View** - Visualize scheduled tasks in a calendar format
- **Secure Authentication** - User authentication powered by Clerk

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Express.js, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Azure Flexible Server) |
| **Authentication** | Clerk |
| **Infrastructure** | Terraform, Azure App Service, Docker |
| **CI/CD** | Azure DevOps Pipelines |
| **Monitoring** | Azure Application Insights |
| **Container Registry** | Docker Hub |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                               │
│                                                                  │
│   ┌─────────────┐         ┌─────────────┐                       │
│   │  Frontend   │────────▶│   Backend   │                       │
│   │  (Next.js)  │   API   │  (Express)  │                       │
│   │  App Service│         │  App Service│                       │
│   └─────────────┘         └──────┬──────┘                       │
│                                  │                               │
│                                  ▼                               │
│                          ┌─────────────┐                        │
│                          │ PostgreSQL  │                        │
│                          │  Flexible   │                        │
│                          │   Server    │                        │
│                          └─────────────┘                        │
│                                                                  │
│   ┌─────────────────────────────────────────────────┐           │
│   │              Application Insights                │           │
│   │         (Traces, Errors, Metrics)               │           │
│   └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘

         ┌─────────────┐          ┌─────────────┐
         │  Docker Hub │◀─────────│ Azure DevOps│
         │   Registry  │  Push    │  Pipelines  │
         └─────────────┘          └─────────────┘
```

---

## Project Structure

```
lifesync/
├── frontend/              # Next.js 14 Application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and API clients
│   └── Dockerfile
├── backend/               # Express.js API
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── prisma/        # Database schema
│   │   └── middleware/    # Auth, error handling
│   ├── tests/             # Jest unit tests
│   └── Dockerfile
├── infra/                 # Terraform IaC
│   ├── modules/           # Reusable Terraform modules
│   ├── environments/      # Dev/Prod configurations
│   └── main.tf
├── pipelines/             # Azure DevOps YAML pipelines
│   ├── backend-pipeline.yml
│   └── frontend-pipeline.yml
└── openspec/              # Project specifications
```

---

## Getting Started

### Prerequisites

- Node.js 20 LTS
- Docker Desktop
- Terraform CLI
- Azure CLI
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifesync
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && npm install
   ```

3. **Configure environment variables**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # Backend (.env)
   DATABASE_URL=postgresql://...
   CLERK_SECRET_KEY=sk_...
   PORT=3001
   ```

4. **Run the applications**
   ```bash
   # Backend (terminal 1)
   cd backend && npm run dev

   # Frontend (terminal 2)
   cd frontend && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/v1/tasks` | List user tasks |
| `POST` | `/api/v1/tasks` | Create a task |
| `PUT` | `/api/v1/tasks/:id` | Update a task |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task |
| `GET` | `/api/v1/notes` | List user notes |
| `POST` | `/api/v1/notes` | Create a note |
| `GET` | `/api/simulate-error` | Generate 500 error (APM demo) |

---

## CI/CD Pipeline

### Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Azure DevOps Pipelines                       │
│                                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────────────┐ │
│  │  Build  │──▶│  Test   │──▶│ Docker  │──▶│   Deploy Dev    │ │
│  │         │   │         │   │  Push   │   │   (automatic)   │ │
│  └─────────┘   └─────────┘   └─────────┘   └────────┬────────┘ │
│                                                     │          │
│                                                     ▼          │
│                                            ┌─────────────────┐ │
│                                            │  Deploy Prod    │ │
│                                            │  (with approval)│ │
│                                            └─────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### Key Features

- **Separate pipelines** for Backend and Frontend
- **Automated testing** with Jest (unit tests + coverage)
- **Docker containerization** with multi-stage builds
- **Automatic deployment** to Dev environment
- **Approval gates** for Production deployment
- **Test results** visible in Azure DevOps UI

---

## Infrastructure (Terraform)

### Azure Resources

| Resource | Purpose |
|----------|---------|
| Resource Group | Container for all resources |
| App Service Plan | Hosting plan (F1/B1 tier) |
| App Service (x4) | Frontend/Backend for Dev/Prod |
| PostgreSQL Flexible Server | Database with Dev/Prod databases |
| Application Insights | APM and monitoring |

### Deploy Infrastructure

```bash
cd infra

# Initialize Terraform
terraform init

# Plan changes
terraform plan -var-file=environments/dev.tfvars

# Apply changes
terraform apply -var-file=environments/dev.tfvars
```

---

## Monitoring

LifeSync integrates with Azure Application Insights for full observability:

- **Distributed Tracing** - Track requests across services
- **Error Tracking** - Automatic exception capture
- **Performance Metrics** - CPU, memory, response times
- **Custom Events** - Application-specific telemetry

### Viewing Metrics

1. Navigate to Azure Portal
2. Open Application Insights resource
3. Explore:
   - **Transaction Search** - View individual requests
   - **Failures** - Analyze errors and exceptions
   - **Metrics** - CPU, memory, request rates

---

## Git Workflow

### Branch Strategy

```
main (production)
  │
  └── develop (integration)
        │
        ├── feature/* (new features)
        │
        └── hotfix/* (urgent fixes)
```

### Commit Convention

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: frontend, backend, infra, pipeline
```

### Pull Request Requirements

- At least 1 reviewer approval
- Successful build
- All tests passing
- No merge conflicts

---

## Environment Variables

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

### Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | App Insights connection |
| `NODE_ENV` | Environment (development/production) |
| `PORT` | Server port (default: 3001) |

---

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Submit a Pull Request
5. Wait for review and approval

---

## License

This project is developed for academic purposes as part of the "Infraestructura para el Desarrollo Continuo" course.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Node.js web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Clerk](https://clerk.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/) - CI/CD
- [Terraform](https://www.terraform.io/) - Infrastructure as Code
