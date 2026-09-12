import Image from "next/image";
import Link from "next/link";

export type StudentCardData = {
  id: string;
  fullName: string;
  photoUrl: string | null;
  career: string | null;
  headline: string | null;
  city: string | null;
  skills: string | null;
  cvUrl: string | null;
  videoUrl: string | null;
};

export default function StudentCard({ student }: { student: StudentCardData }) {
  const skills = student.skills
    ? student.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/empresa/alumno/${student.id}`}
      className="card-shadow group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-center gap-4 border-b border-brand-50 p-5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-100 ring-2 ring-brand-100">
          {student.photoUrl ? (
            <Image
              src={student.photoUrl}
              alt={student.fullName}
              width={64}
              height={64}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-brand-500">
              {student.fullName.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-[family-name:var(--font-heading)] font-bold text-brand-950">
            {student.fullName}
          </h3>
          <p className="truncate text-sm text-brand-600">
            {student.career || "Comercio exterior"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {student.headline && (
          <p className="text-sm text-brand-800">{student.headline}</p>
        )}
        {student.city && (
          <p className="text-xs text-brand-500">{student.city}</p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-3 pt-2 text-xs font-medium text-brand-500">
          {student.cvUrl && <span>📄 CV disponible</span>}
          {student.videoUrl && <span>🎥 Video de presentación</span>}
        </div>
      </div>
    </Link>
  );
}
