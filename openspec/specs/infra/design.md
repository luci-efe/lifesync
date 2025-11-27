# Infrastructure Design

## Context

LifeSync requiere infraestructura en Azure para hospedar una aplicación web con:
- Frontend (Next.js) y Backend (Express) separados
- Base de datos PostgreSQL
- Docker Hub para imágenes Docker
- Monitoreo APM

**Restricciones críticas:**
- Suscripción Azure for Students (recursos limitados)
- SKUs disponibles: F1/B1 para App Service, Burstable para PostgreSQL
- Región verificada: `eastus2`
- Presupuesto: ~$100 USD créditos estudiantiles

## Goals / Non-Goals

### Goals
- Infraestructura reproducible con Terraform
- Separación clara de ambientes Dev/Prod
- Costos mínimos usando free/basic tiers
- Observabilidad básica con Application Insights

### Non-Goals
- Alta disponibilidad (no es requerimiento académico)
- Auto-scaling (fuera del scope del tier gratuito)
- Disaster recovery multi-región
- Kubernetes (overkill para este proyecto)

## Decisions

### Decision 1: Azure App Service sobre Azure Container Apps
**Elegido:** Azure App Service for Containers

**Razón:**
- Familiar de prácticas anteriores
- Tier F1 gratuito disponible
- Integración nativa con ACR
- Deployment slots para staging (si se necesita)

**Alternativas consideradas:**
- Azure Container Apps: Más moderno pero requiere tier de pago
- Azure Kubernetes Service: Overkill, costoso, complejo
- VMs con Docker: Demasiado manual, no hay free tier comparable

### Decision 2: PostgreSQL Flexible Server sobre Single Server
**Elegido:** Flexible Server

**Razón:**
- Single Server está siendo deprecado
- Flexible ofrece tier Burstable más económico
- Mejor integración con VNets (si se necesita)
- Zone redundancy opcional

### Decision 3: Docker Hub sobre ACR
**Elegido:** Docker Hub

**Razón:**
- Requerimiento explícito del profesor en la rúbrica
- No requiere provisionar recursos en Azure (más simple)
- Free tier suficiente para el proyecto académico
- Permite demostrar configuración de Service Connection externo

**Alternativas consideradas:**
- Azure Container Registry (ACR): Integración nativa con Azure, pero no cumple el requerimiento del curso de usar Docker Hub

### Decision 4: Terraform Local State vs Remote
**Elegido:** Local state (para desarrollo)

**Razón:**
- Proyecto individual, no hay colaboración en IaC
- Evita complejidad de Azure Storage Account
- Suficiente para demostración académica

**Migración futura:** Si se trabaja en equipo, migrar a Azure Storage backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Azure Resource Group                         │
│                      rg-lifesync-{env}                          │
│                                                                  │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │   App Service    │     │   App Service    │                  │
│  │  Frontend (Dev)  │     │  Frontend (Prod) │                  │
│  │  lifesync-fe-dev │     │  lifesync-fe-prod│                  │
│  └────────┬─────────┘     └────────┬─────────┘                  │
│           │                        │                             │
│           ▼                        ▼                             │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │   App Service    │     │   App Service    │                  │
│  │  Backend (Dev)   │     │  Backend (Prod)  │                  │
│  │  lifesync-be-dev │     │  lifesync-be-prod│                  │
│  └────────┬─────────┘     └────────┬─────────┘                  │
│           │                        │                             │
│           └──────────┬─────────────┘                             │
│                      ▼                                           │
│  ┌──────────────────────────────────────────┐                   │
│  │        PostgreSQL Flexible Server         │                   │
│  │            psql-lifesync                  │                   │
│  │   ┌─────────────┐  ┌─────────────┐       │                   │
│  │   │lifesync_dev │  │lifesync_prod│       │                   │
│  │   └─────────────┘  └─────────────┘       │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                  │
│  ┌────────────────────┐                                         │
│  │  Application       │     Docker Hub (External)               │
│  │    Insights        │     ┌────────────────────┐              │
│  │  appi-lifesync     │     │ {user}/lifesync-*  │              │
│  └────────────────────┘     └────────────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Terraform Module Structure

```
infra/
├── main.tf                 # Root module, provider config
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── terraform.tfvars        # Default values (gitignored)
├── environments/
│   ├── dev.tfvars          # Dev environment
│   └── prod.tfvars         # Prod environment
└── modules/
    ├── resource-group/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── app-service-plan/
    │   └── ...
    ├── web-app/
    │   └── ...
    ├── postgresql/
    │   └── ...
    └── app-insights/
        └── ...
```

## Risks / Trade-offs

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| F1 tier cold starts | Alta | Media | Aceptable para demo, documentar |
| Créditos agotados | Media | Alta | Monitorear uso, destruir recursos post-clase |
| PostgreSQL costo inesperado | Baja | Media | Usar tier más bajo, single DB |
| Docker Hub rate limits | Baja | Baja | Free tier suficiente para builds limitados |

## Cost Estimation (Monthly)

| Resource | SKU | Estimated Cost |
|----------|-----|----------------|
| App Service Plan (Dev) | F1 | $0 (Free) |
| App Service Plan (Prod) | B1 | ~$13 |
| PostgreSQL Flexible | B_Standard_B1ms | ~$12 |
| Docker Hub | Free | $0 |
| Application Insights | Per GB | ~$2-5 |
| **Total** | | **~$27-30/month** |

*Nota: Dentro del presupuesto de $100 créditos estudiantiles para ~3 meses. Docker Hub free tier reduce costos.*

## Open Questions

- [ ] ¿Crear un solo App Service Plan para Dev y Prod o separados?
  - **Recomendación:** Uno solo para reducir costos (F1 o B1)
- [ ] ¿Usar Azure Key Vault para secretos o Variable Groups de ADO?
  - **Recomendación:** Variable Groups (más simple para el scope)
