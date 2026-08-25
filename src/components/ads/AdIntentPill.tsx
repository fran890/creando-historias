"use client";

import { useState } from "react";
import AdIntentDrawer from "./AdIntentDrawer";

interface AdIntentPillProps {
  label: string;
}

export default function AdIntentPill({ label }: AdIntentPillProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hide mock pills when real AdSense is active in production
  if (adClientId) {
    return null;
  }

  return (
    <>
      <div
        className="google-anno-skip google-anno-sc group"
        tabIndex={0}
        role="link"
        aria-label={label}
        onClick={() => setDrawerOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDrawerOpen(true);
          }
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#0b57d0", // Official Google Blue
          color: "#ffffff",
          fontFamily: "Roboto, sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          borderRadius: "20px",
          padding: "2px 8px 2px 6px",
          margin: "0px 4px",
          cursor: "pointer",
          border: "1px solid #d7d7d7",
          verticalAlign: "middle",
          userSelect: "none",
          transition: "background-color 0.2s ease, transform 0.1s ease",
        }}
        title={`Ver más sobre ${label}`}
      >
        {/* Exact Google AdSense Intent Tag SVG Icon copied from DevTools */}
        <span style={{ display: "inline-flex", alignItems: "center", paddingLeft: "2px" }}>
          <svg
            viewBox="0 -960 960 960"
            width="16px"
            height="16px"
            style={{
              fill: "#ffffff",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <path d="M168-144q-29.7 0-50.85-21.15Q96-186.3 96-216v-528q0-29.7 21.15-50.85Q138.3-816 168-816h624q29.7 0 50.85 21.15Q864-773.7 864-744v528q0 29.7-21.15 50.85Q821.7-144 792-144H168Zm0-72h624v-528H168v528Zm72-96h480v-72H240v72Zm0-144h168v-216H240v216Zm240 0h240v-72H480v72Zm0-144h240v-72H480v72ZM168-216v-528 528Z" />
          </svg>
        </span>
        
        {/* Label text */}
        <span style={{ position: "relative", left: "4px", paddingRight: "4px", color: "#ffffff" }}>
          {label}
        </span>
      </div>

      <AdIntentDrawer
        isOpen={drawerOpen}
        topic={label}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
