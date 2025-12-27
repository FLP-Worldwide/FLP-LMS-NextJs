"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken, clearAccessToken } from "@/utils/token";

export default function AuthSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // When logged in → store token in memory
    if (session?.accessToken) {
      setAccessToken(session.accessToken);
    }

    // When logged out → clear token
    if (status === "unauthenticated") {
      clearAccessToken();
    }

    // reset logout guard
    window.__SIGNING_OUT__ = false;
  }, [session?.accessToken, status]);

  return null;
}
