/** Ilustrații decorative originale: foarfeca animată, separatorul de secțiuni, scena 404. */
import { BrushIcon, CombIcon, DryerIcon, MirrorIcon, RazorIcon, ScissorsIcon, SwatchesIcon } from "@/components/icons";

/** Foarfecă orizontală, cu lamele separate ca să poată „tăia” (vezi .snip în CSS). */
export function SnipScissors({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 84 40" width="84" height="40" aria-hidden="true" focusable="false">
      <SnipScissorsShape />
    </svg>
  );
}

/** Separator: linie punctată „de croitorie” cu o foarfecă și un pieptene la mijloc. */
export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider__line" />
      <ScissorsIcon className="divider__icon" size={28} />
      <CombIcon className="divider__icon divider__icon--soft" size={24} />
      <span className="divider__line" />
    </div>
  );
}

/** Iconițe plutitoare din hero; fiecare are o „adâncime” pentru parallax. */
export function FloatingTools() {
  const tools = [
    { Icon: CombIcon, cls: "t1" },
    { Icon: DryerIcon, cls: "t2" },
    { Icon: BrushIcon, cls: "t3" },
    { Icon: RazorIcon, cls: "t4" },
    { Icon: MirrorIcon, cls: "t5" },
    { Icon: SwatchesIcon, cls: "t6" },
  ];
  return (
    <div className="floaters" aria-hidden="true">
      {tools.map(({ Icon, cls }) => (
        <span key={cls} className={`floater floater--${cls}`}>
          <span className="floater__bob">
            <Icon size={56} />
          </span>
        </span>
      ))}
    </div>
  );
}

/** Scena de 404: o șuviță rebelă pe care foarfeca o urmărește în jurul pieptenului. */
export function LostStrandScene() {
  return (
    <svg className="lost" viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      <ellipse cx="160" cy="182" rx="120" ry="10" fill="var(--blush)" />
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {/* pieptenele cu un dinte lipsă */}
        <rect x="70" y="120" width="180" height="20" rx="6" fill="var(--surface)" />
        <path d="M84 140v28M98 140v28M112 140v28M126 140v28M140 140v14M168 140v28M182 140v28M196 140v28M210 140v28M224 140v28M238 140v20" />
        <path className="ic-accent" d="M86 130h50" />
        {/* șuvița */}
        <path className="lost__strand" d="M150 118c-8-26 22-34 10-58s20-34 34-30" stroke="var(--copper)" strokeWidth="3.2" />
        {/* dintele căzut */}
        <path className="lost__tooth" d="M156 180l-3-14" />
      </g>
      <g className="lost__scissors" transform="translate(210 24)">
        <SnipScissorsShape />
      </g>
      <g className="lost__question" fill="var(--copper-ink)" fontFamily="var(--font-display)" fontSize="34" fontStyle="italic">
        <text x="40" y="70">?</text>
        <text x="270" y="110">?</text>
      </g>
    </svg>
  );
}

function SnipScissorsShape() {
  return (
    <g className="snip" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <g className="snip__blade snip__blade--top">
        <path d="M40 20 78 14.5q3 1.2-.5 3.4L40 20Z" fill="var(--surface)" />
        <path d="M40 20 22.5 12.5" />
        <circle cx="14" cy="10" r="8" stroke="var(--copper)" />
      </g>
      <g className="snip__blade snip__blade--bottom">
        <path d="M40 20 78 25.5q3-1.2-.5-3.4L40 20Z" fill="var(--surface)" />
        <path d="M40 20 22.5 27.5" />
        <circle cx="14" cy="30" r="8" stroke="var(--copper)" />
      </g>
      <circle cx="40" cy="20" r="1.8" fill="currentColor" stroke="none" />
    </g>
  );
}
