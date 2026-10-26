"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { HelpTip } from "@/components/help-tip";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const select =
  "h-14 w-full appearance-none rounded-xl border border-neutral-400 bg-transparent pl-4 pr-10 text-base " +
  "invalid:text-neutral-500 focus:border-neutral-900 focus:outline-none";

function Field({
  name,
  label,
  autoComplete,
  children,
  className = "",
}: {
  name: string;
  label: string;
  autoComplete: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <select
        id={name}
        name={name}
        autoComplete={autoComplete}
        required
        defaultValue=""
        className={select}
      >
        <option value="" disabled>
          {label}
        </option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}

const noop = () => () => {};
const readYear = () => new Date().getFullYear();
// Server prerender never reads the clock (Next 16 forbids it in client
// components); it renders the placeholder-only list and the browser fills in
// the years on hydration.
const serverYear = () => 0;

export function BirthdaySelect() {
  const thisYear = useSyncExternalStore(noop, readYear, serverYear);
  const years = thisYear
    ? Array.from({ length: 100 }, (_, i) => thisYear - i)
    : [];
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
        <span>Birthday</span>
        <HelpTip label="Why we ask for your birthday">
          This information is used to determine the services available for your
          account.
        </HelpTip>
      </div>
      <div className="flex w-full gap-2">
        <Field
          name="bdayMonth"
          label="Month"
          autoComplete="bday-month"
          className="flex-[2]"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </Field>
        <Field
          name="bdayDay"
          label="Day"
          autoComplete="bday-day"
          className="flex-1"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Field>
        <Field
          name="bdayYear"
          label="Year"
          autoComplete="bday-year"
          className="flex-[1.4]"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Field>
      </div>
    </div>
  );
}

/** Reads the three selects out of a submitted form. Returns null if the
 *  combination isn't a real date (e.g. February 30). */
export function readBirthday(form: FormData): Date | null {
  const y = Number(form.get("bdayYear"));
  const m = Number(form.get("bdayMonth"));
  const d = Number(form.get("bdayDay"));
  const date = new Date(Date.UTC(y, m - 1, d));
  // JS rolls impossible dates forward into the next month.
  return date.getUTCMonth() === m - 1 ? date : null;
}
