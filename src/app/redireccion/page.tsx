import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RedireccionPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role === "STUDENT") redirect("/estudiante/dashboard");
  if (session.user.role === "COMPANY") redirect("/empresa/dashboard");

  redirect("/");
}
