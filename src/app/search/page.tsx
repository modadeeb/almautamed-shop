"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";

import {
  CatalogFilters,
  defaultFilterValue,
  type CatalogFilterValue,
} from "@/components/catalog/catalog-filters";
import { ProductGrid, ProductGridSkeleton } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/empty-state";
import { useSearch } from "@/hooks/use-catalog";
import type { Product } from "@/lib/store-api/types";

/** يطبّق الفلاتر والترتيب على نتائج البحث (محليّاً، إذ يُرجع search قائمة بسيطة). */
function applyFilters(products: Product[], f: CatalogFilterValue): Product[] {
  let list = [...products];
  if (f.inStockOnly) list = list.filter((p) => p.inStock);
  if (typeof f.minPrice === "number")
    list = list.filter((p) => p.price.amount >= f.minPrice!);
  if (typeof f.maxPrice === "number")
    list = list.filter((p) => p.price.amount <= f.maxPrice!);
  switch (f.sort) {
    case "price_asc":
      list.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case "price_desc":
      list.sort((a, b) => b.price.amount - a.price.amount);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      break;
    default:
      break;
  }
  return list;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [filters, setFilters] = React.useState<CatalogFilterValue>(defaultFilterValue);

  const { data, isLoading, isError, isFetching } = useSearch(query);
  const results = React.useMemo(
    () => applyFilters(data ?? [], filters),
    [data, filters],
  );

  if (!query) {
    return (
      <EmptyState
        icon={SearchX}
        title="ابدأ بالبحث"
        description="اكتب اسم دواء أو منتج في شريط البحث بالأعلى."
      />
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">نتائج البحث</h1>
        <p className="mt-1 text-muted-foreground">
          عن «{query}»
          {data ? ` — ${results.length} نتيجة` : ""}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-60 lg:shrink-0">
          <CatalogFilters value={filters} onChange={setFilters} />
        </div>

        <div className="min-w-0 flex-1">
          {isError ? (
            <EmptyState
              title="تعذّر تنفيذ البحث"
              description="حدث خطأ أثناء الجلب. حاول مرة أخرى."
            />
          ) : isLoading || isFetching ? (
            <ProductGridSkeleton count={8} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="لا توجد نتائج"
              description={`لم نجد منتجات مطابقة لـ «${query}». جرّب كلمة أخرى أو تحقّق من الإملاء.`}
            />
          ) : (
            <ProductGrid products={results} />
          )}
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container py-6">
      <React.Suspense fallback={<ProductGridSkeleton count={8} />}>
        <SearchResults />
      </React.Suspense>
    </div>
  );
}
