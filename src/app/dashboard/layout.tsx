import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AuthorSidebar from "@/components/layout/AuthorSidebar";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        <AuthorSidebar />
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
