import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 ${className}`}
    >
      <Image
        src="/logo-socios-importadores.jpg"
        alt="Socios Importadores"
        width={160}
        height={48}
        className="h-9 w-auto rounded-md object-contain"
        priority
      />
    </Link>
  );
}
