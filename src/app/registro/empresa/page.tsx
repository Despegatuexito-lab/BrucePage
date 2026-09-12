"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroEmpresaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    sector: "",
    contactName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "COMPANY", ...form }),
    });
    const data = await res.json<{ error?: string }>();

    if (!res.ok) {
      setError(data.error || "No se pudo completar el registro.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/empresa/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <span className="w-fit rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
        Cuenta de empresa
      </span>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
        Crea tu cuenta de empresa
      </h1>
      <p className="mt-2 text-sm text-brand-800">
        Accede al catálogo de alumnos y solicita entrevistas a los
        candidatos que te interesen.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-900">
            Nombre de la empresa
          </label>
          <input
            required
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-900">
            Rubro
          </label>
          <input
            placeholder="Ej. Agencia de aduanas"
            value={form.sector}
            onChange={(e) => update("sector", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-900">
            Persona de contacto
          </label>
          <input
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-900">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-900">
            Contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-accent-100 px-3 py-2 text-sm text-accent-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta de empresa"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-brand-800">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
