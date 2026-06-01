"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** محدّد كمية (+/-) مع حدّ أدنى وأقصى اختياري. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(max ? Math.min(max, value + 1) : value + 1);

  return (
    <div className={cn("flex items-center rounded-md border", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="إنقاص الكمية"
        disabled={value <= min}
        onClick={dec}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-10 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="زيادة الكمية"
        disabled={max !== undefined && value >= max}
        onClick={inc}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
