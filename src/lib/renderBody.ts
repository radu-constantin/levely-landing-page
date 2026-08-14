import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, MARKS, INLINES, type Document } from '@contentful/rich-text-types';

/**
 * Contentful rich text -> the markup `.post-body` already styles.
 *
 * The renderer's defaults emit plain elements, which is exactly what we want:
 * `p`, `h2`, `h3`, `ul`, `ol`, `blockquote`, `hr`, `a`, `code` are all styled
 * by element in global.css, so nothing here needs a class. Only three things
 * need overriding — see below.
 */

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Tallest a single figure may get before it is narrowed instead. */
const MAX_FIGURE_HEIGHT = 620;
/** `.post` column width — a cap wider than this could never bind. */
const FIGURE_CAP_THRESHOLD = 720;

export function renderBody(body: Document | undefined): string {
  if (!body) return '';

  return documentToHtmlString(body, {
    renderMark: {
      // Defaults are <b> and <i>; the stylesheet targets <strong> and <em>.
      [MARKS.BOLD]: (text) => `<strong>${text}</strong>`,
      [MARKS.ITALIC]: (text) => `<em>${text}</em>`,
    },

    renderNode: {
      // An embedded image becomes the framed figure the design uses, with the
      // asset's Description as the caption.
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const file = (node as any).data?.target?.fields;
        const url: string | undefined = file?.file?.url;
        if (!url) return '';

        const src = url.startsWith('//') ? `https:${url}` : url;
        const caption: string = file.description ?? '';
        const alt: string = file.title ?? caption;

        // The frame takes the asset's own proportions, so nothing is cropped
        // and the space is reserved before the image loads. Assets without
        // dimensions (SVGs, say) fall back to the stylesheet's 16/10.
        const dims = file?.file?.details?.image;
        const w = Number(dims?.width) || 0;
        const h = Number(dims?.height) || 0;

        const style: string[] = [];
        if (w > 0 && h > 0) {
          style.push(`--figure-ratio: ${w} / ${h}`);
          // A portrait screenshot at full column width would run to a couple of
          // thousand pixels tall, so cap how much height one figure can take.
          // Only emit the cap when it would actually bind inside the column.
          const widthAtMaxHeight = Math.round(MAX_FIGURE_HEIGHT * (w / h));
          if (widthAtMaxHeight < FIGURE_CAP_THRESHOLD) {
            style.push(`max-width: ${widthAtMaxHeight}px`);
          }
        }
        const styleAttr = style.length ? ` style="${style.join('; ')}"` : '';

        return [
          '<figure>',
          `<div class="post-figure-frame"${styleAttr}>`,
          `<img src="${esc(src)}?w=1440&fm=webp&q=80" alt="${esc(alt)}" loading="lazy" decoding="async" />`,
          '</div>',
          caption ? `<figcaption>${esc(caption)}</figcaption>` : '',
          '</figure>',
        ].join('');
      },

      // External links get the usual safety attributes.
      [INLINES.HYPERLINK]: (node, next) => {
        const uri: string = (node as any).data?.uri ?? '';
        const external = /^https?:\/\//.test(uri);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${esc(uri)}"${attrs}>${next(node.content)}</a>`;
      },
    },
  });
}
