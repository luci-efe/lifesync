# Backend Specification

## Overview
API REST desarrollada en Node.js + Express + TypeScript con Prisma ORM, integrando autenticación Clerk y observabilidad con Application Insights.

---

### Requirement: Express Server Setup
El sistema DEBE exponer un servidor Express en el puerto configurado.

#### Scenario: Server Startup
- **WHEN** se ejecuta `npm start`
- **THEN** el servidor inicia en `PORT` (default 3001)
- **AND** registra mensaje de inicio en consola
- **AND** acepta conexiones HTTP

#### Scenario: Environment Configuration
- **WHEN** el servidor inicia
- **THEN** lee variables de entorno desde `.env` o sistema
- **AND** valida que `DATABASE_URL` está presente
- **AND** falla con error claro si faltan variables críticas

---

### Requirement: Health Check Endpoint
El sistema DEBE exponer un endpoint de health check para verificar disponibilidad.

#### Scenario: Health Check Success
- **WHEN** se hace GET `/api/health`
- **THEN** responde con status `200`
- **AND** body `{ "status": "healthy", "timestamp": "ISO8601", "version": "1.0.0" }`

#### Scenario: Health Check with DB Status
- **WHEN** se hace GET `/api/health?detail=true`
- **THEN** incluye estado de conexión a PostgreSQL
- **AND** responde `{ "status": "healthy", "database": "connected" }`

---

### Requirement: Error Simulation Endpoint
El sistema DEBE exponer un endpoint para simular errores (demo APM).

#### Scenario: Simulate Server Error
- **WHEN** se hace GET `/api/simulate-error`
- **THEN** responde con status `500`
- **AND** body `{ "error": "Simulated error for APM testing" }`
- **AND** el error se registra en Application Insights

#### Scenario: Simulate Slow Response
- **WHEN** se hace GET `/api/simulate-error?type=slow`
- **THEN** espera 3 segundos antes de responder
- **AND** responde con status `200`
- **AND** la latencia se registra en Application Insights

---

### Requirement: Prisma Database Schema
El sistema DEBE definir el esquema de base de datos usando Prisma ORM.

#### Scenario: Task Model Definition
- **WHEN** se define el schema de Prisma
- **THEN** existe modelo `Task` con campos:
  - `id`: UUID, primary key
  - `userId`: String, indexed (referencia a Clerk)
  - `title`: String, requerido
  - `description`: String, opcional
  - `dueDate`: DateTime, opcional
  - `status`: Enum (PENDING, COMPLETED)
  - `priority`: Enum (LOW, MEDIUM, HIGH)
  - `createdAt`: DateTime, default now
  - `updatedAt`: DateTime, auto-update

#### Scenario: Note Model Definition
- **WHEN** se define el schema de Prisma
- **THEN** existe modelo `Note` con campos:
  - `id`: UUID, primary key
  - `userId`: String, indexed
  - `title`: String, requerido
  - `content`: Text, opcional (markdown)
  - `createdAt`: DateTime, default now
  - `updatedAt`: DateTime, auto-update

#### Scenario: Database Migration
- **WHEN** se ejecuta `npx prisma migrate dev`
- **THEN** se aplican migraciones a PostgreSQL
- **AND** se genera el Prisma Client

---

### Requirement: Tasks CRUD Endpoints
El sistema DEBE exponer endpoints RESTful para gestión de tareas.

#### Scenario: List User Tasks
- **WHEN** se hace GET `/api/v1/tasks` con header `x-user-id`
- **THEN** responde con array de tareas del usuario
- **AND** ordenadas por `createdAt` descendente
- **AND** formato `{ "data": [...], "meta": { "total": N } }`

#### Scenario: Create Task
- **WHEN** se hace POST `/api/v1/tasks` con body válido
- **THEN** crea la tarea asociada al `userId`
- **AND** responde con status `201`
- **AND** retorna la tarea creada

#### Scenario: Update Task
- **WHEN** se hace PATCH `/api/v1/tasks/:id` con body válido
- **THEN** actualiza solo los campos enviados
- **AND** verifica que la tarea pertenece al usuario
- **AND** responde con la tarea actualizada

#### Scenario: Delete Task
- **WHEN** se hace DELETE `/api/v1/tasks/:id`
- **THEN** elimina la tarea si pertenece al usuario
- **AND** responde con status `204`

#### Scenario: Task Not Found
- **WHEN** se intenta acceder a tarea inexistente o de otro usuario
- **THEN** responde con status `404`
- **AND** body `{ "error": "Task not found" }`

---

### Requirement: Notes CRUD Endpoints
El sistema DEBE exponer endpoints RESTful para gestión de notas.

#### Scenario: List User Notes
- **WHEN** se hace GET `/api/v1/notes` con header `x-user-id`
- **THEN** responde con array de notas del usuario
- **AND** ordenadas por `updatedAt` descendente

#### Scenario: Create Note
- **WHEN** se hace POST `/api/v1/notes` con body válido
- **THEN** crea la nota asociada al `userId`
- **AND** responde con status `201`

#### Scenario: Update Note
- **WHEN** se hace PATCH `/api/v1/notes/:id`
- **THEN** actualiza título y/o contenido
- **AND** verifica propiedad del usuario

#### Scenario: Delete Note
- **WHEN** se hace DELETE `/api/v1/notes/:id`
- **THEN** elimina la nota si pertenece al usuario

---

### Requirement: User ID Extraction Middleware
El sistema DEBE extraer y validar el userId de las requests.

#### Scenario: User ID from Header
- **WHEN** una request incluye header `x-user-id`
- **THEN** el middleware extrae el userId
- **AND** lo adjunta a `req.userId`
- **AND** continúa al siguiente handler

#### Scenario: Missing User ID
- **WHEN** una request no incluye `x-user-id`
- **THEN** responde con status `401`
- **AND** body `{ "error": "User ID required" }`

#### Scenario: Clerk Token Validation (Opcional)
- **WHEN** se implementa validación completa
- **THEN** se verifica el JWT de Clerk usando `@clerk/backend`
- **AND** se extrae `userId` del token verificado

---

### Requirement: Error Handling Middleware
El sistema DEBE manejar errores de forma consistente.

#### Scenario: Validation Error
- **WHEN** ocurre un error de validación (Zod/Joi)
- **THEN** responde con status `400`
- **AND** body `{ "error": "Validation failed", "details": [...] }`

#### Scenario: Database Error
- **WHEN** ocurre un error de Prisma
- **THEN** responde con status `500`
- **AND** body `{ "error": "Database error" }`
- **AND** loggea detalles internamente (no expone al cliente)

#### Scenario: Unhandled Error
- **WHEN** ocurre un error no manejado
- **THEN** responde con status `500`
- **AND** body `{ "error": "Internal server error" }`
- **AND** registra en Application Insights

---

### Requirement: Application Insights Integration
El sistema DEBE integrarse con Azure Application Insights para APM.

#### Scenario: Auto-Instrumentation
- **WHEN** el servidor inicia con `APPLICATIONINSIGHTS_CONNECTION_STRING`
- **THEN** se inicializa el SDK de Application Insights
- **AND** se habilita auto-collection de requests, dependencies, exceptions

#### Scenario: Custom Telemetry
- **WHEN** ocurre un error en un endpoint
- **THEN** se registra como Exception en Application Insights
- **AND** incluye stack trace y request context

#### Scenario: Request Tracing
- **WHEN** se procesa cualquier request HTTP
- **THEN** se registra la duración, status code, y URL
- **AND** se puede ver en Live Metrics y Transaction Search

---

### Requirement: CORS Configuration
El sistema DEBE configurar CORS para permitir requests del frontend.

#### Scenario: Development CORS
- **WHEN** `NODE_ENV=development`
- **THEN** se permite origin `http://localhost:3000`
- **AND** se permiten headers `Content-Type`, `x-user-id`

#### Scenario: Production CORS
- **WHEN** `NODE_ENV=production`
- **THEN** se permite origin de la URL del frontend en Azure
- **AND** se mantienen los mismos headers permitidos

---

### Requirement: Docker Configuration
El sistema DEBE ser empaquetable en una imagen Docker.

#### Scenario: Dockerfile Build
- **WHEN** se ejecuta `docker build -t backend .`
- **THEN** se genera imagen con Node.js 20 Alpine
- **AND** incluye dependencias de producción únicamente
- **AND** incluye Prisma Client generado

#### Scenario: Container Runtime
- **WHEN** se ejecuta el contenedor
- **THEN** inicia el servidor en el puerto expuesto
- **AND** puede conectarse a PostgreSQL externo
- **AND** lee variables de entorno del runtime

---

### Requirement: Unit Testing
El sistema DEBE incluir tests unitarios con Jest.

#### Scenario: Health Endpoint Test
- **WHEN** se ejecuta `npm test`
- **THEN** se prueba GET `/api/health` retorna 200
- **AND** el body contiene `status: healthy`

#### Scenario: Task CRUD Tests
- **WHEN** se ejecutan tests de tasks
- **THEN** se prueban operaciones CRUD con mocks de Prisma
- **AND** se verifica filtrado por userId

#### Scenario: Test Coverage Report
- **WHEN** se ejecuta `npm run test:coverage`
- **THEN** se genera reporte de cobertura
- **AND** el reporte está en formato compatible con Azure DevOps
