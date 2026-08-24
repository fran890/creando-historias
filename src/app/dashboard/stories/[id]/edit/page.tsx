import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditStoryClient from "./EditStoryClient";

interface Props {
  params: { id: string };
}

export default async function EditStoryPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) notFound();

  // Strict ownership check: Author can only edit their own story
  if (user.role !== "ADMIN" && article.authorId !== user.userId) {
    redirect("/dashboard/stories");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return <EditStoryClient article={article} categories={categories} userRole={user.role} />;
}
