"use client";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const FirebaseReadyContext = createContext(false);

export const useFirebaseReady = () => useContext(FirebaseReadyContext);

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!session?.id_token) return;

    const auth = getAuth();
    auth.useDeviceLanguage();

    signInWithCredential(auth, GoogleAuthProvider.credential(session.id_token))
      .then(() => setReady(true))
      .catch((err) => {
        console.error("❌ Firebase login failed", err);
        setReady(false);
      });
  }, [session?.id_token]);

  return (
    <FirebaseReadyContext.Provider value={ready}>
      {children}
    </FirebaseReadyContext.Provider>
  );
}
