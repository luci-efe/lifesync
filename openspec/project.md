# LifeSync - Project Context

## Purpose

LifeSync es una aplicación web minimalista de organización personal que incluye:
- **To-Do List**: Gestión de tareas con estados y prioridades
- **Notas Rápidas**: Captura de notas con soporte markdown
- **Visualización de Calendario**: Vista de tareas programadas

Aunque la funcionalidad es sencilla, la arquitectura está diseñada para demostrar competencias avanzadas en DevOps: separación de responsabilidades, contenerización, orquestación de despliegues y observabilidad.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Auth Client**: Clerk (@clerk/nextjs)
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **ORM**: Prisma
- **Language**: TypeScript
- **Testing**: Jest

### Infrastructure
- **IaC**: Terraform (~> 3.0.2)
- **Cloud**: Microsoft Azure (Student Subscription)
- **Containers**: Docker + Docker Hub
- **CI/CD**: Azure DevOps Pipelines (YAML)
- **Database**: Azure Database for PostgreSQL (Flexible Server)
- **Hosting**: Azure App Service (Linux)
- **Monitoring**: Azure Application Insights

### Authentication
- **Provider**: Clerk (Identity as a Service)
- **Pattern**: Frontend handles auth, Backend validates userId

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with default config
- **Linting**: ESLint with recommended rules
- **Naming**:
  - Files: kebab-case (e.g., `task-service.ts`)
  - Components: PascalCase (e.g., `TaskList.tsx`)
  - Functions/Variables: camelCase
  - Constants: SCREAMING_SNAKE_CASE
  - Database tables: snake_case

### Architecture Patterns

#### Monorepo Structure
```
/
├── frontend/          # Next.js 14 App
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and API clients
│   └── Dockerfile
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── prisma/    # Database schema
│   │   └── middleware/# Auth, error handling
│   ├── tests/         # Jest unit tests
│   └── Dockerfile
├── infra/             # Terraform IaC
│   ├── modules/       # Reusable modules
│   ├── environments/  # Dev/Prod tfvars
│   └── main.tf
├── pipelines/         # Azure DevOps YAML
│   ├── backend-pipeline.yml
│   └── frontend-pipeline.yml
└── openspec/          # Specifications
```

#### Justificación de Arquitectura Separada
A pesar de que Next.js permite backend integrado (API Routes), hemos separado el Backend (Express) en su propio servicio contenerizado para cumplir con la rúbrica escolar que exige:
1. Pipelines de CI/CD independientes para Front y Back
2. Despliegue de microservicios o contenedores separados
3. Pruebas unitarias aisladas en el backend

### Testing Strategy
- **Unit Tests**: Jest para backend (mínimo endpoints health y CRUD)
- **Coverage**: Reporte de cobertura en pipeline
- **Requirement**: Pruebas deben pasar antes de deploy a Prod

### Git Workflow

#### Branch Strategy (GitFlow Simplificado)
- `main`: Producción, protegida con PR obligatorio
- `develop`: Integración, base para features
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Correcciones urgentes en producción

#### Commit Conventions
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: frontend, backend, infra, pipeline
```

#### PR Requirements
- Al menos 1 reviewer aprobando
- Build exitoso
- Tests pasando
- Sin conflictos de merge

## Domain Context

### Entities
- **Task**: Tarea con título, descripción, fecha límite, estado (pending/completed), prioridad
- **Note**: Nota rápida con título, contenido (markdown), timestamps
- **User**: Manejado por Clerk (userId como referencia externa)

### API Patterns
- RESTful endpoints bajo `/api/v1/`
- Responses en JSON con estructura `{ data, error, meta }`
- Filtrado por userId (extraído del token de Clerk)

## Important Constraints

### Azure Student Subscription Limits
- **Region**: `eastus2` (verificado compatible)
- **SKU App Service**: `F1` (Free) o `B1` (Basic) máximo
- **PostgreSQL**: Flexible Server, Burstable tier
- **ACR**: Basic tier

### Academic Requirements (Rúbrica - 100 pts)
| Criterio | Puntos |
|----------|--------|
| Documentación Wiki en ADO | 10 |
| Plan de trabajo (Issues/Tasks) | 5 |
| Ambientes Dev y Prod (Front + Back) | 10 |
| Estrategia de Ramas y PRs | 10 |
| Pipeline Backend (UAT + Cobertura) | 10 |
| Pipeline Frontend | 10 |
| Cambio visible en Dev | 10 |
| Approval Gate a Producción | 5 |
| Cambio visible en Producción | 10 |
| Monitoreo APM (trazas/errores) | 10 |
| Monitoreo Métricas (CPU/Mem) | 5 |
| Terraform IaC | 5 |

### Must-Have Endpoints (APM Demo)
- `GET /api/health` - Health check
- `GET /api/simulate-error` - Genera error 500 para demostrar APM

## External Dependencies

### Clerk (Authentication)
- Dashboard: https://dashboard.clerk.com
- Keys requeridas: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Middleware de protección en Next.js
- Validación de userId en Backend

### Azure Services
- **App Service**: 4 instancias (frontend-dev, frontend-prod, backend-dev, backend-prod)
- **PostgreSQL**: 1 servidor flexible con 2 databases (dev, prod)
- **Application Insights**: 1 recurso compartido para APM

### Docker Hub
- **Registry**: Docker Hub para almacenamiento de imágenes Docker
- **Repositories**: `{dockerhub-username}/lifesync-frontend`, `{dockerhub-username}/lifesync-backend`
- **Service Connection**: Configurado en Azure DevOps para push/pull de imágenes

### Azure DevOps
- **Project**: LifeSync
- **Repos**: Conectado a GitHub via Service Connection
- **Pipelines**: 2 YAML (backend, frontend)
- **Library**: Variable Group `LifeSync-Secrets`
- **Service Connections**:
  - Docker Hub (para push/pull de imágenes)
  - Azure Resource Manager (para deploy a App Service)

## Environment Variables

### Frontend
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_API_URL=https://backend-{env}.azurewebsites.net
```

### Backend
```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...
NODE_ENV=development|production
PORT=3001
```
