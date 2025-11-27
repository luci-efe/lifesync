# Pipelines Design

## Context

LifeSync requiere pipelines CI/CD en Azure DevOps para:
- Build y test automático del código
- Empaquetado en imágenes Docker
- Deploy a ambientes Dev (automático) y Prod (con aprobación)
- Cumplir requisitos de rúbrica: pipelines separados, pruebas unitarias, approval gates

**Stakeholders:**
- Desarrollador (yo): Ejecuta pipelines
- Profesor: Evalúa cumplimiento de rúbrica
- Approver: Autoriza deployments a producción

## Goals / Non-Goals

### Goals
- Pipelines 100% YAML (versionados en repo)
- Separación clara Backend vs Frontend
- Tests visibles en Azure DevOps UI
- Approval gates para producción
- Trazabilidad de qué se desplegó y cuándo

### Non-Goals
- Infrastructure as Code pipeline (Terraform se corre local)
- Blue-green deployments
- Canary releases
- Performance testing automatizado

## Decisions

### Decision 1: Multi-stage YAML pipelines
**Elegido:** YAML pipelines con múltiples stages

**Razón:**
- Versionados junto con el código
- Portables y auditables
- Soportan environments y approval gates
- Requerido por mejores prácticas de Azure DevOps

**Alternativas consideradas:**
- Classic UI pipelines: No versionables, más limitados
- GitHub Actions: No es Azure DevOps (requerimiento del curso)

### Decision 2: Docker-based deployment
**Elegido:** Build Docker → Push Docker Hub → Deploy container to App Service

**Razón:**
- Consistencia entre local y producción
- Demostración de containerización
- App Service for Containers es straightforward
- Docker Hub requerido por la rúbrica del profesor

**Alternativas consideradas:**
- Zip deploy: No demuestra Docker skills
- ACR: No cumple el requerimiento explícito de usar Docker Hub
- Azure Container Apps: Más complejo, no free tier

### Decision 3: Test reporting con JUnit format
**Elegido:** Jest con reporter `jest-junit`

**Razón:**
- Azure DevOps parsea JUnit XML nativamente
- Tests aparecen en pestaña "Tests" del pipeline
- Coverage se puede publicar como artifact

### Decision 4: Environments para approval gates
**Elegido:** Azure DevOps Environments con approvals

**Razón:**
- Configuración visual de approvers
- Historial de aprobaciones
- Integrado con pipeline stages

## Pipeline Flow Diagrams

### Backend Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Backend Pipeline Flow                            │
│                                                                      │
│  Trigger: push to develop/main en backend/**                        │
│                                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐         │
│  │  Build   │──▶│   Test   │──▶│  Docker  │──▶│  Push to │         │
│  │          │   │  + Lint  │   │  Build   │   │Docker Hub│         │
│  └──────────┘   └────┬─────┘   └──────────┘   └────┬─────┘         │
│                      │                              │                │
│                      ▼                              │                │
│               ┌──────────────┐                      │                │
│               │ Publish Test │                      │                │
│               │   Results    │                      │                │
│               └──────────────┘                      │                │
│                                                     │                │
│  ┌──────────────────────────────────────────────────┘                │
│  │                                                                   │
│  ▼                                                                   │
│  ┌──────────────┐                    ┌──────────────┐               │
│  │ Deploy Dev   │───[if main]───────▶│ Deploy Prod  │               │
│  │ (automatic)  │                    │ (approval)   │               │
│  └──────────────┘                    └──────────────┘               │
│                                             │                        │
│                                             ▼                        │
│                                      ┌──────────────┐               │
│                                      │ Health Check │               │
│                                      └──────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Frontend Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Frontend Pipeline Flow                           │
│                                                                      │
│  Trigger: push to develop/main en frontend/**                       │
│                                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                         │
│  │  Build   │──▶│  Docker  │──▶│ Push to  │                         │
│  │  Next.js │   │  Build   │   │Docker Hub│                         │
│  │          │   │(+args)   │   │          │                         │
│  └──────────┘   └──────────┘   └────┬─────┘                         │
│                                     │                                │
│  ┌──────────────────────────────────┘                                │
│  │                                                                   │
│  ▼                                                                   │
│  ┌──────────────┐                    ┌──────────────┐               │
│  │ Deploy Dev   │───[if main]───────▶│ Deploy Prod  │               │
│  │ (automatic)  │                    │ (approval)   │               │
│  └──────────────┘                    └──────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Stage Definitions

### Backend Stages

```yaml
stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - task: NodeTool@0 (v20)
          - script: npm ci
          - script: npm run lint
          - script: npm test -- --coverage
          - task: PublishTestResults@2
          - task: PublishCodeCoverageResults@1
          - script: npm run build

  - stage: Package
    dependsOn: Build
    jobs:
      - job: DockerBuildPush
        steps:
          - task: Docker@2 (build)
          - task: Docker@2 (push to Docker Hub)

  - stage: DeployDev
    dependsOn: Package
    condition: always() # or specific branch
    jobs:
      - deployment: DeployBackendDev
        environment: 'dev'
        strategy:
          runOnce:
            deploy:
              - task: AzureWebAppContainer@1

  - stage: DeployProd
    dependsOn: DeployDev
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployBackendProd
        environment: 'prod' # Has approval configured
        strategy:
          runOnce:
            deploy:
              - task: AzureWebAppContainer@1
```

## Variable Groups Structure

```
Library/
├── LifeSync-Secrets-Dev
│   ├── CLERK_PUBLISHABLE_KEY (secret)
│   ├── CLERK_SECRET_KEY (secret)
│   ├── DATABASE_URL (secret)
│   ├── APPLICATIONINSIGHTS_CONNECTION_STRING (secret)
│   ├── DOCKERHUB_USERNAME (secret)
│   └── DOCKERHUB_TOKEN (secret)
│
└── LifeSync-Secrets-Prod
    └── (same structure, production values)
```

## Trigger Configuration

```yaml
# Backend Pipeline
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - backend/**
      - pipelines/backend-pipeline.yml
    exclude:
      - backend/README.md

# Frontend Pipeline
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - frontend/**
      - pipelines/frontend-pipeline.yml
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Pipeline timeout en free tier | Optimizar build, usar cache de npm |
| Secrets expuestos en logs | Usar variables secretas, verificar que no se loggeen |
| Deploy fallido sin rollback | Health check post-deploy, manual rollback si falla |
| Approval gate olvidado | Notificación por email, timeout de 72h |

## Environment Configuration

### Dev Environment
- **Approval:** Ninguna (deploy automático)
- **Variables:** LifeSync-Secrets-Dev
- **Target:** lifesync-backend-dev, lifesync-frontend-dev

### Prod Environment
- **Approval:** Requerida (1 approver mínimo)
- **Approvers:** [Tu usuario de Azure DevOps]
- **Timeout:** 72 horas
- **Variables:** LifeSync-Secrets-Prod
- **Target:** lifesync-backend-prod, lifesync-frontend-prod

## Open Questions

- [ ] ¿Incluir lint/format check como stage separado o junto con build?
  - **Recomendación:** Junto con build para simplificar
- [ ] ¿Publicar Docker image con tag de branch además de build ID?
  - **Recomendación:** Sí, ayuda a identificar imágenes
