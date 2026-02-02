import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 md:ml-64 mt-16 md:mt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
