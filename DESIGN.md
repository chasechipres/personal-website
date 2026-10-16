# DESIGN.md

Calm, warm, product-first. Apple's type and buttons, Dropbox's warm neutrals,
Airbnb's cards, Robinhood-style dark mode. One accent color. `~` = estimate,
not measured from the reference sites.

## Color
| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f7f5f2` (Dropbox) | `#110e08` (Robinhood) |
| `--surface` (cards) | `#ffffff` | `#1c180d` (Robinhood) |
| `--panel` (alt sections) | `#eee9e2` (Dropbox) | `#1c180d` |
| `--text` | `#1e1919` (Dropbox) | `#f5f5f7` (Apple) |
| `--muted` | `#5f574c` ~ | `#a8a29a` ~ |
| `--accent` | `#2a2420` (warm ink) | `#c9c1b4` (soft warm off-white) |
| `--border` | `rgba(30,25,25,.10)` ~ | `rgba(245,245,247,.10)` ~ |

The palette is monochrome and warm: the accent is a soft ink/off-white, not a hue (bright blues read
too loud on the warm backgrounds). Use it for primary buttons, links and the monogram, nothing else.
Dashboard gain/loss may add green `#1f9d55` ~ and red `#d64545` ~, on numbers only.

## Type
Font: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`.
| Role | Size / line height | Weight | Tracking |
|---|---|---|---|
| Hero | 56/60 (mobile 40/44 ~) | 600 | -0.28px |
| Section title | 40/44 (mobile 32/36 ~) | 600 | 0 |
| Lead | 28/32 | 400 | 0.196px |
| Subhead | 21/25 | 400 | 0.231px |
| Body | 17/25 ~ | 400 | -0.374px |
| Small | 14/18 | 400 | -0.224px |
| Caption | 12/16 | 400 | -0.12px |

Numbers in the dashboard: `font-variant-numeric: tabular-nums`.

## Layout and spacing
- 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 ~.
- Text column max 980px ~; card grid max 1200px ~; 16px side gutter on mobile, 24px+ on desktop.
- Sections: 96px ~ vertical padding on desktop, 64px ~ on mobile.

## Components
- **Nav:** sticky, 44px tall, `--bg` at 80% opacity with `backdrop-filter: saturate(1.8) blur(20px)` (Apple).
- **Buttons:** pill, `border-radius: 980px`, padding 11px 21px, 17px/400. Primary: `--accent` fill, `--bg` text.
  Secondary: transparent, 1px `--accent` border and text; on hover, fills like primary. Min tap height 44px.
- **Cards:** `--surface`, radius 12px (images inside 8px), 1px `--border`,
  shadow `0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.05)` ~ (none in dark mode).
  Whole card is the link; image on top, title 21px/600, one muted line below.
- **Profile links** (GitHub, LinkedIn, email): secondary pill buttons under the hero line and plain links
  in the footer. Never cards; the card grid is for projects only.
- **Preview card (coming soon):** same shell and size as a card, but not a link: no hover, no press.
  The image area is a wireframe of what's coming (e.g. 3 stat tiles, a line chart, 3-4 rows) drawn as
  plain shapes in `--muted`/`--border` at 50% opacity: no text, no numbers, no accent or gain/loss color.
  Pill badge top-right ("Live dashboard — coming soon", Caption size). Wireframe is one `role="img"`
  with an `aria-label`. No shimmer or animation. When the feature ships, it becomes a normal card in place.
- **Theme toggle:** icon button in the nav (44px target, sun/moon icon, `aria-label` says the mode it switches to).
  Default follows the system (`prefers-color-scheme`); a click sets `data-theme="light|dark"` on `<html>`
  and saves it to `localStorage`. An inline script in `<head>` applies the saved theme before first paint
  (no flash). Switching themes is instant, never animated.

## Mobile
Build mobile-first; every page must pass at 375px wide before desktop polish.
- Breakpoints: base styles for phones, `min-width: 768px` tablet, `min-width: 1024px` desktop.
- No horizontal page scroll. Wide content (dashboard tables, charts) scrolls inside its own container
  or reflows into stacked cards.
- Nav: below 768px, links collapse into a menu button (44px target); the menu is a full-width sheet.
- Tap targets at least 44x44px with 8px between them. Body text and form inputs never below 16px
  (inputs under 16px make iOS zoom in); Small and Caption are for labels only.
- Card grid: 1 column on phones, 2 on tablet, 3 on desktop.
- Use `100dvh`, not `100vh`, and respect `env(safe-area-inset-*)` for the sticky nav and anything fixed.
- Layout holds at 200% text zoom. Check light and dark mode on a real phone before shipping.

## Motion
Minimal. One easing everywhere: `cubic-bezier(0.2, 0, 0, 1)`. No bounce or elastic.
- Durations: 150ms hover/press, 200ms menus and sheets, never over 300ms.
- Hover: color, opacity and shadow only. Press: buttons and cards `scale(0.98)`.
- Mobile menu: sheet fades in and moves 8px down over 200ms; closes in 150ms.
- Live trade feed: new rows appear instantly; background fades from 10% `--accent` to clear over 600ms. No sliding rows.
- P&L numbers: swap instantly, `tabular-nums`, no count-up. Gain/loss color tints the number only.
- Focus rings appear instantly, never animated.
- No entrance animations, layout transitions or parallax.
- `prefers-reduced-motion`: all transitions 0ms; the new-row tint shows for 600ms, then clears without fading.

## Never
Purple or blue gradients, gradient text, glow, neon, particles, glassmorphism beyond the nav,
pure `#000` or `#fff` page backgrounds, emoji as icons, placeholder text.
