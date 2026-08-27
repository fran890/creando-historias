import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Strict RBAC Guard: Only ADMIN allowed
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="admin-light-theme min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        <AdminSidebar />
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
