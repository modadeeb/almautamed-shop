"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/store-api/types";

/** يبني قائمة هرمية (أب ← أبناء) من مصفوفة الفئات المسطّحة. */
function buildTree(categories: Category[]) {
  const roots = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const childrenOf = (id: string) =>
    categories
      .filter((c) => c.parentId === id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  return { roots, childrenOf };
}

/** قائمة تنقّل الفئات الهرمية. */
export function CategoryNav({
  categories,
  activeSlug,
  onNavigate,
  className,
}: {
  categories: Category[];
  activeSlug?: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const { roots, childrenOf } = buildTree(categories);

  return (
    <nav className={cn("space-y-4", className)} aria-label="الفئات">
      {roots.map((root) => {
        const children = childrenOf(root.id);
        const rootActive = activeSlug === root.slug;
        return (
          <div key={root.id}>
            <Link
              href={`/category/${root.slug}`}
              onClick={onNavigate}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
                rootActive && "bg-accent text-accent-foreground",
              )}
            >
              {root.name}
            </Link>
            {children.length > 0 && (
              <ul className="mt-1 space-y-0.5 ps-3">
                {children.map((child) => {
                  const childActive = activeSlug === child.slug;
                  return (
                    <li key={child.id}>
                      <Link
                        href={`/category/${child.slug}`}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-md border-s px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                          childActive &&
                            "border-primary font-medium text-primary",
                        )}
                      >
                        {child.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
