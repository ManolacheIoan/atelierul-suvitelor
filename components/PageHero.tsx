import { ToolIcon } from "@/components/icons";
import type { ToolIconName } from "@/data/services";

export function PageHero({
  eyebrow,
  title,
  intro,
  icon,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  icon: ToolIconName;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {intro && <p className="lead">{intro}</p>}
        </div>
        <div className="page-hero__icon" aria-hidden="true">
          <ToolIcon name={icon} size={72} />
        </div>
      </div>
    </section>
  );
}
