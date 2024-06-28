import "./DawntrailNotice.scss";

import { useLocation } from "wouter";

import Emoji from "./Emoji";

export default function DawntrailNotice() {
  const [location, _] = useLocation();

  if (location != "/") {
    return null;
  }

  return (
    <div className="DawntrailNotice">
      <Emoji emoji="✨" /> Updated for Dawntrail! <s>If</s> When you encounter a 🐛, please let me
      know through Github/Discord!
    </div>
  );
}
