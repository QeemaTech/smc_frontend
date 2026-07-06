import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export {
  getApiOrigin,
  getImageUrl,
  isValidImageValue,
  normalizeImagePath,
  resolveImageSrc,
} from "./images";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
