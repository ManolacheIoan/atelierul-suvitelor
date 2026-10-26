/** Validări pentru formularul de programare. Funcții pure, testate în validation.test.ts. */

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Normalizează un număr de telefon românesc la formatul internațional „+40XXXXXXXXX”.
 * Acceptă: 0722 123 456, 0722-123-456, 0722.123.456, +40 722 123 456, 0040722123456,
 * (0236) 123 456 (fix). Mobil: 07…; fix: 02… sau 03…. Întoarce `null` dacă nu e valid.
 */
export function normalizeRoPhone(input: string): string | null {
  const compact = input.trim().replace(/[\s.\-()/]/g, "");
  if (!/^\+?\d+$/.test(compact)) return null;

  let national: string;
  if (compact.startsWith("+40")) national = compact.slice(3);
  else if (compact.startsWith("0040")) national = compact.slice(4);
  else if (compact.startsWith("0")) national = compact.slice(1);
  else return null;

  // Unii scriu „+40 0722…”; zeroul în plus e tolerat.
  if (national.length === 10 && national.startsWith("0")) national = national.slice(1);
  if (!/^[237]\d{8}$/.test(national)) return null;
  return `+40${national}`;
}

/** „+40722123456” → „0722 123 456”; fix: „+40236123456” → „0236 123 456”. */
export function formatRoPhone(e164: string): string {
  const n = e164.replace(/^\+40/, "0");
  return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
}

export function validatePhone(input: string): ValidationResult<string> {
  if (!input.trim()) return { ok: false, error: "Scrie numărul de telefon, ca să te putem suna dacă apare ceva." };
  const value = normalizeRoPhone(input);
  if (!value) {
    return { ok: false, error: "Numărul nu pare românesc. Exemplu: 0722 123 456 sau +40 722 123 456." };
  }
  return { ok: true, value };
}

const NAME_RE = /^[\p{L}][\p{L}\p{M}' ’.-]*[\p{L}\p{M}.]$/u;

export function validateName(input: string): ValidationResult<string> {
  const value = input.trim().replace(/\s+/g, " ");
  if (!value) return { ok: false, error: "Scrie-ne numele tău." };
  const letters = value.match(/\p{L}/gu)?.length ?? 0;
  if (letters < 2) return { ok: false, error: "Numele trebuie să aibă cel puțin două litere." };
  if (value.length > 60) return { ok: false, error: "Numele e prea lung (maximum 60 de caractere)." };
  if (!NAME_RE.test(value)) {
    return { ok: false, error: "Folosește doar litere, spații, cratimă sau apostrof." };
  }
  return { ok: true, value };
}
