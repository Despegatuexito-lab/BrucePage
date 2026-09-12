import Link from "next/link";

const audiencias = [
  {
    title: "Para estudiantes y egresados",
    description:
      "Crea tu perfil profesional en minutos: sube tu foto, tu CV y un video de presentación para que las empresas de comercio exterior te conozcan antes de la entrevista.",
    bullets: [
      "Perfil público dentro del catálogo de talento",
      "Sube tu CV en PDF y un video de presentación",
      "Recibe solicitudes de entrevista directo a tu bandeja",
    ],
    cta: { href: "/registro/estudiante", label: "Crear mi perfil de alumno" },
    accent: "accent",
  },
  {
    title: "Para empresas del rubro",
    description:
      "Busca y filtra practicantes y postulantes especializados en comercio exterior. Revisa foto, CV y video de cada candidato y solicita la entrevista con un clic.",
    bullets: [
      "Catálogo de alumnos con búsqueda por carrera, ciudad y habilidades",
      "Visualiza CV y video de presentación sin salir de la página",
      'Botón directo de "Solicitar entrevista" para cada candidato',
    ],
    cta: { href: "/registro/empresa", label: "Crear cuenta de empresa" },
    accent: "brand",
  },
];

const pasos = [
  {
    numero: "01",
    titulo: "Regístrate",
    texto:
      "Elige tu tipo de cuenta: alumno en búsqueda de práctica o empleo, o empresa en búsqueda de talento.",
  },
  {
    numero: "02",
    titulo: "Completa tu perfil",
    texto:
      "Los alumnos suben foto, CV y video. Las empresas describen su rubro y a quién buscan.",
  },
  {
    numero: "03",
    titulo: "Conecta",
    texto:
      "Las empresas exploran el catálogo y solicitan entrevistas directamente a los perfiles que les interesan.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero-gradient relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 ring-1 ring-white/20">
            Comercio exterior · Talento y capacitación
          </span>
          <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Conectamos talento en comercio exterior con las empresas que lo
            necesitan
          </h1>
          <p className="max-w-2xl text-lg text-brand-100">
            Socios Importadores es la escuela y ahora también la bolsa de
            talento para estudiantes y egresados de comercio exterior:
            crea tu catálogo de alumno o encuentra a tu próximo practicante.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/registro/estudiante"
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-600/30 transition hover:bg-accent-600"
            >
              Soy alumno, quiero registrarme
            </Link>
            <Link
              href="/registro/empresa"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              Soy empresa, quiero buscar talento
            </Link>
          </div>
        </div>
      </section>

      <section id="nosotros" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
              Sobre Socios Importadores
            </h2>
            <p className="mt-4 text-brand-800">
              Formamos a estudiantes en comercio exterior, importación y
              logística internacional. Sabemos lo difícil que es para un
              egresado conseguir su primera práctica, y lo difícil que es
              para una empresa encontrar candidatos con la base correcta.
              Por eso creamos esta plataforma: un catálogo vivo de talento
              donde cada alumno construye su propio perfil profesional.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Fotos, CV y video de presentación en un solo perfil",
              "Búsqueda y filtros pensados para reclutadores",
              "Solicitud de entrevista con un clic",
              "Perfiles actualizables por el propio alumno",
            ].map((item) => (
              <div
                key={item}
                className="card-shadow rounded-2xl border border-brand-100 bg-white p-5 text-sm font-medium text-brand-900"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plataforma" className="bg-brand-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
            Una plataforma, dos catálogos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-brand-800">
            Cada cuenta tiene su propia experiencia: los alumnos construyen su
            perfil, las empresas buscan y contactan.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {audiencias.map((a) => (
              <div
                key={a.title}
                className="card-shadow flex flex-col rounded-3xl border border-brand-100 bg-white p-8"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-brand-950">
                  {a.title}
                </h3>
                <p className="mt-3 text-brand-800">{a.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {a.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-brand-900"
                    >
                      <span
                        className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                          a.accent === "accent" ? "bg-accent-500" : "bg-brand-600"
                        }`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={a.cta.href}
                  className={`mt-8 inline-flex w-fit rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                    a.accent === "accent"
                      ? "bg-accent-500 hover:bg-accent-600"
                      : "bg-brand-600 hover:bg-brand-700"
                  }`}
                >
                  {a.cta.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
          Cómo funciona
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pasos.map((p) => (
            <div key={p.numero} className="relative rounded-2xl border border-brand-100 bg-white p-6">
              <span className="font-[family-name:var(--font-heading)] text-4xl font-extrabold text-brand-200">
                {p.numero}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-brand-800">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hero-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para empezar?
          </h2>
          <p className="max-w-xl text-brand-100">
            Únete a la comunidad de talento en comercio exterior de Socios
            Importadores hoy mismo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/registro/estudiante"
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              Registrarme como alumno
            </Link>
            <Link
              href="/registro/empresa"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Registrar mi empresa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
