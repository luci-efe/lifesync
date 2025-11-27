# Infrastructure Specification

## Overview
Definición de la infraestructura en Azure usando Terraform para soportar la aplicación LifeSync con ambientes de desarrollo y producción.

---

### Requirement: Azure Resource Group
El sistema DEBE crear un Resource Group en Azure para contener todos los recursos del proyecto.

#### Scenario: Resource Group Creation
- **WHEN** se ejecuta `terraform apply`
- **THEN** se crea un Resource Group con nombre `rg-lifesync-{env}`
- **AND** ubicado en la región `eastus2`
- **AND** con tags de proyecto (Environment, Project, ManagedBy)

---

### Requirement: Docker Hub Integration
El sistema DEBE usar Docker Hub como registro de imágenes Docker para frontend y backend.

#### Scenario: Docker Hub Repository Structure
- **WHEN** se configuran los repositorios en Docker Hub
- **THEN** existen repositorios `{username}/lifesync-frontend` y `{username}/lifesync-backend`
- **AND** los repositorios pueden ser públicos o privados según preferencia

#### Scenario: Docker Image Storage
- **WHEN** el pipeline hace push de una imagen
- **THEN** la imagen se almacena en `docker.io/{username}/lifesync-{service}:{tag}`
- **AND** el tag incluye el número de build o `latest`

#### Scenario: Service Connection in Azure DevOps
- **WHEN** se configura el pipeline de CI/CD
- **THEN** existe un Service Connection de tipo "Docker Registry" en Azure DevOps
- **AND** conectado a Docker Hub con credenciales válidas
- **AND** permite push y pull de imágenes desde los pipelines

---

### Requirement: Azure App Service Plan
El sistema DEBE crear un App Service Plan Linux para hospedar las Web Apps de frontend y backend.

#### Scenario: App Service Plan Creation
- **WHEN** se ejecuta `terraform apply`
- **THEN** se crea un Service Plan con nombre `asp-lifesync-{env}`
- **AND** con OS type `Linux`
- **AND** con SKU `F1` (Free) para desarrollo o `B1` (Basic) para producción

#### Scenario: Free Tier Limitations
- **WHEN** se usa SKU `F1`
- **THEN** `always_on` está deshabilitado (requerido por tier gratuito)
- **AND** se acepta cold start en las aplicaciones

---

### Requirement: Backend Web App
El sistema DEBE crear una Azure Web App para el servicio de Backend (API Express).

#### Scenario: Backend App Creation - Dev
- **WHEN** se ejecuta `terraform apply` con environment `dev`
- **THEN** se crea Web App `lifesync-backend-dev`
- **AND** configurada para contenedores Linux
- **AND** con variable `WEBSITES_PORT=3001`

#### Scenario: Backend App Creation - Prod
- **WHEN** se ejecuta `terraform apply` con environment `prod`
- **THEN** se crea Web App `lifesync-backend-prod`
- **AND** con las mismas configuraciones que dev
- **AND** con Application Insights connection string configurado

---

### Requirement: Frontend Web App
El sistema DEBE crear una Azure Web App para el servicio de Frontend (Next.js).

#### Scenario: Frontend App Creation - Dev
- **WHEN** se ejecuta `terraform apply` con environment `dev`
- **THEN** se crea Web App `lifesync-frontend-dev`
- **AND** configurada para contenedores Linux
- **AND** con variable `WEBSITES_PORT=3000`

#### Scenario: Frontend App Creation - Prod
- **WHEN** se ejecuta `terraform apply` con environment `prod`
- **THEN** se crea Web App `lifesync-frontend-prod`
- **AND** apuntando a la URL del backend de producción

---

### Requirement: PostgreSQL Flexible Server
El sistema DEBE crear un Azure Database for PostgreSQL Flexible Server para persistencia de datos.

#### Scenario: PostgreSQL Server Creation
- **WHEN** se ejecuta `terraform apply`
- **THEN** se crea un PostgreSQL Flexible Server `psql-lifesync`
- **AND** con tier `Burstable` y SKU `B_Standard_B1ms`
- **AND** con PostgreSQL version `16`
- **AND** con almacenamiento inicial de `32GB`

#### Scenario: Database Firewall Rules
- **WHEN** se configura el servidor PostgreSQL
- **THEN** se permite acceso desde Azure Services (Allow Azure Services)
- **AND** opcionalmente se permite IP del desarrollador para debugging

#### Scenario: Database Creation
- **WHEN** el servidor PostgreSQL está disponible
- **THEN** se crean databases `lifesync_dev` y `lifesync_prod`
- **AND** se configura el connection string como output

---

### Requirement: Application Insights
El sistema DEBE crear un recurso de Application Insights para monitoreo APM.

#### Scenario: Application Insights Creation
- **WHEN** se ejecuta `terraform apply`
- **THEN** se crea Application Insights `appi-lifesync`
- **AND** de tipo `web`
- **AND** vinculado a un Log Analytics Workspace

#### Scenario: Connection String Output
- **WHEN** Application Insights está creado
- **THEN** el connection string está disponible como output de Terraform
- **AND** se puede inyectar en las Web Apps como variable de entorno

---

### Requirement: Terraform State Management
El sistema DEBE gestionar el estado de Terraform de forma segura.

#### Scenario: Local State (Desarrollo)
- **WHEN** se trabaja localmente
- **THEN** el estado se guarda en `terraform.tfstate`
- **AND** el archivo `.tfstate` está en `.gitignore`

#### Scenario: Terraform Outputs
- **WHEN** se ejecuta `terraform apply` exitosamente
- **THEN** se muestran outputs con:
  - Web App URLs (dev y prod)
  - PostgreSQL connection string (sensitive)
  - Application Insights connection string (sensitive)

---

### Requirement: Environment Separation
El sistema DEBE separar configuraciones por ambiente usando tfvars.

#### Scenario: Development Environment
- **WHEN** se usa `terraform apply -var-file=environments/dev.tfvars`
- **THEN** se aplican configuraciones de desarrollo
- **AND** con SKU `F1` para App Service
- **AND** con nombres sufijados con `-dev`

#### Scenario: Production Environment
- **WHEN** se usa `terraform apply -var-file=environments/prod.tfvars`
- **THEN** se aplican configuraciones de producción
- **AND** con SKU `B1` para App Service (si presupuesto permite)
- **AND** con nombres sufijados con `-prod`
