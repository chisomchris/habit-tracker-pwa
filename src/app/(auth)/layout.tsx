"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/shared/NavBar";
import { useSession } from "../hooks/useSession";

export default function Layout({ children }: LayoutProps<"/">) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session === undefined) return;
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  if (session === undefined) {
    return (
      <main className="grid h-screen place-items-center">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }
  return !session ? (
    <>
      <Navbar />
      {children}
    </>
  ) : null;
}
