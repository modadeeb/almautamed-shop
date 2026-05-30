"use client";

import { Building2, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/hooks/use-account";

/** مؤشّر نوع الحساب (تجزئة/جملة) يظهر في الترويسة عند تسجيل الدخول. */
export function AccountTypeIndicator({ className }: { className?: string }) {
  const { data: account } = useAccount();
  if (!account) return null;

  const isWholesale = account.accountType === "wholesale";

  return (
    <Badge
      variant={isWholesale ? "default" : "secondary"}
      className={className}
    >
      {isWholesale ? (
        <Building2 className="me-1 h-3.5 w-3.5" />
      ) : (
        <ShoppingBag className="me-1 h-3.5 w-3.5" />
      )}
      {isWholesale ? "حساب جملة" : "حساب تجزئة"}
    </Badge>
  );
}
