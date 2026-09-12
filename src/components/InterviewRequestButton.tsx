"use client";

import { useState } from "react";
import { REQUEST_STATUS_LABEL, RequestStatusType } from "@/lib/constants";

export default function InterviewRequestButton({
  studentId,
  initialStatus,
}: {
  studentId: string;
  initialStatus: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status) {
    return (
      <div className="rounded-full bg-brand-100 px-4 py-3 text-center text-sm font-semibold text-brand-700">
        Solicitud enviada · {REQUEST_STATUS_LABEL[status as RequestStatusType]}
      </div>
    );
  }

  async function handleSend() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/interview-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, message }),
    });
    const data = await res.json<{ error?: string }>();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "No se pudo enviar la solicitud.");
      return;
    }

    setStatus("PENDIENTE");
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full rounded-full bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        Solicitar entrevista
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-200 p-4">
      <label className="block text-xs font-semibold uppercase text-brand-500">
        Mensaje para el alumno (opcional)
      </label>
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Cuéntale brevemente sobre la posición..."
        className="input mt-2 resize-none"
      />
      {error && <p className="mt-2 text-xs text-accent-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex-1 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="rounded-full border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
