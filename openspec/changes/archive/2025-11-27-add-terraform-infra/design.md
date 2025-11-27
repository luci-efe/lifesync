# Infrastructure Design Document

## Context

LifeSync requires Azure infrastructure to host a full-stack web application with:
- Next.js 14 Frontend (containerized)
- Express.js Backend API (containerized)
- PostgreSQL database
- Application Performance Monitoring (APM)

**Constraints:**
- Azure for Students subscription (~$100 credits)
- Region: `eastus2` (verified available)
- Academic deadline: Must be deployable for class demonstration
- Docker Hub required per course requirements (not ACR)

**Reference Implementation:**
The design follows patterns from `project-context/terraform reference/` which demonstrates:
- Modular Terraform architecture
- App Service deployment patterns
- Variable validation techniques
- Output organization

## Goals / Non-Goals

### Goals
- Infrastructure as Code (IaC) with Terraform for reproducibility
- Clear separation of Dev and Prod environments
- Minimal cost using free/basic tiers where possible
- Observable applications via Application Insights
- Secure database with proper firewall rules
- Easy deployment via tfvars files

### Non-Goals
- High availability (multi-region, redundancy)
- Auto-scaling (not available on F1/B1 tiers)
- Custom domains or SSL certificates (Azure defaults sufficient)
- Kubernetes orchestration (overkill for this scope)
- Remote state backend (single developer, local state acceptable)
- Managed Identity for Azure services (adds complexity, Variable Groups sufficient)

## Decisions

### Decision 1: Modular vs Monolithic Terraform

**Chosen:** Modular structure with 5 reusable modules

**Rationale:**
- Follows reference implementation pattern (proven in previous practice)
- Enables independent testing of each component
- Cleaner root module focused on orchestration
- Easier to understand and maintain
- Supports future reuse if project scope expands

**Alternatives Considered:**
- Single `main.tf`: Simpler but becomes unwieldy with 10+ resources
- Terraform workspaces: Adds complexity, tfvars approach is clearer for 2 environments

**Module Structure:**
```
infra/
├── main.tf                    # Orchestration
├── variables.tf               # Root inputs
├── outputs.tf                 # Root outputs
├── environments/
│   ├── dev.tfvars
│   └── prod.tfvars
└── modules/
    ├── resource-group/        # Foundation
    ├── app-service-plan/      # Compute platform
    ├── web-app/               # Application containers (x4)
    ├── postgresql/            # Database + firewall
    └── app-insights/          # Monitoring + Log Analytics
```

### Decision 2: Docker Hub over Azure Container Registry

**Chosen:** Docker Hub as container registry

**Rationale:**
- Explicit course requirement in rubric
- Demonstrates external service integration
- No Azure resources to manage for registry
- Free tier sufficient for academic project (~200 pulls/6hr)
- Service Connection configuration is a learning objective

**Configuration:**
```hcl
site_config {
  application_stack {
    docker_image_name    = "${var.dockerhub_username}/lifesync-backend:latest"
    docker_registry_url  = "https://index.docker.io"
  }
}
```

### Decision 3: App Service SKU Strategy

**Chosen:** F1 (Free) for Dev, B1 (Basic) for Prod

**Rationale:**
- F1 provides zero-cost development environment
- B1 enables Always-On (eliminates cold starts for demo)
- Total cost ~$26/month for 2 B1 instances (well within $100 credits)
- Can run everything on F1 if budget is tight

**SKU Comparison:**
| Feature | F1 (Free) | B1 (Basic) |
|---------|-----------|------------|
| Cost | $0 | ~$13/month |
| Always-On | No | Yes |
| Custom Domains | No | Yes |
| CPU | 60 min/day | Shared |
| Memory | 1 GB | 1.75 GB |

**Configuration:**
- `always_on` must be `false` for F1 (Terraform will fail otherwise)
- Variable validation prevents invalid SKU combinations

### Decision 4: PostgreSQL Flexible Server Configuration

**Chosen:** Single server with multiple databases

**Rationale:**
- Flexible Server is the current generation (Single Server deprecated)
- One server with `lifesync_dev` and `lifesync_prod` databases minimizes cost
- Burstable tier (B1ms) is most economical (~$12/month)
- 32GB storage is minimum and sufficient

**Firewall Strategy:**
- Allow Azure Services: Required for App Service connection
- No public IP access by default (security)
- Optional: Developer IP for debugging (passed as variable)

**Connection String Format:**
```
postgresql://user:pass@psql-lifesync.postgres.database.azure.com:5432/lifesync_dev?sslmode=require
```

### Decision 5: Application Insights with Log Analytics

**Chosen:** Workspace-based Application Insights

**Rationale:**
- Classic Application Insights is deprecated
- Log Analytics Workspace required as data sink
- 30-day retention is free tier minimum
- Single workspace for both environments (cost optimization)
- PerGB2018 SKU is the current standard

**Integration:**
- Connection string passed to Web Apps as app setting
- Backend uses `@azure/monitor-opentelemetry` SDK
- Frontend uses client-side tracking (optional)

### Decision 6: Local State Management

**Chosen:** Local Terraform state (no remote backend)

**Rationale:**
- Single developer project
- No concurrent modifications
- Simpler setup, no Azure Storage Account needed
- `.gitignore` prevents accidental state commits
- Sufficient for academic demonstration

**Future Migration:**
If team collaboration needed:
```hcl
terraform {
  backend "azurerm" {
    storage_account_name = "stlifesyncterraform"
    container_name       = "tfstate"
    key                  = "lifesync.tfstate"
  }
}
```

### Decision 7: Environment Separation via tfvars

**Chosen:** Separate tfvars files, shared modules

**Rationale:**
- Clear environment configuration in version control
- Same modules ensure consistency between dev/prod
- Easy to apply: `terraform apply -var-file=environments/dev.tfvars`
- No workspace complexity

**Environment Differences:**
| Setting | Dev | Prod |
|---------|-----|------|
| SKU | F1 | B1 |
| Always-On | false | true |
| DB Name | lifesync_dev | lifesync_prod |
| Tags | Environment=dev | Environment=prod |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Azure Subscription (Student)                          │
│                         Region: eastus2                                  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              Resource Group: rg-lifesync-{env}                     │  │
│  │                                                                    │  │
│  │   ┌─────────────────────────────────────────────────────────┐     │  │
│  │   │         App Service Plan: asp-lifesync-{env}             │     │  │
│  │   │                  SKU: F1/B1, OS: Linux                   │     │  │
│  │   │                                                          │     │  │
│  │   │  ┌──────────────────┐    ┌──────────────────┐           │     │  │
│  │   │  │  Web App         │    │  Web App         │           │     │  │
│  │   │  │  Frontend-Dev    │    │  Frontend-Prod   │           │     │  │
│  │   │  │  Port: 3000      │    │  Port: 3000      │           │     │  │
│  │   │  └────────┬─────────┘    └────────┬─────────┘           │     │  │
│  │   │           │                       │                      │     │  │
│  │   │  ┌──────────────────┐    ┌──────────────────┐           │     │  │
│  │   │  │  Web App         │    │  Web App         │           │     │  │
│  │   │  │  Backend-Dev     │    │  Backend-Prod    │           │     │  │
│  │   │  │  Port: 3001      │    │  Port: 3001      │           │     │  │
│  │   │  └────────┬─────────┘    └────────┬─────────┘           │     │  │
│  │   │           │                       │                      │     │  │
│  │   └───────────┼───────────────────────┼──────────────────────┘     │  │
│  │               │                       │                            │  │
│  │   ┌───────────▼───────────────────────▼──────────────────────┐    │  │
│  │   │        PostgreSQL Flexible Server: psql-lifesync          │    │  │
│  │   │           Tier: Burstable B1ms, Version: 16               │    │  │
│  │   │   ┌─────────────────┐    ┌─────────────────┐              │    │  │
│  │   │   │  lifesync_dev   │    │  lifesync_prod  │              │    │  │
│  │   │   └─────────────────┘    └─────────────────┘              │    │  │
│  │   └──────────────────────────────────────────────────────────┘    │  │
│  │                                                                    │  │
│  │   ┌──────────────────────────────────────────────────────────┐    │  │
│  │   │     Log Analytics Workspace: log-lifesync                 │    │  │
│  │   │              Retention: 30 days                           │    │  │
│  │   │   ┌──────────────────────────────────────────────────┐   │    │  │
│  │   │   │     Application Insights: appi-lifesync           │   │    │  │
│  │   │   │            Type: web                              │   │    │  │
│  │   │   └──────────────────────────────────────────────────┘   │    │  │
│  │   └──────────────────────────────────────────────────────────┘    │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────────────┐
│      Docker Hub         │
│  ┌───────────────────┐  │
│  │ {user}/lifesync-  │  │
│  │   frontend:tag    │  │
│  │   backend:tag     │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

## Risks / Trade-offs

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| F1 cold starts during demo | High | Medium | Warm up apps before demo, or use B1 |
| Student credits exhausted | Low | High | Monitor usage in Azure Portal, destroy resources when not needed |
| PostgreSQL cost higher than expected | Low | Medium | Use smallest tier, single server |
| Docker Hub rate limiting | Very Low | Low | Free tier allows 200 pulls/6hr, sufficient for builds |
| Terraform state conflicts | Very Low | Medium | Single developer, use `.gitignore` |
| Azure region capacity issues | Very Low | High | eastus2 pre-verified, fallback to eastus |

## Cost Estimation

### Monthly Cost (Estimated)
| Resource | Dev (F1) | Prod (B1) | Total |
|----------|----------|-----------|-------|
| App Service Plan | $0 | $13 | $13 |
| Web Apps (2 per plan) | Included | Included | $0 |
| PostgreSQL B1ms | - | $12 | $12 |
| Log Analytics (5GB) | $0 | $0 | $0 |
| Application Insights | ~$2 | ~$2 | $4 |
| **Total** | **~$2** | **~$27** | **~$29/month** |

*Within $100 student credit budget for ~3 months of operation*

## Security Considerations

### Implemented
- PostgreSQL firewall (Azure Services only)
- Sensitive outputs marked in Terraform
- Credentials via tfvars (not in code)
- SSL required for database connections

### Not Implemented (Out of Scope)
- Managed Identity (uses Variable Groups instead)
- Key Vault integration
- VNet isolation
- Web Application Firewall
- Custom SSL certificates

## Open Questions

1. **Resolved:** Single App Service Plan for all apps or separate per environment?
   - **Decision:** Single plan shared by all 4 Web Apps (cost optimization)

2. **Resolved:** Docker Hub credentials in Web App settings?
   - **Decision:** For public images, no credentials needed. For private, use app settings.

3. **Pending:** Should PostgreSQL allow developer IP for debugging?
   - **Recommendation:** Add as optional variable, disabled by default

## References

- Terraform Reference: `project-context/terraform reference/`
- Infrastructure Spec: `openspec/specs/infra/spec.md`
- Project Context: `openspec/project.md`
- Azure Provider Docs: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
