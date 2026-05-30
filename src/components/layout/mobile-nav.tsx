"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AccountTypeIndicator } from "@/components/layout/account-type-indicator";
import { SearchBar } from "@/components/layout/search-bar";
import { accountNav, mainNav, site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="start" className="flex w-80 flex-col gap-0 p-0">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{site.name}</SheetTitle>
          <AccountTypeIndicator className="w-fit" />
        </SheetHeader>

        <div className="border-b p-5">
          <SearchBar onSubmitted={close} />
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="px-2 pb-1 pt-2 text-xs font-semibold text-muted-foreground">
            التصفّح
          </p>
          {mainNav.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}

          <p className="px-2 pb-1 pt-4 text-xs font-semibold text-muted-foreground">
            حسابي
          </p>
          {accountNav.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
