/**
 * Toate serviciile, duratele și prețurile. Editează aici; paginile, programarea
 * și totalurile se actualizează singure. Prețurile sunt în lei, durata în minute.
 */

export type ServiceCategory = "femei" | "barbati" | "copii";

/** Iconițele disponibile (vezi components/icons.tsx). */
export type ToolIconName = "scissors" | "comb" | "razor" | "dryer" | "brush" | "mirror" | "swatches";

export interface Service {
  /** Identificator unic, folosit în programări și în data/staff.ts. */
  id: string;
  name: string;
  category: ServiceCategory;
  /** Grupul din tabel (ex. „Tuns”, „Vopsit”). */
  group: string;
  durationMin: number;
  priceLei: number;
  /** `true` = prețul afișat e „de la” (depinde de lungimea părului). */
  priceFrom?: boolean;
  description: string;
  icon: ToolIconName;
}

export interface CategoryInfo {
  id: ServiceCategory;
  label: string;
  intro: string;
  icon: ToolIconName;
}

export const categories: CategoryInfo[] = [
  {
    id: "femei",
    label: "Femei",
    intro: "Tunsori, culoare, balayage, tratamente și coafuri pentru zilele importante.",
    icon: "dryer",
  },
  {
    id: "barbati",
    label: "Bărbați",
    intro: "Barbershop clasic: fade-uri curate, barbă conturată cu prosop cald, styling.",
    icon: "razor",
  },
  {
    id: "copii",
    label: "Copii și adolescenți",
    intro: "Tunsori răbdătoare pentru cei mici și stiluri la modă pentru adolescenți.",
    icon: "comb",
  },
];

export const services: Service[] = [
  // ——— Femei ———
  {
    id: "f-tuns-scurt",
    name: "Tuns păr scurt",
    category: "femei",
    group: "Tuns",
    durationMin: 45,
    priceLei: 110,
    description: "Consultație, spălat, tuns și uscat cu formă.",
    icon: "scissors",
  },
  {
    id: "f-tuns-lung",
    name: "Tuns păr mediu sau lung",
    category: "femei",
    group: "Tuns",
    durationMin: 60,
    priceLei: 140,
    description: "Tuns cu straturi sau linie dreaptă, spălat și uscat.",
    icon: "scissors",
  },
  {
    id: "f-coafat",
    name: "Coafat (brushing)",
    category: "femei",
    group: "Coafat",
    durationMin: 45,
    priceLei: 90,
    priceFrom: true,
    description: "Spălat și brushing cu volum sau drept, lucios.",
    icon: "dryer",
  },
  {
    id: "f-onduleuri",
    name: "Onduleuri și bucle",
    category: "femei",
    group: "Coafat",
    durationMin: 60,
    priceLei: 120,
    description: "Bucle lejere sau onduleuri definite, fixate să țină toată ziua.",
    icon: "brush",
  },
  {
    id: "f-vopsit-radacina",
    name: "Vopsit rădăcină",
    category: "femei",
    group: "Vopsit",
    durationMin: 90,
    priceLei: 210,
    description: "Retuș de rădăcină până la 4 cm, cu uscat inclus.",
    icon: "swatches",
  },
  {
    id: "f-vopsit-complet",
    name: "Vopsit complet",
    category: "femei",
    group: "Vopsit",
    durationMin: 120,
    priceLei: 290,
    priceFrom: true,
    description: "Culoare uniformă pe toată lungimea, cu tratament de protecție.",
    icon: "swatches",
  },
  {
    id: "f-balayage",
    name: "Balayage",
    category: "femei",
    group: "Vopsit",
    durationMin: 180,
    priceLei: 520,
    priceFrom: true,
    description: "Șuvițe pictate manual, tonifiere și coafat. Efect natural, care crește frumos.",
    icon: "brush",
  },
  {
    id: "f-tratament-hidratare",
    name: "Tratament de hidratare",
    category: "femei",
    group: "Tratamente",
    durationMin: 45,
    priceLei: 130,
    description: "Mască intensivă, masaj al scalpului și uscat.",
    icon: "mirror",
  },
  {
    id: "f-tratament-keratina",
    name: "Tratament cu keratină",
    category: "femei",
    group: "Tratamente",
    durationMin: 150,
    priceLei: 450,
    priceFrom: true,
    description: "Netezire și luciu de durată, pentru păr rebel sau deteriorat.",
    icon: "mirror",
  },
  {
    id: "f-coafura-eveniment",
    name: "Coafură de eveniment",
    category: "femei",
    group: "Coafuri de eveniment",
    durationMin: 75,
    priceLei: 220,
    description: "Coc, semi-prins sau bucle pentru nunți, botezuri și banchete.",
    icon: "brush",
  },
  {
    id: "f-coafura-mireasa",
    name: "Coafură de mireasă (cu probă)",
    category: "femei",
    group: "Coafuri de eveniment",
    durationMin: 120,
    priceLei: 450,
    description: "Probă în avans și coafura din ziua nunții, cu accesorii prinse.",
    icon: "brush",
  },
  // ——— Bărbați ———
  {
    id: "b-tuns",
    name: "Tuns bărbați",
    category: "barbati",
    group: "Tuns",
    durationMin: 40,
    priceLei: 70,
    description: "Tuns clasic sau modern, spălat și styling.",
    icon: "scissors",
  },
  {
    id: "b-fade",
    name: "Tuns fade",
    category: "barbati",
    group: "Tuns",
    durationMin: 45,
    priceLei: 80,
    description: "Skin fade, low sau mid fade, cu tranziții curate.",
    icon: "razor",
  },
  {
    id: "b-barba",
    name: "Barbă",
    category: "barbati",
    group: "Barbă",
    durationMin: 30,
    priceLei: 50,
    description: "Conturare cu brici, prosop cald și ulei de barbă.",
    icon: "razor",
  },
  {
    id: "b-tuns-barba",
    name: "Tuns + barbă",
    category: "barbati",
    group: "Pachete",
    durationMin: 70,
    priceLei: 110,
    description: "Pachetul complet: tuns, barbă conturată, prosop cald.",
    icon: "razor",
  },
  {
    id: "b-aranjat",
    name: "Aranjat (contur și styling)",
    category: "barbati",
    group: "Aranjat",
    durationMin: 20,
    priceLei: 40,
    description: "Contur la ceafă și tâmple între două tunsori, plus styling.",
    icon: "comb",
  },
  // ——— Copii și adolescenți ———
  {
    id: "c-tuns-copii",
    name: "Tuns copii (până la 10 ani)",
    category: "copii",
    group: "Tuns",
    durationMin: 30,
    priceLei: 50,
    description: "Fără grabă, cu scaun înălțat și pauze când e nevoie.",
    icon: "comb",
  },
  {
    id: "c-tuns-adolescenti",
    name: "Tuns adolescenți (11–17 ani)",
    category: "copii",
    group: "Tuns",
    durationMin: 40,
    priceLei: 60,
    description: "Stiluri actuale, explicate pe înțelesul lor, ușor de aranjat acasă.",
    icon: "scissors",
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function servicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category);
}

/** Durata și prețul total pentru o selecție de servicii. */
export function totals(ids: readonly string[]): { durationMin: number; priceLei: number; hasFromPrice: boolean } {
  return ids.reduce(
    (acc, id) => {
      const s = getService(id);
      if (!s) return acc;
      return {
        durationMin: acc.durationMin + s.durationMin,
        priceLei: acc.priceLei + s.priceLei,
        hasFromPrice: acc.hasFromPrice || Boolean(s.priceFrom),
      };
    },
    { durationMin: 0, priceLei: 0, hasFromPrice: false },
  );
}

export function formatPrice(s: Pick<Service, "priceLei" | "priceFrom">): string {
  return `${s.priceFrom ? "de la " : ""}${s.priceLei} lei`;
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 oră" : `${h} ore`;
  return `${h} h ${m} min`;
}
