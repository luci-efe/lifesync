# Frontend Specification

## Overview
Aplicación web desarrollada en Next.js 14 (App Router) con Tailwind CSS, integrando autenticación Clerk y consumiendo la API del Backend.

---

### Requirement: Next.js App Router Setup
El sistema DEBE usar Next.js 14 con App Router para routing y rendering.

#### Scenario: Application Start
- **WHEN** se ejecuta `npm run dev`
- **THEN** la aplicación inicia en `localhost:3000`
- **AND** soporta hot reload
- **AND** muestra la página de inicio

#### Scenario: Production Build
- **WHEN** se ejecuta `npm run build`
- **THEN** se genera build optimizado en `.next/`
- **AND** las páginas estáticas se pre-renderizan
- **AND** no hay errores de TypeScript

---

### Requirement: Clerk Authentication Integration
El sistema DEBE integrar Clerk para autenticación de usuarios.

#### Scenario: Clerk Provider Setup
- **WHEN** la aplicación carga
- **THEN** `<ClerkProvider>` envuelve toda la app en `app/layout.tsx`
- **AND** se inicializa con `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **AND** el header incluye componentes condicionales de Clerk

#### Scenario: Header Auth Components
- **WHEN** se renderiza el layout
- **THEN** el header muestra `<SignedOut>` con `<SignInButton />` y `<SignUpButton />`
- **AND** muestra `<SignedIn>` con `<UserButton />`
- **AND** los componentes se importan de `@clerk/nextjs`

#### Scenario: Sign In Flow
- **WHEN** usuario no autenticado accede a ruta protegida
- **THEN** es redirigido a `/sign-in`
- **AND** puede autenticarse con email/password o OAuth
- **AND** después de login es redirigido a `/dashboard`

#### Scenario: Sign Up Flow
- **WHEN** usuario nuevo accede a `/sign-up`
- **THEN** puede crear cuenta con email
- **AND** recibe verificación por email
- **AND** después de verificar es redirigido a `/dashboard`

#### Scenario: User Button Component
- **WHEN** usuario está autenticado
- **THEN** se muestra `<UserButton />` en el header/navbar
- **AND** permite ver perfil y cerrar sesión

---

### Requirement: Middleware Route Protection
El sistema DEBE proteger rutas que requieren autenticación usando clerkMiddleware.

#### Scenario: Middleware Configuration
- **WHEN** se configura `middleware.ts` en la raíz del proyecto o `src/`
- **THEN** usa `clerkMiddleware()` de `@clerk/nextjs/server`
- **AND** exporta configuración de matcher que:
  - Salta internals de Next.js y archivos estáticos (html, css, js, imágenes, fonts, etc.)
  - Siempre ejecuta para rutas API (`/api/*`, `/trpc/*`)

#### Scenario: Middleware Matcher Pattern
- **WHEN** se define el matcher en middleware.ts
- **THEN** incluye patrón `/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)`
- **AND** incluye patrón `/(api|trpc)(.*)`

#### Scenario: Protected Route Access
- **WHEN** usuario no autenticado accede a `/dashboard`
- **THEN** es redirigido a `/sign-in`
- **AND** después de login vuelve a `/dashboard`

---

### Requirement: Landing Page
El sistema DEBE mostrar una página de inicio pública.

#### Scenario: Landing Page Content
- **WHEN** usuario accede a `/`
- **THEN** ve página de bienvenida con:
  - Título "LifeSync"
  - Descripción breve del producto
  - Botón "Get Started" que lleva a `/sign-up`
  - Botón "Sign In" que lleva a `/sign-in`

#### Scenario: Authenticated User Redirect
- **WHEN** usuario autenticado accede a `/`
- **THEN** puede ver botón "Go to Dashboard"
- **AND** el navbar muestra `<UserButton />`

---

### Requirement: Dashboard Page
El sistema DEBE mostrar un dashboard con resumen de tareas y notas.

#### Scenario: Dashboard Layout
- **WHEN** usuario autenticado accede a `/dashboard`
- **THEN** ve layout con:
  - Sidebar de navegación
  - Header con `<UserButton />`
  - Área principal con widgets

#### Scenario: Dashboard Widgets
- **WHEN** se carga el dashboard
- **THEN** muestra:
  - Contador de tareas pendientes
  - Lista de tareas próximas a vencer
  - Notas recientes (últimas 5)
  - Accesos rápidos a crear tarea/nota

---

### Requirement: Tasks Management UI
El sistema DEBE proveer interfaz para gestionar tareas.

#### Scenario: Tasks List Page
- **WHEN** usuario accede a `/tasks`
- **THEN** ve lista de sus tareas
- **AND** puede filtrar por estado (pending/completed)
- **AND** puede ordenar por fecha o prioridad

#### Scenario: Create Task Modal
- **WHEN** usuario hace clic en "Add Task"
- **THEN** se abre modal con formulario:
  - Título (requerido)
  - Descripción (opcional)
  - Fecha límite (date picker)
  - Prioridad (Low/Medium/High)
- **AND** al guardar se llama POST `/api/v1/tasks`

#### Scenario: Edit Task
- **WHEN** usuario hace clic en una tarea
- **THEN** puede editar campos inline o en modal
- **AND** al guardar se llama PATCH `/api/v1/tasks/:id`

#### Scenario: Complete Task
- **WHEN** usuario marca checkbox de tarea
- **THEN** se llama PATCH con `status: COMPLETED`
- **AND** la tarea se muestra tachada o se mueve a sección completadas

#### Scenario: Delete Task
- **WHEN** usuario hace clic en eliminar
- **THEN** muestra confirmación
- **AND** al confirmar se llama DELETE `/api/v1/tasks/:id`

---

### Requirement: Notes Management UI
El sistema DEBE proveer interfaz para gestionar notas.

#### Scenario: Notes List Page
- **WHEN** usuario accede a `/notes`
- **THEN** ve grid/lista de sus notas
- **AND** cada nota muestra título y preview del contenido

#### Scenario: Create Note
- **WHEN** usuario hace clic en "New Note"
- **THEN** navega a `/notes/new`
- **AND** ve editor con campo título y área de contenido
- **AND** al guardar se llama POST `/api/v1/notes`

#### Scenario: Edit Note
- **WHEN** usuario hace clic en una nota
- **THEN** navega a `/notes/:id`
- **AND** puede editar título y contenido
- **AND** cambios se guardan al hacer clic en "Save"

#### Scenario: Delete Note
- **WHEN** usuario hace clic en eliminar nota
- **THEN** muestra confirmación
- **AND** al confirmar navega a `/notes`

---

### Requirement: Calendar View
El sistema DEBE mostrar vista de calendario con tareas.

#### Scenario: Calendar Page
- **WHEN** usuario accede a `/calendar`
- **THEN** ve calendario mensual
- **AND** las tareas con `dueDate` aparecen en el día correspondiente

#### Scenario: Calendar Navigation
- **WHEN** usuario navega entre meses
- **THEN** se cargan tareas del mes visible
- **AND** puede hacer clic en un día para ver detalles

---

### Requirement: API Client
El sistema DEBE tener cliente HTTP para comunicarse con el backend.

#### Scenario: API Base Configuration
- **WHEN** se inicializa el API client
- **THEN** usa `NEXT_PUBLIC_API_URL` como base URL
- **AND** incluye interceptor para agregar `x-user-id` header

#### Scenario: User ID Injection
- **WHEN** se hace request al backend
- **THEN** se obtiene `userId` de `useAuth()` de Clerk
- **AND** se agrega como header `x-user-id`

#### Scenario: Error Handling
- **WHEN** el backend retorna error
- **THEN** se muestra toast/notificación al usuario
- **AND** si es 401, se redirige a login

---

### Requirement: Responsive Design
El sistema DEBE ser responsive y funcional en móviles.

#### Scenario: Mobile Layout
- **WHEN** viewport es menor a 768px
- **THEN** el sidebar se convierte en menú hamburguesa
- **AND** los formularios usan full width
- **AND** las listas se adaptan a una columna

#### Scenario: Desktop Layout
- **WHEN** viewport es mayor a 1024px
- **THEN** sidebar está siempre visible
- **AND** dashboard muestra widgets en grid 2-3 columnas

---

### Requirement: Loading and Error States
El sistema DEBE mostrar estados de carga y error apropiados.

#### Scenario: Loading State
- **WHEN** se está cargando datos
- **THEN** se muestra skeleton loader o spinner
- **AND** los botones están deshabilitados

#### Scenario: Error State
- **WHEN** falla la carga de datos
- **THEN** se muestra mensaje de error
- **AND** botón "Retry" para reintentar

#### Scenario: Empty State
- **WHEN** no hay tareas/notas
- **THEN** se muestra ilustración de estado vacío
- **AND** CTA para crear primer item

---

### Requirement: Docker Configuration
El sistema DEBE ser empaquetable en una imagen Docker.

#### Scenario: Dockerfile Build
- **WHEN** se ejecuta `docker build -t frontend .`
- **THEN** se genera imagen con build de producción
- **AND** usa multi-stage build para optimizar tamaño
- **AND** las variables de entorno se inyectan en build time

#### Scenario: Build Arguments
- **WHEN** se construye la imagen
- **THEN** `NEXT_PUBLIC_*` variables se pasan como build args
- **AND** se inyectan en el bundle del cliente

---

### Requirement: Tailwind CSS Styling
El sistema DEBE usar Tailwind CSS para estilos.

#### Scenario: Tailwind Configuration
- **WHEN** se configura Tailwind
- **THEN** incluye content paths para `app/` y `components/`
- **AND** extiende tema con colores de marca LifeSync
- **AND** incluye plugin `@tailwindcss/forms` para formularios

#### Scenario: Dark Mode (Opcional)
- **WHEN** usuario tiene preferencia de dark mode
- **THEN** la UI respeta `prefers-color-scheme`
- **AND** los colores se adaptan automáticamente
