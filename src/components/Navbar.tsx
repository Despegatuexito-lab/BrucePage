"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/components/Logo";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/#nosotros"
            className="text-sm font-medium text-brand-900 hover:text-brand-600"
          >
            Nosotros
          </Link>
          <Link
            href="/#plataforma"
            className="text-sm font-medium text-brand-900 hover:text-brand-600"
          >
            Plataforma de talento
          </Link>

          {status === "loading" ? null : role === "STUDENT" ? (
            <>
              <Link
                href="/estudiante/dashboard"
                className="text-sm font-medium text-brand-900 hover:text-brand-600"
              >
                Mi perfil
              </Link>
              <Link
                href="/estudiante/solicitudes"
                className="text-sm font-medium text-brand-900 hover:text-brand-600"
              >
                Solicitudes
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : role === "COMPANY" ? (
            <>
              <Link
                href="/empresa/dashboard"
                className="text-sm font-medium text-brand-900 hover:text-brand-600"
              >
                Catálogo
              </Link>
              <Link
                href="/empresa/solicitudes"
                className="text-sm font-medium text-brand-900 hover:text-brand-600"
              >
                Mis solicitudes
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-brand-900 hover:text-brand-600"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro/estudiante"
                className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                Soy alumno
              </Link>
              <Link
                href="/registro/empresa"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Soy empresa
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-brand-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="my-1.5 block h-0.5 w-6 bg-current" />
          <span className="block h-0.5 w-6 bg-current" />
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-brand-100 bg-white px-4 py-3 md:hidden">
          <Link href="/#nosotros" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
            Nosotros
          </Link>
          <Link href="/#plataforma" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
            Plataforma de talento
          </Link>

          {role === "STUDENT" ? (
            <>
              <Link href="/estudiante/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
                Mi perfil
              </Link>
              <Link href="/estudiante/solicitudes" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
                Solicitudes
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Cerrar sesión
              </button>
            </>
          ) : role === "COMPANY" ? (
            <>
              <Link href="/empresa/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
                Catálogo
              </Link>
              <Link href="/empresa/solicitudes" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
                Mis solicitudes
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-brand-900 hover:bg-brand-50">
                Iniciar sesión
              </Link>
              <Link href="/registro/estudiante" onClick={() => setOpen(false)} className="mt-1 rounded-full bg-accent-500 px-4 py-2 text-center text-sm font-semibold text-white">
                Soy alumno
              </Link>
              <Link href="/registro/empresa" onClick={() => setOpen(false)} className="mt-1 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white">
                Soy empresa
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
