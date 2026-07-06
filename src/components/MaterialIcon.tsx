import { cn } from "@/lib/utils";

export type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
};

/**
 * Google Material Symbols icon.
 * @see https://fonts.google.com/icons
 */
export function MaterialIcon({
  name,
  className,
  filled = false,
  size = 24,
  weight = 400,
}: MaterialIconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined inline-flex items-center justify-center leading-none select-none",
        className,
      )}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${Math.min(48, Math.max(20, size))}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default MaterialIcon;
