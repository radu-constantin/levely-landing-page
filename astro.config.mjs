// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // `directory` writes /journal/index.html rather than /journal.html, so every
  // page is reachable at a trailing-slash URL — which is the shape the
  // Contentful slugs will produce (/journal/<slug>/).
  build: { format: 'directory' },
});
