import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** يدمج أصناف Tailwind بأمان (يحل التعارضات) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
