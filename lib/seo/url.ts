export const SITE_URL = "https://hrsignal.vercel.app";

export function absUrl(path: string) {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}
