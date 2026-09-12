# Socios Importadores — Plataforma de talento

Sitio web de Socios Importadores con una plataforma integrada para conectar
**alumnos/egresados de comercio exterior** con **empresas del rubro** que
buscan practicantes o personal. Pensado para desplegarse en **Cloudflare
Workers**.

## Qué incluye

- Landing institucional de Socios Importadores (marca morada + logo oficial).
- **Cuentas de alumno**: registro, login y un panel donde el alumno sube su
  foto, su CV (PDF) y un video de presentación, además de datos como
  carrera, habilidades, ciudad y disponibilidad.
- **Cuentas de empresa**: registro, login, catálogo de alumnos con buscador
  (nombre, carrera, ciudad, habilidades), ficha de detalle de cada alumno
  (foto, CV, video) y botón de **"Solicitar entrevista"**.
- Bandeja de solicitudes para cada rol: la empresa ve el estado de las
  entrevistas que solicitó; el alumno puede aceptar o rechazar cada
  solicitud recibida.

## Stack técnico

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4 para el sistema visual (paleta morada de la marca)
- [Prisma](https://www.prisma.io) + **Cloudflare D1** (SQLite serverless)
  como base de datos, vía `@prisma/adapter-d1`
- Archivos (foto/CV/video) en **Cloudflare R2**, servidos por
  `src/app/api/files/[...key]/route.ts`
- [NextAuth](https://next-auth.js.org) (credenciales + JWT) para login con
  dos roles: `STUDENT` y `COMPANY`
- [OpenNext](https://opennext.js.org/cloudflare) adapta el build de Next.js
  para correr como un Worker de Cloudflare

## Cómo correr el proyecto en local

```bash
npm install
cp .env.example .env   # define NEXTAUTH_SECRET y NEXTAUTH_URL
npm run dev
```

`next dev` emula automáticamente los bindings de D1 y R2 en local (gracias
a `initOpenNextCloudflareForDev` en `next.config.ts`), así que no hace
falta nada más para desarrollar. Abre
[http://localhost:3000](http://localhost:3000).

Para probar el Worker real (más fiel a producción):

```bash
npx wrangler d1 migrations apply socios-importadores-db --local
npm run preview   # build con OpenNext + wrangler dev
```

## Desplegar a Cloudflare

1. **Crear los recursos** (una sola vez):
   ```bash
   npx wrangler login
   npx wrangler d1 create socios-importadores-db
   npx wrangler r2 bucket create socios-importadores-uploads
   ```
   Copia el `database_id` que te entrega el primer comando dentro de
   `wrangler.jsonc` (reemplaza `REEMPLAZA_CON_TU_DATABASE_ID`).

2. **Aplicar las migraciones** a la base D1 remota:
   ```bash
   npx wrangler d1 migrations apply socios-importadores-db --remote
   ```

3. **Configurar los secretos** (no van en `wrangler.jsonc`):
   ```bash
   npx wrangler secret put NEXTAUTH_SECRET
   npx wrangler secret put NEXTAUTH_URL   # la URL pública final del Worker
   ```

4. **Desplegar**:
   ```bash
   npm run deploy
   ```

## Notas sobre el esquema y las migraciones

El esquema vive en `prisma/schema.prisma` (para editar el modelo de datos y
tener autocompletado/tipos de Prisma), pero **la migración que realmente se
aplica a D1** está en `migrations/0001_init.sql` (formato que espera
`wrangler d1 migrations`). Si cambias el schema:

1. Edita `prisma/schema.prisma` y corre `npx prisma generate`.
2. Escribe a mano el SQL incremental correspondiente en
   `migrations/000X_descripcion.sql` (D1 usa SQLite estándar).
3. Aplícalo con `npx wrangler d1 migrations apply socios-importadores-db --local` (y `--remote` para producción).

## Por qué esta combinación de versiones

Cloudflare Workers no permite compilar WebAssembly dinámicamente en
runtime, algo que **Prisma 7 hace por defecto** con su nuevo "query
compiler" (ver [prisma/prisma#28657](https://github.com/prisma/prisma/issues/28657)).
Por eso el proyecto usa **Prisma 6.19.0**, que sigue usando el motor WASM
clásico (importado como módulo estático, compatible con Workers) cuando se
combina con un driver adapter. `@prisma/client` y `.prisma/client` se
mantienen fuera del bundle de Next.js (`serverExternalPackages` en
`next.config.ts`) para que el propio proceso de build de OpenNext los
empaquete correctamente para el runtime de Cloudflare.
