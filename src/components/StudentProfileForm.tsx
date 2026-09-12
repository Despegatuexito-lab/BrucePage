"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProfileData = {
  fullName: string;
  career: string;
  headline: string;
  bio: string;
  phone: string;
  linkedin: string;
  city: string;
  skills: string;
  availability: string;
  graduationYear: string;
  isPublished: boolean;
  photoUrl: string | null;
  cvUrl: string | null;
  videoUrl: string | null;
};

export default function StudentProfileForm({
  profile,
}: {
  profile: ProfileData;
}) {
  const router = useRouter();
  const [form, setForm] = useState(profile);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile.photoUrl
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  const photoInput = useRef<HTMLInputElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const fd = new FormData();
    fd.set("fullName", form.fullName);
    fd.set("career", form.career);
    fd.set("headline", form.headline);
    fd.set("bio", form.bio);
    fd.set("phone", form.phone);
    fd.set("linkedin", form.linkedin);
    fd.set("city", form.city);
    fd.set("skills", form.skills);
    fd.set("availability", form.availability);
    fd.set("graduationYear", form.graduationYear);
    fd.set("isPublished", String(form.isPublished));

    if (photoInput.current?.files?.[0]) {
      fd.set("photo", photoInput.current.files[0]);
    }
    if (cvInput.current?.files?.[0]) {
      fd.set("cv", cvInput.current.files[0]);
    }
    if (videoInput.current?.files?.[0]) {
      fd.set("video", videoInput.current.files[0]);
    }

    const res = await fetch("/api/profile/student", {
      method: "PUT",
      body: fd,
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Error al guardar." });
      return;
    }

    setMessage({ type: "ok", text: "Perfil actualizado correctamente." });
    setForm((f) => ({
      ...f,
      photoUrl: data.profile.photoUrl,
      cvUrl: data.profile.cvUrl,
      videoUrl: data.profile.videoUrl,
    }));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section className="card-shadow rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
          Foto de perfil
        </h2>
        <div className="mt-4 flex items-center gap-5">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-brand-100 ring-2 ring-brand-200">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Foto de perfil"
                width={96}
                height={96}
                className="h-24 w-24 object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-brand-500">
                Sin foto
              </div>
            )}
          </div>
          <div>
            <input
              ref={photoInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPhotoChange}
              className="block text-sm text-brand-800 file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
            />
            <p className="mt-1 text-xs text-brand-500">JPG, PNG o WEBP. Máx. 5MB.</p>
          </div>
        </div>
      </section>

      <section className="card-shadow rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
          Datos personales
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre completo">
            <input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Carrera / especialidad">
            <input
              value={form.career}
              onChange={(e) => update("career", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Titular profesional">
            <input
              placeholder="Ej. Especialista en logística internacional"
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Ciudad">
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Teléfono / WhatsApp">
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="LinkedIn">
            <input
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              className="input"
              placeholder="https://linkedin.com/in/..."
            />
          </Field>
          <Field label="Año de egreso">
            <input
              type="number"
              value={form.graduationYear}
              onChange={(e) => update("graduationYear", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Disponibilidad">
            <select
              value={form.availability}
              onChange={(e) => update("availability", e.target.value)}
              className="input"
            >
              <option value="">Selecciona...</option>
              <option value="Inmediata">Inmediata</option>
              <option value="En 2 semanas">En 2 semanas</option>
              <option value="En 1 mes">En 1 mes</option>
              <option value="Solo prácticas">Solo prácticas</option>
            </select>
          </Field>
        </div>

        <Field label="Habilidades (separadas por coma)" className="mt-4">
          <input
            placeholder="Incoterms, aduanas, SAP, inglés avanzado..."
            value={form.skills}
            onChange={(e) => update("skills", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Sobre mí" className="mt-4">
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            className="input resize-none"
          />
        </Field>

        <label className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-900">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
          />
          Mostrar mi perfil en el catálogo de empresas
        </label>
      </section>

      <section className="card-shadow rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
          Curriculum vitae (CV)
        </h2>
        <input
          ref={cvInput}
          type="file"
          accept="application/pdf"
          className="mt-3 block text-sm text-brand-800 file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
        />
        <p className="mt-1 text-xs text-brand-500">Solo PDF. Máx. 10MB.</p>
        {form.cvUrl && (
          <a
            href={form.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
          >
            Ver CV actual
          </a>
        )}
      </section>

      <section className="card-shadow rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
          Video de presentación
        </h2>
        <input
          ref={videoInput}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="mt-3 block text-sm text-brand-800 file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
        />
        <p className="mt-1 text-xs text-brand-500">MP4, WEBM o MOV. Máx. 100MB.</p>
        {form.videoUrl && (
          <video
            src={form.videoUrl}
            controls
            className="mt-3 w-full max-w-md rounded-xl border border-brand-100"
          />
        )}
      </section>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            message.type === "ok"
              ? "bg-brand-100 text-brand-700"
              : "bg-accent-100 text-accent-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {saving ? "Guardando..." : "Guardar perfil"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-brand-900">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
