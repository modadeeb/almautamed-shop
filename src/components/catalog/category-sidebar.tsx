"use client";

import * as React from "react";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoryNav } from "@/components/catalog/category-nav";
import { useCategories } from "@/hooks/use-catalog";

function NavSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

/** الشريط الجانبي للفئات: ثابت على سطح المكتب، وداخل Sheet على الجوال. */
export function CategorySidebar({ activeSlug }: { activeSlug?: string }) {
  const { data: categories, isLoading } = useCategories();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* سطح المكتب */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-32">
          <h2 className="mb-3 px-3 text-sm font-bold">الفئات</h2>
          {isLoading || !categories ? (
            <NavSkeleton />
          ) : (
            <CategoryNav categories={categories} activeSlug={activeSlug} />
          )}
        </div>
      </aside>

      {/* الجوال: زر يفتح Sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <ListFilter className="h-4 w-4" />
              الفئات
            </Button>
          </SheetTrigger>
          <SheetContent side="start" className="w-80 overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>الفئات</SheetTitle>
            </SheetHeader>
            {isLoading || !categories ? (
              <NavSkeleton />
            ) : (
              <CategoryNav
                categories={categories}
                activeSlug={activeSlug}
                onNavigate={() => setOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
