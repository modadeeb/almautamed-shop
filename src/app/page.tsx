"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BannerCarousel } from "@/components/catalog/banner-carousel";
import { ProductGrid, ProductGridSkeleton } from "@/components/catalog/product-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners, useCategories, useProducts } from "@/hooks/use-catalog";
import type { ProductFilters } from "@/lib/store-api/types";

/** قسم منتجات بعنوان ورابط "عرض الكل". */
function ProductSection({
  title,
  filters,
  moreHref,
}: {
  title: string;
  filters: ProductFilters;
  moreHref?: string;
}) {
  const { data, isLoading, isError } = useProducts(filters);

  if (isError) return null;

  return (
    <section className="container py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        {moreHref && (
          <Button asChild variant="ghost" size="sm">
            <Link href={moreHref}>
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      {isLoading || !data ? (
        <ProductGridSkeleton count={5} />
      ) : (
        <ProductGrid products={data.items} />
      )}
    </section>
  );
}

function HomeBanners() {
  const { data, isLoading } = useBanners();
  const top = (data ?? []).filter((b) => b.position === "home_top");

  if (isLoading) {
    return <Skeleton className="aspect-[16/7] w-full rounded-2xl sm:aspect-[16/5]" />;
  }
  if (top.length === 0) return null;
  return <BannerCarousel banners={top} />;
}

function CategoryTiles() {
  const { data, isLoading } = useCategories();
  const roots = (data ?? []).filter((c) => !c.parentId);

  return (
    <section className="container py-8">
      <h2 className="mb-4 text-lg font-bold sm:text-xl">تسوّق حسب الفئة</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {roots.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function GridBanners() {
  const { data } = useBanners();
  const grid = (data ?? []).filter((b) => b.position === "home_grid");
  if (grid.length === 0) return null;

  return (
    <section className="container py-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {grid.map((banner) => {
          const tile = (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border shadow-soft">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4">
                <span className="font-semibold text-white">{banner.title}</span>
              </div>
            </div>
          );
          return banner.linkUrl ? (
            <Link key={banner.id} href={banner.linkUrl}>
              {tile}
            </Link>
          ) : (
            <div key={banner.id}>{tile}</div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <div className="container pt-6">
        <HomeBanners />
      </div>

      <CategoryTiles />

      <ProductSection
        title="وصل حديثاً"
        filters={{ featured: "new_arrivals", pageSize: 5 }}
        moreHref="/category/medicines"
      />

      <GridBanners />

      <ProductSection
        title="الأكثر مبيعاً"
        filters={{ featured: "best_sellers", pageSize: 5 }}
        moreHref="/category/medicines"
      />
    </div>
  );
}
