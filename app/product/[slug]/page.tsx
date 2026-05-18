import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { PRODUCTS, getProductBySlug } from "@/lib/products";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  const tagline = product.designs[0]?.tagline;
  return {
    title: product.name,
    description: tagline
      ? `${product.name} — $${product.price}. ${tagline} DMK Apparel streetwear.`
      : `${product.name} — $${product.price}. DMK Apparel streetwear.`,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
