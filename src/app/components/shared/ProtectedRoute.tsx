import { useSession } from "@/app/hooks/useSession";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  useLayoutEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      router.replace("/login");
    }
  }, [session, router]);

  if (session === undefined) {
    return (
      <main className="grid h-screen place-items-center">
        <div className="animate-pulse">Loading auth state...</div>
      </main>
    );
  }
  return session ? <>{children}</> : null;
}
