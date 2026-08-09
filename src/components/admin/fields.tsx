/**
 * Form primitives for the admin dashboard.
 *
 * Server components with no client JavaScript: every form here posts to a
 * Server Action and works with scripting disabled. Design bible §10 — forms
 * must never be left in browser-default styling, so the controls carry the
 * brand's border, radius, and focus ring.
 */
import { cn } from "@/lib/utils";

const controlClass =
  "h-9 w-full rounded-md border border-border bg-surface-raised px-3 text-sm " +
  "outline-none transition-colors placeholder:text-muted-foreground/70 " +
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";

export function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-border bg-surface-raised rounded-lg border p-5",
        className,
      )}
    >
      <h2 className="text-base font-medium">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  min,
  hint,
  className,
  dir,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: "text" | "number" | "color" | "password";
  required?: boolean;
  min?: number;
  hint?: string;
  className?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        dir={dir}
        required={required}
        min={min}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        className={cn(controlClass, type === "color" && "p-1")}
      />
      {hint ? (
        <span className="text-muted-foreground mt-1 block text-xs">{hint}</span>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  className,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      {/* A native select, deliberately: the shadcn Select is a client component
          and this form must submit without JavaScript. */}
      <select name={name} defaultValue={defaultValue} className={controlClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-2.5 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="border-border accent-primary mt-0.5 size-4 rounded"
      />
      <span>
        {label}
        {hint ? (
          <span className="text-muted-foreground block text-xs">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

/** Renders the `?error=` a failed Server Action redirected back with. */
export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="border-destructive/30 bg-destructive/10 text-destructive mb-6 rounded-md border px-4 py-3 text-sm"
    >
      {message}
    </p>
  );
}

/** A swatch beside a colour, so a hex value is legible at a glance. */
export function Swatch({ colour }: { colour: string }) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: colour }}
      className="border-border inline-block size-4 shrink-0 rounded-full border align-middle"
    />
  );
}
