import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * className utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
