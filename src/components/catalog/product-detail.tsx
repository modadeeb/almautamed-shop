"use client";

import * as React from "react";
import Image from "next/image";
import {
  Barcode,
  CheckCircle2,
  Loader2,
  ShoppingCart,
  XCircle,
} from "lucide-react";

import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { QuantityStepper } from "@/components/catalog/quantity-stepper";
import { ProductGrid, ProductGridSkeleton } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCategories, useProduct, useProducts } from "@/hooks/use-catalog";
import { formatMoneyObject, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: categories } = useCategories();
  const { addToCart, isPending } = useAddToCart();
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);

  // منتجات ذات صلة من نفس الفئة.
  const { data: related, isLoading: relatedLoading } = useProducts(
    product ? { categoryId: product.categoryId, pageSize: 6 } : undefined,
  );

  if (isLoading) {
    return (
      <div className="container py-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container py-10">
        <EmptyState
          icon={XCircle}
          title="المنتج غير موجود"
          description="ربما تمّت إزالة هذا المنتج أو أن الرابط غير صحيح."
        />
      </div>
    );
  }

  const images =
    product.images.length > 0
      ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
      : [];
  const mainImage = images[activeImage] ?? images[0];

  const category = categories?.find((c) => c.id === product.categoryId);
  const parent = category?.parentId
    ? categories?.find((c) => c.id === category.parentId)
    : undefined;

  const crumbs: Crumb[] = [];
  if (parent) crumbs.push({ label: parent.name, href: `/category/${parent.slug}` });
  if (category) crumbs.push({ label: category.name, href: `/category/${category.slug}` });
  crumbs.push({ label: product.name });

  const relatedProducts = (related?.items ?? []).filter((p) => p.id !== product.id);

  return (
    <div className="container py-6">
      <Breadcrumbs items={crumbs} />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* المعرض */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
            {mainImage && (
              <Image
                src={mainImage.url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            {!product.inStock && (
              <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[1px]">
                <Badge variant="destructive" className="text-sm">
                  غير متوفر حالياً
                </Badge>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-all",
                    i === activeImage
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "opacity-70 hover:opacity-100",
                  )}
                  aria-label={`صورة ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} — ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* المعلومات */}
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
          {product.scientificName && (
            <p className="mt-1 text-muted-foreground">{product.scientificName}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatMoneyObject(product.price)}
            </span>
            {product.inStock ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                متوفر
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3.5 w-3.5" />
                غير متوفر
              </Badge>
            )}
          </div>

          {product.inStock && typeof product.availableQuantity === "number" && (
            <p className="mt-2 text-sm text-muted-foreground">
              الكمية المتاحة: {formatNumber(product.availableQuantity)}
            </p>
          )}

          {product.shortDescription && (
            <p className="mt-4 leading-relaxed">{product.shortDescription}</p>
          )}
          {product.description && (
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {product.barcode && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Barcode className="h-4 w-4" />
              <span dir="ltr" className="tabular-nums">
                {product.barcode}
              </span>
            </p>
          )}

          {/* الكمية + إضافة للسلة */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={product.availableQuantity}
            />
            <Button
              size="lg"
              className="flex-1 sm:flex-none"
              disabled={!product.inStock || isPending}
              onClick={() => addToCart(product, quantity)}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              أضف للسلة
            </Button>
          </div>
        </div>
      </div>

      {/* منتجات ذات صلة */}
      <section className="mt-14">
        <h2 className="mb-4 text-lg font-bold sm:text-xl">منتجات ذات صلة</h2>
        {relatedLoading ? (
          <ProductGridSkeleton count={5} />
        ) : relatedProducts.length > 0 ? (
          <ProductGrid products={relatedProducts.slice(0, 5)} />
        ) : (
          <p className="text-sm text-muted-foreground">لا توجد منتجات ذات صلة.</p>
        )}
      </section>
    </div>
  );
}
