# FPVBuddy Style Guide

All visual tokens live in `src/styles.css` inside Tailwind CSS `@theme` and local `@font-face` declarations. Keep fonts and assets local (offline PWA — no CDN links).

## Colour tokens (`src/styles.css`)

| Role | Token | Value |
|---|---|---|
| Background / Surface | `--color-background`, `--color-surface` | `#121416` |
| Surface containers | `--color-surface-container-lowest` .. `highest` | `#0c0e10` .. `#333537` |
| On surface / muted | `--color-on-surface`, `--color-on-surface-variant` | `#e2e2e5`, `#c0c7d5` |
| Primary | `--color-primary`, `--color-primary-container` | `#a3c9ff`, `#1493ff` |
| Secondary | `--color-secondary`, `--color-secondary-container` | `#78dc77`, `#00761f` |
| Tertiary / Error | `--color-tertiary`, `--color-error` | `#ffb3ae`, `#ffb4ab` |
| Outline | `--color-outline`, `--color-outline-variant` | `#8a919f`, `#404753` |

## Typography

- Headline (`--font-family-headline`): `Space Grotesk` (`src/assets/fonts/SpaceGrotesk-Variable.woff2`)
- Body / Label (`--font-family-body`, `--font-family-label`): `Inter` (`src/assets/fonts/Inter-Variable.woff2`)
- Icons: `Material Symbols Outlined` (`src/assets/fonts/MaterialSymbolsOutlined-Variable.woff2`)

## Accessibility

- Meet WCAG AA contrast minimums (`>= 4.5:1` normal text) and pass `angular-eslint` template accessibility checks.
