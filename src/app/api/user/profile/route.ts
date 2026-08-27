import { NextResponse } from "next/server";
import { getCurrentUser, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSafePublicImageUrl } from "@/lib/images";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede tener mas de 30 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "El nombre de usuario solo puede contener letras, numeros, guiones y guiones bajos"),
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
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { username: true, email: true, role: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const oldUsername = currentUser.username;

    if (validatedData.username !== oldUsername) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: validatedData.username },
        select: { id: true },
      });

      if (usernameExists) {
        return NextResponse.json({ error: "Ese nombre de usuario ya esta en uso" }, { status: 409 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        name: validatedData.name,
        username: validatedData.username,
        bio: validatedData.bio,
        avatarUrl,
      },
      select: { id: true, name: true, username: true, email: true, role: true, avatarUrl: true, bio: true },
    });

    await setSessionCookie({
      userId: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role as "ADMIN" | "AUTHOR",
    });

    const publishedArticles = await prisma.article.findMany({
      where: { authorId: user.userId, status: "PUBLISHED" },
      select: { slug: true },
    });

    try {
      const { revalidatePath, revalidateTag } = await import("next/cache");

      revalidatePath("/");
      revalidatePath(`/author/${oldUsername}`);
      revalidatePath(`/author/${updatedUser.username}`);
      revalidateTag("articles-homepage");
      revalidateTag("articles-all");

      for (const article of publishedArticles) {
        revalidatePath(`/stories/${article.slug}`);
        revalidateTag(`article-${article.slug}`);
      }
    } catch (err) {
      console.warn("Profile revalidation failed:", err);
    }

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
