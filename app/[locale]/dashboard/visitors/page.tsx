import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowLeft,
  Globe2,
  Monitor,
  Users,
  CalendarDays,
  MapPin,
  Clock3,
  Fingerprint,
  Laptop,
} from "lucide-react";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";
import { getCachedVisitors } from "@/features/visitors/queries/visitor.queries";
import { normalizeDate, readableDate } from "@/lib/dates/utils";
import { formatNumber } from "@/lib/dates/formatters";

import type {
  Visitor,
  VisitorDevice,
} from "@/features/interfaces/visitor";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

type Period = "7d" | "30d" | "90d";

interface VisitorsPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
  searchParams: Promise<{
    period?: string | string[];
  }>;
}

interface DeviceDetails {
  deviceType: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
}

const PERIOD_DAYS: Record<Period, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function getObject(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Supports both the flat VisitorDevice interface and the nested
 * UAParser object currently written by VisitorService.buildContext().
 */
function getDeviceDetails(device: VisitorDevice): DeviceDetails {
  const details = getObject(device);

  const nestedDevice = getObject(details.device);
  const nestedOS = getObject(details.os);
  const nestedBrowser = getObject(details.browser);

  return {
    deviceType:
      getString(details.deviceType) ||
      getString(nestedDevice.type) ||
      getString(nestedDevice.model) ||
      getString(nestedDevice.vendor),

    os:
      getString(details.os) ||
      getString(nestedOS.name),

    osVersion:
      getString(details.osVersion) ||
      getString(nestedOS.version),

    browser:
      getString(details.browser) ||
      getString(nestedBrowser.name),

    browserVersion:
      getString(details.browserVersion) ||
      getString(nestedBrowser.version) ||
      getString(nestedBrowser.major),
  };
}

function getDayKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default async function VisitorsPage({
  params,
  searchParams,
}: VisitorsPageProps) {
  const { locale } = await params;

  await requireAuthenticatedUser();

  const t = await getTranslations({
    locale,
    namespace: "VisitorsPage",
  });

  const query = await searchParams;

  const requestedPeriod = Array.isArray(query.period)
    ? query.period[0]
    : query.period;

  const period: Period =
    requestedPeriod === "30d" || requestedPeriod === "90d"
      ? requestedPeriod
      : "7d";

  const records: Visitor[] = await getCachedVisitors();

  const now = new Date();
  const startDate = new Date(now);

  startDate.setDate(
    startDate.getDate() - (PERIOD_DAYS[period] - 1),
  );
  startDate.setHours(0, 0, 0, 0);

  const datedRecords = records
    .filter((visitor) => !visitor.deletedAt)
    .map((visitor) => ({
      visitor,
      date: normalizeDate(visitor.date),
      lastSeen: normalizeDate(visitor.lastSeenAt),
      lastSession: normalizeDate(visitor.lastSessionAt),
    }));

  const filteredRecords = datedRecords
    .filter(({ date, lastSeen }) => {
      const activityDate = lastSeen ?? date;

      return (
        activityDate !== null &&
        activityDate >= startDate &&
        activityDate <= now
      );
    })
    .sort((a, b) => {
      const aTime = a.lastSeen?.getTime() ?? 0;
      const bTime = b.lastSeen?.getTime() ?? 0;

      return bTime - aTime;
    });

  const uniqueVisitors = new Set(
    filteredRecords.map(({ visitor }) => visitor.visitorId),
  ).size;

  // visitorCount is the accumulated session count for each visitor.
  const estimatedSessions = filteredRecords.reduce(
    (total, { visitor }) =>
      total + Math.max(0, visitor.visitorCount ?? 0),
    0,
  );

  const countryCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();

  for (const { visitor, date, lastSeen } of filteredRecords) {
    const country = visitor.country?.trim() || t("unknown");

    countryCounts.set(
      country,
      (countryCounts.get(country) ?? 0) + 1,
    );

    const details = getDeviceDetails(visitor.device);

    const deviceLabel =
      details.deviceType ||
      details.os ||
      details.browser ||
      t("unknown");

    deviceCounts.set(
      deviceLabel,
      (deviceCounts.get(deviceLabel) ?? 0) + 1,
    );

    const activityDate = lastSeen ?? date;

    if (activityDate) {
      const key = getDayKey(activityDate);

      dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
    }
  }

  const dailyActivity = Array.from(
    { length: PERIOD_DAYS[period] },
    (_, index) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + index);

      return {
        key: getDayKey(day),
        label: new Intl.DateTimeFormat(
          locale === "fr" ? "fr-FR" : "en-US",
          {
            day: "numeric",
            month: "short",
          },
        ).format(day),
        count: dailyCounts.get(getDayKey(day)) ?? 0,
      };
    },
  );

  const maxDailyCount = Math.max(
    1,
    ...dailyActivity.map((day) => day.count),
  );

  const topCountries = [...countryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const topDevices = [...deviceCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const metrics = [
    {
      label: t("totalVisitors"),
      value: formatNumber(filteredRecords.length, locale),
      icon: Users,
    },
    {
      label: t("uniqueVisitors"),
      value: formatNumber(uniqueVisitors, locale),
      icon: Globe2,
    },
    {
      label: t("estimatedSessions"),
      value: formatNumber(estimatedSessions, locale),
      icon: CalendarDays,
    },
  ];

  return (
    <main className="space-y-8">
      {/* Page heading and period filter */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href={`/${locale}/dashboard`}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("backToDashboard")}
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
            {t("eyebrow")}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {t("title")}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {t("description")}
          </p>
        </div>

        <nav
          aria-label={t("periodFilter")}
          className="flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white p-1"
        >
          {(["7d", "30d", "90d"] as const).map((value) => (
            <Link
              key={value}
              href={`/${locale}/dashboard/visitors?period=${value}`}
              aria-current={period === value ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                period === value
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {t(value)}
            </Link>
          ))}
        </nav>
      </header>

      {/* Summary cards */}
      <section
        aria-label={t("summary")}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {metrics.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {value}
                </p>
              </div>

              <span className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* Visitor activity chart */}
      <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-950">
            {t("visitorActivity")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("visitorActivityDescription")}
          </p>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center">
            <Users
              className="mx-auto size-8 text-slate-300"
              aria-hidden="true"
            />

            <p className="mt-3 font-semibold text-slate-800">
              {t("noVisitors")}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {t("noVisitorsDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyActivity.map((day) => (
              <div
                key={day.key}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3"
              >
                <span className="text-xs text-slate-500">
                  {day.label}
                </span>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${(day.count / maxDailyCount) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-right text-xs font-semibold tabular-nums text-slate-700">
                  {formatNumber(day.count, locale)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Visitor records table */}
      <section className="border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {t("visitorRecords")}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {t("visitorRecordsDescription")}
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-500">
              {formatNumber(filteredRecords.length, locale)}
            </span>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            {t("noVisitors")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    {t("location")}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {t("deviceInformation")}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {t("firstVisit")}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {t("lastSeen")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(
                  ({ visitor, date, lastSeen, lastSession }) => {
                    const device = getDeviceDetails(visitor.device);

                    const location = [
                      visitor.city?.trim(),
                      visitor.country?.trim(),
                    ].filter(Boolean);

                    return (
                      <tr
                        key={visitor.id ?? visitor.visitorId}
                        className="transition-colors hover:bg-slate-50/80"
                      >

                        <td className="px-5 py-4">
                          <div className="flex items-start gap-2 text-slate-700">
                            <MapPin
                              className="mt-0.5 size-4 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />

                            <span>
                              {location.length
                                ? location.join(", ")
                                : t("unknown")}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-start gap-2">
                            <Laptop
                              className="mt-0.5 size-4 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />

                            <div className="space-y-1">
                              <p className="font-medium text-slate-800">
                                {device.deviceType ||
                                  device.os ||
                                  t("unknown")}
                              </p>

                              <p className="text-xs text-slate-500">
                                {[
                                  device.browser,
                                  device.browserVersion,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || t("unknown")}
                              </p>

                              <p className="text-xs text-slate-500">
                                {[
                                  device.os,
                                  device.osVersion,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || t("unknown")}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="flex items-start gap-2">
                            <CalendarDays
                              className="mt-0.5 size-4 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />

                            <span>{readableDate(date, locale)}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="flex items-start gap-2">
                            <Clock3
                              className="mt-0.5 size-4 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />

                            <div>
                              <p>{readableDate(lastSeen, locale)}</p>

                              {lastSession && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {t("lastSession")}:{" "}
                                  {readableDate(lastSession, locale)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Country and device summaries */}
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Globe2
              className="size-5 text-orange-600"
              aria-hidden="true"
            />

            <h2 className="text-lg font-bold text-slate-950">
              {t("topCountries")}
            </h2>
          </div>

          {topCountries.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              {t("noBreakdown")}
            </p>
          ) : (
            <ul className="space-y-4">
              {topCountries.map(([country, count]) => (
                <li
                  key={country}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate text-sm font-medium text-slate-700">
                    {country}
                  </span>

                  <span className="text-sm font-semibold tabular-nums text-slate-950">
                    {formatNumber(count, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Monitor
              className="size-5 text-orange-600"
              aria-hidden="true"
            />

            <h2 className="text-lg font-bold text-slate-950">
              {t("devices")}
            </h2>
          </div>

          {topDevices.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              {t("noBreakdown")}
            </p>
          ) : (
            <ul className="space-y-4">
              {topDevices.map(([device, count]) => (
                <li
                  key={device}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate text-sm font-medium text-slate-700">
                    {device}
                  </span>

                  <span className="text-sm font-semibold tabular-nums text-slate-950">
                    {formatNumber(count, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}