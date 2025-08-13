import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const TZ = "America/Denver";

export const ymd = (d) => formatInTimeZone(d, TZ, "yyyy-MM-dd");
export const nice = (d) => formatInTimeZone(d, TZ, "EEE MMM d");

export function monthGrid(anchorDate) {
  // Returns an array of Date objects covering the calendar month (Mon–Sun weeks)
  const start = startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 });
  const days = [];
  let cur = start;
  while (cur <= end) {
    days.push(cur);
    cur = addDays(cur, 1);
  }
  return days;
}

export const isSameMonthLocal = (a, b) => isSameMonth(a, b);
export const isTodayLocal = (d) => isToday(d);
