import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  /** `page` for wide modules, `content` for reading-width editorial copy. */
  width?: "page" | "content";
};

/**
 * Multiple max-widths, not one container (design bible §8). Modules that
 * intentionally bleed wider should skip Container rather than widen it.
 *
 * Text alignment is deliberately *not* set here. §8 asks for rhythm from
 * contrast — wide against contained, editorial against utilitarian — and a
 * centred default applied to every page is the "single central column of
 * identical sections" it rules out. Centre at the call site, per module.
 */
export function Container({
  className,
  width = "page",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 md:px-10",
        width === "page" ? "max-w-page" : "max-w-content",
        className,
      )}
      {...props}
    />
  );
}
