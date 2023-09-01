import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function DocumentTitle({ prefix }: { prefix?: string | null }) {
  const [location, _] = useLocation();

  const [suffix, setSuffix] = useState("Craftingway");

  const env = window.origin.includes("craftingway-preview")
    ? " (Preview)"
    : window.origin.includes("localhost")
    ? " (Dev)"
    : "";

  useEffect(() => {
    if (location.startsWith("/rotation")) {
      setSuffix("Saved Rotation");
    } else {
      setSuffix("Craftingway");
    }
  }, [location]);

  useEffect(() => {
    document.title = prefix ? `${prefix} | ${suffix}${env}` : `${suffix}${env}`;
  }, [prefix, suffix, env]);

  return null;
}
