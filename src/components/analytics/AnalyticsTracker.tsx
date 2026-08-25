"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  articleId: string;
  authorId: string;
}

export default function AnalyticsTracker({ articleId, authorId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Don't track analytics when loaded inside an iframe (e.g. Google AdSense previewer)
    if (typeof window !== "undefined" && window.self !== window.top) {
      return;
    }

    // Send background analytics ping
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, authorId }),
    }).catch(() => {
      // Silently ignore analytics failures
    });
  }, [articleId, authorId]);

  return null;
}
