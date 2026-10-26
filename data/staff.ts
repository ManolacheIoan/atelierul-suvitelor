/**
 * Echipa salonului (personaje fictive). Fiecare persoană are:
 * - serviciile pe care le face (id-uri din data/services.ts),
 * - zilele în care lucrează (programul salonului se aplică peste ele),
 * - un portret ilustrat; `photo` poate primi mai târziu o fotografie reală.
 */
import type { Weekday } from "@/config/site";

export type HairStyle =
  | "bob"
  | "lung"
  | "ondulat"
  | "pixie"
  | "coc"
  | "fade"
  | "pompadour"
  | "scurt"
  | "buclat"
  | "codite"
  | "undercut";

/** Descrierea unui portret ilustrat (vezi components/illustrations/Portrait.tsx). */
export interface PortraitSpec {
  hair: HairStyle;
  hairColor: string;
  /** Culoare secundară pentru șuvițe/balayage (opțional). */
  highlight?: string;
  skin: string;
  outfit: string;
  beard?: boolean;
  glasses?: boolean;
  earring?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
  serviceIds: string[];
  workDays: Weekday[];
  portrait: PortraitSpec;
  /** Cale către o fotografie reală (ex. „/echipa/ioana.webp”). Dacă lipsește, se afișează ilustrația. */
  photo?: string;
}

export const staff: StaffMember[] = [
  {
    id: "ioana",
    name: "Ioana Mareș",
    role: "Hair stylist senior și coloristă",
    specialties: ["Balayage", "Vopsit", "Corecții de culoare"],
    bio: "Lucrează cu culoarea de 12 ani și îți spune sincer ce nuanță ți se potrivește, chiar dacă nu e cea din poză.",
    serviceIds: [
      "f-tuns-scurt",
      "f-tuns-lung",
      "f-coafat",
      "f-vopsit-radacina",
      "f-vopsit-complet",
      "f-balayage",
      "f-tratament-hidratare",
      "f-tratament-keratina",
    ],
    workDays: [2, 3, 4, 5, 6],
    portrait: { hair: "ondulat", hairColor: "#5A3426", highlight: "#C8924F", skin: "#EBC2A6", outfit: "#3B1F3F", earring: true },
  },
  {
    id: "radu",
    name: "Radu Ciobanu",
    role: "Master barber",
    specialties: ["Fade", "Barbă cu brici", "Tunsori clasice"],
    bio: "Vine din școala clasică de barbershop. Un fade de-al lui ține curat și după trei săptămâni.",
    serviceIds: ["b-tuns", "b-fade", "b-barba", "b-tuns-barba", "b-aranjat", "c-tuns-adolescenti"],
    workDays: [1, 2, 3, 4, 5, 6],
    portrait: { hair: "pompadour", hairColor: "#2B1E1A", skin: "#D9A47F", outfit: "#7A4A2E", beard: true },
  },
  {
    id: "bianca",
    name: "Bianca Tudose",
    role: "Stilistă coafuri de eveniment",
    specialties: ["Coafuri de mireasă", "Onduleuri", "Tratamente"],
    bio: "Mirese, nașe, absolvente: Bianca face coafuri care rezistă la dans până dimineața.",
    serviceIds: [
      "f-coafat",
      "f-onduleuri",
      "f-coafura-eveniment",
      "f-coafura-mireasa",
      "f-tratament-hidratare",
      "f-tuns-lung",
    ],
    workDays: [1, 3, 4, 5, 6],
    portrait: { hair: "coc", hairColor: "#B9773F", skin: "#F1CDB4", outfit: "#C8794B", earring: true },
  },
  {
    id: "matei",
    name: "Matei Dobre",
    role: "Barber și stilist pentru adolescenți",
    specialties: ["Tunsori moderne", "Copii și adolescenți", "Texturi"],
    bio: "Adolescenții vin cu poze de pe telefon; Matei pleacă de la ele și adaptează stilul la părul lor.",
    serviceIds: ["b-tuns", "b-fade", "b-aranjat", "c-tuns-copii", "c-tuns-adolescenti"],
    workDays: [1, 2, 3, 4, 5],
    portrait: { hair: "undercut", hairColor: "#3A2A22", skin: "#C98E68", outfit: "#2E4A45", glasses: true },
  },
  {
    id: "elena",
    name: "Elena Pavel",
    role: "Hair stylist",
    specialties: ["Tunsori scurte", "Bob-uri", "Copii"],
    bio: "Specialistă în tunsori scurte, precise. Cei mici o îndrăgesc pentru că le explică fiecare pas.",
    serviceIds: [
      "f-tuns-scurt",
      "f-tuns-lung",
      "f-coafat",
      "f-onduleuri",
      "f-vopsit-radacina",
      "c-tuns-copii",
      "c-tuns-adolescenti",
    ],
    workDays: [1, 2, 4, 5, 6],
    portrait: { hair: "bob", hairColor: "#241A26", skin: "#E3B08E", outfit: "#8E4A23" },
  },
];

export function getStaff(id: string): StaffMember | undefined {
  return staff.find((m) => m.id === id);
}

/** Cine poate face TOATE serviciile selectate. */
export function staffForServices(serviceIds: readonly string[]): StaffMember[] {
  return staff.filter((m) => serviceIds.every((id) => m.serviceIds.includes(id)));
}
