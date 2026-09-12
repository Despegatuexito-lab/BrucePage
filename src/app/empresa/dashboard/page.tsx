"use client";

import { useEffect, useState } from "react";
import StudentCard, { StudentCardData } from "@/components/StudentCard";

export default function EmpresaDashboardPage() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<StudentCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/students?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setStudents(data.students || []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
            Catálogo de talento
          </h1>
          <p className="mt-2 text-sm text-brand-800">
            Explora los perfiles de alumnos de Socios Importadores y
            solicita una entrevista al candidato que te interese.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, carrera, ciudad o habilidad..."
          className="input max-w-lg"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-brand-500">Cargando alumnos...</p>
        ) : students.length === 0 ? (
          <p className="rounded-xl border border-dashed border-brand-200 p-8 text-center text-sm text-brand-500">
            No se encontraron alumnos con ese criterio de búsqueda.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
