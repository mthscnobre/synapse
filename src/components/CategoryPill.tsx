import { cn } from "@/lib/utils";

interface CategoryPillProps {
  category: string;
  color?: string;
  small?: boolean;
}

const getTextColorForBackground = (bgColor: string): string => {
  if (!bgColor) return "text-foreground";
  const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "text-black" : "text-white";
};

export function CategoryPill({ category, color, small }: CategoryPillProps) {
  const textColorClass = getTextColorForBackground(color || "");

  return (
    <span
      className={cn(
        "font-semibold rounded-full",
        small ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs",
        !color && "bg-muted text-muted-foreground",
        color && textColorClass
      )}
      style={{ backgroundColor: color || undefined }}
    >
      {category}
    </span>
  );
}
