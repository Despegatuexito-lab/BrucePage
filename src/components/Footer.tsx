import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="w-fit rounded-lg bg-white p-1.5">
            <Logo />
          </div>
          <p className="text-sm text-brand-300">
            Formamos especialistas en comercio exterior y los conectamos con
            las empresas que necesitan su talento.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Plataforma de talento
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-300">
            <li>
              <a href="/registro/estudiante" className="hover:text-white">
                Registro de alumnos
              </a>
            </li>
            <li>
              <a href="/registro/empresa" className="hover:text-white">
                Registro de empresas
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-white">
                Iniciar sesión
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-300">
            <li>info@sociosimportadores.com</li>
            <li>Lima, Perú</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-brand-300 sm:px-6">
        © {new Date().getFullYear()} Socios Importadores. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
