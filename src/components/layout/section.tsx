import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  /** Spacing tiers from design bible §8. */
  spacing?: "compact" | "regular" | "spacious" | "feature";
};

const spacingClass = {
  compact: "py-section-compact",
  regular: "py-section",
  spacious: "py-section-spacious",
  feature: "py-section-feature",
} as const;

/** A full-bleed band. Rhythm comes from spacing, not from stacking equals. */
export function Section({
  className,
  spacing = "regular",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("bg-background text-foreground", spacingClass[spacing], className)}
      {...props}
    />
  );
}
