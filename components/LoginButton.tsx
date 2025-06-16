"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (session?.user) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            width={32}
            height={32}
            className="rounded-full border"
          />
        )}
        <span className="text-sm font-medium">
          {session.user.name || "User"}
        </span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
      <span className="text-sm text-muted-foreground">Not signed in</span>
      <Button
        variant="default"
        size="sm"
        onClick={() =>
          signIn("google", {
            prompt: "select_account",
          })
        }
      >
        Sign in with Google
      </Button>
    </div>
  );
}
