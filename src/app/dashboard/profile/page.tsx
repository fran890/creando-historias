import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user || !user.userId) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, name: true, username: true, email: true, avatarUrl: true, bio: true, role: true },
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-black text-gray-900 dark:text-white">Perfil de Usuario</h1>
        <p className="text-sm text-gray-500">Configura tu imagen de avatar, nombre público y biografía.</p>
      </div>

      <ProfileForm user={dbUser} />
    </div>
  );
}
