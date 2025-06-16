"use client";

import { SessionProvider } from "next-auth/react";
import ThemesProvider from "./themes-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { FirebaseAuthProvider } from "./firebase-auth-provider";
import NetworkCheck from "@/components/NetworkCheck";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemesProvider>
        <NetworkCheck />
        <FirebaseAuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </FirebaseAuthProvider>
      </ThemesProvider>
    </SessionProvider>
  );
}
