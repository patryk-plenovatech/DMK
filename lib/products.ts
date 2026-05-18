// Single source of truth for DMK Apparel product catalog.
//
// Catalog model
// -------------
// Each design = its own product. A product carries multiple dimensions of
// customer choice that are independent of each other:
//
//   1. PRINT COLOR (Colorway, via design.imagesByColorway) — the ink color on
//      the design (orange / red / green / pink / gold / silver). For the DMK
//      crest long-sleeve, the colorway happens to be the SHIRT color since
//      the design itself is one color.
//   2. SHIRT COLOR (product.shirtColors) — the garment fabric color
//      (black / white / tan). Independent of print color; the customer can
//      mix any print onto any shirt color. The orange Load-The-Bar print is
//      the only one with a tan option, expressed via shirtColorsByPrintColor.
//   3. PLACEMENT (product.placements) — design-on-front (cheaper) vs.
//      DMK-crest-front + design-on-back (more expensive). Long sleeves are
//      priced the same for both placements.
//   4. SIZE — universal apparel sizes; hats and backpacks are one-size.
//
// Each colorway's image array is ordered [back, front] — design-bearing back
// first, DMK crest front second. Single-image arrays for products without a
// front/back pair (hats, backpacks).

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;
export type Size = (typeof SIZES)[number];

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
  | "hat"
  | "backpack";

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  hoodie: "Hoodie",
  "short-sleeve": "Short Sleeve",
  "long-sleeve": "Long Sleeve",
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
 *  doesn't expose a shirt-color picker at all (hats, backpacks, products
 *  whose colorway IS the shirt color like the DMK crest long-sleeve). */
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

// --- pricing tiers --------------------------------------------------------

const HOODIE_PLACEMENTS: PlacementOption[] = [
  { id: "front-only", price: 35 },
  { id: "back-with-crest", price: 40 },
];

const SHORT_SLEEVE_PLACEMENTS: PlacementOption[] = [
  { id: "front-only", price: 25 },
  { id: "back-with-crest", price: 30 },
];

const LONG_SLEEVE_PLACEMENTS: PlacementOption[] = [
  { id: "front-only", price: 30 },
  { id: "back-with-crest", price: 30 },
];

const HAT_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 20 },
];

const BACKPACK_PLACEMENTS: PlacementOption[] = [
  { id: "back-with-crest", price: 45 },
];

const SHIRT_COLORS_DEFAULT: Colorway[] = ["black", "white"];

// --- asset paths ----------------------------------------------------------

const P = {
  // Hoodie back-print designs
  hoodieLoadOrange: "/products/load-the-bar-orange-tan.jpg",
  hoodieLoadRed: "/products/load-the-bar-red-black.jpg",
  hoodieLoadGreen: "/products/load-the-bar-green-black.jpg",
  hoodieMentalGreen: "/products/mental-strength-green-black.jpg",
  hoodieMentalGreenAlt: "/products/mental-strength-green-black-alt.jpg",
  hoodieMentalPink: "/products/mental-strength-pink-black.jpg",
  hoodieMentalPinkWhite: "/products/mental-strength-pink-white.jpg",
  hoodieStrengthSurvival: "/products/strength-survival-black.jpg",
  hoodieIronOverIllness: "/products/iron-over-illness-black.jpg",
  hoodieCrestFront: "/products/hoodie-dmk-crest-black-front.jpg",
  hoodieLoadBackStudio: "/products/hoodie-load-the-bar-black-back.jpg",

  // Short-sleeve back-print designs (real product photography)
  teeLoadOrangeBack: "/products/short-sleeve-load-the-bar-orange-black-back.jpg",
  teeLoadGreenBack: "/products/short-sleeve-load-the-bar-green-black-back.jpg",
  teeMentalGreenBack: "/products/short-sleeve-mental-strength-green-black-back.jpg",
  teeMentalGreenButterfliesBack: "/products/short-sleeve-mental-strength-green-butterflies-black-back.jpg",
  teeMentalPinkWhiteBack: "/products/short-sleeve-mental-strength-pink-white-back.jpg",
  teeCrestFront: "/products/short-sleeve-dmk-crest-black-front.jpg",

  // Long-sleeve back-print designs (cropped from collage)
  longSleeveMentalGreenButterfliesBack: "/products/long-sleeve-mental-strength-green-butterflies-back.jpg",
  longSleeveMentalGreenBack: "/products/long-sleeve-mental-strength-green-back.jpg",
  longSleeveMentalPinkWhiteBack: "/products/long-sleeve-mental-strength-pink-white-back.jpg",
  longSleeveLoadOrangeBack: "/products/long-sleeve-load-the-bar-orange-back.jpg",
  longSleeveLoadGreenBack: "/products/long-sleeve-load-the-bar-green-back.jpg",
  longSleeveCrestBlack: "/products/long-sleeve-dmk-crest-black-only.jpg",
  longSleeveCrestWhite: "/products/long-sleeve-dmk-crest-white-only.jpg",

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
      red: [P.hoodieLoadRed, P.hoodieCrestFront],
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
      green: [P.hoodieMentalGreen, P.hoodieCrestFront],
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
      black: [P.hoodieStrengthSurvival, P.hoodieCrestFront],
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
      black: [P.hoodieIronOverIllness, P.hoodieCrestFront],
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
  shirtColorsByPrintColor: { orange: ["black", "white", "tan"] },
  designs: designOnly(
    "load-the-bar",
    "Load The Bar — Unload The Mind",
    {
      orange: [P.teeLoadOrangeBack, P.teeCrestFront],
      green: [P.teeLoadGreenBack, P.teeCrestFront],
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
      green: [P.teeMentalGreenBack, P.teeCrestFront],
      pink: [P.teeMentalPinkWhiteBack, P.teeCrestFront],
    },
    "Train the mind like the body.",
  ),
};

const SHORT_SLEEVE_MENTAL_STRENGTH_HEARTS: Product = {
  slug: "short-sleeve-mental-strength-hearts",
  type: "short-sleeve",
  name: "Mental Strength Is Trained — Hearts",
  placements: SHORT_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "mental-strength-hearts",
    "Mental Strength Is Trained — Hearts & Butterflies",
    {
      green: [P.teeMentalGreenButterfliesBack, P.teeCrestFront],
    },
    "Train the mind like the body.",
  ),
};

// --- Long Sleeves ---------------------------------------------------------

const LONG_SLEEVE_LOAD_THE_BAR: Product = {
  slug: "long-sleeve-load-the-bar",
  type: "long-sleeve",
  name: "Load The Bar Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  shirtColorsByPrintColor: { orange: ["black", "white", "tan"] },
  designs: designOnly(
    "load-the-bar",
    "Load The Bar — Unload The Mind",
    {
      orange: [P.longSleeveLoadOrangeBack],
      green: [P.longSleeveLoadGreenBack],
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
      green: [P.longSleeveMentalGreenBack],
      pink: [P.longSleeveMentalPinkWhiteBack],
    },
    "Train the mind like the body.",
  ),
};

const LONG_SLEEVE_MENTAL_STRENGTH_HEARTS: Product = {
  slug: "long-sleeve-mental-strength-hearts",
  type: "long-sleeve",
  name: "Mental Strength Is Trained — Hearts Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  shirtColors: SHIRT_COLORS_DEFAULT,
  designs: designOnly(
    "mental-strength-hearts",
    "Mental Strength Is Trained — Hearts & Butterflies",
    {
      green: [P.longSleeveMentalGreenButterfliesBack],
    },
    "Train the mind like the body.",
  ),
};

// DMK Crest long-sleeve: its colorway IS the shirt color (black vs. white),
// so no separate shirt-color picker.
const LONG_SLEEVE_DMK_CREST: Product = {
  slug: "long-sleeve-dmk-crest",
  type: "long-sleeve",
  name: "DMK Crest Long Sleeve",
  placements: LONG_SLEEVE_PLACEMENTS,
  designs: designOnly(
    "dmk-crest",
    "DMK Crest",
    {
      black: [P.longSleeveCrestBlack],
      white: [P.longSleeveCrestWhite],
    },
    "House mark.",
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
  HOODIE_LOAD_THE_BAR,
  HOODIE_MENTAL_STRENGTH,
  HOODIE_STRENGTH_IS_SURVIVAL,
  HOODIE_IRON_OVER_ILLNESS,
  // Short Sleeves
  SHORT_SLEEVE_LOAD_THE_BAR,
  SHORT_SLEEVE_MENTAL_STRENGTH,
  SHORT_SLEEVE_MENTAL_STRENGTH_HEARTS,
  // Long Sleeves
  LONG_SLEEVE_LOAD_THE_BAR,
  LONG_SLEEVE_MENTAL_STRENGTH,
  LONG_SLEEVE_MENTAL_STRENGTH_HEARTS,
  LONG_SLEEVE_DMK_CREST,
  // Hats
  TRUCKER_HAT_DMK,
  // Backpacks
  BACKPACK_LOAD_THE_BAR,
  BACKPACK_MENTAL_STRENGTH,
];
