# Levely journal — entry format brief

**How to use this:** paste this whole file into a new chat, then paste your draft
underneath it. The assistant should return the filled-in fields from the
"Output template" section at the bottom, ready to copy into Contentful.

---

## Context

Levely is an iOS focus timer where real-life skills level up like an RPG
character. The journal is a build-in-public log, written by one solo developer
(Radu) working alone against a hackathon deadline. Entries are published from
Contentful and rendered by a static Astro site.

The tone is honest and specific — what got built, what broke, what was wrong the
first time. First person. Short paragraphs. Concrete numbers over adjectives. No
growth tactics, no thought leadership, no motivational filler. It is a log, not a
newsletter.

---

## The fields

Every entry is one Contentful **Journal Entry** record. Nine fields, of which
seven need writing.

### `title` — Short text, required
The headline. Sentence case, no trailing full stop, no markdown.

Aim for **45–65 characters**. It renders in a large serif face and wraps to two
lines around 65; past ~80 it starts looking unwieldy on mobile.

Say the specific thing, not the category. *"First TestFlight build, and
everything it broke"* rather than *"Lessons from beta testing"*.

### `slug` — Short text, required, unique
Lowercase, words separated by hyphens, letters and digits only. Must match
`^[a-z0-9]+(?:-[a-z0-9]+)*$`.

Derive it from the title, dropping filler words. Keep it under ~60 characters.

> `Why I'm building a focus timer that levels you up`
> → `why-im-building-a-focus-timer`

**This is permanent.** It becomes the URL (`/journal/<slug>/`). Once an entry is
published and shared, changing the slug breaks every existing link. Never put a
date or a number in it.

### `entryNumber` — Integer, unique, optional
Counts from the beginning: the first entry ever published is `1`, the newest
carries the highest number. Renders as the gold `ENTRY 7` badge.

It is a label, not the sort key — the index sorts by `publishDate`, so a
back-dated entry lands in the right chronological place without disturbing any
other entry's number. Leave it empty and the badge simply doesn't render.

### `publishDate` — Date & time, required
Drives both the sort order on the index and the displayed date. Date alone is
fine; the time is not shown.

### `lede` — Long text, required
*(Named `intro` if that field was renamed.)*

One or two sentences, roughly **120–200 characters**. Renders as the larger serif
paragraph between the headline and the byline.

It does three jobs, so it has to survive on its own: it is also the page's
`<meta name="description">` and its `og:description` — the grey line under the
headline when the link is shared on X. Write it so it reads as a complete thought
with no surrounding context. No markdown, no links, no line breaks.

### `excerpt` — Long text, required
Two or three sentences, roughly **200–300 characters**. This is the card text on
the journal index, and its only job is to earn the click.

**Must not be a copy of the `lede`.** They sit in different places for different
readers: the excerpt is for someone scanning a list and deciding what to open;
the lede is for someone who already opened it. The excerpt can be more "here is
what is inside"; the lede should be a sharper opening.

### `body` — Rich text, required
The article itself. See the rules below.

### `heroImage` — Media (one image), optional
Only used as the social card image. **1200 × 630** is the right size. Nothing
renders it on the page itself.

### Not fields — do not write these
- **Read time** — computed from the body's word count at build time
- **The `LATEST` pill** — derived from sort position
- **Author / byline** — hardcoded, there is only one writer
- **Published status** — Contentful's own draft/publish handles it

---

## Body rules

The body is Contentful Rich Text. Every element below already has styling waiting
for it in the site's CSS. Anything not on this list has no styling and must not
be used.

**Allowed:** paragraphs, H2, H3, **bold**, *italic*, `inline code`, code blocks,
blockquote, bulleted lists, numbered lists, horizontal rule, hyperlinks, embedded
images.

**Never use:**
- **H1** — the title is the page's only `h1`. Start sections at H2.
- **Tables** — not styled, they will look broken.
- **Embedded entries** — nothing renders them.

**Structure.** H2 for sections, H3 only if a section genuinely needs
sub-sections (most do not). Two to four H2s in a typical entry. Keep paragraphs
to three or four sentences — the measure is narrow and long blocks read as walls.

**Italic renders green**, in the same colour as the site's accent. That makes it
loud. Use it for the *thing itself* being emphasised — "what levels up is
*guitar*" — not for stressed adverbs. A couple per entry at most.

**Blockquote gets a gold left rule** and larger serif type. It works best for a
standalone claim you want to slow the reader down on, not necessarily for
quoting someone else.

**Images.** Each one needs a caption — in Contentful the caption comes from the
asset's **Description** field, so fill that in when uploading, not just the
title. Captions render small and grey below the image. Images are framed at 16:10
and cropped to fill, so avoid tall screenshots. When drafting, mark the intended
position and write the caption text.

**Links** open in the same tab and render green. Fine to use, don't pile them up.

---

## Getting the body into Contentful

The assistant should return the body as **Markdown**, which is the most readable
format to review.

To import it: paste into the Rich Text field. If your clipboard carries
formatting (copying from a *rendered* markdown preview rather than raw text),
Contentful keeps the headings, lists and bold. If you paste raw markdown it will
land as plain text — in that case use the editor's shortcuts to fix structure
(`##` + space makes an H2, `-` + space makes a list item).

Images cannot be pasted. Upload each as an asset, fill in its **Description**
as the caption, then embed it at the marked position.

---

## Output template

Return exactly this, filled in:

```
TITLE
<title>

SLUG
<slug>

ENTRY NUMBER
<n>

PUBLISH DATE
<YYYY-MM-DD>

LEDE
<one or two sentences>

EXCERPT
<two or three sentences>

BODY
<markdown — H2/H3, paragraphs, lists, quotes, code, [IMAGE: description | caption text]>
```

Then flag anything that needed a judgement call: a title that had to be
shortened, a lede invented because the draft had no natural opening, an image
whose placement was guessed, or any content that used a disallowed element and
had to be reshaped.

Preserve the author's voice and wording. Restructure and trim for the format;
do not rewrite the prose into something smoother than it was.
