# Pipelines Specification Delta

## MODIFIED Requirements

### Requirement: Pipeline Separation
El sistema MUST tener pipelines separados para frontend y backend.

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
El sistema MUST ejecutar CI (build y test) para el backend con lint.

#### Scenario: Backend Build Stage with Lint
- **WHEN** hay push a rama `dev` o `main` en `backend/**`
- **THEN** se ejecuta stage "Build":
  - Checkout del código
  - Setup Node.js 20
  - Install dependencies (`npm ci`)
  - Generate Prisma client (`npx prisma generate`)
  - Run linter (`npm run lint`)
  - Run tests (`npm test`)
  - Build TypeScript (`npm run build`)
- **AND** el pipeline falla si lint tiene errores
- **AND** el pipeline falla si hay tests fallidos

---

### Requirement: Backend CD Pipeline - Dev
El sistema MUST desplegar automáticamente a ambiente Dev desde rama `dev`.

#### Scenario: Deploy to Dev on Dev Branch
- **WHEN** el Docker push es exitoso y la rama es `dev`
- **THEN** se ejecuta stage "Deploy-Dev" automáticamente
- **AND** se actualiza Web App `lifesync-backend-dev`
- **AND** se configura para usar imagen `{dockerhub_username}/lifesync-backend:dev-latest`
- **AND** se ejecuta health check en `/api/health`

#### Scenario: Skip Dev Deploy on Main Branch
- **WHEN** el Docker push es exitoso y la rama es `main`
- **THEN** NO se ejecuta stage "Deploy-Dev"
- **AND** se procede directamente a "Deploy-Prod"

---

### Requirement: Backend CD Pipeline - Prod
El sistema MUST desplegar a Prod con aprobación manual desde rama `main`.

#### Scenario: Approval Gate for Main Branch
- **WHEN** la rama es `main` y el build/package son exitosos
- **THEN** el stage "Deploy-Prod" requiere aprobación manual
- **AND** notifica a approvers configurados
- **AND** espera máximo 72 horas por aprobación

#### Scenario: Deploy to Prod After Approval
- **WHEN** se aprueba el deployment para rama `main`
- **THEN** se actualiza Web App `lifesync-backend-prod`
- **AND** se usa imagen `{dockerhub_username}/lifesync-backend:prod-latest`
- **AND** se usan variables de `LifeSync-Secrets-Prod`
- **AND** se ejecuta health check en `/api/health`

---

### Requirement: Frontend CI Pipeline
El sistema MUST ejecutar CI (build) para el frontend con lint.

#### Scenario: Frontend Build Stage with Lint
- **WHEN** hay push a rama `dev` o `main` en `frontend/**`
- **THEN** se ejecuta stage "Build":
  - Checkout del código
  - Setup Node.js 20
  - Install dependencies (`npm ci`)
  - Run linter (`npm run lint`)
  - Build Next.js (`npm run build`)
- **AND** el pipeline falla si lint tiene errores

---

### Requirement: Frontend CD Pipeline
El sistema MUST desplegar frontend a Dev y Prod siguiendo el mismo patrón que backend.

#### Scenario: Frontend Deploy to Dev
- **WHEN** Docker push exitoso y rama es `dev`
- **THEN** se actualiza Web App `lifesync-frontend-dev`
- **AND** con `NEXT_PUBLIC_API_URL` apuntando a `https://lifesync-backend-dev.azurewebsites.net`

#### Scenario: Frontend Deploy to Prod
- **WHEN** rama es `main` y hay aprobación
- **THEN** se actualiza Web App `lifesync-frontend-prod`
- **AND** con `NEXT_PUBLIC_API_URL` apuntando a `https://lifesync-backend-prod.azurewebsites.net`

---

### Requirement: Pipeline Triggers
El sistema MUST configurar triggers apropiados para ambas ramas principales.

#### Scenario: CI Trigger for Dev and Main
- **WHEN** hay push a `dev` o `main`
- **THEN** se ejecuta pipeline automáticamente
- **AND** solo si hay cambios en paths relevantes

#### Scenario: PR Trigger for Validation
- **WHEN** se abre PR hacia `dev` o `main`
- **THEN** se ejecuta build de validación (Build stage only)
- **AND** el status se reporta en el PR
- **AND** NO se ejecutan stages de deployment

---

## ADDED Requirements

### Requirement: Pipeline File Location
El sistema MUST tener los pipelines en un directorio centralizado.

#### Scenario: Centralized Pipelines Directory
- **WHEN** se buscan los archivos de pipeline
- **THEN** existen en el directorio `pipelines/` en la raíz del repositorio
- **AND** el backend pipeline está en `pipelines/backend-pipeline.yml`
- **AND** el frontend pipeline está en `pipelines/frontend-pipeline.yml`
- **AND** no existe `backend/azure-pipelines.yml` (archivo legacy eliminado)

---

### Requirement: Docker Image Tagging
El sistema MUST usar tags consistentes para imágenes Docker.

#### Scenario: Dev Branch Image Tags
- **WHEN** se hace push de imagen desde rama `dev`
- **THEN** la imagen tiene tags:
  - `$(Build.BuildId)` - único por build
  - `dev-latest` - última versión de dev

#### Scenario: Main Branch Image Tags
- **WHEN** se hace push de imagen desde rama `main`
- **THEN** la imagen tiene tags:
  - `$(Build.BuildId)` - único por build
  - `prod-latest` - última versión de producción

---

### Requirement: Health Check Verification
El sistema MUST verificar la salud de la aplicación después del deploy.

#### Scenario: Backend Health Check After Deploy
- **WHEN** se completa deploy del backend a cualquier ambiente
- **THEN** se hace GET al endpoint `/api/health`
- **AND** se espera status 200
- **AND** si falla después de 3 reintentos, el stage se marca como fallido

#### Scenario: Frontend Health Check After Deploy
- **WHEN** se completa deploy del frontend a cualquier ambiente
- **THEN** se verifica que la URL principal responde con status 200
- **AND** si falla después de 3 reintentos, el stage se marca como warning (no falla el pipeline)

---

### Requirement: Variable Groups by Environment
El sistema MUST usar Variable Groups separados por ambiente.

#### Scenario: Dev Environment Variables
- **WHEN** se despliega a ambiente Dev
- **THEN** se usan variables de `LifeSync-Secrets-Dev`
- **AND** incluye todas las variables necesarias para el ambiente de desarrollo

#### Scenario: Prod Environment Variables
- **WHEN** se despliega a ambiente Prod
- **THEN** se usan variables de `LifeSync-Secrets-Prod`
- **AND** incluye todas las variables necesarias para el ambiente de producción
- **AND** las variables son independientes del ambiente Dev

---

### Requirement: CI/CD Documentation
El sistema MUST incluir documentación de configuración.

#### Scenario: Setup Guide Exists
- **WHEN** un desarrollador nuevo necesita configurar CI/CD
- **THEN** existe archivo `docs/CICD-SETUP.md`
- **AND** contiene instrucciones para crear Service Connections
- **AND** contiene instrucciones para crear Variable Groups
- **AND** contiene instrucciones para crear Environments
- **AND** lista todos los credentials necesarios y dónde obtenerlos
