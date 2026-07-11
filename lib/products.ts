// Single source of truth for DMK Apparel product catalog.
//
// Catalog model
// -------------
// Each design = its own product. A product carries multiple dimensions of
// customer choice that are independent of each other:
//
//   1. PRINT COLOR (Colorway, via design.imagesByColorway) — the ink color on
//      the design (orange / green / pink / gold). Products with a single print
//      hide this picker. For sweatpants the colorway IS the garment color.
//   2. SHIRT COLOR (product.shirtColors) — the garment fabric color
//      (black / white / tan). Independent of print color; the customer can
//      mix any print onto any shirt color. The orange Load-The-Bar hoodie is
//      the only one with a tan option, expressed via shirtColorsByPrintColor.
//   3. PLACEMENT (product.placements) — every hoodie/shirt is now DMK crest on
//      the front + design on the back (one style, flat priced), so the
//      placement picker is hidden.
//   4. SIZE — universal apparel sizes (S–3XL); sweatpants run S–2XL; hats and
//      backpacks are one-size.
//
// Apparel colorway image arrays are ordered [back, front] — design-bearing
// back first, DMK crest front second. Single-image arrays for products without
// a front/back pair (long sleeves, sweatpants, hats, backpacks).

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;
export type Size = (typeof SIZES)[number];

// Some products run a reduced size range (e.g. sweatpants are S–2XL).
export const SIZES_S_TO_2XL = ["S", "M", "L", "XL", "2XL"] as const;

export type Colorway =
  | "black"
  | "white"
  | "grey"
  | "tan"
  | "orange"
  | "red"
  | "green"
  | "pink"
  | "gold";

export const COLORWAY_LABEL: Record<Colorway, string> = {
  black: "Black",
  white: "White",
  grey: "Grey",
  tan: "Tan",
  orange: "Orange",
  red: "Red",
  green: "Green",
  pink: "Pink",
  gold: "Gold",
};

export const COLORWAY_HEX: Record<Colorway, string> = {
  black: "#0a0a0a",
  white: "#f5f5f5",
  grey: "#9ca3af",
  tan: "#c8a679",
  orange: "#ea580c",
  red: "#dc2626",
  green: "#16a34a",
  pink: "#ec4899",
  gold: "#d4af37",
};

export type ProductType =
  | "hoodie"
  | "short-sleeve"
  | "long-sleeve"
  | "sweatpants"
  | "hat"
  | "backpack";

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  hoodie: "Hoodie",
  "short-sleeve": "Short Sleeve",
  "long-sleeve": "Long Sleeve",
  sweatpants: "Sweatpants",
  hat: "Trucker Hat",
  backpack: "Backpack",
};

export type Placement = "front-only" | "back-with-crest";

export const PLACEMENT_LABEL: Record<Placement, string> = {
  "front-only": "Design on Front",
  "back-with-crest": "DMK Crest Front + Design on Back",
};

export const PLACEMENT_BLURB: Record<Placement, string> = {
  "front-only": "Main design printed on the front. No back print.",
  "back-with-crest":
    "Small DMK crest on the front-left chest, main design on the back.",
};

export type PlacementOption = {
  id: Placement;
  price: number;
};

export type Design = {
  id: string;
  name: string;
  imagesByColorway: Partial<Record<Colorway, string[]>>;
  tagline?: string;
};

export type Product = {
  slug: string;
  type: ProductType;
  name: string;
  placements: PlacementOption[];
  /** Shirt fabric colors — independent of print color. Absent = no picker. */
  shirtColors?: Colorway[];
  /** Per-print-color overrides for shirt colors (e.g. orange print also offers tan). */
  shirtColorsByPrintColor?: Partial<Record<Colorway, Colorway[]>>;
  /** Restrict this product to a reduced size range. Absent = full SIZES. */
  sizes?: readonly Size[];
  /** Short "limited drop" note shown as a badge (e.g. "July only"). */
  limitedNote?: string;
  designs: Design[];
};

// --- helpers --------------------------------------------------------------

export function getDesignColorways(d: Design): Colorway[] {
  return Object.keys(d.imagesByColorway) as Colorway[];
}

export function getDesignImages(d: Design, c: Colorway): string[] {
  return (
    d.imagesByColorway[c] ??
    Object.values(d.imagesByColorway)[0] ??
    []
  );
}

export function getPrimaryImage(d: Design): string {
  const first = Object.values(d.imagesByColorway)[0];
  return first?.[0] ?? "/brand/logo-silver.png";
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllColorways(product: Product): Colorway[] {
  const set = new Set<Colorway>();
  for (const d of product.designs)
    for (const c of getDesignColorways(d)) set.add(c);
  return Array.from(set);
}

/** Returns shirt colors available for a given print color, falling back to
 *  the product's default `shirtColors`. Returns `undefined` when the product
 *  doesn't expose a shirt-color picker at all (hats, backpacks, sweatpants,
 *  and other products whose colorway IS the garment color). */
export function getShirtColors(
  product: Product,
  printColor: Colorway,
): Colorway[] | undefined {
  if (!product.shirtColors) return undefined;
  return product.shirtColorsByPrintColor?.[printColor] ?? product.shirtColors;
}

export function getMinPrice(product: Product): number {
  return Math.min(...product.placements.map((p) => p.price));
}

export function getMaxPrice(product: Product): number {
  return Math.max(...product.placements.map((p) => p.price));
}

export function getPlacementPrice(
  product: Product,
  placement: Placement,
): number {
  return (
    product.placements.find((p) => p.id === placement)?.price ??
    product.placements[0].price
  );
}

/** Sizes are universal for apparel; hats and backpacks are one-size. */
export function getSizesFor(type: ProductType): readonly Size[] | null {
  if (type === "hat" || type === "backpack") return null;
  return SIZES;
}

/** Sizes offered for a specific product — honours a per-product `sizes`
 *  override (reduced range), else the universal range for its type. Returns
 *  null for one-size products (hats, backpacks). */
export function getProductSizes(product: Product): readonly Size[] | null {
  if (getSizesFor(product.type) === null) return null;
  return product.sizes ?? SIZES;
}

// --- pricing tiers --------------------------------------------------------

// All hoodies and shirts are front (DMK crest) + back (design) only — one
// style per garment, flat priced.
const HOODIE_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 45 },
];

const SHORT_SLEEVE_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 30 },
];

const LONG_SLEEVE_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 35 },
];

const SWEATPANTS_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 35 },
];

const HAT_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 20 },
];

const BACKPACK_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 45 },
];

const SHIRT_COLORS_DEFAULT: Colorway[] = ["black", "white"];

// --- asset paths ----------------------------------------------------------
// Back-design crops show each design on a black garment (the canonical view);
// shirt color is a separate customer choice. Cropped from the client's July
// 2026 mockups (Photos 1).

const P = {
  // Shared DMK crest fronts (black garment)
  hoodieCrestFront: "/products/hoodie-dmk-crest-black-front.jpg",
  teeCrestFront: "/products/short-sleeve-dmk-crest-black-front.jpg",

  // Hoodie back designs
  hoodieLoadOrange: "/products/hoodie-load-the-bar-orange-black-back.jpg",
  hoodieLoadGreen: "/products/hoodie-load-the-bar-green-black-back.jpg",
  hoodieMentalPink: "/products/hoodie-mental-strength-pink-black-back.jpg",
  hoodieSurvival: "/products/hoodie-strength-survival-gold-black-back.jpg",
  hoodieIron: "/products/hoodie-iron-over-illness-gold-black-back.jpg",

  // Load The Bar — USA (limited July drop). [back, front].
  hoodieLoadUsaBack: "/products/hoodie-load-the-bar-usa-white-back.jpg",
  hoodieLoadUsaFront: "/products/hoodie-load-the-bar-usa-white-front.jpg",

  // Short-sleeve back designs
  teeLoadOrange: "/products/short-sleeve-load-the-bar-orange-black-back.jpg",
  teeLoadGreen: "/products/short-sleeve-load-the-bar-green-black-back.jpg",
  teeMentalPink: "/products/short-sleeve-mental-strength-pink-black-back.jpg",
  teeSurvival: "/products/short-sleeve-strength-survival-gold-black-back.jpg",
  teeIron: "/products/short-sleeve-iron-over-illness-gold-black-back.jpg",

  // Long-sleeve back designs
  longSleeveLoadOrange: "/products/long-sleeve-load-the-bar-orange-black-back.jpg",
  longSleeveLoadGreen: "/products/long-sleeve-load-the-bar-green-black-back.jpg",
  longSleeveMentalPink: "/products/long-sleeve-mental-strength-pink-black-back.jpg",
  longSleeveSurvival: "/products/long-sleeve-strength-survival-gold-black-back.jpg",
  longSleeveIron: "/products/long-sleeve-iron-over-illness-gold-black-back.jpg",

  // Sweatpants (DMK crest on the thigh)
  sweatpantsBlack: "/products/sweatpants-dmk-black.jpg",
  sweatpantsGrey: "/products/sweatpants-dmk-grey.jpg",

  // Hats
  hatSilver: "/products/trucker-hat-dmk-silver.jpg",
  hatGold: "/products/trucker-hat-dmk-gold.jpg",

  // Backpacks
  backpackLoadOrange: "/products/backpack-load-the-bar-orange-black.jpg",
  backpackMentalGreen: "/products/backpack-mental-strength-green-black.jpg",
};

// --- catalog --------------------------------------------------------------
// Each design = its own product. The `designs` array on each Product carries
// exactly one Design — the design IS the product.

const designOnly = (
  id: string,
  name: string,
  imagesByColorway: Partial<Record<Colorway, string[]>>,
  tagline?: string,
): Design[] => [{ id, name, imagesByColorway, tagline }];

// --- Hoodies --------------------------------------------------------------

// Limited July drop: patriotic "Load The Bar — Unload The Mind" hoodie. DMK
// crest on the front, USA-flag back print. White or black, $45, S–3XL.
const HOODIE_LOAD_THE_BAR_USA: Product = {
  slug: "hoodie-load-the-bar-usa",
  type: "hoodie",
  name: "Load The Bar USA Hoodie",
  placements: HOODIE_PLACEMENTS,
  shirtColors: ["white", "black"],
  limitedNote: "Limited — July only",
  designs: designOnly(
    "load-the-bar-usa",
    "Load The Bar — Unload The Mind (USA)",
    {
      white: [P.hoodieLoadUsaBack, P.hoodieLoadUsaFront],
    },
    "Limited July drop. Load the bar. Unload the mind.",
  ),
};

const HOODIE_LOAD_THE_BAR: Product = {
  slug: "hoodie-load-the-bar",
  type: "hoodie",
  name: "Load The Bar Hoodie",
  placements: HOODIE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  // Orange print is the only one that also comes on a tan hoodie.
  shirtColorsByPrintColor: { orange: ["black", "white", "tan"] },
  designs: designOnly(
    "load-the-bar",
    "Load The Bar — Unload The Mind",
    {
      orange: [P.hoodieLoadOrange, P.hoodieCrestFront],
      green: [P.hoodieLoadGreen, P.hoodieCrestFront],
    },
    "Load the bar. Unload the mind.",
  ),
};

const HOODIE_MENTAL_STRENGTH: Product = {
  slug: "hoodie-mental-strength",
  type: "hoodie",
  name: "Mental Strength Is Trained Hoodie",
  placements: HOODIE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "mental-strength",
    "Mental Strength Is Trained",
    {
      pink: [P.hoodieMentalPink, P.hoodieCrestFront],
    },
    "Train the mind like the body.",
  ),
};

const HOODIE_STRENGTH_IS_SURVIVAL: Product = {
  slug: "hoodie-strength-is-survival",
  type: "hoodie",
  name: "Strength Is Survival Hoodie",
  placements: HOODIE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "strength-is-survival",
    "Strength Is Survival",
    {
      gold: [P.hoodieSurvival, P.hoodieCrestFront],
    },
    "Forged through the worst of it.",
  ),
};

const HOODIE_IRON_OVER_ILLNESS: Product = {
  slug: "hoodie-iron-over-illness",
  type: "hoodie",
  name: "Iron Over Illness Hoodie",
  placements: HOODIE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "iron-over-illness",
    "Iron Over Illness",
    {
      gold: [P.hoodieIron, P.hoodieCrestFront],
    },
    "Heavy days. Heavier reps.",
  ),
};

// --- Short Sleeves --------------------------------------------------------

const SHORT_SLEEVE_LOAD_THE_BAR: Product = {
  slug: "short-sleeve-load-the-bar",
  type: "short-sleeve",
  name: "Load The Bar Short Sleeve",
  placements: SHORT_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "load-the-bar",
    "Load The Bar — Unload The Mind",
    {
      orange: [P.teeLoadOrange, P.teeCrestFront],
      green: [P.teeLoadGreen, P.teeCrestFront],
    },
    "Load the bar. Unload the mind.",
  ),
};

const SHORT_SLEEVE_MENTAL_STRENGTH: Product = {
  slug: "short-sleeve-mental-strength",
  type: "short-sleeve",
  name: "Mental Strength Is Trained Short Sleeve",
  placements: SHORT_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "mental-strength",
    "Mental Strength Is Trained",
    {
      pink: [P.teeMentalPink, P.teeCrestFront],
    },
    "Train the mind like the body.",
  ),
};

const SHORT_SLEEVE_STRENGTH_IS_SURVIVAL: Product = {
  slug: "short-sleeve-strength-is-survival",
  type: "short-sleeve",
  name: "Strength Is Survival Short Sleeve",
  placements: SHORT_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "strength-is-survival",
    "Strength Is Survival",
    {
      gold: [P.teeSurvival, P.teeCrestFront],
    },
    "Forged through the worst of it.",
  ),
};

const SHORT_SLEEVE_IRON_OVER_ILLNESS: Product = {
  slug: "short-sleeve-iron-over-illness",
  type: "short-sleeve",
  name: "Iron Over Illness Short Sleeve",
  placements: SHORT_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "iron-over-illness",
    "Iron Over Illness",
    {
      gold: [P.teeIron, P.teeCrestFront],
    },
    "Heavy days. Heavier reps.",
  ),
};

// --- Long Sleeves ---------------------------------------------------------

const LONG_SLEEVE_LOAD_THE_BAR: Product = {
  slug: "long-sleeve-load-the-bar",
  type: "long-sleeve",
  name: "Load The Bar Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "load-the-bar",
    "Load The Bar — Unload The Mind",
    {
      orange: [P.longSleeveLoadOrange],
      green: [P.longSleeveLoadGreen],
    },
    "Load the bar. Unload the mind.",
  ),
};

const LONG_SLEEVE_MENTAL_STRENGTH: Product = {
  slug: "long-sleeve-mental-strength",
  type: "long-sleeve",
  name: "Mental Strength Is Trained Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "mental-strength",
    "Mental Strength Is Trained",
    {
      pink: [P.longSleeveMentalPink],
    },
    "Train the mind like the body.",
  ),
};

const LONG_SLEEVE_STRENGTH_IS_SURVIVAL: Product = {
  slug: "long-sleeve-strength-is-survival",
  type: "long-sleeve",
  name: "Strength Is Survival Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "strength-is-survival",
    "Strength Is Survival",
    {
      gold: [P.longSleeveSurvival],
    },
    "Forged through the worst of it.",
  ),
};

const LONG_SLEEVE_IRON_OVER_ILLNESS: Product = {
  slug: "long-sleeve-iron-over-illness",
  type: "long-sleeve",
  name: "Iron Over Illness Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "iron-over-illness",
    "Iron Over Illness",
    {
      gold: [P.longSleeveIron],
    },
    "Heavy days. Heavier reps.",
  ),
};

// --- Sweatpants -----------------------------------------------------------
// DMK crest on the thigh. The colorway IS the garment color (black or grey),
// so there is no separate shirt-color picker. S–2XL.

const SWEATPANTS_DMK: Product = {
  slug: "sweatpants-dmk",
  type: "sweatpants",
  name: "DMK Sweatpants",
  placements: SWEATPANTS_PLACEMENTS,
  sizes: SIZES_S_TO_2XL,
  designs: designOnly(
    "dmk-sweatpants",
    "DMK Sweatpants",
    {
      black: [P.sweatpantsBlack],
      grey: [P.sweatpantsGrey],
    },
    "Crest on the thigh.",
  ),
};

// --- Hats -----------------------------------------------------------------

const TRUCKER_HAT_DMK: Product = {
  slug: "trucker-hat-dmk",
  type: "hat",
  name: "DMK Trucker Hat",
  placements: HAT_PLACEMENTS,
  designs: designOnly(
    "trucker-dmk",
    "DMK Trucker",
    {
      black: [P.hatSilver],
      gold: [P.hatGold],
    },
    "Mesh back. House crest.",
  ),
};

// --- Backpacks ------------------------------------------------------------

const BACKPACK_LOAD_THE_BAR: Product = {
  slug: "backpack-load-the-bar",
  type: "backpack",
  name: "Load The Bar Backpack",
  placements: BACKPACK_PLACEMENTS,
  designs: designOnly(
    "load-the-bar",
    "Load The Bar — Unload The Mind",
    {
      orange: [P.backpackLoadOrange],
    },
    "Load the bar. Unload the mind.",
  ),
};

const BACKPACK_MENTAL_STRENGTH: Product = {
  slug: "backpack-mental-strength",
  type: "backpack",
  name: "Mental Strength Is Trained Backpack",
  placements: BACKPACK_PLACEMENTS,
  designs: designOnly(
    "mental-strength",
    "Mental Strength Is Trained",
    {
      green: [P.backpackMentalGreen],
    },
    "Train the mind like the body.",
  ),
};

// --- final catalog --------------------------------------------------------

export const PRODUCTS: Product[] = [
  // Hoodies
  HOODIE_LOAD_THE_BAR_USA, // limited July drop — featured first
  HOODIE_LOAD_THE_BAR,
  HOODIE_MENTAL_STRENGTH,
  HOODIE_STRENGTH_IS_SURVIVAL,
  HOODIE_IRON_OVER_ILLNESS,
  // Short Sleeves
  SHORT_SLEEVE_LOAD_THE_BAR,
  SHORT_SLEEVE_MENTAL_STRENGTH,
  SHORT_SLEEVE_STRENGTH_IS_SURVIVAL,
  SHORT_SLEEVE_IRON_OVER_ILLNESS,
  // Long Sleeves
  LONG_SLEEVE_LOAD_THE_BAR,
  LONG_SLEEVE_MENTAL_STRENGTH,
  LONG_SLEEVE_STRENGTH_IS_SURVIVAL,
  LONG_SLEEVE_IRON_OVER_ILLNESS,
  // Sweatpants
  SWEATPANTS_DMK,
  // Hats
  TRUCKER_HAT_DMK,
  // Backpacks
  BACKPACK_LOAD_THE_BAR,
  BACKPACK_MENTAL_STRENGTH,
];
