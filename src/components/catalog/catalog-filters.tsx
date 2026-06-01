"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface CatalogFilterValue {
  sort: "newest" | "price_asc" | "price_desc" | "name";
  inStockOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export const defaultFilterValue: CatalogFilterValue = {
  sort: "newest",
  inStockOnly: false,
};

const sortOptions: { value: CatalogFilterValue["sort"]; label: string }[] = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
  { value: "name", label: "الاسم (أبجدي)" },
];

/** الحقول الفعلية للفلاتر (تُستخدم داخل الـ aside وداخل الـ Sheet). */
function FilterFields({
  draft,
  setDraft,
}: {
  draft: CatalogFilterValue;
  setDraft: React.Dispatch<React.SetStateAction<CatalogFilterValue>>;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="sort">
          الترتيب
        </label>
        <select
          id="sort"
          value={draft.sort}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              sort: e.target.value as CatalogFilterValue["sort"],
            }))
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-semibold">نطاق السعر</span>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="من"
            value={draft.minPrice ?? ""}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="إلى"
            value={draft.maxPrice ?? ""}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
        <input
          type="checkbox"
          checked={draft.inStockOnly}
          onChange={(e) =>
            setDraft((d) => ({ ...d, inStockOnly: e.target.checked }))
          }
          className="h-4 w-4 rounded border-input accent-primary"
        />
        المتوفر فقط
      </label>
    </div>
  );
}

/** لوحة فلاتر الكتالوج: مدمجة على سطح المكتب، وداخل Sheet على الجوال. */
export function CatalogFilters({
  value,
  onChange,
  className,
}: {
  value: CatalogFilterValue;
  onChange: (next: CatalogFilterValue) => void;
  className?: string;
}) {
  // مسودّة محلية لزر "تطبيق" على الجوال.
  const [draft, setDraft] = React.useState(value);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setDraft(value), [value]);

  const reset = () => {
    setDraft(defaultFilterValue);
    onChange(defaultFilterValue);
  };

  return (
    <>
      {/* سطح المكتب: لوحة مدمجة تُطبّق فوراً */}
      <div
        className={cn(
          "hidden rounded-xl border bg-card p-4 shadow-soft lg:block",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold">تصفية</h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={reset}
          >
            إعادة تعيين
          </Button>
        </div>
        <FilterFields draft={value} setDraft={(updater) => {
          const next =
            typeof updater === "function"
              ? (updater as (p: CatalogFilterValue) => CatalogFilterValue)(value)
              : updater;
          onChange(next);
        }} />
      </div>

      {/* الجوال: زر يفتح Sheet مع "تطبيق" */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              تصفية
            </Button>
          </SheetTrigger>
          <SheetContent side="end" className="flex w-80 flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>تصفية النتائج</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <FilterFields draft={draft} setDraft={setDraft} />
            </div>
            <SheetFooter className="mt-4 flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDraft(defaultFilterValue);
                }}
              >
                إعادة تعيين
              </Button>
              <SheetClose asChild>
                <Button
                  className="flex-1"
                  onClick={() => onChange(draft)}
                >
                  تطبيق
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
