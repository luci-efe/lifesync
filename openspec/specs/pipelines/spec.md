# Pipelines Specification

## Overview
Definición de pipelines CI/CD en Azure DevOps usando YAML para automatizar build, test y deploy del frontend y backend a ambientes Dev y Prod.

---

### Requirement: Pipeline Separation
El sistema DEBE tener pipelines separados para frontend y backend.

#### Scenario: Backend Pipeline File
- **WHEN** se configura CI/CD para backend
- **THEN** existe archivo `pipelines/backend-pipeline.yml`
- **AND** se triggerea con cambios en `backend/**`
- **AND** es independiente del frontend pipeline

#### Scenario: Frontend Pipeline File
- **WHEN** se configura CI/CD para frontend
- **THEN** existe archivo `pipelines/frontend-pipeline.yml`
- **AND** se triggerea con cambios en `frontend/**`
- **AND** es independiente del backend pipeline

---

### Requirement: Backend CI Pipeline
El sistema DEBE ejecutar CI (build y test) para el backend.

#### Scenario: Backend Build Stage
- **WHEN** hay push a rama `develop` o `main` en `backend/**`
- **THEN** se ejecuta stage "Build":
  - Checkout del código
  - Setup Node.js 20
  - Install dependencies (`npm ci`)
  - Run linter (`npm run lint`)
  - Run tests (`npm test`)
  - Build TypeScript (`npm run build`)

#### Scenario: Backend Test Results
- **WHEN** se ejecutan tests del backend
- **THEN** se publican resultados en formato JUnit
- **AND** aparecen en pestaña "Tests" de Azure DevOps
- **AND** el pipeline falla si hay tests fallidos

#### Scenario: Backend Coverage Report
- **WHEN** se ejecutan tests con coverage
- **THEN** se genera reporte de cobertura
- **AND** se publica como artifact
- **AND** se puede ver porcentaje en summary del pipeline

#### Scenario: Backend Docker Build
- **WHEN** el build y tests pasan
- **THEN** se construye imagen Docker
- **AND** se tagea con `$(Build.BuildId)` y `latest`
- **AND** se hace push a Docker Hub

---

### Requirement: Backend CD Pipeline - Dev
El sistema DEBE desplegar automáticamente a ambiente Dev.

#### Scenario: Deploy to Dev
- **WHEN** el Docker push es exitoso en rama `develop`
- **THEN** se ejecuta stage "Deploy-Dev"
- **AND** se actualiza Web App `lifesync-backend-dev`
- **AND** se configura para usar imagen recién pusheada

#### Scenario: Dev Environment Variables
- **WHEN** se despliega a Dev
- **THEN** se inyectan variables desde Variable Group `LifeSync-Secrets-Dev`
- **AND** incluye `DATABASE_URL`, `CLERK_SECRET_KEY`, etc.

---

### Requirement: Backend CD Pipeline - Prod
El sistema DEBE desplegar a Prod con aprobación manual.

#### Scenario: Approval Gate
- **WHEN** el deploy a Dev es exitoso y rama es `main`
- **THEN** el stage "Deploy-Prod" requiere aprobación manual
- **AND** notifica a approvers configurados
- **AND** espera máximo 72 horas por aprobación

#### Scenario: Deploy to Prod
- **WHEN** se aprueba el deployment
- **THEN** se actualiza Web App `lifesync-backend-prod`
- **AND** se usan variables de `LifeSync-Secrets-Prod`
- **AND** se registra quién aprobó

---

### Requirement: Frontend CI Pipeline
El sistema DEBE ejecutar CI (build) para el frontend.

#### Scenario: Frontend Build Stage
- **WHEN** hay push a rama `develop` o `main` en `frontend/**`
- **THEN** se ejecuta stage "Build":
  - Checkout del código
  - Setup Node.js 20
  - Install dependencies (`npm ci`)
  - Run linter (`npm run lint`)
  - Build Next.js (`npm run build`)

#### Scenario: Frontend Docker Build
- **WHEN** el build pasa
- **THEN** se construye imagen Docker con build args:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_API_URL`
- **AND** se tagea y push a Docker Hub

---

### Requirement: Frontend CD Pipeline
El sistema DEBE desplegar frontend a Dev y Prod.

#### Scenario: Frontend Deploy to Dev
- **WHEN** Docker push exitoso en rama `develop`
- **THEN** se actualiza Web App `lifesync-frontend-dev`
- **AND** con URL de backend apuntando a dev

#### Scenario: Frontend Deploy to Prod
- **WHEN** rama es `main` y hay aprobación
- **THEN** se actualiza Web App `lifesync-frontend-prod`
- **AND** con URL de backend apuntando a prod

---

### Requirement: Variable Groups
El sistema DEBE usar Variable Groups para secretos.

#### Scenario: Variable Group Structure
- **WHEN** se configuran secretos
- **THEN** existen Variable Groups:
  - `LifeSync-Secrets-Dev`
  - `LifeSync-Secrets-Prod`
- **AND** contienen:
  - `CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `DATABASE_URL`
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`
  - `DOCKERHUB_USERNAME`
  - `DOCKERHUB_TOKEN`

#### Scenario: Secret Masking
- **WHEN** se usan variables secretas
- **THEN** los valores están marcados como secret
- **AND** no se muestran en logs del pipeline

---

### Requirement: Service Connections
El sistema DEBE configurar Service Connections para Azure y Docker Hub.

#### Scenario: Azure Resource Manager Connection
- **WHEN** se despliega a Azure
- **THEN** existe Service Connection `azure-lifesync`
- **AND** tiene permisos para:
  - Azure Web App (deploy)

#### Scenario: Docker Hub Connection
- **WHEN** se hace push de imágenes
- **THEN** existe Service Connection `dockerhub-lifesync` de tipo "Docker Registry"
- **AND** configurado con Docker Hub credentials (username + access token)
- **AND** permite push/pull de imágenes `{username}/lifesync-*`

---

### Requirement: Branch Policies
El sistema DEBE aplicar políticas en ramas principales.

#### Scenario: Main Branch Protection
- **WHEN** se configura rama `main`
- **THEN** requiere Pull Request para merge
- **AND** requiere al menos 1 reviewer aprobando
- **AND** requiere build exitoso
- **AND** no permite push directo

#### Scenario: Develop Branch Protection
- **WHEN** se configura rama `develop`
- **THEN** requiere Pull Request para merge
- **AND** requiere build exitoso
- **AND** es la rama base para features

---

### Requirement: Pipeline Triggers
El sistema DEBE configurar triggers apropiados.

#### Scenario: CI Trigger
- **WHEN** hay push a `develop` o `main`
- **THEN** se ejecuta pipeline automáticamente
- **AND** solo si hay cambios en paths relevantes

#### Scenario: PR Trigger
- **WHEN** se abre PR hacia `develop` o `main`
- **THEN** se ejecuta build de validación
- **AND** el status se reporta en el PR

#### Scenario: Path Filters
- **WHEN** se configura trigger del backend
- **THEN** solo se activa con cambios en:
  - `backend/**`
  - `pipelines/backend-pipeline.yml`
- **AND** ignora cambios en `frontend/**`, `infra/**`

---

### Requirement: Pipeline Stages Structure
El sistema DEBE organizar pipelines en stages claros.

#### Scenario: Backend Pipeline Stages
- **WHEN** se ejecuta backend pipeline
- **THEN** tiene stages:
  1. `Build` - Compile, lint, test
  2. `Package` - Docker build y push
  3. `Deploy-Dev` - Deploy automático a dev
  4. `Deploy-Prod` - Deploy con approval a prod

#### Scenario: Frontend Pipeline Stages
- **WHEN** se ejecuta frontend pipeline
- **THEN** tiene stages:
  1. `Build` - Next.js build
  2. `Package` - Docker build y push
  3. `Deploy-Dev` - Deploy automático
  4. `Deploy-Prod` - Deploy con approval

---

### Requirement: Deployment Verification
El sistema DEBE verificar que deployments fueron exitosos.

#### Scenario: Health Check After Deploy
- **WHEN** se completa deploy del backend
- **THEN** se hace GET al endpoint `/api/health`
- **AND** se espera status 200
- **AND** si falla, el stage se marca como fallido

#### Scenario: Smoke Test After Deploy
- **WHEN** se completa deploy del frontend
- **THEN** se verifica que la URL responde
- **AND** se puede ver la landing page

---

### Requirement: Artifact Management
El sistema DEBE gestionar artifacts de build.

#### Scenario: Test Results Artifact
- **WHEN** se completa stage de tests
- **THEN** se publican resultados como artifact
- **AND** se retienen por 30 días

#### Scenario: Docker Image Tags
- **WHEN** se hace push a ACR
- **THEN** la imagen tiene tags:
  - `$(Build.BuildId)` - único por build
  - `latest` - siempre la más reciente
  - `$(Build.SourceBranchName)` - rama de origen
