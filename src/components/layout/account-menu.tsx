"use client";

import Link from "next/link";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { accountNav } from "@/lib/site";
import { useAccount } from "@/hooks/use-account";

export function AccountMenu() {
  const { data: account, isLoading } = useAccount();

  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  // غير مسجّل: أزرار دخول/تسجيل.
  if (!account) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">دخول</span>
          </Link>
        </Button>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/register">
            <UserPlus className="h-4 w-4" />
            تسجيل
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="حسابي">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{account.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {account.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountNav.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.title}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
