/**
 * Galeria de stiluri. Acum fiecare lucrare e o ilustrație (vezi `portrait`).
 * Când ai fotografii reale, pune-le în public/galerie/ și completează `image`:
 * imaginea va fi afișată în locul ilustrației, cu același text alternativ.
 */
import type { PortraitSpec } from "@/data/staff";

export type GalleryCategory = "femei" | "barbati" | "copii" | "culoare";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  /** Text alternativ pentru fotografia reală (când există). */
  alt: string;
  /** Opțional: cale către o fotografie reală, ex. „/galerie/bob-carre.webp”. */
  image?: string;
  /** Ilustrația folosită ca rezervă când nu există fotografie. */
  portrait: PortraitSpec;
  /** Culoarea de fundal a cardului ilustrat. */
  backdrop: string;
}

export const galleryCategories: { id: GalleryCategory | "toate"; label: string }[] = [
  { id: "toate", label: "Toate" },
  { id: "femei", label: "Femei" },
  { id: "barbati", label: "Bărbați" },
  { id: "copii", label: "Copii și adolescenți" },
  { id: "culoare", label: "Culoare" },
];

export const gallery: GalleryItem[] = [
  {
    id: "bob-carre",
    title: "Bob carré cu breton",
    category: "femei",
    description: "Linie precisă la nivelul bărbiei, breton drept.",
    alt: "Femeie cu tunsoare bob carré închisă la culoare și breton drept",
    portrait: { hair: "bob", hairColor: "#2A1C22", skin: "#EBC2A6", outfit: "#C8794B" },
    backdrop: "#F4E3DC",
  },
  {
    id: "balayage-miere",
    title: "Balayage miere",
    category: "culoare",
    description: "Bază castanie, vârfuri luminate în nuanțe de miere.",
    alt: "Femeie cu păr lung ondulat, castaniu cu vârfuri aurii",
    portrait: { hair: "ondulat", hairColor: "#5A3426", highlight: "#D9A15B", skin: "#F1CDB4", outfit: "#3B1F3F", earring: true },
    backdrop: "#F6E6D3",
  },
  {
    id: "skin-fade",
    title: "Skin fade cu textură",
    category: "barbati",
    description: "Tranziție de la piele, partea de sus texturată.",
    alt: "Bărbat cu tunsoare fade scurtă pe părți",
    portrait: { hair: "fade", hairColor: "#231915", skin: "#C98E68", outfit: "#2E4A45" },
    backdrop: "#E9E4DE",
  },
  {
    id: "coc-mireasa",
    title: "Coc de mireasă",
    category: "femei",
    description: "Coc jos, lejer, cu șuvițe care încadrează fața.",
    alt: "Femeie cu păr prins într-un coc elegant",
    portrait: { hair: "coc", hairColor: "#8A5530", skin: "#F1CDB4", outfit: "#FBF7F2", earring: true },
    backdrop: "#F4E3DC",
  },
  {
    id: "pompadour-barba",
    title: "Pompadour și barbă plină",
    category: "barbati",
    description: "Volum în față, barbă conturată cu brici.",
    alt: "Bărbat cu pompadour și barbă îngrijită",
    portrait: { hair: "pompadour", hairColor: "#2B1E1A", skin: "#D9A47F", outfit: "#7A4A2E", beard: true },
    backdrop: "#EFE2D6",
  },
  {
    id: "bucle-copil",
    title: "Bucle de copil",
    category: "copii",
    description: "Tuns ușor, care păstrează buclele naturale.",
    alt: "Copil cu păr creț, tuns scurt",
    portrait: { hair: "buclat", hairColor: "#6B3F24", skin: "#E3B08E", outfit: "#C8794B" },
    backdrop: "#F6E6D3",
  },
  {
    id: "pixie-cupru",
    title: "Pixie cupru",
    category: "culoare",
    description: "Tunsoare pixie cu o nuanță caldă de cupru.",
    alt: "Femeie cu tunsoare pixie de culoare cupru",
    portrait: { hair: "pixie", hairColor: "#A4532A", skin: "#F1CDB4", outfit: "#3B1F3F", earring: true },
    backdrop: "#F4E3DC",
  },
  {
    id: "undercut-adolescent",
    title: "Undercut pentru adolescenți",
    category: "copii",
    description: "Părți scurte, breton lung care se aranjează ușor.",
    alt: "Adolescent cu tunsoare undercut și ochelari",
    portrait: { hair: "undercut", hairColor: "#3A2A22", skin: "#EBC2A6", outfit: "#2E4A45", glasses: true },
    backdrop: "#E9E4DE",
  },
  {
    id: "lung-drept",
    title: "Lung, drept, lucios",
    category: "femei",
    description: "Tratament cu keratină și brushing.",
    alt: "Femeie cu păr lung drept, foarte lucios",
    portrait: { hair: "lung", hairColor: "#3A2420", skin: "#C98E68", outfit: "#8E4A23" },
    backdrop: "#EFE2D6",
  },
  {
    id: "codite",
    title: "Codițe pentru serbare",
    category: "copii",
    description: "Codițe prinse simetric, cu fundițe.",
    alt: "Fetiță cu două codițe",
    portrait: { hair: "codite", hairColor: "#B9773F", skin: "#F1CDB4", outfit: "#C8794B" },
    backdrop: "#F4E3DC",
  },
  {
    id: "clasic-scurt",
    title: "Tuns clasic cu cărare",
    category: "barbati",
    description: "Cărare laterală, finisaj natural.",
    alt: "Bărbat cu tunsoare clasică scurtă și cărare",
    portrait: { hair: "scurt", hairColor: "#5B4636", skin: "#EBC2A6", outfit: "#3B1F3F" },
    backdrop: "#E9E4DE",
  },
  {
    id: "aubergine-intens",
    title: "Vânătă intens",
    category: "culoare",
    description: "Culoare de modă, cu luciu rece.",
    alt: "Femeie cu păr lung, vopsit în nuanță vânătă",
    portrait: { hair: "lung", hairColor: "#4B2550", highlight: "#7D4A80", skin: "#EBC2A6", outfit: "#C8794B", earring: true },
    backdrop: "#EFE2D6",
  },
];
