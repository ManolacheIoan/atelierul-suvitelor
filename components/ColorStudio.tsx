"use client";

import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/illustrations/Portrait";
import type { PortraitSpec } from "@/data/staff";

interface Shade {
  id: string;
  label: string;
  hairColor: string;
  highlight?: string;
  note: string;
}

const NATURAL = "#3E2A22";

const SHADES: Shade[] = [
  { id: "miere", label: "Miere", hairColor: "#5A3426", highlight: "#D9A15B", note: "Balayage cald, care crește natural. Recomandat pe bază castanie." },
  { id: "cupru", label: "Cupru", hairColor: "#9C4E28", highlight: "#D0844F", note: "Nuanță vie, luminoasă. Cere un tratament de menținere la 4–6 săptămâni." },
  { id: "ciocolata", label: "Ciocolată", hairColor: "#4A2A1E", note: "Profunzime și luciu, fără schimbări bruște. Ideal pentru acoperirea firelor albe." },
  { id: "perlat", label: "Blond perlat", hairColor: "#B89A74", highlight: "#EADCC4", note: "Necesită decolorare în etape; discutăm înainte dacă părul o suportă." },
  { id: "vanata", label: "Vânătă", hairColor: "#4B2550", highlight: "#8A5590", note: "Nuanța noastră preferată. Rece, elegantă, cu reflexe care se văd la lumină." },
  { id: "rose", label: "Roz pudrat", hairColor: "#B98183", highlight: "#E7BDB8", note: "Pastel delicat, potrivit pe păr deschis. Se estompează frumos în 3–4 săptămâni." },
];

const base: Omit<PortraitSpec, "hairColor" | "highlight"> = {
  hair: "ondulat",
  skin: "#F1CDB4",
  outfit: "#3B1F3F",
  earring: true,
};

export function ColorStudio() {
  const [shade, setShade] = useState(SHADES[0]);
  const [split, setSplit] = useState(50);
  const [sweeping, setSweeping] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (next: Shade) => {
    setShade(next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Mică animație: linia de separare pornește din dreapta și dezvăluie noua nuanță.
    setSweeping(false);
    setSplit(96);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setSweeping(true);
        setSplit(50);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setSweeping(false), 950);
      }),
    );
  };

  return (
    <div className="studio">
      <div
        className={sweeping ? "studio__stage is-sweeping" : "studio__stage"}
        style={{ "--split": `${split}%` } as React.CSSProperties}
      >
        <div className="studio__layer">
          <Portrait spec={{ ...base, hairColor: NATURAL }} backdrop="var(--surface-2)" />
        </div>
        <div className="studio__layer studio__layer--after">
          <Portrait spec={{ ...base, hairColor: shade.hairColor, highlight: shade.highlight }} backdrop="var(--surface-2)" />
        </div>
        <div className="studio__handle" aria-hidden="true" />
        <div className="studio__tags" aria-hidden="true">
          <span>Înainte</span>
          <span>După</span>
        </div>
      </div>

      <div className="studio__controls">
        <fieldset>
          <legend>Alege o nuanță</legend>
          <div className="swatches">
            {SHADES.map((s) => (
              <div className="swatch" key={s.id}>
                <input
                  type="radio"
                  id={`nuanta-${s.id}`}
                  name="nuanta"
                  value={s.id}
                  checked={shade.id === s.id}
                  onChange={() => choose(s)}
                />
                <label htmlFor={`nuanta-${s.id}`}>
                  <span
                    className="swatch__dot"
                    style={{
                      background: s.highlight ? `linear-gradient(160deg, ${s.hairColor} 35%, ${s.highlight})` : s.hairColor,
                    }}
                  />
                  {s.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="range-field">
          <label htmlFor="comparatie">Compară înainte și după</label>
          <input
            id="comparatie"
            type="range"
            min={0}
            max={100}
            value={split}
            aria-valuetext={`${100 - split}% din imagine arată nuanța nouă`}
            onChange={(e) => {
              setSweeping(false);
              setSplit(Number(e.target.value));
            }}
          />
        </div>
        <p className="studio__note" aria-live="polite">
          <strong>{shade.label}:</strong> {shade.note}
        </p>
      </div>
    </div>
  );
}
