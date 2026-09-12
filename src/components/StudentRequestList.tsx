"use client";

import { useState } from "react";
import { REQUEST_STATUS_LABEL, RequestStatusType } from "@/lib/constants";

type RequestItem = {
  id: string;
  status: string;
  message: string | null;
  companyName: string;
  sector: string | null;
  contactName: string | null;
  phone: string | null;
};

export default function StudentRequestList({
  requests: initial,
}: {
  requests: RequestItem[];
}) {
  const [requests, setRequests] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: "ACEPTADA" | "RECHAZADA") {
    setLoadingId(id);
    const res = await fetch(`/api/interview-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoadingId(null);
    if (!res.ok) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  if (requests.length === 0) {
    return (
      <p className="mt-8 rounded-xl border border-dashed border-brand-200 p-8 text-center text-sm text-brand-500">
        Aún no has recibido solicitudes de entrevista. Completa tu perfil
        para que más empresas te encuentren.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {requests.map((r) => (
        <div
          key={r.id}
          className="card-shadow rounded-2xl border border-brand-100 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-brand-950">
                {r.companyName}
              </h3>
              <p className="text-sm text-brand-600">{r.sector}</p>
              {r.message && (
                <p className="mt-2 text-sm text-brand-800">
                  &ldquo;{r.message}&rdquo;
                </p>
              )}
            </div>
            <StatusBadge status={r.status as RequestStatusType} />
          </div>

          {r.status === "PENDIENTE" ? (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateStatus(r.id, "ACEPTADA")}
                disabled={loadingId === r.id}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                Aceptar
              </button>
              <button
                onClick={() => updateStatus(r.id, "RECHAZADA")}
                disabled={loadingId === r.id}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 disabled:opacity-60"
              >
                Rechazar
              </button>
            </div>
          ) : r.status === "ACEPTADA" && (r.contactName || r.phone) ? (
            <p className="mt-3 text-sm text-brand-800">
              Contacto: {[r.contactName, r.phone].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatusType }) {
  const styles: Record<RequestStatusType, string> = {
    PENDIENTE: "bg-brand-100 text-brand-700",
    ACEPTADA: "bg-emerald-100 text-emerald-700",
    RECHAZADA: "bg-accent-100 text-accent-600",
  };
  return (
    <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}>
      {REQUEST_STATUS_LABEL[status]}
    </span>
  );
}
