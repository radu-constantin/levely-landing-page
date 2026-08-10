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

        return [
          '<figure>',
          '<div class="post-figure-frame">',
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
