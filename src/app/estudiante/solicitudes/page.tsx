import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import StudentRequestList from "@/components/StudentRequestList";

export default async function EstudianteSolicitudesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") redirect("/login");

  const prisma = await getPrisma();
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  const requests = student
    ? await prisma.interviewRequest.findMany({
        where: { studentId: student.id },
        include: { company: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
        Solicitudes de entrevista
      </h1>
      <p className="mt-2 text-sm text-brand-800">
        Estas son las empresas interesadas en ti. Acepta o rechaza cada
        solicitud.
      </p>

      <StudentRequestList
        requests={requests.map((r) => ({
          id: r.id,
          status: r.status,
          message: r.message,
          companyName: r.company.companyName,
          sector: r.company.sector,
          contactName: r.company.contactName,
          phone: r.company.phone,
        }))}
      />
    </div>
  );
}
