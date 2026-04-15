import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0b0114" }}
    >
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
