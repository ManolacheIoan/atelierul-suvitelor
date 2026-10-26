"use client";

import { useState } from "react";
import { Portrait } from "@/components/illustrations/Portrait";
import { galleryCategories, type GalleryCategory, type GalleryItem } from "@/data/gallery";

const LABELS: Record<GalleryCategory, string> = {
  femei: "Femei",
  barbati: "Bărbați",
  copii: "Copii și adolescenți",
  culoare: "Culoare",
};

/** Imaginea reală dacă există `image`, altfel ilustrația. */
function Media({ item }: { item: GalleryItem }) {
  if (item.image) {
    // eslint-disable-next-line @next/next/no-img-element -- export static, fără optimizare de imagini
    return <img src={item.image} alt={item.alt} width={600} height={600} loading="lazy" decoding="async" />;
  }
  return <Portrait spec={item.portrait} backdrop={item.backdrop} label={`Ilustrație: ${item.alt}`} />;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "toate">("toate");
  const visible = filter === "toate" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrează după categorie">
        {galleryCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="filter-btn"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {visible.length} lucrări afișate
      </p>
      <ul className="gallery-grid" key={filter}>
        {visible.map((item, i) => (
          <li key={item.id} style={{ "--i": i } as React.CSSProperties}>
            <figure className="gallery-card">
              <div className="gallery-card__media">
                <Media item={item} />
              </div>
              <figcaption>
                <span className="chip">{LABELS[item.category]}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
