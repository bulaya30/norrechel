import { View } from "@/features/interfaces/view";
import { isInCurrentWeek, weekDays, normalizeDate } from "@/lib/dates/utils";



export const buildWeeklyViews = (views: View[]) => {

    const weeklyDays = weekDays.map((day) => ({
        name: day,
        views: 0,
    }));

    views.forEach((view) => {
        if (!isInCurrentWeek(view.viewed_at)) {
            return;
        }

        const date = normalizeDate(view.viewed_at);

        if (!date) {
            return;
        }

        const day = weeklyDays[date.getDay()];

        if (day) {
            day.views++;
        }
    });

    return weeklyDays;
};