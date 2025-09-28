import { formatDate } from "date-fns";

import type { Session } from "../types.js";

const hourMinuteFormat = "h:mm";
const timeFormat = "h:mm aaa";
const monthDayFormat = "LLL d";
const monthDayYearFormat = `${monthDayFormat}, yyyy`;
const dateTimeFormat = `${timeFormat}, ${monthDayFormat}`;
const fullDateFormat = `${timeFormat}, ${monthDayYearFormat}`;
// -8 here
const currentTimezoneOffset = new Date().getTimezoneOffset() / 60;
const losAngelesTimezoneOffset = 7;

export const formatSessionTime = (
  session: Session,
  shouldUseLocalTz: boolean,
) => {
  try {
    // GMT+8 (current) -> GMT-7 (-7 * 60 * 60 * 1000)
    // should -15
    const startsAtDate =
      new Date(session.startsAt).getTime() -
      (shouldUseLocalTz
        ? 0
        : (-currentTimezoneOffset + losAngelesTimezoneOffset) * 60 * 60 * 1000);
    const endsAtDate =
      new Date(session.endsAt).getTime() -
      (shouldUseLocalTz
        ? 0
        : (-currentTimezoneOffset + losAngelesTimezoneOffset) * 60 * 60 * 1000);

    return `${formatDate(startsAtDate, timeFormat)} - ${formatDate(
      endsAtDate,
      timeFormat,
    )}`;
  } catch {
    return "...";
  }
};

export const formatFullDate = (dateString: string) => {
  try {
    return formatDate(new Date(dateString), fullDateFormat);
  } catch {
    return "...";
  }
};

export const getCurrentTimezone = () => {
  try {
    return formatDate(new Date(), "zzzz");
  } catch {
    return "...";
  }
};

export const isDayOneSession = (date: string) => {
  try {
    return (
      formatDate(
        new Date(date).getTime() -
          (-currentTimezoneOffset + losAngelesTimezoneOffset) * 60 * 60 * 1000,
        monthDayYearFormat,
      ) === "May 15, 2024"
    );
  } catch {
    return false;
  }
};

export const isDayTwoSession = (date: string) => {
  try {
    return (
      formatDate(
        new Date(date).getTime() -
          (-currentTimezoneOffset + losAngelesTimezoneOffset) * 60 * 60 * 1000,
        monthDayYearFormat,
      ) === "May 16, 2024"
    );
  } catch {
    return false;
  }
};
