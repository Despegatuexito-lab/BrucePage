import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload, deleteUpload, UploadError } from "@/lib/storage";
import { ROLES } from "@/lib/constants";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== ROLES.STUDENT) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== ROLES.STUDENT) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return NextResponse.json(
      { error: "Perfil no encontrado." },
      { status: 404 }
    );
  }

  const formData = await req.formData();

  const fullName = formData.get("fullName")?.toString().trim();
  if (!fullName) {
    return NextResponse.json(
      { error: "El nombre completo es obligatorio." },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {
    fullName,
    career: formData.get("career")?.toString() || null,
    headline: formData.get("headline")?.toString() || null,
    bio: formData.get("bio")?.toString() || null,
    phone: formData.get("phone")?.toString() || null,
    linkedin: formData.get("linkedin")?.toString() || null,
    city: formData.get("city")?.toString() || null,
    skills: formData.get("skills")?.toString() || null,
    availability: formData.get("availability")?.toString() || null,
    isPublished: formData.get("isPublished") === "true",
  };

  const graduationYearRaw = formData.get("graduationYear")?.toString();
  updateData.graduationYear = graduationYearRaw
    ? parseInt(graduationYearRaw, 10)
    : null;

  try {
    const photo = formData.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const url = await saveUpload(photo, "photos");
      await deleteUpload(profile.photoUrl);
      updateData.photoUrl = url;
    }

    const cv = formData.get("cv");
    if (cv instanceof File && cv.size > 0) {
      const url = await saveUpload(cv, "cvs");
      await deleteUpload(profile.cvUrl);
      updateData.cvUrl = url;
    }

    const video = formData.get("video");
    if (video instanceof File && video.size > 0) {
      const url = await saveUpload(video, "videos");
      await deleteUpload(profile.videoUrl);
      updateData.videoUrl = url;
    }
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const updated = await prisma.studentProfile.update({
    where: { userId: session.user.id },
    data: updateData,
  });

  return NextResponse.json({ profile: updated });
}
