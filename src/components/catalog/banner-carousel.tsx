"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/store-api/types";

/** كاروسيل بانرات بسيط مع تقدّم تلقائي وأزرار وتنقّل بالنقاط (RTL). */
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = React.useState(0);
  const count = banners.length;

  const go = React.useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border shadow-soft">
      <div
        className="flex transition-transform duration-500 ease-out"
        // RTL: الشرائح تتراصّ من اليمين، لذا نزيح بالاتجاه الموجب.
        style={{ transform: `translateX(${index * 100}%)` }}
      >
        {banners.map((banner) => {
          const content = (
            <div className="relative aspect-[16/7] w-full sm:aspect-[16/5]">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center bg-gradient-to-l from-black/55 via-black/20 to-transparent p-6 sm:p-12">
                <h2 className="max-w-md text-xl font-bold text-white drop-shadow sm:text-3xl">
                  {banner.title}
                </h2>
              </div>
            </div>
          );
          return (
            <div key={banner.id} className="w-full shrink-0">
              {banner.linkUrl ? (
                <Link href={banner.linkUrl}>{content}</Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute end-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full opacity-80 shadow-soft hover:opacity-100"
            aria-label="التالي"
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute start-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full opacity-80 shadow-soft hover:opacity-100"
            aria-label="السابق"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-3 start-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                aria-label={`الشريحة ${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  "h-2 rounded-full bg-white/60 transition-all",
                  i === index ? "w-5 bg-white" : "w-2",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
