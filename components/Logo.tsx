import Link from "next/link";
import { BUSINESS_NAME } from "@/config/site";

/** Monograma: un pieptene deasupra unei foarfeci deschise, pe o plăcuță vânătă. */
export function LogoMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className ? `logo-mark ${className}` : "logo-mark"}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="15" fill="#3B1F3F" />
      <rect x="1.5" y="1.5" width="45" height="45" rx="15" fill="none" stroke="#C8794B" strokeOpacity=".55" />
      <g fill="none" strokeLinecap="round">
        <path d="M12.5 12.5h23" stroke="#FBF7F2" strokeWidth="3" />
        <path
          d="M15 13v4.6M18.8 13v4.6M22.6 13v4.6M26.4 13v4.6M30.2 13v4.6M34 13v3.4"
          stroke="#FBF7F2"
          strokeWidth="1.5"
        />
        <path d="M17 20.5 29.6 34M31 20.5 18.4 34" stroke="#E2A07A" strokeWidth="2.4" />
        <circle cx="16.2" cy="37.2" r="3.7" stroke="#E2A07A" strokeWidth="2.2" />
        <circle cx="31.8" cy="37.2" r="3.7" stroke="#E2A07A" strokeWidth="2.2" />
      </g>
      <circle cx="24" cy="27.9" r="1.5" fill="#FBF7F2" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${BUSINESS_NAME} — prima pagină`}>
      <LogoMark />
      <span className="logo__word">{BUSINESS_NAME}</span>
    </Link>
  );
}
