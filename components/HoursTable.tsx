"use client";

import { useSyncExternalStore } from "react";
import { schedule, WEEK_ORDER, WEEKDAY_NAMES, type Weekday } from "@/config/site";
import { weekdayOf, wallClock } from "@/lib/availability";
import { hoursLabel } from "@/lib/format";

const noop = () => () => {};
const todayWeekday = () => weekdayOf(wallClock(new Date(), schedule.timeZone).date);

/** Programul săptămânal; ziua de azi e evidențiată (doar în browser). */
export function HoursTable() {
  const today = useSyncExternalStore<Weekday | -1>(noop, todayWeekday, () => -1);
  return (
    <table className="hours-table">
      <caption className="visually-hidden">Program de lucru</caption>
      <tbody>
        {WEEK_ORDER.map((d) => (
          <tr key={d} data-today={d === today}>
            <th scope="row">
              {WEEKDAY_NAMES[d]}
              {d === today && <span className="visually-hidden"> (azi)</span>}
            </th>
            <td>{hoursLabel(schedule.weekly[d])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
