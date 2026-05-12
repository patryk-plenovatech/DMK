// Single source of truth for DMK Apparel product catalog.
// Photography for individual designs is partial — see /public/products/README.md.
// We reuse what's available across the catalog; replace image paths as new shots come in.

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

export type ProductType = "hoodie" | "short-sleeve" | "long-sleeve" | "hat";

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  hoodie: "Hoodie",
  "short-sleeve": "Short Sleeve",
  "long-sleeve": "Long Sleeve",
  hat: "Trucker Hat",
};

export type Design = {
  id: string;
  name: string;
  /** Available colorways for this specific design. */
  colorways: Colorway[];
  /** Image paths under /public/. First image is primary. */
  images: string[];
  /** Optional tagline shown on product page. */
  tagline?: string;
};

export type Product = {
  slug: string;
  type: ProductType;
  name: string;
  price: number;
  designs: Design[];
};

// Photographed assets in /public/products/
const HOODIE_LOAD_BACK = "/products/hoodie-load-the-bar-black-back.jpg";
const HOODIE_CREST_FRONT = "/products/hoodie-dmk-crest-black-front.jpg";
const TEE_LOAD_BACK = "/products/short-sleeve-load-the-bar-black-back.jpg";
const TEE_CREST_FRONT = "/products/short-sleeve-dmk-crest-black-front.jpg";

// Design definitions — share across product types via spread.
const D_STRENGTH_OVER_SURVIVAL: Design = {
  id: "strength-over-survival",
  name: "Strength Over Survival",
  colorways: ["black", "white", "grey"],
  images: [HOODIE_LOAD_BACK],
  tagline: "Forged through the worst of it.",
};

const D_IRON_OVER_ILLNESS: Design = {
  id: "iron-over-illness",
  name: "Iron Over Illness",
  colorways: ["black", "white", "grey"],
  images: [HOODIE_LOAD_BACK],
  tagline: "Heavy days. Heavier reps.",
};

const D_MENTAL_STRENGTH_GREEN: Design = {
  id: "mental-strength-is-trained-green",
  name: "Mental Strength Is Trained — Green",
  colorways: ["black", "grey"],
  images: [HOODIE_CREST_FRONT, HOODIE_LOAD_BACK],
  tagline: "Train the mind like the body.",
};

const D_MENTAL_STRENGTH_PINK: Design = {
  id: "mental-strength-is-trained-pink",
  name: "Mental Strength Is Trained — White / Pink",
  colorways: ["white"],
  images: [HOODIE_CREST_FRONT],
  tagline: "Train the mind like the body.",
};

const D_LOAD_THE_BAR_ORANGE: Design = {
  id: "load-the-bar-orange",
  name: "Load The Bar / Unload The Mind — Orange",
  colorways: ["black", "white", "grey", "tan"],
  images: [HOODIE_LOAD_BACK, HOODIE_CREST_FRONT],
  tagline: "Load the bar. Unload the mind.",
};

const D_LOAD_THE_BAR_RED: Design = {
  id: "load-the-bar-red",
  name: "Load The Bar / Unload The Mind — Red",
  colorways: ["black", "white", "grey"],
  images: [HOODIE_LOAD_BACK],
  tagline: "Load the bar. Unload the mind.",
};

const D_DMK_CREST: Design = {
  id: "dmk-crest",
  name: "DMK Crest",
  colorways: ["black", "white", "grey"],
  images: [HOODIE_CREST_FRONT],
  tagline: "House mark.",
};

// Hat variants are separate — they're not full apparel designs.
const D_HAT_DMK_BLACK: Design = {
  id: "trucker-dmk-black",
  name: "DMK Trucker — Black",
  colorways: ["black"],
  images: [HOODIE_CREST_FRONT],
};

const D_HAT_DMK_WHITE: Design = {
  id: "trucker-dmk-white",
  name: "DMK Trucker — White",
  colorways: ["white"],
  images: [HOODIE_CREST_FRONT],
};

export const PRODUCTS: Product[] = [
  {
    slug: "hoodie",
    type: "hoodie",
    name: "DMK Hoodie",
    price: 40,
    designs: [
      D_LOAD_THE_BAR_ORANGE,
      { ...D_LOAD_THE_BAR_RED, images: [HOODIE_LOAD_BACK] },
      D_MENTAL_STRENGTH_GREEN,
      D_MENTAL_STRENGTH_PINK,
      D_STRENGTH_OVER_SURVIVAL,
      D_IRON_OVER_ILLNESS,
      { ...D_DMK_CREST, images: [HOODIE_CREST_FRONT] },
    ],
  },
  {
    slug: "short-sleeve",
    type: "short-sleeve",
    name: "DMK Short Sleeve",
    price: 25,
    designs: [
      { ...D_LOAD_THE_BAR_ORANGE, images: [TEE_LOAD_BACK, TEE_CREST_FRONT] },
      { ...D_LOAD_THE_BAR_RED, images: [TEE_LOAD_BACK] },
      { ...D_MENTAL_STRENGTH_GREEN, images: [TEE_CREST_FRONT, TEE_LOAD_BACK] },
      { ...D_MENTAL_STRENGTH_PINK, images: [TEE_CREST_FRONT] },
      { ...D_STRENGTH_OVER_SURVIVAL, images: [TEE_LOAD_BACK] },
      { ...D_IRON_OVER_ILLNESS, images: [TEE_LOAD_BACK] },
      { ...D_DMK_CREST, images: [TEE_CREST_FRONT] },
    ],
  },
  {
    slug: "long-sleeve",
    type: "long-sleeve",
    name: "DMK Long Sleeve",
    price: 30,
    designs: [
      { ...D_LOAD_THE_BAR_ORANGE, images: [HOODIE_LOAD_BACK] },
      { ...D_LOAD_THE_BAR_RED, images: [HOODIE_LOAD_BACK] },
      D_MENTAL_STRENGTH_GREEN,
      D_MENTAL_STRENGTH_PINK,
      D_STRENGTH_OVER_SURVIVAL,
      D_IRON_OVER_ILLNESS,
      { ...D_DMK_CREST, images: [HOODIE_CREST_FRONT] },
    ],
  },
  {
    slug: "trucker-hat",
    type: "hat",
    name: "DMK Trucker Hat",
    price: 20,
    designs: [D_HAT_DMK_BLACK, D_HAT_DMK_WHITE],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllColorways(product: Product): Colorway[] {
  const set = new Set<Colorway>();
  for (const d of product.designs) for (const c of d.colorways) set.add(c);
  return Array.from(set);
}

/**
 * Sizes are universal across apparel; hats are one-size-fits-all (no size picker).
 */
export function getSizesFor(type: ProductType): readonly Size[] | null {
  if (type === "hat") return null;
  return SIZES;
}
