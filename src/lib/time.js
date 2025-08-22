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
import { addHours } from "date-fns";
import { eachDayOfInterval } from "date-fns";

export const TZ = "America/Denver";

export const ymd = (d) => formatInTimeZone(d, TZ, "yyyy-MM-dd");
export const nice = (d) => formatInTimeZone(d, TZ, "EEE MMM d");
export const toISO = (d, hhmm) => `${ymd(d)}T${hhmm}:00`;

export function addHoursISO(iso, hours) {
  const end = addHours(new Date(iso), hours);
  return formatInTimeZone(end, TZ, "yyyy-MM-dd'T'HH:mm:ss");
}

export function dayKey(d) {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][d.getDay()];
}

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

// Returns true if [aStart, aEnd) overlaps [bStart, bEnd)
export function overlaps(aStartISO, aEndISO, bStartISO, bEndISO) {
  const aStart = new Date(aStartISO).getTime();
  const aEnd = new Date(aEndISO).getTime();
  const bStart = new Date(bStartISO).getTime();
  const bEnd = new Date(bEndISO).getTime();
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

export function ymdListFromRange(startDate, endDate) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.map((d) => ymd(d));
}
