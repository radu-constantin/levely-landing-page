# Handoff: Levely — Email-Capture Landing Page

## ⚡ Ready-to-deploy files (start here)
This bundle now includes a **working static implementation** you can ship as-is:
- **`index.html`** — the page markup
- **`styles.css`** — all styles + animations (+ responsive stacking & `prefers-reduced-motion`)
- **`app.js`** — validation, submit → capture-endpoint POST, success state, and a `CONFIG` block at the top

**To launch:** open `app.js`, set `CONFIG.formEndpoint` to your capture URL (Formspree/Buttondown/Kit), fill in `articleUrl` + `handle`, then drop the three files on Netlify/Vercel/Cloudflare Pages/GitHub Pages. Until `formEndpoint` is set, submit fakes success and logs a console warning (local-testing mode).

The rest of this README is the full design spec (exact tokens, measurements, states) — reference it if you rebuild inside an existing framework/codebase rather than shipping the static files. `Levely.dc.html` is the original prototype (proprietary format; reference only).

## Overview
A single-screen landing page for **Levely**, an iOS focus timer where real-life skills level up like an RPG character. The page has exactly one job: **capture emails** from people who will follow the build-in-public journey and receive founding/early access at launch. It is intentionally minimal — one screen, one conversion point. No CMS, no multi-page site, no routing.

The emotional pitch: other focus apps reward you with a meaningless proxy (a growing plant/pet). Levely makes your own growth the reward. The hero visual is a glowing green "XP potion" vial (mirrors the app's real XP vial) floating inside a rotating arcane ring — "light fantasy, not costume-level nerdy."

> **Trademark constraint:** No Elder Scrolls / Morrowind names, art, or trademarked assets anywhere. The "skill-by-use" mechanic is fine to convey generically; the inspiration stays out of branding.

## About the Design Files
The file in this bundle (`Levely.dc.html`) is a **design reference created in HTML** — a working prototype showing the intended look and behavior. It is **not** production code to ship directly. It is authored in a proprietary component format (`.dc.html`) that depends on a runtime (`support.js`) and a design-system stylesheet; **do not attempt to deploy it as-is**.

Your task is to **recreate this design in the target environment** using its established patterns. Since this is a brand-new standalone marketing page with no existing codebase, the recommended implementation is a **single static `index.html`** (plain HTML/CSS + a few lines of vanilla JS) — this matches the "ship fast and cheap, an afternoon not a project" constraint and deploys to Netlify / Vercel / Cloudflare Pages / GitHub Pages by drag-and-drop. A framework (Next.js, Astro, etc.) is overkill for one screen but fine if you already have a setup. All measurements, colors, and copy below are exact — build from this README alone.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are specified. Recreate the UI pixel-accurately. The only visual elements that are decorative approximations (and can be re-tuned) are the ambient CSS animations (starfield drift, vial wobble, rising bubbles, sparkles) — match the *feel*, exact timings are guidance.

---

## Screen: Landing (single view)

### Purpose
Communicate the product in one glance and collect an email address. Success state confirms the signup in-page (no redirect).

### Layout
- **Full-viewport section**, `min-height: 100vh`, `overflow: hidden`, dark radial-gradient background (see tokens). Everything is centered vertically within it.
- **Z-order (back to front):** background gradient → two drifting starfield layers → two ambient radial "bloom" glows → inset vignette → content layer (`z-index: 1`).
- **Content layer** is a vertical flex column with page padding `clamp(20px, 4vw, 40px)` vertical / `clamp(20px, 5vw, 64px)` horizontal:
  - **Header** (flex row, space-between): brand mark left, status badge right.
  - **Main** (flex: 1, centered): a **2-column CSS grid** —
    - `grid-template-columns: minmax(0, 300px) minmax(0, 520px)`
    - `gap: clamp(40px, 7vw, 104px)`
    - `align-items: center; justify-content: center`
    - `padding: clamp(28px, 5vh, 56px) 0`
    - **Left column** = the potion visual + skill chips (centered stack).
    - **Right column** = pitch copy + email capture + footer links (left-aligned, `max-width: 520px`).
- **Responsive:** below ~820px the two columns should stack (potion on top, copy below), each centered. (The prototype uses a fixed grid; implement a `@media (max-width: 820px)` that sets `grid-template-columns: 1fr` and reduces the headline clamp.)

### Components

#### 1. Brand mark (header, left)
- Row, `gap: 11px`, vertically centered.
- Sparkle glyph `✦`, `font-size: 16px`, color `#f2cf83`, `text-shadow: 0 0 12px rgba(242,207,131,.7)`.
- Wordmark **"LEVELY"**: font **Cinzel** 600, `font-size: 22px`, `letter-spacing: 0.14em`, filled with a vertical gold gradient via background-clip: `linear-gradient(180deg, #fbe6bd, #e0b466)` clipped to text (`color: transparent`), `text-shadow: 0 0 24px rgba(242,207,131,.35)`.

#### 2. Status badge (header, right)
- Text **"LVL I · FOUNDING"**, font Cinzel 600, `font-size: 10px`, `letter-spacing: 0.16em`.
- `padding: 6px 13px`, `border-radius: 99px`, `border: 1px solid rgba(242,207,131,.4)`, `background: rgba(242,207,131,.06)`, color `#f2cf83`.

#### 3. "Now training" eyebrow (left column, top)
- Row, `gap: 9px`. Font Cinzel 500, `font-size: 11px`, `letter-spacing: 0.22em`, `text-transform: uppercase`, color `#c7b8ef`.
- Leading diamond `◇` in `#5ff0a3`. Text: **"Now training · Programming"**.

#### 4. Potion visual (left column, centerpiece)
Container: `position: relative; width: clamp(150px, 42vw, 178px)`, with a slow vertical "breathe" float (`lv-breathe`, 7s, translateY 0 → -10px → 0).

Layers, all absolutely positioned & centered on the container:
- **Arcane ring (outer):** SVG circle, `width: 186%` of container, aspect 1:1, centered, rotating `lv-spin` 70s linear infinite. Two concentric circles: r=96 `stroke rgba(242,207,131,.32)` width 0.7 `stroke-dasharray: 1.5 7`; r=88 `stroke rgba(242,207,131,.14)` width 0.5. (viewBox 0 0 200 200)
- **Arcane ring (inner):** `width: 150%`, rotating **reverse** `lv-spin-rev` 95s. One circle r=96 `stroke rgba(95,240,163,.28)` width 0.6 `stroke-dasharray: 0.6 11`.
- **Glow aura:** ellipse `width: 150%; height: 78%`, `border-radius: 50%`, `background: radial-gradient(closest-side, rgba(51,221,133,.5), rgba(51,221,133,.12) 56%, transparent 74%)`, pulsing opacity `lv-aura` 5.5s (0.45 → 0.85 → 0.45).
- **Floating motes** (5, each absolutely placed around the vial):
  - "+12 XP" — left:-20px top:60%, Cinzel 600 12px, `#8df2bd`, glow shadow, animation `lv-mote` 4.6s (rise + fade).
  - "+8 XP" — right:-22px top:42%, Cinzel 600 12px, `#f5d98b`, `lv-mote` 5.6s delay 1.8s.
  - `✦` left:-8px top:34%, 13px `#f2cf83`, `lv-twinkle` 3.4s delay .4s.
  - `✧` right:-4px top:66%, 11px `#7ef2b6`, `lv-twinkle` 4s delay 1.2s.
  - `✦` right:12% top:12%, 10px `#f5d98b`, `lv-twinkle` 3.1s delay 2.1s.
- **Glass body** (`z-index: 2`): `width: 100%`, `aspect-ratio: 178/452`, `border-radius: 999px`, `overflow: hidden`.
  - `border: 1.5px solid rgba(232,224,255,.42)`.
  - `background: linear-gradient(180deg, rgba(150,116,236,.4) 0%, rgba(90,80,150,.24) 30%, rgba(28,26,58,.5) 58%, rgba(18,18,44,.62) 100%)`.
  - `box-shadow: 0 0 54px rgba(51,221,133,.34), 0 0 120px rgba(51,221,133,.16), inset 0 2px 18px rgba(255,255,255,.16), inset 0 -28px 56px rgba(0,0,0,.4)`.
  - **Glass highlight** inside: vertical streak, top:6% left:20% width:12% height:74%, `border-radius: 99px`, white gradient `linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.05) 60%, transparent)`, `filter: blur(1px)`.
  - **Liquid** (child): `position: absolute; left:0; right:0; bottom:-8px; height: calc(<LEVEL>% + 8px)` where LEVEL is the fill percentage (default **60**). `background: linear-gradient(180deg, #37e089 0%, #28c674 58%, #1e9d5e 100%)`, `box-shadow: 0 -6px 30px rgba(51,221,133,.5)`, `overflow: visible`, gentle `lv-bob` 8s (translateY 0 → +4px → 0 — note: bobs **downward only** so the vial floor never shows a gap; the -8px bottom offset also guarantees full coverage).
    - **Wobbling surface:** a 200%-wide SVG wave strip at the liquid's top edge, sliding `lv-wobble` 7s alternate (translateX 0 → -50%). SVG path (viewBox 0 0 400 32, `preserveAspectRatio: none`, height 32px, positioned top:-28px): `M0 13 C 50 2, 150 24, 200 13 C 250 2, 350 24, 400 13 L400 32 L0 32 Z`, `fill: #35dd85`.
    - **Bubbles** (5 rising circles, `lv-rise` 4.4–6.5s with staggered delays, translateY 0 → -300px + fade): sizes 16/10/7/6/5px at left 28%/58%/44%/70%/18%, bottom:8%. Dark bubbles `rgba(20,44,32,.4–.45)`; two "spark" bubbles are light `rgba(190,255,220,.5–.55)` / gold `rgba(245,217,139,.6)` with matching glow shadow.
- **Ground reflection:** below vial, bottom:-26px, `width: 70%; height: 24px`, centered ellipse `radial-gradient(closest-side, rgba(51,221,133,.4), transparent 72%)`, `filter: blur(3px)`.

> The prototype currently has **no cork** and **no separate meniscus line** (both were removed during editing). If you want the fuller "potion" read, a corked stopper at the vial mouth and a bright meniscus line at the liquid surface are easy additions — optional.

#### 5. Skill chips / "inventory" (left column, below potion)
- Flex row, wrap, centered, `gap: 8px`, `max-width: 280px`, `margin-top: 8px`.
- Four chips, each: inline-flex, `gap: 7px`, `padding: 5px 12px`, `border-radius: 99px`, `background: rgba(242,207,131,.05)`, `border: 1px solid rgba(242,207,131,.18)`, `font-size: 12px`, color `#e6e0f5`.
  - Leading diamond `◆` in `#5ff0a3`, `font-size: 9px`.
  - Skill name (body font).
  - Level tag: Cinzel 10px, `letter-spacing: 0.06em`, color `#f2cf83`, `font-variant-numeric: tabular-nums`, format **"LV N"** (non-breaking space).
- Data: Guitar LV 4 · Programming LV 7 · Writing LV 6 · French LV 2.

#### 6. Section eyebrow (right column, top)
- Text **"A focus timer for main characters"**. Cinzel 500, `font-size: 12px`, `letter-spacing: 0.24em`, `text-transform: uppercase`, color `#f2cf83`, `margin-bottom: 18px`.

#### 7. Headline (right column)
- Two lines: **"Level up your"** / **"*real-life* skills."** ("real-life" is italic, color `#ffe9b8`; rest `#f6f1ff`).
- Font **Cormorant Garamond** 600, `font-size: clamp(44px, 6vw, 72px)`, `line-height: 0.98`, `letter-spacing: -0.01em`, `text-shadow: 0 0 40px rgba(150,116,236,.35)`, `margin: 0 0 20px`.

#### 8. Hook line (right column)
- **"You're the main character. Start leveling."**
- `font-size: clamp(17px, 2vw, 20px)`, `line-height: 1.4`, weight 500, color `#a8e9c6`, `margin: 0 0 16px`.

#### 9. Pitch paragraph (right column)
- Copy (exact): *"Every other focus app grows you a little cartoon plant while you work. Cute. But the plant can't play guitar. Levely turns each focus session into XP for the skills you \*actually\* want to get good at — the reward is you."* ("actually" is italic, color `#8df2bd`.)
- `font-size: 15px`, `line-height: 1.64`, color `#b8b2cf`, `max-width: 47ch`, `margin: 0 0 30px`.

#### 10. Email capture (right column) — the conversion point
Container `max-width: 460px`. Two mutually exclusive states:

**Default state (form):**
- `<form>` flex row, `gap: 10px`, `align-items: stretch`.
- **Email input:** `type="email"`, `required`, `placeholder="you@wherever.com"`, `aria-label="Email address"`. `flex: 1`, `min-height: 52px`, `padding: 0 16px`, `font-size: 15px`, color `#eef1fb`, `background: rgba(255,255,255,.045)`, `border: 1px solid rgba(242,207,131,.25)`, `border-radius: 12px`, `outline: none`, `caret-color: #5ff0a3`.
  - **Focus:** `border-color: #5ff0a3; box-shadow: 0 0 0 3px rgba(51,221,133,.18)`.
- **Submit button:** label **"Get founding access"** (→ **"Casting…"** while submitting). `min-height: 52px`, `padding: 0 22px`, `white-space: nowrap`, Cinzel 600, `font-size: 14px`, `letter-spacing: 0.04em`, color `#08221a`, `background: linear-gradient(150deg, #5ff0a3, #22c072)`, no border, `border-radius: 12px`, `cursor: pointer`, `box-shadow: 0 6px 24px rgba(51,221,133,.35)`.
  - **Hover:** `filter: brightness(1.07); box-shadow: 0 8px 30px rgba(51,221,133,.55)`.
  - **Active:** `filter: brightness(.97)`.
  - **Disabled** while submitting.
- **Error line** (conditional, below form): `margin-top: 10px`, `font-size: 12.5px`, color `#ffb4a8`.
- **CTA microcopy** (below): `margin-top: 14px`, `font-size: 12.5px`, `line-height: 1.55`, base color `#8a84a2`.
  - Part 1 (`#c7c1dd`): "Follow the build, get founding access at launch."
  - Part 2 (`#f2cf83`): "Only N founding spots." (N = founding-spots count, default 100; hide sentence if 0.)
  - Part 3 (`#8a84a2`): "It's just me — no spam, no VC deck, no plant."

**Success state** (replaces the form after submit):
- Row, `gap: 14px`, `padding: 16px 18px`, `border-radius: 14px`, `background: rgba(51,221,133,.08)`, `border: 1px solid rgba(51,221,133,.35)`, `box-shadow: 0 0 44px rgba(51,221,133,.16)`. Fades in (`lv-fadein` .5s: opacity 0→1, translateY 14px→0).
- **Check badge:** 34×34 circle, `background: linear-gradient(150deg, #5ff0a3, #22c072)`, `✓` in `#08221a` 17px 700, glow shadow.
- **Title:** "You're in. Welcome, adventurer." — Cormorant Garamond 600, `font-size: 20px`, color `#eafff3`.
- **Body:** "+50 XP for good taste. Founding access lands in your inbox at launch — I'll write to you from the trenches until then." — `font-size: 13px`, `line-height: 1.55`, color `#9fd8b9`.

#### 11. Footer links (right column, bottom)
- Flex row, wrap, `gap: 10px 20px`, `margin-top: 34px`, `font-size: 13px`.
- Link 1: **"Read the Day 1 journal →"**, color `#8df2bd`, no underline; hover underline. `href` = article URL (placeholder `#` for now).
- Separator: `✦` in `#565073`.
- Link 2: **"@levely on X"** (handle configurable), color `#9d97b8`; hover `#e6e0f5`. `href = https://x.com/<handle without @>`.

---

## Interactions & Behavior
- **Submit flow:**
  1. On form submit, `preventDefault()`.
  2. Trim the email; validate against `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`. On fail → show error "That doesn't look like an email. Try again, adventurer." and stop.
  3. POST to the capture endpoint (see State/Config). Set submitting → button shows "Casting…" and is disabled.
  4. On HTTP OK → switch to success state. On network/non-OK error → clear submitting, show error "Something glitched on my end — try again in a sec."
- **POST format** (prototype default): `fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: new URLSearchParams({ email }) })`. This is form-encoded and works directly with Formspree, Buttondown, Kit/ConvertKit, and most no-backend capture services. Adjust body/headers to whatever service you wire up.
- **Animations** (all decorative, `prefers-reduced-motion` should disable them): starfield drift 180s/260s linear; vial breathe 7s; ring spin 70s / reverse 95s; aura pulse 5.5s; wobble 7s alternate; bubbles rise 4.4–6.5s; motes/twinkle 3.1–5.6s; success fade-in .5s. Timings are for feel — not load-bearing.
- **No routing, no other pages.** Success is in-page only.

## State Management
Minimal — three flags plus config:
- `submitted: boolean` — false → form, true → success card.
- `submitting: boolean` — disables button, swaps label to "Casting…".
- `error: string` — validation/network message; empty = hidden.

**Config values** (were tweakable props; bake in or expose as env/config):
- `formEndpoint: string` — **the capture URL. Required for emails to actually store.** Empty = prototype shows success without sending (dev only). ⚠️ This is a hard product requirement: the page is useless if it drops emails. Wire a real endpoint (Formspree/Buttondown/Kit or a tiny backend) before launch.
- `liquidLevel: number` (0–100, default 60) — vial fill %.
- `foundingSpots: number` (default 100) — scarcity count; 0 hides the sentence.
- `handle: string` (default `@levely`) — X handle.
- `articleUrl: string` (default `#`) — Day 1 journal link.

## Design Tokens

**Colors**
- Background gradient: `radial-gradient(135% 108% at 50% 2%, #2a1e52 0%, #1c1440 34%, #120c2d 64%, #090619 100%)`
- Text — primary heading `#f6f1ff`; body `#b8b2cf`; muted `#8a84a2`; softer muted `#c7c1dd`
- Green (XP) accent: base `#35dd85` / `#5ff0a3`; liquid gradient `#37e089 → #28c674 → #1e9d5e`; button gradient `#5ff0a3 → #22c072`; button text `#08221a`; mint text `#8df2bd` / `#a8e9c6` / `#9fd8b9`
- Gold accent: `#f2cf83`; wordmark gradient `#fbe6bd → #e0b466`; italic-headline gold `#ffe9b8`; mote gold `#f5d98b`
- Violet: purple bloom `rgba(150,116,236,.18)`; eyebrow lilac `#c7b8ef`
- Error text: `#ffb4a8`
- Glass border: `rgba(232,224,255,.42)`

**Typography**
- Display/headline & success title: **Cormorant Garamond** (600), Google Fonts.
- Wordmark, eyebrows, level tags, button: **Cinzel** (500/600), Google Fonts.
- Body/UI text: system sans (Inter or the codebase default is fine).
- Import: `https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap`

**Radius:** inputs/button 12px; success card 14px; chips/badge 99px (pill); vial 999px.

**Spacing** (key gaps): page pad `clamp(20px,4vw,40px)`/`clamp(20px,5vw,64px)`; grid gap `clamp(40px,7vw,104px)`; left-column stack gap 26px; chips gap 8px; form gap 10px.

**Shadows/glows:** vial `0 0 54px rgba(51,221,133,.34), 0 0 120px rgba(51,221,133,.16)` + insets; button `0 6px 24px rgba(51,221,133,.35)`; success card `0 0 44px rgba(51,221,133,.16)`; text glows on gold/green glyphs `0 0 8–12px` of the same hue.

## Assets
- **No image assets.** Everything is CSS/SVG-drawn (vial, ring, glows) + Unicode glyphs (`✦ ✧ ◇ ◆ ✓`). The starfield is pure CSS radial-gradients.
- Fonts from Google Fonts (Cinzel, Cormorant Garamond).
- The reference app screenshot that inspired the vial is in the project at `uploads/` — for visual reference only, not used on the page.
- Icons: if you prefer real icon assets over glyphs, the design system specifies **Phosphor icons**.

## Files
- `Levely.dc.html` — the design prototype (proprietary `.dc.html` component format; reference only, do not deploy). Open it in the design tool to see it live; read the markup for exact structure. The single `<div>` under `</helmet>` is the whole page; the `<script>` at the bottom holds the JS logic (validation, submit, state).

## Recommended implementation checklist
1. Single `index.html` + inline `<style>` + small `<script>`. Add the Google Fonts `<link>`.
2. Recreate the layout/tokens above; add a `@media (max-width: 820px)` stacking rule and a `prefers-reduced-motion` block that disables animations.
3. Wire `formEndpoint` to a real capture service (Formspree is the fastest zero-backend option) and confirm a test email lands.
4. Fill in the real Day 1 article URL and X handle.
5. Deploy as a static file (Netlify/Vercel/Cloudflare Pages/GitHub Pages).
