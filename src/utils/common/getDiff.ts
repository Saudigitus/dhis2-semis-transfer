import { parseISO, intervalToDuration, differenceInHours, differenceInDays } from 'date-fns';

export function getFormattedTimeDifference(datString: string) {
    const targetDate = parseISO(datString);
    const now = new Date();
    const isFuture = targetDate > now;

    const duration = intervalToDuration({
        start: isFuture ? now : targetDate,
        end: isFuture ? targetDate : now,
    });

    const totalHours = differenceInHours(targetDate, now);
    const totalDays = differenceInDays(targetDate, now);

    if (Math.abs(totalHours) < 24) return `${duration.hours}h ${duration.minutes}m ago`;
    else if (Math.abs(totalDays) < 30) return `${duration.days} day(s) ago`;
    else return `${duration.months} month(s) ${duration.days} day(s) ago`;
}
