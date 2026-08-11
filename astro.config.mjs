// @ts-check
import { defineConfig } from 'astro/config';

// Absolute URLs need to know where the site lives. Set SITE_URL in Render (and
// in .env locally) to your public origin, e.g. https://levely.onrender.com —
// without it, canonical/og:url are omitted and the X share link carries only
// the title, with no link back to the article.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  // `directory` writes /journal/index.html rather than /journal.html, so every
  // page is reachable at a trailing-slash URL — which is the shape the
  // Contentful slugs will produce (/journal/<slug>/).
  build: { format: 'directory' },
});
