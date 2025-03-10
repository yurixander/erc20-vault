import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum CommonLink {
  GitHub = "https://github.com/yurixander/erc20-vault",
}
