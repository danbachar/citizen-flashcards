import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  /** Spacing tiers from design bible §8. */
  spacing?: "compact" | "regular" | "spacious" | "feature";
  /** `dark` renders a charcoal band; alternate it to pace the page. */
  tone?: "base" | "raised" | "dark" | "yellow";
  as?: "section" | "footer" | "div";
};

const spacingClass = {
  compact: "py-section-compact",
  regular: "py-section",
  spacious: "py-section-spacious",
  feature: "py-section-feature",
} as const;

const toneClass = {
  base: "bg-background text-foreground",
  raised: "bg-surface-raised text-foreground",
  dark: "dark bg-background text-foreground",
  yellow: "bg-brand-yellow text-brand-charcoal",
} as const;

/**
 * A full-bleed band. Rhythm comes from alternating tone and spacing between
 * sections — not from stacking identical centered blocks.
 */
export function Section({
  className,
  spacing = "regular",
  tone = "base",
  as: Tag = "section",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(spacingClass[spacing], toneClass[tone], className)}
      {...(props as React.ComponentProps<"div">)}
    />
  );
}
