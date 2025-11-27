# **Backlog del Proyecto para Azure DevOps (Kanban)**

Este documento lista las Epics, Features y User Stories que debes registrar en tu tablero de Azure DevOps para cumplir con el requisito de "Plan de trabajo en ADO".

## **EPIC 1: Inicialización y Gestión (Project Setup)**

*Objetivo: Configurar el entorno de trabajo y repositorios.*

### **Feature 1.1: Configuración de Repositorio y Herramientas**

* \[ \] **Task:** Crear Monorepo en GitHub e inicializar estructura de carpetas (/frontend, /backend, /infra).  
* \[ \] **Task:** Crear Proyecto en Azure DevOps y conectar con GitHub (Service Connection).  
* \[ \] **Task:** Configurar reglas de ramas (Branch Policies) para main (requerir PR).

## **EPIC 2: Infraestructura como Código (IaC)**

*Objetivo: Aprovisionar recursos en Azure usando Terraform.*

### **Feature 2.1: Definición de Recursos Base**

* \[ \] **Task:** Crear script Terraform para Resource Group y Azure Container Registry (ACR).  
* \[ \] **Task:** Crear script Terraform para App Service Plan (Linux) y Web Apps (Front & Back).  
* \[ \] **Task:** Crear script Terraform para Base de Datos PostgreSQL y Application Insights.

### **Feature 2.2: Despliegue de Infraestructura**

* \[ \] **Task:** Ejecutar terraform apply localmente para crear entorno Dev.  
* \[ \] **Task:** Obtener credenciales de ACR y DB y guardarlas como secretos.

## **EPIC 3: Backend & Base de Datos**

*Objetivo: Crear API REST funcional y segura.*

### **Feature 3.1: Modelo de Datos y ORM**

* \[ \] **Task:** Configurar Prisma con conexión a PostgreSQL.  
* \[ \] **Task:** Definir Schema: Modelos Task y Note (incluyendo campo userId).  
* \[ \] **Task:** Ejecutar migración inicial de base de datos.

### **Feature 3.2: API Endpoints**

* \[ \] **Task:** Implementar endpoint GET/POST /api/tasks integrando userId de Clerk.  
* \[ \] **Task:** Implementar endpoint GET /api/health (Health check).  
* \[ \] **Task:** Implementar endpoint GET /api/simulate-error (Para prueba de APM/Logs).

### **Feature 3.3: Calidad de Código (Testing)**

* \[ \] **Task:** Configurar Jest para pruebas unitarias.  
* \[ \] **Task:** Escribir prueba unitaria para endpoint de Health Check (Requisito Rúbrica).

## **EPIC 4: Frontend & Autenticación**

*Objetivo: Interfaz de usuario conectada y segura.*

### **Feature 4.1: Autenticación con Clerk**

* \[ \] **Task:** Instalar @clerk/nextjs y configurar \<ClerkProvider\>.  
* \[ \] **Task:** Implementar Middleware de protección de rutas en Next.js.  
* \[ \] **Task:** Agregar componente \<UserButton /\> en Navbar.

### **Feature 4.2: Funcionalidad de Usuario (UI)**

* \[ \] **Task:** Crear formulario para agregar Tareas (conectar con API Backend).  
* \[ \] **Task:** Crear lista visual de Tareas y Notas.  
* \[ \] **Task:** Configurar variables de entorno (NEXT\_PUBLIC\_API\_URL).

## **EPIC 5: DevOps & CI/CD Pipelines**

*Objetivo: Automatizar construcción y despliegue.*

### **Feature 5.1: Gestión de Secretos**

* \[ \] **Task:** Crear Variable Group en ADO Library (LifeSync-Secrets) con llaves de Clerk y DB.

### **Feature 5.2: Pipeline Backend**

* \[ \] **Task:** Crear backend-pipeline.yml: Build, Test, Docker Push.  
* \[ \] **Task:** Agregar etapa de Deploy a Azure Web App (Dev).  
* \[ \] **Task:** Agregar etapa de Deploy a Prod con "Approval Gate".

### **Feature 5.3: Pipeline Frontend**

* \[ \] **Task:** Crear frontend-pipeline.yml: Build (con Args), Docker Push.  
* \[ \] **Task:** Agregar etapa de Deploy a Azure Web App (Dev & Prod).

## **EPIC 6: Observabilidad y Demo Final**

*Objetivo: Preparar evidencias para la evaluación.*

### **Feature 6.1: Monitoreo (APM)**

* \[ \] **Task:** Verificar conexión de Application Insights en el Backend.  
* \[ \] **Task:** Generar tráfico de prueba y verificar trazas/errores en Azure Portal.

### **Feature 6.2: Preparación de Demo**

* \[ \] **Task:** Ensayar flujo de cambio de código (Live Coding) y creación de PR.  
* \[ \] **Task:** Verificar que las pruebas unitarias son visibles en la pestaña "Tests" de ADO.