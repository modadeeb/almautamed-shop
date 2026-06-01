import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label={site.name}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Plus className="h-5 w-5" strokeWidth={2.75} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold text-foreground">{site.name}</span>
        <span className="hidden text-[11px] text-muted-foreground sm:block">
          أدوية ومستلزمات طبية
        </span>
      </span>
    </Link>
  );
}
