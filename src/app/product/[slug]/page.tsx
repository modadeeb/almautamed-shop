import type { Metadata } from "next";

import { ProductDetail } from "@/components/catalog/product-detail";
import { storeApi } from "@/lib/store-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await storeApi.catalog.getProduct(slug);

  if (!product) {
    return { title: "منتج غير موجود" };
  }

  const description =
    product.shortDescription ??
    product.description ??
    `${product.name} — متوفر في متجر المعتمد للأدوية.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images.map((img) => ({ url: img.url })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
