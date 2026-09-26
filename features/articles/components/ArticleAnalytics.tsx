"use client";

import { useEffect, useRef, useCallback } from "react";

interface ArticleAnalyticsProps {
  articleId: string;
  slug?: string;
  locale?: string;

  onTrackView: () => void;

  onTrackReadTime: (seconds: number) => void;

  onTrackScroll: (percent: number) => void;
}

export default function ArticleAnalytics({
  articleId,
  slug,
  locale,
  onTrackView,
  onTrackReadTime,
  onTrackScroll,
}: ArticleAnalyticsProps) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);

  useEffect(() => {
    if (!articleId) return;

    startTime.current = Date.now();
    maxScroll.current = 0;

    onTrackView();
  }, [articleId, onTrackView]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const total =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (total <= 0) return;

      const percent = Math.round(
        (scrollTop / total) * 100,
      );

      if (percent > maxScroll.current) {
        maxScroll.current = percent;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
  }, []);

  const handleLeave = useCallback(() => {
    if (!articleId) return;

    const seconds = Math.round(
      (Date.now() - startTime.current) / 1000,
    );

    onTrackReadTime(seconds);

    onTrackScroll(maxScroll.current);
  }, [
    articleId,
    onTrackReadTime,
    onTrackScroll,
  ]);

  useEffect(() => {
    window.addEventListener(
      "beforeunload",
      handleLeave,
    );

    return () => {
      handleLeave();

      window.removeEventListener(
        "beforeunload",
        handleLeave,
      );
    };
  }, [handleLeave]);

  return null;
}