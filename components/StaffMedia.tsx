import { Portrait } from "@/components/illustrations/Portrait";
import type { StaffMember } from "@/data/staff";

/** Fotografia reală, dacă există `photo`; altfel portretul ilustrat. */
export function StaffMedia({ member, decorative = false }: { member: StaffMember; decorative?: boolean }) {
  const label = decorative ? undefined : `Portret ilustrat: ${member.name}`;
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- export static, fără optimizare de imagini
      <img src={member.photo} alt={decorative ? "" : member.name} width={400} height={400} loading="lazy" decoding="async" />
    );
  }
  return <Portrait spec={member.portrait} label={label} />;
}
