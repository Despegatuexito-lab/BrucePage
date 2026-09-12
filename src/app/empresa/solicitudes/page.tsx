import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REQUEST_STATUS_LABEL, RequestStatusType } from "@/lib/constants";

export default async function EmpresaSolicitudesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "COMPANY") redirect("/login");

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });

  const requests = company
    ? await prisma.interviewRequest.findMany({
        where: { companyId: company.id },
        include: { student: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
        Mis solicitudes de entrevista
      </h1>
      <p className="mt-2 text-sm text-brand-800">
        Aquí puedes ver el estado de las entrevistas que has solicitado a
        los alumnos del catálogo.
      </p>

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-brand-200 p-8 text-center text-sm text-brand-500">
            Aún no has enviado solicitudes de entrevista.{" "}
            <Link href="/empresa/dashboard" className="font-semibold text-brand-600 hover:underline">
              Explora el catálogo
            </Link>
          </p>
        ) : (
          requests.map((r) => (
            <Link
              key={r.id}
              href={`/empresa/alumno/${r.student.id}`}
              className="card-shadow flex items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-white p-5 transition hover:-translate-y-0.5"
            >
              <div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-brand-950">
                  {r.student.fullName}
                </h3>
                <p className="text-sm text-brand-600">
                  {r.student.career || "Comercio exterior"}
                </p>
                {r.message && (
                  <p className="mt-1 text-xs text-brand-500">
                    &ldquo;{r.message}&rdquo;
                  </p>
                )}
              </div>
              <StatusBadge status={r.status as RequestStatusType} />
            </Link>
          ))
        )}
      </div>
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
