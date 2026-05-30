"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useCartCount, useCartMutations } from "@/hooks/use-cart";
import { formatMoneyObject } from "@/lib/format";

export function CartSheet() {
  const [open, setOpen] = React.useState(false);
  const { data: cart, isLoading } = useCart();
  const count = useCartCount();
  const { updateItem, removeItem } = useCartMutations();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="السلة"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <Badge className="absolute -end-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[11px] tabular-nums">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="end" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            سلة المشتريات
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 opacity-40" />
              <p>سلتك فارغة حالياً</p>
              <SheetClose asChild>
                <Button asChild variant="outline" size="sm">
                  <Link href="/">تصفّح المنتجات</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => {
                const image =
                  item.product.images.find((i) => i.isPrimary) ??
                  item.product.images[0];
                return (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {image && (
                        <Image
                          src={image.url}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-medium leading-snug">
                          {item.product.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label="إزالة"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="إنقاص"
                            onClick={() =>
                              updateItem.mutate({
                                itemId: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="زيادة"
                            onClick={() =>
                              updateItem.mutate({
                                itemId: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatMoneyObject(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t bg-muted/30 p-5">
            <div className="w-full space-y-1.5 text-sm">
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
              <div className="flex justify-between border-t pt-1.5 text-base font-bold">
                <span>الإجمالي</span>
                <span>{formatMoneyObject(cart.total)}</span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <SheetClose asChild>
                <Button asChild variant="outline">
                  <Link href="/cart">عرض السلة</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/checkout">إتمام الشراء</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
