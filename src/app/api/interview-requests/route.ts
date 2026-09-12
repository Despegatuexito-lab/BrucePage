import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (session.user.role === ROLES.COMPANY) {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!company) return NextResponse.json({ requests: [] });

    const requests = await prisma.interviewRequest.findMany({
      where: { companyId: company.id },
      include: { student: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  }

  if (session.user.role === ROLES.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!student) return NextResponse.json({ requests: [] });

    const requests = await prisma.interviewRequest.findMany({
      where: { studentId: student.id },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  }

  return NextResponse.json({ requests: [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== ROLES.COMPANY) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const studentId = body?.studentId?.toString();
  const message = body?.message?.toString() || null;

  if (!studentId) {
    return NextResponse.json(
      { error: "Falta el alumno." },
      { status: 400 }
    );
  }

  const company = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!company) {
    return NextResponse.json(
      { error: "Perfil de empresa no encontrado." },
      { status: 404 }
    );
  }

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
  });
  if (!student) {
    return NextResponse.json(
      { error: "Alumno no encontrado." },
      { status: 404 }
    );
  }

  const existing = await prisma.interviewRequest.findUnique({
    where: {
      companyId_studentId: { companyId: company.id, studentId },
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Ya enviaste una solicitud a este alumno." },
      { status: 409 }
    );
  }

  const request = await prisma.interviewRequest.create({
    data: {
      companyId: company.id,
      studentId,
      message,
    },
  });

  return NextResponse.json({ request });
}
