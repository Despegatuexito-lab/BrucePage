import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 ${className}`}
    >
      <Image
        src="/logo-socios-importadores.png"
        alt="Socios Importadores"
        width={328}
        height={144}
        className="h-10 w-auto object-contain"
        priority
      />
    </Link>
  );
}
