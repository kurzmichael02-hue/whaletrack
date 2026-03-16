"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("whaletrack_theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggle() {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("whaletrack_theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("whaletrack_theme", "light");
    }
  }

  return (
    <button onClick={toggle} style={{
      background: "none", border: "1px solid #1a1a1a", cursor: "pointer",
      padding: "4px 10px", borderRadius: "4px", fontSize: "12px",
      color: "#333", transition: "all 0.1s",
    }}>
      {dark ? "☀ Light" : "◑ Dark"}
    </button>
  );
}