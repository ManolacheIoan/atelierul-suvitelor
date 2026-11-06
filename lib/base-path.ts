/** Prefixes a root path ("/icon.svg") with the deploy sub-path, e.g. "/respiro/icon.svg" on GitHub Pages. */
export const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
