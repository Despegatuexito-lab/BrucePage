import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import InterviewRequestButton from "@/components/InterviewRequestButton";

export default async function AlumnoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "COMPANY") redirect("/login");

  const { id } = await params;
  const prisma = await getPrisma();
  const student = await prisma.studentProfile.findUnique({ where: { id } });
  if (!student || !student.isPublished) notFound();

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });

  const existingRequest = company
    ? await prisma.interviewRequest.findUnique({
        where: {
          companyId_studentId: { companyId: company.id, studentId: student.id },
        },
      })
    : null;

  const skills = student.skills
    ? student.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="card-shadow overflow-hidden rounded-3xl border border-brand-100 bg-white">
        <div className="hero-gradient flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:text-left">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-white/20 ring-4 ring-white/30">
            {student.photoUrl ? (
              <Image
                src={student.photoUrl}
                alt={student.fullName}
                width={112}
                height={112}
                className="h-28 w-28 object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                {student.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">
              {student.fullName}
            </h1>
            <p className="mt-1 text-brand-100">
              {student.headline || student.career || "Comercio exterior"}
            </p>
            <p className="mt-1 text-sm text-brand-200">
              {[student.city, student.availability].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {student.bio && (
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
                  Sobre el candidato
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm text-brand-800">
                  {student.bio}
                </p>
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
                  Habilidades
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {student.videoUrl && (
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-brand-950">
                  Video de presentación
                </h2>
                <video
                  src={student.videoUrl}
                  controls
                  className="mt-2 w-full rounded-xl border border-brand-100"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-brand-950">
                Datos de contacto
              </h3>
              <dl className="mt-3 space-y-2 text-sm text-brand-800">
                {student.career && (
                  <div>
                    <dt className="text-xs uppercase text-brand-500">Carrera</dt>
                    <dd>{student.career}</dd>
                  </div>
                )}
                {student.graduationYear && (
                  <div>
                    <dt className="text-xs uppercase text-brand-500">
                      Año de egreso
                    </dt>
                    <dd>{student.graduationYear}</dd>
                  </div>
                )}
                {student.linkedin && (
                  <div>
                    <dt className="text-xs uppercase text-brand-500">LinkedIn</dt>
                    <dd>
                      <a
                        href={student.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline"
                      >
                        Ver perfil
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {student.cvUrl && (
              <a
                href={student.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-full border border-brand-300 px-4 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Ver CV completo
              </a>
            )}

            <InterviewRequestButton
              studentId={student.id}
              initialStatus={existingRequest?.status ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
