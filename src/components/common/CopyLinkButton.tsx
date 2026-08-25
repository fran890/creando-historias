"use client";

import { useState } from "react";
import { Link2, Check, Copy } from "lucide-react";

interface CopyLinkButtonProps {
  slug: string;
  variant?: "full" | "icon" | "pill";
  className?: string;
}

export default function CopyLinkButton({ slug, variant = "full", className = "" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const fullUrl = `${origin}/stories/${slug}`;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Silently handle errors (e.g. inside AdSense preview iframe)
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition relative group ${className}`}
        title={copied ? "¡Enlace copiado!" : "Copiar enlace de la historia"}
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-xl transition ${className}`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
        <span>{copied ? "¡Enlace Copiado!" : "Copiar Enlace"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-brand-500 hover:text-white text-xs font-semibold rounded-xl transition ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
      <span>{copied ? "¡Enlace copiado!" : "Copiar enlace"}</span>
    </button>
  );
}
