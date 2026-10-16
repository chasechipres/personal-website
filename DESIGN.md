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
| `--accent` | `#0071e3` (Apple) | `#2997ff` (Apple) |
| `--border` | `rgba(30,25,25,.10)` ~ | `rgba(245,245,247,.10)` ~ |

The accent is the only color. Use it for primary buttons and links, nothing else.
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
- **Buttons:** pill, `border-radius: 980px`, padding 11px 21px, 17px/400. Primary: `--accent` fill, white text.
  Secondary: transparent, 1px `--accent` border and text. Min tap height 44px.
- **Cards:** `--surface`, radius 12px (images inside 8px), 1px `--border`,
  shadow `0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.05)` ~ (none in dark mode).
  Whole card is the link; image on top, title 21px/600, one muted line below.

## Motion
Minimal. Hover and press: color, opacity and shadow only, 150ms ease-out ~.
No entrance animations, no layout transitions, no parallax. Respect `prefers-reduced-motion`.

## Never
Purple or blue gradients, gradient text, glow, neon, particles, glassmorphism beyond the nav,
pure `#000` or `#fff` page backgrounds, emoji as icons, placeholder text.
