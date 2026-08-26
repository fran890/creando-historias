import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSafePublicImageUrl } from "@/lib/images";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);
    const avatarUrl = getSafePublicImageUrl(validatedData.avatarUrl);

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        avatarUrl,
      },
      select: { id: true, name: true, username: true, email: true, role: true, avatarUrl: true, bio: true },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}
