// Single source of truth for DMK Apparel product catalog.
// A design's `imagesByColorway` map enumerates only the colorways we have
// photography for — switching colors on the product page swaps the image.
// Designs photographed in only one color still get one entry; that's the
// only colorway customers can select for that design until more photos exist.

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;
export type Size = (typeof SIZES)[number];

export type Colorway = "black" | "white" | "grey" | "tan";

export const COLORWAY_LABEL: Record<Colorway, string> = {
  black: "Black",
  white: "White",
  grey: "Grey",
  tan: "Tan",
};

export const COLORWAY_HEX: Record<Colorway, string> = {
  black: "#0a0a0a",
  white: "#f5f5f5",
  grey: "#9ca3af",
  tan: "#c8a679",
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

// --- catalog --------------------------------------------------------------

// Asset paths under /public/
const P = {
  // Studio shots (front + back) we have for the black hoodie + short-sleeve
  hoodieLoadBack: "/products/hoodie-load-the-bar-black-back.jpg",
  hoodieCrestFront: "/products/hoodie-dmk-crest-black-front.jpg",
  teeLoadBack: "/products/short-sleeve-load-the-bar-black-back.jpg",
  teeCrestFront: "/products/short-sleeve-dmk-crest-black-front.jpg",

  // New real-product photography for short-sleeve back prints
  teeLoadOrangeBack: "/products/short-sleeve-load-the-bar-orange-black-back.jpg",
  teeLoadGreenBack: "/products/short-sleeve-load-the-bar-green-black-back.jpg",
  teeMentalGreenBack: "/products/short-sleeve-mental-strength-green-black-back.jpg",
  teeMentalGreenButterfliesBack: "/products/short-sleeve-mental-strength-green-butterflies-black-back.jpg",
  teeMentalPinkWhiteBack: "/products/short-sleeve-mental-strength-pink-white-back.jpg",

  // Design renders from the brief screenshot
  strengthSurvivalBlack: "/products/strength-survival-black.jpg",
  ironOverIllnessBlack: "/products/iron-over-illness-black.jpg",
  mentalGreenBlack: "/products/mental-strength-green-black.jpg",
  mentalGreenBlackAlt: "/products/mental-strength-green-black-alt.jpg",
  mentalPinkBlack: "/products/mental-strength-pink-black.jpg",
  mentalPinkWhite: "/products/mental-strength-pink-white.jpg",
  loadOrangeTan: "/products/load-the-bar-orange-tan.jpg",
  loadRedBlack: "/products/load-the-bar-red-black.jpg",
  loadGreenBlack: "/products/load-the-bar-green-black.jpg",

  // Hats
  hatSilver: "/products/trucker-hat-dmk-silver.jpg",
  hatGold: "/products/trucker-hat-dmk-gold.jpg",

  // Long-sleeve real product photography
  longSleeveCrestPair: "/products/long-sleeve-dmk-crest-pair.jpg",
  longSleeveLineup: "/products/long-sleeve-lineup-black.jpg",
  longSleevePlaceholder: "/products/long-sleeve-placeholder.jpg",

  // Backpacks
  backpackLoadOrange: "/products/backpack-load-the-bar-orange-black.jpg",
  backpackMentalGreen: "/products/backpack-mental-strength-green-black.jpg",
};

const HOODIE_DESIGNS: Design[] = [
  {
    id: "load-the-bar-orange",
    name: "Load The Bar — Orange Cross",
    imagesByColorway: {
      tan: [P.loadOrangeTan],
      black: [P.hoodieLoadBack],
    },
    tagline: "Load the bar. Unload the mind.",
  },
  {
    id: "load-the-bar-red",
    name: "Load The Bar — Red",
    imagesByColorway: {
      black: [P.loadRedBlack],
    },
    tagline: "Load the bar. Unload the mind.",
  },
  {
    id: "load-the-bar-green",
    name: "Load The Bar — Green Ribbon",
    imagesByColorway: {
      black: [P.loadGreenBlack],
    },
    tagline: "Load the bar. Unload the mind.",
  },
  {
    id: "mental-strength-green",
    name: "Mental Strength Is Trained — Green",
    imagesByColorway: {
      black: [P.mentalGreenBlack, P.mentalGreenBlackAlt],
    },
    tagline: "Train the mind like the body.",
  },
  {
    id: "mental-strength-pink",
    name: "Mental Strength Is Trained — Hearts",
    imagesByColorway: {
      white: [P.mentalPinkWhite],
      black: [P.mentalPinkBlack],
    },
    tagline: "Train the mind like the body.",
  },
  {
    id: "strength-is-survival",
    name: "Strength Is Survival",
    imagesByColorway: {
      black: [P.strengthSurvivalBlack],
    },
    tagline: "Forged through the worst of it.",
  },
  {
    id: "iron-over-illness",
    name: "Iron Over Illness",
    imagesByColorway: {
      black: [P.ironOverIllnessBlack],
    },
    tagline: "Heavy days. Heavier reps.",
  },
  {
    id: "dmk-crest",
    name: "DMK Crest",
    imagesByColorway: {
      black: [P.hoodieCrestFront],
    },
    tagline: "House mark.",
  },
];

const SHORT_SLEEVE_DESIGNS: Design[] = [
  {
    id: "load-the-bar-orange",
    name: "Load The Bar — Orange Cross",
    imagesByColorway: {
      black: [P.teeLoadOrangeBack],
    },
    tagline: "Load the bar. Unload the mind.",
  },
  {
    id: "load-the-bar-green",
    name: "Load The Bar — Green Ribbon",
    imagesByColorway: {
      black: [P.teeLoadGreenBack],
    },
    tagline: "Load the bar. Unload the mind.",
  },
  {
    id: "mental-strength-green",
    name: "Mental Strength Is Trained — Green",
    imagesByColorway: {
      black: [P.teeMentalGreenBack],
    },
    tagline: "Train the mind like the body.",
  },
  {
    id: "mental-strength-green-butterflies",
    name: "Mental Strength Is Trained — Green & Butterflies",
    imagesByColorway: {
      black: [P.teeMentalGreenButterfliesBack],
    },
    tagline: "Train the mind like the body.",
  },
  {
    id: "mental-strength-pink",
    name: "Mental Strength Is Trained — Hearts",
    imagesByColorway: {
      white: [P.teeMentalPinkWhiteBack],
    },
    tagline: "Train the mind like the body.",
  },
  {
    id: "dmk-crest",
    name: "DMK Crest",
    imagesByColorway: {
      black: [P.teeCrestFront],
    },
    tagline: "House mark.",
  },
];

// Long-sleeve: real photography for the DMK crest pair; the rest of the design
// catalog mirrors the hoodie lineup but shows the "lineup" group shot as a
// placeholder until each design is photographed individually.
const LONG_SLEEVE_DESIGNS: Design[] = [
  {
    id: "dmk-crest",
    name: "DMK Crest",
    imagesByColorway: {
      black: [P.longSleeveCrestPair],
      white: [P.longSleeveCrestPair],
    },
    tagline: "House mark.",
  },
  ...HOODIE_DESIGNS.filter((d) => d.id !== "dmk-crest").map((d) => {
    const lineupByColor: Partial<Record<Colorway, string[]>> = {};
    for (const c of getDesignColorways(d)) {
      lineupByColor[c] = [P.longSleeveLineup];
    }
    return { ...d, imagesByColorway: lineupByColor };
  }),
];

const HAT_DESIGNS: Design[] = [
  {
    id: "trucker-dmk-silver",
    name: "DMK Trucker — Silver",
    imagesByColorway: { black: [P.hatSilver] },
    tagline: "Mesh back. House crest.",
  },
  {
    id: "trucker-dmk-gold",
    name: "DMK Trucker — Gold",
    imagesByColorway: { black: [P.hatGold] },
    tagline: "Mesh back. Gilded crest.",
  },
];

const BACKPACK_DESIGNS: Design[] = [
  {
    id: "load-the-bar-orange",
    name: "Load The Bar — Orange Cross",
    imagesByColorway: { black: [P.backpackLoadOrange] },
    tagline: "Load the bar. Unload the mind.",
  },
  {
    id: "mental-strength-green",
    name: "Mental Strength Is Trained — Green",
    imagesByColorway: { black: [P.backpackMentalGreen] },
    tagline: "Train the mind like the body.",
  },
];

export const PRODUCTS: Product[] = [
  { slug: "hoodie", type: "hoodie", name: "DMK Hoodie", price: 40, designs: HOODIE_DESIGNS },
  { slug: "short-sleeve", type: "short-sleeve", name: "DMK Short Sleeve", price: 25, designs: SHORT_SLEEVE_DESIGNS },
  { slug: "long-sleeve", type: "long-sleeve", name: "DMK Long Sleeve", price: 30, designs: LONG_SLEEVE_DESIGNS },
  { slug: "trucker-hat", type: "hat", name: "DMK Trucker Hat", price: 20, designs: HAT_DESIGNS },
  { slug: "backpack", type: "backpack", name: "DMK Backpack", price: 45, designs: BACKPACK_DESIGNS },
];
