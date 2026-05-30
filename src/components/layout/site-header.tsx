import Link from "next/link";

import { AccountMenu } from "@/components/layout/account-menu";
import { AccountTypeIndicator } from "@/components/layout/account-type-indicator";
import { CartSheet } from "@/components/layout/cart-sheet";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchBar } from "@/components/layout/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { mainNav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      {/* الصف العلوي: الشعار، البحث، الإجراءات */}
      <div className="container flex h-16 items-center gap-3">
        <MobileNav />
        <Logo />

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <AccountTypeIndicator className="hidden lg:inline-flex" />
          <ThemeToggle />
          <CartSheet />
          <AccountMenu />
        </div>
      </div>

      {/* شريط التصنيفات (سطح المكتب) */}
      <nav className="hidden border-t md:block">
        <div className="container flex h-11 items-center gap-1 overflow-x-auto">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
