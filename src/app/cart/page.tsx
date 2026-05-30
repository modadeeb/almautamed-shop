"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingCart, Tag, Trash2 } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { QuantityStepper } from "@/components/catalog/quantity-stepper";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useCartMutations } from "@/hooks/use-cart";
import { formatMoneyObject } from "@/lib/format";

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border p-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function CartPage() {
  const { data: cart, isLoading, isError } = useCart();
  const { updateItem, removeItem, applyCoupon } = useCartMutations();
  const [coupon, setCoupon] = React.useState("");

  return (
    <div className="container py-6">
      <Breadcrumbs items={[{ label: "سلة المشتريات" }]} />
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">سلة المشتريات</h1>

      {isLoading ? (
        <CartSkeleton />
      ) : isError ? (
        <EmptyState
          title="تعذّر تحميل السلة"
          description="حدث خطأ أثناء الجلب. حاول إعادة تحميل الصفحة."
        />
      ) : !cart || cart.items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="سلتك فارغة"
          description="لم تُضِف أي منتجات بعد. تصفّح الكتالوج وأضف ما يناسبك."
          action={
            <Button asChild>
              <Link href="/">تصفّح المنتجات</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          {/* قائمة البنود */}
          <div className="space-y-4">
            {cart.items.map((item) => {
              const image =
                item.product.images.find((i) => i.isPrimary) ??
                item.product.images[0];
              const removing =
                removeItem.isPending && removeItem.variables === item.id;
              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border bg-card p-4 shadow-soft"
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted"
                  >
                    {image && (
                      <Image
                        src={image.url}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="line-clamp-2 font-semibold leading-snug hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatMoneyObject(item.unitPrice)} / للوحدة
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label="إزالة"
                        disabled={removing}
                        onClick={() => removeItem.mutate(item.id)}
                      >
                        {removing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        max={item.product.availableQuantity}
                        onChange={(q) =>
                          updateItem.mutate({ itemId: item.id, quantity: q })
                        }
                      />
                      <span className="font-bold">
                        {formatMoneyObject(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* الملخّص */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Card>
              <CardContent className="space-y-5 p-5">
                <h2 className="font-bold">ملخّص الطلب</h2>

                {/* الكوبون */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (coupon.trim()) applyCoupon.mutate(coupon.trim());
                  }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-1.5 text-sm font-medium">
                    <Tag className="h-3.5 w-3.5" />
                    كوبون الخصم
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="مثال: WELCOME10"
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={applyCoupon.isPending || !coupon.trim()}
                    >
                      {applyCoupon.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "تطبيق"
                      )}
                    </Button>
                  </div>
                  {cart.couponCode && cart.discount.amount > 0 && (
                    <p className="text-xs text-success">
                      الكوبون «{cart.couponCode}» مُطبّق.
                    </p>
                  )}
                </form>

                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>المجموع الفرعي</span>
                    <span>{formatMoneyObject(cart.subtotal)}</span>
                  </div>
                  {cart.discount.amount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>الخصم</span>
                      <span>− {formatMoneyObject(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>الإجمالي</span>
                    <span>{formatMoneyObject(cart.total)}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    متابعة للدفع
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/">مواصلة التسوّق</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
