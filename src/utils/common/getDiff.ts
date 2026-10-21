import { parseISO, intervalToDuration, differenceInMinutes, differenceInDays } from 'date-fns';
import { D2I18n } from 'dhis2-semis-types';

// Elapsed time since a past date: "Just now", "5 min ago", "2h 15m ago", "3 days ago", "1 month 2 days ago".
export function getFormattedTimeDifference(datString: string, i18n: D2I18n) {
    const targetDate = parseISO(datString);
    const now = new Date();
    const isFuture = targetDate > now;

    const duration = intervalToDuration({
        start: isFuture ? now : targetDate,
        end: isFuture ? targetDate : now,
    });

    const totalMinutes = Math.abs(differenceInMinutes(targetDate, now));
    const totalDays = Math.abs(differenceInDays(targetDate, now));
    const days = (count: number) => count === 1 ? i18n.t('1 day') : i18n.t('{{days}} days', { days: count });
    const months = (count: number) => count === 1 ? i18n.t('1 month') : i18n.t('{{months}} months', { months: count });
    const ago = (time: string) => i18n.t('{{time}} ago', { time });

    if (totalMinutes < 1) return i18n.t('Just now');
    if (totalMinutes < 60) return ago(`${totalMinutes} min`);
    if (totalMinutes < 24 * 60) return ago(`${duration.hours ?? 0}h ${duration.minutes ?? 0}m`);
    if (totalDays < 30) return ago(days(totalDays));

    const totalMonths = (duration.years ?? 0) * 12 + (duration.months ?? 0);
    return ago(duration.days ? `${months(totalMonths)} ${days(duration.days)}` : months(totalMonths));
}
