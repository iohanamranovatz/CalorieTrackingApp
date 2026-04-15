import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";

export default async function Home() {
  if (hasEnvVars) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      redirect("/dashboard");
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0b0114" }}
    >
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-white">Calorie Tracker</h1>
        <p className="text-[#94a3b8] text-lg max-w-md mx-auto">
          Calculate macros for your recipes, track your daily calories, and reach
          your nutrition goals.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-[#d946ef] hover:bg-[#c026d3] text-white px-8">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#2a1545] text-[#94a3b8] hover:bg-[#1a0b2e] hover:text-white px-8"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
