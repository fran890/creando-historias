"use client";

import { useEffect } from "react";

interface AnalyticsTrackerProps {
  articleId: string;
  authorId: string;
}

export default function AnalyticsTracker({ articleId, authorId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Send background analytics ping
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, authorId }),
    }).catch((err) => console.error("Analytics ping failed:", err));
  }, [articleId, authorId]);

  return null;
}
