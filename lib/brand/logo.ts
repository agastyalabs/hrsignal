export function domainFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function vendorLogoCandidates({
  slug,
  websiteUrl,
  explicitLogoUrl,
}: {
  slug: string | null | undefined;
  websiteUrl: string | null | undefined;
  explicitLogoUrl?: string | null | undefined;
}): string[] {
  const out: string[] = [];
  if (explicitLogoUrl) out.push(explicitLogoUrl);

  const domain = domainFromUrl(websiteUrl);
  if (domain) out.push(`https://logo.clearbit.com/${domain}`);

  if (slug) {
    out.push(`/logos/vendors/${slug}.png`);
    out.push(`/logos/vendors/${slug}.svg`);
  }

  return out;
}
