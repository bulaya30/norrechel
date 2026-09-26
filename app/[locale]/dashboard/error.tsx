"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <section
      role="alert"
      aria-labelledby="dashboard-error-heading"
      className="
        relative isolate flex min-h-[70vh]
        items-center justify-center overflow-hidden
        rounded-3xl border border-slate-200
        bg-slate-950 px-6 py-16 text-center
        shadow-sm
      "
    >
      <div
        aria-hidden="true"
        className="
          absolute inset-0 -z-20
          bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.30),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.18),_transparent_30%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute inset-0 -z-10
          bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:48px_48px]
        "
      />

      <div
        className="
          w-full max-w-xl rounded-3xl
          border border-white/15
          bg-white/95 px-6 py-10
          text-slate-950 shadow-2xl
          shadow-black/20 backdrop-blur-xl
          sm:px-10
        "
      >
        <div
          className="
            mx-auto flex size-16 items-center
            justify-center rounded-2xl
            bg-orange-100 text-orange-700
            ring-1 ring-orange-200
          "
        >
          <AlertTriangle
            className="size-8"
            aria-hidden="true"
          />
        </div>

        <p
          className="
            mt-6 text-xs font-bold uppercase
            tracking-[0.22em] text-orange-600
          "
        >
          Dashboard error
        </p>

        <h1
          id="dashboard-error-heading"
          className="
            mt-3 text-3xl font-bold tracking-tight
            text-slate-950 sm:text-4xl
          "
        >
          Something went wrong
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
          The dashboard could not load correctly. Try loading this section
          again. If the problem continues, check the server logs or the data
          query used by this page.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div
            className="
              mt-6 rounded-xl border border-red-200
              bg-red-50 px-4 py-3 text-left
            "
          >
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">
              Development error
            </p>

            <p className="mt-2 break-words text-sm leading-6 text-red-700">
              {error.message}
            </p>

            {error.digest && (
              <p className="mt-2 text-xs text-red-600">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <Button
          type="button"
          onClick={reset}
          className="
            mt-8 h-11 bg-blue-900 px-6
            font-semibold text-white
            transition-all duration-200
            hover:-translate-y-0.5
            hover:bg-blue-800
            focus-visible:ring-blue-700
          "
        >
          <RotateCcw
            className="size-4"
            aria-hidden="true"
          />
          Try again
        </Button>
      </div>

      <div
        aria-hidden="true"
        className="
          absolute bottom-0 left-0 h-px w-full
          bg-gradient-to-r
          from-transparent via-white/30 to-transparent
        "
      />
    </section>
  );
}