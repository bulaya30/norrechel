"use client";

import { useEffect, useRef } from "react";

const VISITOR_ID_KEY = "visitor_id";

type ContentType = "article" | "project";
type EngagementType = "scroll_depth" | "read_time";

interface ContentEngagementTrackerProps {
  contentId: string;
  contentType: ContentType;
}

const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const READ_TIME_THRESHOLDS = [10, 30, 60, 120, 300];

export default function ContentEngagementTracker({
  contentId,
  contentType,
}: ContentEngagementTrackerProps) {
  const sentScrollDepths = useRef(new Set<number>());
  const sentReadTimes = useRef(new Set<number>());

  useEffect(() => {
    if (!contentId || !contentType) return;

    const visitorId = localStorage.getItem(VISITOR_ID_KEY);

    if (!visitorId) return;

    let elapsedSeconds = 0;
    let lastStartedAt: number | null = null;
    let active = !document.hidden;

    const timers: number[] = [];

    async function sendEngagement(
      eventType: EngagementType,
      eventValue: number,
    ) {
      try {
        const response = await fetch("/api/engagements/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitor_id: visitorId,
            content_id: contentId,
            content_type: contentType,
            event_type: eventType,
            event_value: eventValue,
            metadata: null,
          }),
          keepalive: true,
        });

        if (!response.ok) {
          console.error(
            "Engagement tracking failed:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Engagement tracking failed:", error);
      }
    }

    function startReading() {
      if (active && lastStartedAt !== null) return;

      active = true;
      lastStartedAt = Date.now();
    }

    function stopReading() {
      if (!active || lastStartedAt === null) return;

      elapsedSeconds += Math.floor(
        (Date.now() - lastStartedAt) / 1000,
      );

      lastStartedAt = null;
      active = false;
    }

    function getElapsedSeconds() {
      if (lastStartedAt === null) {
        return elapsedSeconds;
      }

      return (
        elapsedSeconds +
        Math.floor((Date.now() - lastStartedAt) / 1000)
      );
    }

    function checkReadTime() {
      const seconds = getElapsedSeconds();

      for (const threshold of READ_TIME_THRESHOLDS) {
        if (
          seconds >= threshold &&
          !sentReadTimes.current.has(threshold)
        ) {
          sentReadTimes.current.add(threshold);
          void sendEngagement("read_time", threshold);
        }
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopReading();
        checkReadTime();
      } else {
        startReading();
      }
    }

    function handleScroll() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage =
        scrollableHeight <= 0
          ? 100
          : Math.min(
              100,
              Math.round((window.scrollY / scrollableHeight) * 100),
            );

      for (const threshold of SCROLL_THRESHOLDS) {
        if (
          percentage >= threshold &&
          !sentScrollDepths.current.has(threshold)
        ) {
          sentScrollDepths.current.add(threshold);
          void sendEngagement("scroll_depth", threshold);
        }
      }
    }

    startReading();
    handleScroll();

    const timer = window.setInterval(() => {
      checkReadTime();
    }, 1000);

    timers.push(timer);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    function handlePageHide() {
      stopReading();
      checkReadTime();
    }

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      stopReading();
      checkReadTime();

      timers.forEach(window.clearInterval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);

      sentScrollDepths.current.clear();
      sentReadTimes.current.clear();
    };
  }, [contentId, contentType]);

  return null;
}