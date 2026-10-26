/** Întrebări frecvente. `{phone}` e înlocuit automat cu numărul din config/site.ts. */
export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "Cum fac o programare?",
    a: "Online, din pagina „Programare”: alegi serviciile, specialistul (sau „oricine e liber”), ziua și ora. Poți și să ne suni la {phone}.",
  },
  {
    q: "Pot anula sau muta programarea?",
    a: "Da. Din pagina „Programare” vezi programările făcute de pe acest dispozitiv și le poți anula cu un clic. Pentru mutare, anulează și alege altă oră sau sună-ne.",
  },
  {
    q: "Primesc SMS de confirmare?",
    a: "Nu trimitem SMS automat. După programare vezi pe ecran toate detaliile; te rugăm să le notezi. Dacă ceva se schimbă la noi, te sunăm noi.",
  },
  {
    q: "Cât durează un balayage?",
    a: "În jur de trei ore, în funcție de lungimea și densitatea părului. Durata exactă apare la fiecare serviciu și se adună automat când programezi.",
  },
  {
    q: "De ce unele prețuri sunt „de la”?",
    a: "Pentru vopsit, balayage, keratină și coafat, cantitatea de produs depinde de lungimea părului. Îți spunem prețul final înainte să începem.",
  },
  {
    q: "Tundeți și copii?",
    a: "Da, de la vârsta de 2 ani. Avem scaun înălțat, răbdare și pauze când e nevoie. Adolescenții au propriul serviciu, cu stiluri actuale.",
  },
  {
    q: "Ce se întâmplă dacă întârzii?",
    a: "Te așteptăm 10 minute. După aceea s-ar putea să scurtăm serviciul sau să îl mutăm, ca să nu întârziem următorul client.",
  },
  {
    q: "Pot plăti cu cardul?",
    a: "Da, acceptăm card și numerar. Avem și vouchere cadou, la orice valoare.",
  },
  {
    q: "Pot veni fără programare?",
    a: "Dacă avem un loc liber, sigur. Ca să nu aștepți, sună-ne înainte la {phone}.",
  },
  {
    q: "Ce produse folosiți?",
    a: "Vopsele fără amoniac pentru retușuri și produse profesionale pentru îngrijire. Te sfătuim sincer ce să folosești acasă, fără să-ți vindem ce nu-ți trebuie.",
  },
];
