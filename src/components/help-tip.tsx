"use client";

import { Question } from "@phosphor-icons/react";
import { cn } from "cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  /** What a screen reader announces for the button, e.g. "Why we ask". */
  label: string;
  children: React.ReactNode;
  className?: string;
};

/** The circled "?" that opens a short explanation. A real button so keyboards
 *  and screen readers reach it; opens on hover and on focus. */
export function HelpTip({ label, children, className }: Props) {
  return (
    // Base UI waits 600ms by default, long enough that a quick hover never
    // sees it. The delay lives on the provider; 150ms reads as instant.
    <TooltipProvider delay={150}>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={label}
              className={cn(
                "inline-flex rounded-full text-neutral-500 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
                className,
              )}
            />
          }
        >
          <Question size={16} weight="fill" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-center">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
