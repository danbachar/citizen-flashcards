"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseId } from "@/lib/flashcards";
import { cn } from "@/lib/utils";

/** Radix has no empty-string item value, so "no choice" needs a sentinel. */
const ANY = "any";

export type IdOption = {
  id: number;
  label: string;
  /** Drawn as a swatch beside the label. Levels use it; nothing else does. */
  colour?: string;
};

export type IdOptionGroup = {
  label: string;
  options: IdOption[];
};

function isGrouped(
  options: IdOption[] | IdOptionGroup[],
): options is IdOptionGroup[] {
  return options.length > 0 && "options" in options[0];
}

/**
 * A labelled select over rows, where "not narrowed" is a real choice.
 *
 * Every curriculum control is the same shape — pick a row by id, or pick
 * nothing — so the sentinel, the id parsing, and the label all live here once.
 * Options may be flat or grouped; grouping is inferred from their shape rather
 * than switched on by a flag.
 */
export function IdSelect({
  id,
  label,
  placeholder,
  value,
  options,
  onChange,
  className,
  triggerClassName,
}: {
  id: string;
  label: string;
  /** The "not narrowed" choice, e.g. "Every tier". */
  placeholder: string;
  value: number | null;
  options: IdOption[] | IdOptionGroup[];
  onChange: (value: number | null) => void;
  className?: string;
  triggerClassName?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </label>

      <Select
        value={value === null ? ANY : String(value)}
        onValueChange={(next) => onChange(parseId(next))}
      >
        <SelectTrigger id={id} className={cn("w-full", triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{placeholder}</SelectItem>

          {isGrouped(options)
            ? options.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <Option key={option.id} option={option} />
                  ))}
                </SelectGroup>
              ))
            : options.map((option) => (
                <Option key={option.id} option={option} />
              ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Option({ option }: { option: IdOption }) {
  return (
    <SelectItem value={String(option.id)}>
      {option.colour ? (
        <span
          aria-hidden
          className="size-2.5 rounded-full ring-1 ring-foreground/15"
          style={{ backgroundColor: option.colour }}
        />
      ) : null}
      {option.label}
    </SelectItem>
  );
}
