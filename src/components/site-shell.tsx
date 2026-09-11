import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { healthQuery } from "@/lib/queries";
import { API_BASE_URL } from "@/lib/api";
import { Lamp } from "@/components/control";

const NAV = [
  { to: "/dashboard", label: "/ CONTROL" },
  { to: "/requests", label: "/ REQUESTS" },
  { to: "/what-if", label: "/ WHAT-IF" },
  { to: "/plan", label: "/ PLAN" },
  { to: "/priority", label: "/ PRIORITY" },
  { to: "/risks", label: "/ RISKS" },
  { to: "/impact", label: "/ IMPACT" },
  { to: "/about", label: "/ ABOUT" },
];

export function useEngineHealth() {
  return useQuery(healthQuery);
}

export function EngineOfflineBanner() {
  const { isError, error } = useEngineHealth();
  if (!isError) return null;
  return (
    <div className="border-b border-signal/40 bg-signal/15">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-6 py-2">
        <Lamp tone="danger" />
        <span className="font-mono text-[11px] tracking-wide text-signal">
          AI ENGINE OFFLINE — {(error as Error)?.message ?? `ML service unavailable at ${API_BASE_URL}`}
        </span>
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { data, isError, isLoading } = useEngineHealth();
  const tone = isError ? "danger" : isLoading ? "signal" : "clear";
  const statusLabel = isError ? "DOWN" : isLoading ? "…" : (data?.status ?? "UP");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-cream">
      <div className="dusk pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-90" />
      <div className="vignette pointer-events-none absolute inset-x-0 top-0 h-[460px]" />

      <header className="sticky top-0 z-20 border-b border-line/80 bg-ink/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="chrome grid size-8 place-items-center rounded-md font-display text-sm font-bold">S</span>
            <span className="leading-none">
              <span className="block font-display text-sm font-semibold tracking-wide">SHADOWBLOCK</span>
              <span className="block font-mono text-[10px] tracking-[0.2em] text-steel">BLOCK PLANNER · CONTROL</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 font-mono text-[11px] text-steel lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded px-3 py-2 transition hover:text-cream"
                activeProps={{ className: "rounded px-3 py-2 bg-ink3 text-cream" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="hidden text-steel sm:inline">ML ENGINE</span>
            <Lamp tone={tone} />
            <span className={isError ? "text-danger" : "text-clear"}>{statusLabel}</span>
          </div>
        </div>
        <nav className="flex flex-wrap gap-1 border-t border-line/60 px-4 py-2 font-mono text-[10px] text-steel lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded px-2 py-1"
              activeProps={{ className: "rounded px-2 py-1 bg-ink3 text-cream" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <EngineOfflineBanner />

      <main className="relative z-10 mx-auto max-w-[1440px] px-6 py-8">{children}</main>

      <footer className="relative z-10 mt-8 border-t border-line/70">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-[10px] text-steel">
          <span>Model ensemble · LightGBM 50 · Temporal CNN 30 · Random Forest 20 · recall 0.85</span>
          <span>Railway AI Block Planner · Smart India Hackathon prototype · simulated data</span>
        </div>
      </footer>
    </div>
  );
}
