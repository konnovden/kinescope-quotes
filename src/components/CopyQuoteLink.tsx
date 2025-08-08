"use client";

import { useEffect, useState } from "react";

/**
 * Component to display the full public quote URL and provide a button to copy it to the clipboard.
 * It computes the URL based on the current window location and the provided token.
 */
export function CopyQuoteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  // Determine the full URL once the component is mounted in the browser.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setUrl(`${origin}/q/${token}`);
    }
  }, [token]);

  async function handleCopy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Reset the copied state after 1.5 seconds
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }

  return (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <input
        value={url}
        readOnly
        className="px-2 py-1 border rounded text-xs flex-1"
      />
      <button
        onClick={handleCopy}
        className="text-xs bg-slate-100 border px-3 py-1 rounded hover:bg-slate-200 whitespace-nowrap"
      >
        {copied ? "Скопировано!" : "Скопировать"}
      </button>
    </div>
  );
}