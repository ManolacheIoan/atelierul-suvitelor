/**
 * Portret ilustrat, construit din forme simple (fără imagini externe).
 * Folosit pentru echipă și pentru galeria de stiluri. Stil: linie vânătă,
 * umplere plată, detalii în cupru.
 */
import { useId } from "react";
import type { HairStyle, PortraitSpec } from "@/data/staff";

const INK = "#3B1F3F";
const COPPER = "#C8794B";

/** Forma părului din spatele capului (desenată înaintea feței). */
const BACK: Partial<Record<HairStyle, string>> = {
  bob: "M60 100C56 60 76 46 100 46s44 14 40 54l2 32q-16 6-26-2H84q-10 8-26 2Z",
  lung: "M62 96C58 58 78 44 100 44s42 14 38 52l4 80q-14 6-24 0l-2-46H84l-2 46q-10 6-24 0Z",
  ondulat:
    "M62 96C56 58 78 44 100 44s44 14 38 52c8 16-2 28 6 44 6 14-6 26 2 38q-16 6-26-2c6-14-6-26-2-44H82c4 18-8 30-2 44q-10 8-26 2c8-12-4-24 2-38 8-16-2-28 6-44Z",
  coc: "M84 44a16 16 0 1 0 32 0a16 16 0 1 0-32 0Z",
  codite:
    "M48 118c0-14 6-24 14-24s12 10 10 24-6 30-12 30-12-16-12-30Zm104 0c0-14-6-24-14-24s-12 10-10 24 6 30 12 30 12-16 12-30Z",
};

/** Forma părului de deasupra frunții. */
const FRONT: Record<HairStyle, string> = {
  bob: "M67 96C63 64 80 50 100 50s37 14 33 46c-1-8-3-13-5-16H72c-2 3-4 8-5 16Z",
  lung: "M68 98C65 64 82 50 100 50s35 14 32 48c-6-22-20-34-32-37-12 3-26 15-32 37Z",
  ondulat: "M68 102C63 62 86 48 104 50c20 2 32 16 28 46-8-20-22-30-38-26-12 4-20 14-26 32Z",
  pixie: "M66 98C60 60 82 46 104 48s36 18 30 50c-4-12-10-20-18-24-12 8-30 6-40 2-6 6-8 14-10 22Z",
  coc: "M68 98C64 64 82 54 100 54s36 10 32 44c-6-20-20-30-32-30S74 78 68 98Z",
  fade: "M68 90C68 62 84 54 100 54s32 8 32 36c-6-12-16-18-32-18S74 78 68 90Z",
  pompadour: "M68 94C64 66 74 48 92 40c16-6 36-2 42 12 4 10 0 24-2 38-4-12-12-20-26-22-14-2-28 6-38 26Z",
  scurt: "M68 96C64 62 82 50 100 50s36 12 32 46c-4-14-12-22-24-24l-4-12c-8 8-24 12-36 36Z",
  buclat: "",
  codite: "M68 96C64 64 82 52 100 52s36 12 32 44c-6-18-18-28-32-30-14 2-26 12-32 30Z",
  undercut: "M70 86C70 60 86 50 104 50s32 12 28 32c-12-2-28 2-40 12-6-6-14-8-22-8Z",
};

/** Bucle: cercuri pe un arc deasupra capului. */
function curls(): { cx: number; cy: number; r: number }[] {
  const out: { cx: number; cy: number; r: number }[] = [];
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (1.05 + (0.9 * i) / 8);
    out.push({ cx: +(100 + 36 * Math.cos(a)).toFixed(1), cy: +(90 + 38 * Math.sin(a)).toFixed(1), r: i % 2 ? 11 : 12.5 });
  }
  return out;
}
const CURLS = curls();

export function Portrait({
  spec,
  label,
  backdrop = "#F4E3DC",
  className,
}: {
  spec: PortraitSpec;
  /** Text pentru cititoarele de ecran; fără el, ilustrația e decorativă. */
  label?: string;
  backdrop?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const hairFill = spec.highlight ? `url(#h${id})` : spec.hairColor;
  const kid = spec.hair === "buclat" || spec.hair === "codite";
  const short = spec.hair === "fade" || spec.hair === "undercut" || spec.hair === "scurt" || spec.hair === "pompadour";

  return (
    <svg
      className={className ? `portrait ${className}` : "portrait"}
      viewBox="0 0 200 200"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {spec.highlight && (
        <defs>
          <linearGradient id={`h${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.35" stopColor={spec.hairColor} />
            <stop offset="1" stopColor={spec.highlight} />
          </linearGradient>
        </defs>
      )}
      <circle cx="100" cy="100" r="96" fill={backdrop} />
      <circle cx="100" cy="100" r="96" fill="none" stroke={COPPER} strokeOpacity=".35" strokeDasharray="2 6" />

      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {BACK[spec.hair] && <path className="portrait__hair" d={BACK[spec.hair]} fill={hairFill} />}
        {spec.hair === "buclat" &&
          CURLS.map((c, i) => <circle key={`b${i}`} className="portrait__hair" cx={c.cx} cy={c.cy + 6} r={c.r} fill={hairFill} />)}

        {/* umeri și haine */}
        <path
          d="M36 200c2-32 26-50 52-52q12 8 24 0c26 2 50 20 52 52Z"
          fill={spec.outfit}
          transform={kid ? "translate(100 200) scale(.86) translate(-100 -200)" : undefined}
        />
        <path d="M88 126v22q12 8 24 0v-22" fill={spec.skin} />
        {/* urechi și cap */}
        <ellipse cx="67" cy="99" rx="5.5" ry="8.5" fill={spec.skin} />
        <ellipse cx="133" cy="99" rx="5.5" ry="8.5" fill={spec.skin} />
        <ellipse cx="100" cy="95" rx="32" ry="39" fill={spec.skin} />

        {/* părțile scurte ale tunsorilor fade / undercut */}
        {short && (
          <path
            d="M68.5 84q-1.5 10 1 20M131.5 84q1.5 10-1 20"
            stroke={spec.hairColor}
            strokeOpacity=".55"
            strokeWidth="4"
          />
        )}

        {spec.beard && (
          <>
            <path
              d="M69 102c0 28 14 40 31 40s31-12 31-40c-4 10-12 16-22 15q-9-4-18 0c-10 1-18-5-22-15Z"
              fill={spec.hairColor}
            />
            <path d="M88 113q12-6 24 0-12 2-24 0Z" fill={spec.hairColor} />
          </>
        )}

        {/* față */}
        <g fill="none" strokeWidth="2">
          <path d="M83 98q4.5-3.5 9 0M108 98q4.5-3.5 9 0" />
          <path d="M100 101q-3 8 2 10" strokeOpacity=".6" />
          <path d={spec.beard ? "M93 120q7 4 14 0" : "M92 117q8 6 16 0"} stroke={spec.beard ? "#FBF7F2" : INK} />
        </g>
        {!spec.beard && (
          <g fill={COPPER} fillOpacity=".28" stroke="none">
            <circle cx="81" cy="110" r="5.5" />
            <circle cx="119" cy="110" r="5.5" />
          </g>
        )}
        {spec.glasses && (
          <g fill="none" strokeWidth="2">
            <circle cx="87.5" cy="98" r="9" />
            <circle cx="112.5" cy="98" r="9" />
            <path d="M96.5 97q3.5-2 7 0M78.5 96l-10-2M121.5 96l10-2" />
          </g>
        )}

        {/* păr în față */}
        {spec.hair === "buclat" ? (
          CURLS.map((c, i) => <circle key={`f${i}`} className="portrait__hair" cx={c.cx} cy={c.cy} r={c.r - 3} fill={hairFill} />)
        ) : (
          <path className="portrait__hair" d={FRONT[spec.hair]} fill={hairFill} />
        )}
        {spec.hair === "coc" && (
          <path d="M70 100c-4 12 2 20-2 28M130 100c4 12-2 20 2 28" fill="none" stroke={spec.hairColor} strokeWidth="2.6" />
        )}
        {spec.hair === "codite" && (
          <g fill={COPPER} stroke={INK}>
            <circle cx="63" cy="98" r="4.5" />
            <circle cx="137" cy="98" r="4.5" />
          </g>
        )}
        {spec.earring && <circle cx="66" cy="112" r="3" fill={COPPER} />}
      </g>
    </svg>
  );
}
