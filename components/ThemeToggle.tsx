"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

export const THEME_KEY = "atelier-tema";

/** Rulează în <head> înainte de afișare, ca tema salvată să nu „clipească”. */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js")`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.dataset.theme === "dark";

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* stocare blocată: tema rămâne doar pentru această vizită */
    }
  };

  return (
    <button type="button" className="icon-btn theme-toggle" aria-pressed={dark} onClick={toggle}>
      <span className="visually-hidden">Temă întunecată</span>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
