import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { ROLES } from "@/lib/constants";

const studentSchema = z.object({
  role: z.literal("STUDENT"),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  career: z.string().optional(),
});

const companySchema = z.object({
  role: z.literal("COMPANY"),
  email: z.string().email(),
  password: z.string().min(6),
  companyName: z.string().min(2),
  sector: z.string().optional(),
  contactName: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json<Record<string, unknown>>().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const parsed =
    body.role === "STUDENT"
      ? studentSchema.safeParse(body)
      : companySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const email = data.email.toLowerCase().trim();

  const prisma = await getPrisma();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con ese correo." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  if (data.role === "STUDENT") {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: ROLES.STUDENT,
        studentProfile: {
          create: {
            fullName: data.fullName,
            career: data.career,
          },
        },
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: ROLES.COMPANY,
        companyProfile: {
          create: {
            companyName: data.companyName,
            sector: data.sector,
            contactName: data.contactName,
          },
        },
      },
    });
  }

  return NextResponse.json({ ok: true });
}
