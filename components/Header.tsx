"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav } from "@/config/site";

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape închide meniul și readuce focusul pe buton.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav id="meniu" className="nav" aria-label="Principal" data-open={open}>
          <ul className="nav__list">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav__link"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/programare/" className="btn btn--primary nav__booking" onClick={close}>
            <CalendarIcon /> Programează-te
          </Link>
        </nav>
        <ThemeToggle />
        <Link
          href="/programare/"
          className="btn btn--primary btn--sm header-cta"
          aria-current={isCurrent(pathname, "/programare/") ? "page" : undefined}
        >
          Programează-te
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="icon-btn nav-toggle"
          aria-expanded={open}
          aria-controls="meniu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">Meniu</span>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
