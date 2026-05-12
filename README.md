# DMK Apparel

A modern, streetwear-styled marketing + storefront site for **DMK Apparel** — a brand built around mental health awareness and using fitness as a tool for recovery.

> "Mental strength is trained."

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (CSS-based theme — no `tailwind.config.ts`)
- **shadcn/ui** primitives (Button, Sheet, Card, Badge, Dialog, Separator)
- **Framer Motion** for quiet scroll reveals and hover lifts
- **Google Fonts** — Bebas Neue (display) + Inter (body) via `next/font`

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build (Turbopack)
npm run start   # serve the build
```

> **Note on Node:** This was scaffolded with Node 24 (Next 16 requires Node ≥ 20.9).

## Project structure

```
app/
  layout.tsx         Global shell — Nav + Footer + fonts + metadata
  page.tsx           Home — Hero, story teaser, featured products, mission band
  shop/page.tsx      Catalog grid with type filter (?type=hoodie etc.)
  product/[slug]/    Product detail with design/color/size/qty pickers
  story/page.tsx     Founder's story
  checkout/page.tsx  TEMPORARY "Coming Soon" placeholder — no payment
  not-found.tsx      Custom 404
  sitemap.ts         Auto-generated sitemap.xml
  robots.ts          Auto-generated robots.txt
  icon.png           Favicon (DMK crest)
  globals.css        Brand palette, fonts, grain utility, shadcn vars
components/
  Nav.tsx            Sticky top nav (mobile = shadcn Sheet)
  Footer.tsx         Socials only — Instagram + TikTok
  Hero.tsx           Full-bleed dark hero
  ProductCard.tsx    Grid card with hover-lift
  ProductDetail.tsx  Client-side picker UI for product page
  MissionBand.tsx    Awareness-only mission section
  GreenRibbon.tsx    Inline SVG ribbon mark
  ui/                shadcn primitives
lib/
  products.ts        Single source of truth for the catalog
  utils.ts           shadcn `cn()` helper
public/
  brand/             DMK crest logos (silver + gold)
  products/          Product photography (see public/products/README.md)
```

## Deploy to Vercel (manual)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Next.js** (auto-detected). No env vars needed.
4. Click **Deploy**.
5. Add your custom domain in Vercel → Project → Settings → Domains.

## TODO before launch

- [ ] **Real checkout** — the `/checkout` page is a placeholder pointing customers to Instagram / TikTok DMs. Replace with Shopify, Stripe Checkout, Snipcart, or similar.
- [ ] **Individual product photos** for every design × colorway. Currently only 4 photos exist (front/back of one black hoodie + one black tee); the catalog reuses these as placeholders. See [`public/products/README.md`](public/products/README.md) for the full asset map and what's missing (Strength Over Survival, Iron Over Illness, Mental Strength is Trained variants, Load The Bar red, white/grey/tan colorways, long-sleeve, trucker hats).
- [ ] **Logo source files** — the crest in `public/brand/` was extracted from the brief PDF. A clean SVG or higher-res transparent PNG would prevent pixelation at larger sizes.
- [ ] **Custom domain** + production OG image (currently OG points to the silver crest).
- [ ] **Analytics** — add Vercel Analytics or Plausible.
- [ ] **Email signup** for restock notifications (Resend + a simple Server Action would be enough).
- [ ] If product copy/tagline-per-design isn't quite right, edit the `tagline` fields in `lib/products.ts`.

## Brand constraints (encoded throughout the codebase)

- **Awareness-only messaging.** No "X% of proceeds donated" claims anywhere.
- **Contact = Instagram + TikTok only.** No email is shown on the site (none was provided in the brief).
- **Dark, gritty, condensed streetwear** — not glossy, not corporate.

## Notes on Next.js 16 specifics

This project uses Next.js 16. A few things that differ from earlier versions:

- `params` and `searchParams` are **Promises** — must be `await`-ed.
- **Turbopack is the default** build engine.
- **Tailwind v4** uses `@theme` in `app/globals.css` for theming. There is no `tailwind.config.ts`.
- `lucide-react` brand icons (Instagram, TikTok, etc.) have been removed — those are inlined as SVG in `Footer.tsx` / `checkout/page.tsx`.

If you upgrade further, see `node_modules/next/dist/docs/01-app/02-guides/upgrading/`.
