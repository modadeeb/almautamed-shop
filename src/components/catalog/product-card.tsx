"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { formatMoneyObject } from "@/lib/format";
import type { Product } from "@/lib/store-api/types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isPending, pendingProductId } = useAddToCart();
  const image =
    product.images.find((i) => i.isPrimary) ?? product.images[0];
  const loading = isPending && pendingProductId === product.id;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {image && (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[1px]">
            <Badge variant="destructive">غير متوفر</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <Link href={`/product/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          {product.scientificName && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {product.scientificName}
            </p>
          )}
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-primary">
            {formatMoneyObject(product.price)}
          </span>
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="أضف للسلة"
            disabled={!product.inStock || loading}
            onClick={() => addToCart(product)}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
