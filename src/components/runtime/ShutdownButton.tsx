"use client";

import { useState, useEffect } from "react";
import t from "@/lib/i18n";
import { requestRuntimeShutdown } from "@/lib/runtime/shutdown";

export function ShutdownButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "done" | "error">("idle");
  const isDevelopment = process.env.NODE_ENV === "development";

  const handleClick = async () => {
    if (!confirm(t("runtime.shutdownConfirm"))) return;
    setStatus("loading");
    try {
      const result = await requestRuntimeShutdown();
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // Auto-transition from "shutting down..." to "stopped" after a brief display
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("done"), 800);
    return () => clearTimeout(timer);
  }, [status]);

  // Close the browser tab once shutdown is confirmed.
  // window.close() works here because the page was opened by launch.ps1's Start-Process.
  // If the browser blocks it (manual tab), the "stopped" message remains as fallback.
  useEffect(() => {
    if (status !== "done") return;
    window.close();
  }, [status]);

  if (!isDevelopment) {
    return null;
  }

  if (status === "success") {
    return <span className="text-xs text-[var(--color-primary)]">{t("runtime.shutdownStarting")}</span>;
  }

  if (status === "done") {
    return <span className="text-xs text-[var(--color-muted)]">{t("runtime.shutdownDone")}</span>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="btn-danger text-xs px-3 py-1.5"
    >
      {status === "loading" ? t("runtime.shutdownTitle") : t("runtime.shutdown")}
    </button>
  );
}
