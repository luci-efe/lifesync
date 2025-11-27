# LifeSync - Tareas y Roadmap de Desarrollo

Este documento contiene las tareas que debes realizar manualmente y los specs que debes implementar con ayuda de Claude y OpenSpec.

---

## Tareas Manuales (Debes hacer TÚ)

Estas tareas requieren acceso a portales web, configuración de cuentas, o decisiones que solo tú puedes tomar.

### Configuración Inicial de Servicios

- [ ] **Crear cuenta en Clerk** (https://dashboard.clerk.com)
  - Crear aplicación "LifeSync"
  - Obtener `CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY`
  - Configurar OAuth providers si lo deseas (Google, GitHub)

- [ ] **Crear proyecto en Azure DevOps** (https://dev.azure.com)
  - Nombre: `LifeSync`
  - Invitar a `eduardo.estrada@iteso.mx` con licencia Basic
  - Crear Service Connection a GitHub (si usas GitHub como repo)
  - Crear Service Connection a Azure (Azure Resource Manager)

- [ ] **Verificar suscripción Azure for Students**
  - Confirmar que tienes créditos disponibles
  - Verificar que región `eastus2` está disponible
  - Revisar límites de recursos (App Service F1/B1)

### Configuración de Azure DevOps

- [ ] **Crear Variable Groups en Library**
  - `LifeSync-Secrets-Dev`:
    - `CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `DATABASE_URL` (después de crear PostgreSQL)
    - `APPLICATIONINSIGHTS_CONNECTION_STRING`
    - `ACR_USERNAME`
    - `ACR_PASSWORD`
  - `LifeSync-Secrets-Prod` (mismas variables, valores de prod)

- [ ] **Configurar Branch Policies**
  - Rama `main`: Requerir PR, 1 reviewer, build exitoso
  - Rama `develop`: Requerir PR, build exitoso

- [ ] **Crear Backlog Items en Azure Boards**
  - Usar el contenido de `project-context/backlog-idea.md`
  - Crear Epics, Features y Tasks según el documento

- [ ] **Crear Wiki del proyecto**
  - Descripción del proyecto
  - Stack tecnológico
  - Diagrama de infraestructura
  - Diagrama de deployment
  - Estrategia de ramas

### Configuración Local

- [ ] **Instalar herramientas necesarias**
  - Node.js 20 LTS
  - Docker Desktop
  - Terraform CLI
  - Azure CLI (`az login`)
  - Git configurado

- [ ] **Clonar y configurar repositorio**
  - Crear ramas `main` y `develop`
  - Configurar `.env` files locales (no commitear)

---

## Specs a Implementar con OpenSpec

Estos son los features que debes desarrollar. Para cada uno, usa el comando `/openspec:proposal` para crear una propuesta de cambio y luego `/openspec:apply` para implementarlo.

### Fase 1: Infraestructura (IaC)

| ID | Spec/Feature | Descripción | Prioridad |
|----|--------------|-------------|-----------|
| `add-terraform-base` | Terraform Base Setup | Resource Group, ACR, App Service Plan | Alta |
| `add-terraform-apps` | Web Apps Terraform | Backend y Frontend Web Apps (dev/prod) | Alta |
| `add-terraform-database` | PostgreSQL Terraform | Flexible Server con databases | Alta |
| `add-terraform-monitoring` | Application Insights | APM y Log Analytics Workspace | Alta |

**Comando sugerido:**
```bash
# Crear propuesta para infraestructura base
/openspec:proposal add-terraform-base
```

### Fase 2: Backend (API)

| ID | Spec/Feature | Descripción | Prioridad |
|----|--------------|-------------|-----------|
| `add-backend-setup` | Express + TypeScript Setup | Estructura base, configs, health endpoint | Alta |
| `add-prisma-schema` | Prisma Schema | Modelos Task y Note con migrations | Alta |
| `add-backend-crud` | CRUD Endpoints | Tasks y Notes API con userId filtering | Alta |
| `add-backend-apm` | APM Integration | Application Insights SDK, error endpoint | Alta |
| `add-backend-tests` | Unit Tests | Jest tests para health y CRUD | Alta |
| `add-backend-docker` | Dockerfile Backend | Multi-stage build para producción | Media |

**Comando sugerido:**
```bash
# Crear propuesta para setup de backend
/openspec:proposal add-backend-setup
```

### Fase 3: Frontend (UI)

| ID | Spec/Feature | Descripción | Prioridad |
|----|--------------|-------------|-----------|
| `add-frontend-setup` | Next.js 14 Setup | App Router, Tailwind, estructura base | Alta |
| `add-clerk-auth` | Clerk Authentication | Provider, middleware, UserButton | Alta |
| `add-frontend-layout` | Layout Components | Navbar, Sidebar, Dashboard shell | Alta |
| `add-tasks-ui` | Tasks UI | Lista, crear, editar, completar tareas | Alta |
| `add-notes-ui` | Notes UI | Lista, crear, editar notas | Media |
| `add-calendar-ui` | Calendar View | Vista de calendario con tareas | Baja |
| `add-frontend-docker` | Dockerfile Frontend | Multi-stage build con build args | Media |

**Comando sugerido:**
```bash
# Crear propuesta para setup de frontend
/openspec:proposal add-frontend-setup
```

### Fase 4: Pipelines (CI/CD)

| ID | Spec/Feature | Descripción | Prioridad |
|----|--------------|-------------|-----------|
| `add-backend-pipeline` | Backend Pipeline | Build, test, Docker, deploy dev/prod | Alta |
| `add-frontend-pipeline` | Frontend Pipeline | Build, Docker, deploy dev/prod | Alta |
| `add-approval-gates` | Approval Gates | Gates de aprobación para producción | Alta |

**Comando sugerido:**
```bash
# Crear propuesta para pipeline de backend
/openspec:proposal add-backend-pipeline
```

---

## Orden de Desarrollo Sugerido

### Sprint 1: Fundamentos (Días 1-3)
1. **Tareas manuales**: Crear cuentas Clerk, Azure DevOps, Variable Groups
2. **Spec**: `add-terraform-base` - Infraestructura base
3. **Spec**: `add-terraform-apps` - Web Apps
4. **Spec**: `add-terraform-database` - PostgreSQL
5. **Spec**: `add-terraform-monitoring` - Application Insights
6. **Manual**: Ejecutar `terraform apply` para crear recursos

### Sprint 2: Backend (Días 4-6)
1. **Spec**: `add-backend-setup` - Express base
2. **Spec**: `add-prisma-schema` - Modelos de datos
3. **Spec**: `add-backend-crud` - Endpoints CRUD
4. **Spec**: `add-backend-apm` - Integración APM
5. **Spec**: `add-backend-tests` - Tests unitarios
6. **Spec**: `add-backend-docker` - Dockerfile

### Sprint 3: Frontend (Días 7-9)
1. **Spec**: `add-frontend-setup` - Next.js base
2. **Spec**: `add-clerk-auth` - Autenticación
3. **Spec**: `add-frontend-layout` - Layout
4. **Spec**: `add-tasks-ui` - UI de tareas
5. **Spec**: `add-notes-ui` - UI de notas
6. **Spec**: `add-frontend-docker` - Dockerfile

### Sprint 4: DevOps & Demo (Días 10-12)
1. **Spec**: `add-backend-pipeline` - Pipeline backend
2. **Spec**: `add-frontend-pipeline` - Pipeline frontend
3. **Spec**: `add-approval-gates` - Gates de aprobación
4. **Manual**: Configurar pipelines en Azure DevOps
5. **Manual**: Probar flujo completo PR → Dev → Prod
6. **Manual**: Preparar demo con APM

---

## Checklist Final Pre-Presentación

### Documentación
- [ ] Wiki en Azure DevOps completa
- [ ] Diagrama de infraestructura
- [ ] Diagrama de deployment
- [ ] Estrategia de ramas documentada

### Pipelines
- [ ] Pipeline Backend funcionando (build + test + deploy)
- [ ] Pipeline Frontend funcionando (build + deploy)
- [ ] Approval gates configurados para Prod
- [ ] Tests visibles en pestaña "Tests"

### Ambientes
- [ ] Backend Dev funcionando (URL pública)
- [ ] Backend Prod funcionando (URL pública)
- [ ] Frontend Dev funcionando (URL pública)
- [ ] Frontend Prod funcionando (URL pública)

### APM
- [ ] Application Insights recibiendo datos
- [ ] Trazas visibles en Transaction Search
- [ ] Errores capturados (probar /api/simulate-error)
- [ ] Métricas CPU/Memoria visibles

### Demo
- [ ] Practicar flujo: Cambio → PR → Build → Dev → Approve → Prod
- [ ] Tener error simulado listo para mostrar en APM
- [ ] Conocer ubicación de todas las pantallas en Azure Portal

---

## Recursos Útiles

- **OpenSpec Docs**: Ver `openspec/AGENTS.md`
- **Terraform Azure Provider**: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
- **Clerk Docs**: https://clerk.com/docs
- **Next.js 14 Docs**: https://nextjs.org/docs
- **Azure DevOps Pipelines**: https://learn.microsoft.com/en-us/azure/devops/pipelines/
- **Application Insights Node.js**: https://learn.microsoft.com/en-us/azure/azure-monitor/app/nodejs
