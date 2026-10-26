/**
 * Iconițe originale, desenate în același stil: linie de 2px, capete rotunjite,
 * detalii în cupru (clasa `ic-accent`). Culoarea liniei vine din `currentColor`.
 */
import type { ToolIconName } from "@/data/services";

type IconProps = { className?: string; title?: string; size?: number };

function Svg({
  children,
  className,
  title,
  size = 24,
  viewBox = "0 0 24 24",
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={viewBox === "0 0 48 48" ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {children}
    </svg>
  );
}

// ——— Instrumente (48×48) ———

export function ScissorsIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <path d="M17.5 30.5 35 6M30.5 30.5 13 6" />
      <circle className="ic-accent" cx="13.5" cy="35.5" r="6" />
      <circle className="ic-accent" cx="34.5" cy="35.5" r="6" />
      <circle cx="24" cy="21.4" r="1.3" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function CombIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <rect x="6" y="12" width="36" height="9" rx="3" />
      <path d="M10 21v14M14 21v14M18 21v14M22 21v14M26 21v11M30 21v11M34 21v11M38 21v11" />
      <path className="ic-accent" d="M11 16.5h12" />
    </Svg>
  );
}

export function RazorIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <path d="M20 22 34 8c3-2.4 7 .8 5 4.2L26 28Z" />
      <path className="ic-accent" d="M35.5 9.2 23.6 21.1" />
      <path d="M22 27 9 40" strokeWidth="4" />
      <circle className="ic-accent" cx="23" cy="25" r="2.2" />
    </Svg>
  );
}

export function DryerIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <rect x="6" y="9" width="30" height="18" rx="9" />
      <path d="M36 13h5v10h-5" />
      <path d="M15 27 12 41h7l3-14" />
      <circle className="ic-accent" cx="15" cy="18" r="4" />
      <path className="ic-accent" d="M44 13.5h1.5M44 18h2.5M44 22.5h1.5" />
    </Svg>
  );
}

export function BrushIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <ellipse cx="30" cy="17" rx="10" ry="12.5" transform="rotate(40 30 17)" />
      <path d="M22.5 26 9 40" strokeWidth="3.4" />
      <path
        className="ic-accent"
        d="M27 11.5h.01M31.5 12h.01M24.5 15.5h.01M29 16h.01M33.5 16.5h.01M27 20h.01M31 20.5h.01"
        strokeWidth="2.6"
      />
    </Svg>
  );
}

export function MirrorIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <circle cx="24" cy="18" r="12" />
      <path className="ic-accent" d="M17.5 15.5a7.5 7.5 0 0 1 5-5.5" />
      <path d="M24 30v12M20 42h8" />
    </Svg>
  );
}

export function SwatchesIcon(p: IconProps) {
  return (
    <Svg {...p} viewBox="0 0 48 48">
      <rect x="19" y="6" width="10" height="30" rx="3" transform="rotate(-28 24 38)" />
      <rect className="ic-accent ic-fill" x="19" y="6" width="10" height="30" rx="3" />
      <rect x="19" y="6" width="10" height="30" rx="3" transform="rotate(28 24 38)" />
      <circle cx="24" cy="31" r="1.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

const TOOL_ICONS: Record<ToolIconName, (p: IconProps) => React.ReactElement> = {
  scissors: ScissorsIcon,
  comb: CombIcon,
  razor: RazorIcon,
  dryer: DryerIcon,
  brush: BrushIcon,
  mirror: MirrorIcon,
  swatches: SwatchesIcon,
};

export function ToolIcon({ name, ...p }: IconProps & { name: ToolIconName }) {
  const Icon = TOOL_ICONS[name];
  return <Icon {...p} />;
}

// ——— Interfață (24×24) ———

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 3.5h3.2l1.6 4.2-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.2 1.6V17a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2Z" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path className="ic-accent" d="M8 14h.01M12 14h.01M16 14h.01M8 17.2h.01M12 17.2h.01" strokeWidth="2.4" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path className="ic-accent" d="M12 7.5V12l3 2" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle className="ic-accent" cx="12" cy="10" r="2.3" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
    <path className="ic-accent" d="m4 7 8 6 8-6" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </Svg>
);

export const ChevronIcon = ({ dir = "right", ...p }: IconProps & { dir?: "left" | "right" | "down" }) => (
  <Svg {...p}>
    <path d={dir === "left" ? "m14.5 6-6 6 6 6" : dir === "down" ? "m6 9.5 6 6 6-6" : "m9.5 6 6 6-6 6"} />
  </Svg>
);

export const ArrowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Svg>
);

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path className="ic-accent" d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Svg>
);

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />
    <path className="ic-accent" d="M16 4.5v3M14.5 6h3" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const SparkleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" />
    <path className="ic-accent" d="M19 16v4M17 18h4" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
);

export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="9" r="3.5" />
    <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" />
    <circle className="ic-accent" cx="17" cy="8" r="2.6" />
    <path className="ic-accent" d="M16.5 13.2a5 5 0 0 1 5 5" />
  </Svg>
);

export const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 19c0-8 5-13.5 14-14 0 9-5.5 14-14 14Z" />
    <path className="ic-accent" d="M5 19 13 11" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19.5s-7.5-4.6-7.5-10a4.2 4.2 0 0 1 7.5-2.6 4.2 4.2 0 0 1 7.5 2.6c0 5.4-7.5 10-7.5 10Z" />
  </Svg>
);
