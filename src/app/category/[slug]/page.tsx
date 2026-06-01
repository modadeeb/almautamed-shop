"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";

import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import {
  CatalogFilters,
  defaultFilterValue,
  type CatalogFilterValue,
} from "@/components/catalog/catalog-filters";
import { CategorySidebar } from "@/components/catalog/category-sidebar";
import { ProductGrid, ProductGridSkeleton } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useCategories, useProducts } from "@/hooks/use-catalog";

const PAGE_SIZE = 8;

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [filters, setFilters] = React.useState<CatalogFilterValue>(defaultFilterValue);
  const [page, setPage] = React.useState(1);

  // إعادة الصفحة للأولى عند تغيّر الفئة أو الفلاتر.
  React.useEffect(() => setPage(1), [slug, filters]);

  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.slug === slug);
  const parent = category?.parentId
    ? categories?.find((c) => c.id === category.parentId)
    : undefined;
  const subcategories = category
    ? (categories ?? []).filter((c) => c.parentId === category.id)
    : [];

  const { data, isLoading, isError, isPlaceholderData } = useProducts({
    categorySlug: slug,
    inStockOnly: filters.inStockOnly,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const crumbs: Crumb[] = [];
  if (parent) crumbs.push({ label: parent.name, href: `/category/${parent.slug}` });
  crumbs.push({ label: category?.name ?? slug });

  return (
    <div className="container py-6">
      <Breadcrumbs items={crumbs} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{category?.name ?? slug}</h1>
        {subcategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Button key={sub.id} asChild variant="secondary" size="sm">
                <Link href={`/category/${sub.slug}`}>{sub.name}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* الشريط الجانبي: فئات + فلاتر (على الجوال يظهر كزرّي Sheet) */}
        <div className="flex gap-2 lg:w-60 lg:shrink-0 lg:flex-col lg:gap-6">
          <CategorySidebar activeSlug={slug} />
          <CatalogFilters value={filters} onChange={setFilters} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-muted-foreground">
            {data ? `${data.total} منتج` : "…"}
          </p>

          {isError ? (
            <EmptyState
              title="تعذّر تحميل المنتجات"
              description="حدث خطأ أثناء الجلب. حاول إعادة تحميل الصفحة."
            />
          ) : isLoading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="لا توجد منتجات"
              description="لا توجد منتجات مطابقة لهذه الفئة أو الفلاتر الحالية."
              action={
                <Button variant="outline" onClick={() => setFilters(defaultFilterValue)}>
                  إعادة تعيين الفلاتر
                </Button>
              }
            />
          ) : (
            <>
              <div
                className={
                  isPlaceholderData ? "opacity-60 transition-opacity" : undefined
                }
              >
                <ProductGrid products={data.items} />
              </div>

              {data.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="الصفحة السابقة"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    صفحة {page} من {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="الصفحة التالية"
                    disabled={page >= data.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
