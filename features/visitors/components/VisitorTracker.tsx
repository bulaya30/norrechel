"use client";

import { useEffect } from "react";

const VISITOR_ID_KEY = "visitor_id";
const SESSION_ID_KEY = "visitor_session_id";

function getOrCreateId(
  storage: Storage,
  key: string,
): string {
  const existing = storage.getItem(key);

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();

  storage.setItem(key, id);

  return id;
}

export default function VisitorTracker() {
  useEffect(() => {
    async function trackVisitor() {
      try {
        const visitorId = getOrCreateId(
          localStorage,
          VISITOR_ID_KEY,
        );

        const sessionId = getOrCreateId(
          sessionStorage,
          SESSION_ID_KEY,
        );

        await fetch("/api/visitors/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            sessionId,
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error(
          "Visitor tracking failed:",
          error,
        );
      }
    }

    trackVisitor();
  }, []);

  return null;
}