// every internal link goes through here so the GitHub Pages base path is never missed (spec §8)
export function normaliseBase(base: string): string {
  const core = base.split("/").filter(Boolean).join("/");
  return core ? `/${core}/` : "/";
}

const envBase = () => normaliseBase(import.meta.env?.BASE_URL ?? "/");

export function href(path: string, base: string = envBase()): string {
  return normaliseBase(base) + path.replace(/^\/+/, "");
}

export function absolute(path: string, site: string, base: string = envBase()): string {
  return site.replace(/\/+$/, "") + href(path, base);
}
