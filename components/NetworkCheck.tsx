"use client";

import { useEffect, useState } from "react";

export default function NetworkCheck() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!online) {
    return (
      <div className="bg-red-500 text-white text-center py-2">
        ⚠️ You are offline. Changes may not sync.
      </div>
    );
  }

  return null;
}
