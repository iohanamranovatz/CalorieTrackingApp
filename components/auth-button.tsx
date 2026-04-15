
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";


export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  await supabase.auth.getClaims();

  return  (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
