"use client";

import { useEffect } from "react";

export default function UTMCookieSaver() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    utmKeys.forEach((key) => {
      const value = params.get(key) ?? "";
      document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
    });
  }, []);

  return null;
}
