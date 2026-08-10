import { createClient } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

/**
 * The space is shared with another site, so every query is filtered by
 * content type. Never query without it.
 */
export const CONTENT_TYPE = 'levelyJournal';

const read = (key: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[key] ?? process.env[key];

const space = read('CONTENTFUL_SPACE_ID');
const environment = read('CONTENTFUL_ENVIRONMENT') || 'master';
const deliveryToken = read('CONTENTFUL_DELIVERY_TOKEN');
const previewToken = read('CONTENTFUL_PREVIEW_TOKEN');

/** `npm run dev` reads drafts too, so an entry can be proofed before publishing. */
const usePreview = Boolean(import.meta.env.DEV && previewToken);
const accessToken = usePreview ? previewToken : deliveryToken;

if (!space || !accessToken) {
  throw new Error(
    'Contentful credentials missing. Copy .env.example to .env and fill in ' +
      'CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN.',
  );
}

const client = createClient({
  space,
  environment,
  accessToken,
  host: usePreview ? 'preview.contentful.com' : undefined,
});

export interface JournalEntry {
  id: string;
  title: string;
  slug: string;
  href: string;
  entryNumber?: number;
  /** Formatted for display, e.g. "Jul 13, 2026". */
  date: string;
  /** Sort key. Falls back to the entry's creation time. */
  sortDate: string;
  /** Computed from the body, never stored. */
  readTime: string;
  lede: string;
  excerpt: string;
  body: Document;
  heroImageUrl?: string;
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Walk a rich-text document collecting every text node. */
function plainText(node: any): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.content)) return node.content.map(plainText).join(' ');
  return '';
}

function readTimeFor(body: Document): string {
  const words = plainText(body).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function absoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

function normalise(item: any): JournalEntry {
  const f = item.fields ?? {};
  // publishDate is optional in the model, so fall back to creation time
  // rather than dropping the entry out of the ordering entirely.
  const sortDate: string = f.publishDate ?? item.sys.createdAt;

  return {
    id: item.sys.id,
    title: f.title,
    slug: f.slug,
    href: `/journal/${f.slug}/`,
    entryNumber: typeof f.entryNumber === 'number' ? f.entryNumber : undefined,
    date: dateFormat.format(new Date(sortDate)),
    sortDate,
    readTime: readTimeFor(f.body),
    lede: f.lede ?? '',
    excerpt: f.excerpt ?? '',
    body: f.body,
    heroImageUrl: absoluteUrl(f.heroImage?.fields?.file?.url),
  };
}

let cache: JournalEntry[] | null = null;

/** All entries, newest first. Cached for the lifetime of one build. */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  if (cache) return cache;

  const res = await client.getEntries({
    content_type: CONTENT_TYPE,
    include: 2,
    limit: 200,
  });

  cache = res.items
    .map(normalise)
    .filter((e) => e.slug && e.title)
    .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

  return cache;
}

/** The newest entry, or null if nothing is published yet. */
export async function getLatestEntry(): Promise<JournalEntry | null> {
  const entries = await getJournalEntries();
  return entries[0] ?? null;
}
