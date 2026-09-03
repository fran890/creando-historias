"use client";

/**
 * StickyFloatingAd - Currently hidden.
 * 
 * With only 2 Adsterra banner ad zones available (header + sidebar),
 * there's no third key to use here. This component is kept as a stub
 * so it doesn't break imports. To activate it, create a new ad zone
 * in Adsterra dashboard and pass the key here.
 */

interface StickyFloatingAdProps {
  slotId?: string;
  className?: string;
}

export default function StickyFloatingAd({ slotId, className = "" }: StickyFloatingAdProps) {
  // Hidden until a third ad zone key is available from Adsterra
  return null;
}
