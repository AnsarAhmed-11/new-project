import ProductDetailClient from "@/app/components/ProductDetailClient";

export const instant = false;

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
