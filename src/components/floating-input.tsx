import type { ComponentProps } from "react";

type Props = ComponentProps<"input"> & { label: string };

/** Text input whose label sits inside the box and floats up to a small
 *  caption when the field is focused or filled. The single-space placeholder
 *  makes `:placeholder-shown` mean "empty", which is how the label knows to
 *  stay small after blur. */
export function FloatingInput({ label, id, className = "", ...rest }: Props) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        placeholder=" "
        className="peer h-14 w-full rounded-xl border border-neutral-400 px-4 pt-5 pb-1 text-base
          focus:border-neutral-900 focus:outline-none"
        {...rest}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-neutral-500 transition-all
          peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs
          peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  );
}
