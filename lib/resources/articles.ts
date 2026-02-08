import { loadResourceArticles, type ResourceArticle } from "./loader";

let CACHE: ResourceArticle[] | null = null;

function getAll(): ResourceArticle[] {
  if (CACHE) return CACHE;
  const fromFiles = loadResourceArticles();
  CACHE = fromFiles;
  return CACHE;
}

export type { ResourceArticle };

export function listResourceArticles(): ResourceArticle[] {
  return getAll();
}

export function getResourceArticle(slug: string): ResourceArticle | null {
  return getAll().find((a) => a.slug === slug) ?? null;
}
