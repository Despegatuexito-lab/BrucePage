# Socios Importadores — Plataforma de talento

Sitio web de Socios Importadores con una plataforma integrada para conectar
**alumnos/egresados de comercio exterior** con **empresas del rubro** que
buscan practicantes o personal.

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
- [Prisma](https://www.prisma.io) + SQLite como base de datos (archivo
  local `prisma/dev.db`, ignorado por git)
- [NextAuth](https://next-auth.js.org) (credenciales + JWT) para login con
  dos roles: `STUDENT` y `COMPANY`
- Subida de archivos (foto/CV/video) a `public/uploads`, servidos como
  archivos estáticos

## Cómo correr el proyecto en local

```bash
npm install
cp .env.example .env   # y define un NEXTAUTH_SECRET propio
npx prisma migrate dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Notas para producción

- El almacenamiento de archivos en `public/uploads` funciona bien en un
  servidor Node persistente (VPS, Docker, Railway, Render, etc.), pero
  **no** es apto para plataformas serverless con sistema de archivos
  efímero (por ejemplo Vercel) porque las subidas se perderían entre
  despliegues. Para ese caso, reemplazar `src/lib/storage.ts` por un
  proveedor externo (S3, Cloudinary, etc.).
- Cambia `NEXTAUTH_SECRET` por un valor aleatorio y seguro, y `DATABASE_URL`
  si migras a otro motor de base de datos (Postgres/MySQL) en producción.
