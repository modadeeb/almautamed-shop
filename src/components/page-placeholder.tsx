import Link from "next/link";
import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * هيكل صفحة فارغ للمرحلة 1: عنوان + إشارة "قيد الإنشاء".
 * يُستبدَل محتواه لاحقاً بمنطق الكتالوج/الدفع.
 */
export function PagePlaceholder({
  title,
  description,
  backHref = "/",
  backLabel = "العودة للرئيسية",
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        {description ?? "هذه الصفحة قيد الإنشاء — ستتوفّر في المراحل القادمة."}
      </p>
      <span className="mt-4 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        قيد الإنشاء
      </span>
      <Button asChild variant="outline" className="mt-8">
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </div>
  );
}
