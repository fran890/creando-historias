# 📰 EditorialSphere - Plataforma de Blogs Multiusuario con Atribución de Ingresos

Plataforma web de publicación editorial multiusuario basada en **Next.js 14 (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, y **Tailwind CSS**.

Inspirada en las mejores características de plataformas como Medium, **EditorialSphere** está diseñada con un enfoque prioritario en la **seguridad de datos**, **control de acceso basado en roles y propiedad (RBAC/Ownership)**, **analítica de tráfico anónima** y un **motor de atribución de ingresos publicitarios (Google AdSense)** desacoplado.

---

## 🌟 Características Principales

### 1. Sistema de Roles & Autorización Estricta en Backend
- **ADMIN**:
  - Gestión completa de usuarios (creación, cambio de rol, bloqueo).
  - Moderación editorial (cola de historias pendientes, aprobación, rechazo, despublicación, eliminación).
  - Configuración del porcentaje global de reparto de ingresos (`platformSharePercentage` vs `authorSharePercentage`).
  - **Administrador como Autor**: Puede crear y publicar sus propias historias exactamente igual que cualquier autor, manteniendo su propio `authorId`.
- **AUTHOR**:
  - Creación de borradores y vista previa en tiempo real.
  - Envío de historias a revisión (`PENDING_REVIEW`).
  - Edición exclusiva de sus propias publicaciones (protegido en backend contra accesos cruzados mediante guardias de propiedad).
  - Dashboard propio con estadísticas de vistas e ingresos estimados atribuidos.

### 2. Atribución Transparente de Ingresos (AdSense Ready)
- El sistema diferencia explícitamente entre **Ingresos Estimados** e **Ingresos Reales/Importados**.
- Registra métricas de lecturas asociadas a `(articleId, authorId)` y aplica la fórmula de reparto configurada (ej. 70% Autor / 30% Plataforma).
- Arquitectura desacoplada mediante `RevenueService` lista para conectar adaptadores de la API de AdSense o importar reportes CSV agregados.

### 3. Analítica Respetuosa de la Privacidad
- Tracking anónimo (`ArticleView`) con hashes SHA-256 (User-Agent + Salt + Fecha) sin almacenar direcciones IP completas para cumplimiento estricto de GDPR/Privacidad.
- Desglose por dispositivo, país y fuentes de tráfico en tiempo real.

### 4. Editor de Contenido Estructurado & SEO Dinámico
- Editor **Tiptap** WYSIWYG configurado para almacenamiento en JSON estricto / HTML sanitizado (`DOMPurify`) previniendo inyección de código XSS.
- Metadata dinámico, tarjetas OpenGraph, Twitter/X cards, `sitemap.xml` autogenerado, `robots.txt` y datos estructurados Schema.org (`BlogPosting`).

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router, Server Actions & Server Components)
- **Lenguaje**: TypeScript (Strict Mode)
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma ORM
- **Autenticación**: JWT Session con cookies `HttpOnly` y hasheo de contraseñas con `bcryptjs`
- **Estilos**: Tailwind CSS & Lucide Icons
- **Editor**: Tiptap Rich Text Editor
- **Testing**: Vitest

---

## 🚀 Guía de Instalación y Ejecución Local

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia la plantilla `.env.example` a `.env`:

```bash
cp .env.example .env
```

Asegúrate de configurar la cadena de conexión a PostgreSQL en `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/adsense_blog_db?schema=public"
JWT_SECRET="super-secret-jwt-key-change-this-in-production-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_PLATFORM_SHARE_PERCENTAGE="30"
DEFAULT_AUTHOR_SHARE_PERCENTAGE="70"
```

### 3. Migrar e Inicializar Base de Datos (Seed)

Genera las tablas e inserta los datos de prueba:

```bash
# Push del esquema a la base de datos
npx prisma db push

# Poblar con usuarios, publicaciones, visitas e ingresos de demostración
npm run db:seed
```

### 4. Credenciales de Prueba (Seed)

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **ADMIN** | `admin@example.com` | `admin123` |
| **AUTOR 1** | `autor1@example.com` | `autor123` |
| **AUTOR 2** | `autor2@example.com` | `autor2@example.com` |

### 5. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará accesible en: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Ejecución de Tests de Seguridad

Para correr los tests unitarios y de autorización (RBAC/Ownership):

```bash
npm run test
```

---

## 🔒 Auditoría de Seguridad e Integridad

- **Rutas Protegidas**: `/admin/*` requiere verificación de sesión JWT y rol `ADMIN`. Intenciones de acceso sin permisos redirigen automáticamente.
- **Validaciones en Backend**: Las peticiones de edición o eliminación verifican la propiedad en base de datos. Modificaciones directas mediante HTTP de `authorId` o `status` por usuarios de rol `AUTHOR` son ignoradas y sanitizadas en el servidor.
