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
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
