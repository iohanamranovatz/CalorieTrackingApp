"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={logout}
      variant="ghost"
      size="sm"
      className="text-[#94a3b8] hover:text-[#d946ef] hover:bg-[#2a1545]/50"
    >
      Logout
    </Button>
  );
}
