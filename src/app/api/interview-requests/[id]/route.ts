import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, REQUEST_STATUS } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== ROLES.STUDENT) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (
    status !== REQUEST_STATUS.ACEPTADA &&
    status !== REQUEST_STATUS.RECHAZADA
  ) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!student) {
    return NextResponse.json(
      { error: "Perfil no encontrado." },
      { status: 404 }
    );
  }

  const interviewRequest = await prisma.interviewRequest.findUnique({
    where: { id },
  });
  if (!interviewRequest || interviewRequest.studentId !== student.id) {
    return NextResponse.json(
      { error: "Solicitud no encontrada." },
      { status: 404 }
    );
  }

  const updated = await prisma.interviewRequest.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ request: updated });
}
