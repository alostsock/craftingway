import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function DocumentTitle({ prefix }: { prefix?: string | null }) {
  const [location, _] = useLocation();

  const [suffix, setSuffix] = useState("Craftingway");

  useEffect(() => {
    if (location.startsWith("/rotation")) {
      setSuffix("Saved Rotation");
    } else if (window.origin.includes("craftingway-preview")) {
      setSuffix("Craftingway (Preview)");
    } else if (window.origin.includes("localhost")) {
      setSuffix("Craftingway (Dev)");
    } else {
      setSuffix("Craftingway");
    }
  }, [location]);

  useEffect(() => {
    document.title = prefix ? `${prefix} | ${suffix}` : suffix;
  }, [prefix, suffix]);

  return null;
}
