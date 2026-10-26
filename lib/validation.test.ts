import { describe, expect, it } from "vitest";
import { formatRoPhone, normalizeRoPhone, validateName, validatePhone } from "./validation";

describe("telefon românesc", () => {
  it.each([
    ["0722123456", "+40722123456"],
    ["0722 123 456", "+40722123456"],
    ["0722-123-456", "+40722123456"],
    ["0722.123.456", "+40722123456"],
    ["+40 722 123 456", "+40722123456"],
    ["+40722123456", "+40722123456"],
    ["0040 722 123 456", "+40722123456"],
    ["+40 0722 123 456", "+40722123456"],
    ["(0236) 410 123", "+40236410123"],
    ["0341 123 456", "+40341123456"],
  ])("acceptă %s", (input, expected) => {
    expect(normalizeRoPhone(input)).toBe(expected);
  });

  it.each(["", "072212345", "07221234567", "0122123456", "0822123456", "+33612345678", "722123456", "07a2123456", "abc"])(
    "respinge „%s”",
    (input) => {
      expect(normalizeRoPhone(input)).toBeNull();
    },
  );

  it("formatează pentru afișare", () => {
    expect(formatRoPhone("+40722123456")).toBe("0722 123 456");
  });

  it("dă mesaje clare", () => {
    expect(validatePhone("  ")).toMatchObject({ ok: false });
    expect(validatePhone("123")).toMatchObject({ ok: false, error: expect.stringContaining("0722 123 456") });
    expect(validatePhone("0744 000 111")).toEqual({ ok: true, value: "+40744000111" });
  });
});

describe("nume", () => {
  it.each(["Ana", "Ioana-Maria Popescu", "Ștefan Țurcanu", "D'Angelo", "Ana  Maria "])("acceptă „%s”", (input) => {
    expect(validateName(input).ok).toBe(true);
  });

  it("normalizează spațiile", () => {
    expect(validateName("  Ana   Maria ")).toEqual({ ok: true, value: "Ana Maria" });
  });

  it.each(["", "   ", "A", "4n4", "Ana123", "<script>", "-Ana", "x".repeat(61)])("respinge „%s”", (input) => {
    expect(validateName(input).ok).toBe(false);
  });
});
