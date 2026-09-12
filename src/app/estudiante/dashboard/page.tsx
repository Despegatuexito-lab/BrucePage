import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentProfileForm from "@/components/StudentProfileForm";

export default async function EstudianteDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") redirect("/login");

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-brand-950">
        Mi perfil de alumno
      </h1>
      <p className="mt-2 text-sm text-brand-800">
        Completa tu perfil para aparecer en el catálogo de talento que
        revisan las empresas. Mientras más completo esté, mejores
        oportunidades tendrás.
      </p>

      <StudentProfileForm
        profile={{
          fullName: profile.fullName,
          career: profile.career ?? "",
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
          phone: profile.phone ?? "",
          linkedin: profile.linkedin ?? "",
          city: profile.city ?? "",
          skills: profile.skills ?? "",
          availability: profile.availability ?? "",
          graduationYear: profile.graduationYear
            ? String(profile.graduationYear)
            : "",
          isPublished: profile.isPublished,
          photoUrl: profile.photoUrl,
          cvUrl: profile.cvUrl,
          videoUrl: profile.videoUrl,
        }}
      />
    </div>
  );
}
