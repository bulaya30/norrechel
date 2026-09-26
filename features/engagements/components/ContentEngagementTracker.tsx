"use client";

import { useEffect, useRef } from "react";

const VISITOR_ID_KEY = "visitor_id";

type ContentType =
  | "article"
  | "project";

type EngagementType =
  | "scroll_depth"
  | "read_time";

interface ContentEngagementTrackerProps {
  contentId: string;
  contentType: ContentType;
}

export default function ContentEngagementTracker({
  contentId,
  contentType,
}: ContentEngagementTrackerProps) {
  const sentScrollDepths =
    useRef<Set<number>>(new Set());

  const sentReadTime =
    useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!contentId || !contentType) {
      return;
    }

    const visitorId =
      localStorage.getItem(
        VISITOR_ID_KEY,
      );

    if (!visitorId) {
      return;
    }

    async function sendEngagement(
      eventType: EngagementType,
      eventValue: number,
      metadata?: Record<
        string,
        unknown
      >,
    ) {
      try {
        await fetch(
          "/api/engagements/track",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              content_id: contentId,
              content_type: contentType,
              event_type: eventType,
              event_value: eventValue,
              metadata:
                metadata ?? null,
            }),
            keepalive: true,
          },
        );
      } catch (error) {
        console.error(
          "Engagement tracking failed:",
          error,
        );
      }
    }

    function handleScroll() {
      const documentHeight =
        document.documentElement
          .scrollHeight;

      const viewportHeight =
        window.innerHeight;

      const scrollableHeight =
        documentHeight -
        viewportHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollTop =
        window.scrollY;

      const percentage = Math.min(
        100,
        Math.round(
          (scrollTop /
            scrollableHeight) *
            100,
        ),
      );

      const thresholds = [
        25,
        50,
        75,
        100,
      ];

      for (const threshold of thresholds) {
        if (
          percentage >= threshold &&
          !sentScrollDepths.current.has(
            threshold,
          )
        ) {
          sentScrollDepths.current.add(
            threshold,
          );

          void sendEngagement(
            "scroll_depth",
            threshold,
          );
        }
      }
    }

    const readTimeIntervals = [
      10,
      30,
      60,
      120,
      300,
    ];

    const timers =
      readTimeIntervals.map(
        (seconds) =>
          window.setTimeout(() => {
            if (
              !sentReadTime.current.has(
                seconds,
              )
            ) {
              sentReadTime.current.add(
                seconds,
              );

              void sendEngagement(
                "read_time",
                seconds,
              );
            }
          }, seconds * 1000),
      );

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      timers.forEach(
        (timer) =>
          window.clearTimeout(timer),
      );
    };
  }, [
    contentId,
    contentType,
  ]);

  return null;
}