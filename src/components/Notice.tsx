import "./Notice.scss";

import { useLocation } from "wouter";

import Emoji from "./Emoji";

export default function Notice() {
  const [location, _] = useLocation();

  if (location != "/") {
    return null;
  }

  return (
    <div className="Notice">
      <Emoji emoji="🌅" /> Updated for patch 7.35!
    </div>
  );
}
