"use client";

import { useEffect } from "react";

const VISITOR_ID_KEY = "visitor_id";
const SESSION_ID_KEY = "visitor_session_id";

type ContentType = "article" | "project";

interface ContentViewTrackerProps {
  contentId: string;
  contentType: ContentType;
  slug: string;
}

export default function ContentViewTracker({
  contentId,
  contentType,
  slug,
}: ContentViewTrackerProps) {
  useEffect(() => {
    if (!contentId || !contentType || !slug) {
      return;
    }

    async function trackView() {
      try {
        const visitorId = localStorage.getItem(VISITOR_ID_KEY);

        const sessionId = sessionStorage.getItem(SESSION_ID_KEY);

        if (!visitorId || !sessionId) {
          return;
        }

        const response = await fetch(
          "/api/views/track",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              content_id: contentId,
              content_type: contentType,
              slug,
              referrer:
                document.referrer || null,
              session_id: sessionId,
            }),
            keepalive: true,
          },
        );

        if (!response.ok) {
          console.error(
            "View tracking failed:",
            await response.text(),
          );
        }
      } catch (error) {
        console.error(
          "View tracking request failed:",
          error,
        );
      }
    }

    trackView();
  }, [
    contentId,
    contentType,
    slug,
  ]);

  return null;
}