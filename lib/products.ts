// Single source of truth for DMK Apparel product catalog.
//
// Catalog model: each design = its own product. Within a product, the
// `Colorway` picker swaps between **print colors** (orange/red/green/pink) for
// apparel back-prints, **shirt colors** (black/white) for long sleeves where
// the same design exists on both, or **logo colors** (black/gold) for hats.
//
// Each colorway's image array is ordered [back, front] — the design-bearing
// back of the garment first, the DMK crest front second. For products without
// a back/front pair (hats, backpacks), the array is a single image.

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
  price: number;
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

/** Sizes are universal for apparel; hats and backpacks are one-size (no size picker). */
export function getSizesFor(type: ProductType): readonly Size[] | null {
  if (type === "hat" || type === "backpack") return null;
  return SIZES;
}

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
// exactly one Design — the design IS the product. Front of every apparel
// piece is the DMK crest, so each colorway's image array is [back, front].

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
  price: 40,
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
  price: 40,
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
  price: 40,
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
  price: 40,
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
  price: 25,
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
  price: 25,
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
  price: 25,
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
  price: 30,
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
  price: 30,
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
  price: 30,
  designs: designOnly(
    "mental-strength-hearts",
    "Mental Strength Is Trained — Hearts & Butterflies",
    {
      green: [P.longSleeveMentalGreenButterfliesBack],
    },
    "Train the mind like the body.",
  ),
};

const LONG_SLEEVE_DMK_CREST: Product = {
  slug: "long-sleeve-dmk-crest",
  type: "long-sleeve",
  name: "DMK Crest Long Sleeve",
  price: 30,
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
  price: 20,
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
  price: 45,
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
  price: 45,
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
