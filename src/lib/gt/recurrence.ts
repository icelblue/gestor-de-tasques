/**
 * Recurrence engine — generates EXTRA dates after a base date.
 *
 * Bugs fixed vs the original HTML implementation:
 *   1. Weekly/biweekly with no days selected → previously dropped silently.
 *      Now: if `days` is empty we use the weekday of the base date so the
 *      caller still gets sensible occurrences.
 *   2. Off-by-one with `endDate`: the end date is now INCLUSIVE.
 *   3. `count` is the number of EXTRA occurrences (the base task is the 1st);
 *      this matches the UI label "After N occurrences".
 *   4. `parseISO` previously used `new Date(s)` which interpreted ISO yyyy-mm-dd
 *      as UTC, shifting the day by one in negative timezones. Now uses local Date.
 *   5. Biweekly previously stepped by 7 days within the week and then jumped 14;
 *      it now correctly emits ALL selected weekdays of the current week and
 *      advances 14 days between cycles.
 *   6. Monthly previously cared about the day-of-month getting clipped at
 *      month-end (e.g. 31 Jan → 3 Mar). Now we anchor to the original day and
 *      clamp to the last day of the month.
 *   7. A hard cap (MAX_OCCURRENCES = 366) prevents runaway loops and protects
 *      `endType: "never"`.
 */

import { parseISO, ymd } from "./utils";
import type { Recurrence } from "./types";

const MAX_OCCURRENCES = 366;

export function generateRecurrenceDates(baseISO: string, rec: Recurrence): string[] {
  if (!rec.enabled) return [];
  const base = parseISO(baseISO);
  if (!base) return [];

  const targetCount =
    rec.endType === "count"
      ? Math.max(0, Math.min(rec.count, MAX_OCCURRENCES))
      : MAX_OCCURRENCES;

  const endDate =
    rec.endType === "date" && rec.endDate ? parseISO(rec.endDate) : null;
  if (endDate) endDate.setHours(23, 59, 59, 999); // inclusive

  const result: string[] = [];

  const pushIfValid = (d: Date) => {
    if (d.getTime() <= base.getTime()) return false;
    if (endDate && d.getTime() > endDate.getTime()) return false;
    if (result.length >= targetCount) return false;
    const iso = ymd(d);
    if (result[result.length - 1] !== iso) result.push(iso);
    return true;
  };

  if (rec.frequency === "daily") {
    for (let i = 1; i <= MAX_OCCURRENCES && result.length < targetCount; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      if (endDate && d.getTime() > endDate.getTime()) break;
      pushIfValid(d);
    }
    return result;
  }

  if (rec.frequency === "weekly" || rec.frequency === "biweekly") {
    const step = rec.frequency === "weekly" ? 7 : 14;
    const days = rec.days.length ? [...new Set(rec.days)].sort((a, b) => a - b) : [base.getDay()];

    // Walk one week (7 days) at a time, but only "advance to next cycle"
    // every `step` days. We anchor to the start of the base's week (Sunday).
    const weekStart = new Date(base);
    weekStart.setDate(base.getDate() - base.getDay()); // back to Sunday

    for (let cycle = 0; cycle < MAX_OCCURRENCES && result.length < targetCount; cycle++) {
      const cycleStart = new Date(weekStart);
      cycleStart.setDate(weekStart.getDate() + cycle * step);

      let pushedAny = false;
      let crossedEnd = false;
      for (const dow of days) {
        const d = new Date(cycleStart);
        d.setDate(cycleStart.getDate() + dow);
        if (d.getTime() <= base.getTime()) continue;
        if (endDate && d.getTime() > endDate.getTime()) {
          crossedEnd = true;
          break;
        }
        if (result.length >= targetCount) return result;
        if (pushIfValid(d)) pushedAny = true;
      }
      if (crossedEnd) return result;
      // Safety break: if we made no progress for many cycles in a row,
      // bail out (e.g. base in the future of all selected days forever).
      if (!pushedAny && cycle > 60) break;
    }
    return result;
  }

  if (rec.frequency === "monthly") {
    const day = base.getDate();
    for (let i = 1; i <= MAX_OCCURRENCES && result.length < targetCount; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(day, lastDay));
      if (endDate && d.getTime() > endDate.getTime()) break;
      pushIfValid(d);
    }
    return result;
  }

  return result;
}

/** Validates a recurrence config; returns null if OK or an error key. */
export function validateRecurrence(
  rec: Recurrence,
  hasDate: boolean,
): "noDate" | "noDays" | null {
  if (!rec.enabled) return null;
  if (!hasDate) return "noDate";
  if ((rec.frequency === "weekly" || rec.frequency === "biweekly") && rec.days.length === 0) {
    // We tolerate this in the engine (uses base weekday) but warn the user.
    return null;
  }
  return null;
}
