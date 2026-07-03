import React, { useState, useEffect, useMemo } from "react";
import {
  X, TrendingDown, Clock, Plus, Activity, BarChart3, AlertTriangle
} from "lucide-react";
import {
  analyzeMarket, rankBooks
} from "./devig.js";

/* ================================================================
 * <SharpDropModal /> — opens on a "sharp drop" signal from xAPEX.
 *
 * xAPEX detects the price movement and pushes a fully-formed signal:
 *   { homeTeam, awayTeam, league, kickoffISO, market, selection,
 *     pinnacleFrom, pinnacleTo, dropPct, fixtureId,
 *     marketOdds:{home,draw,away}, ouOdds:{line,over,under} }
 *
 * BetPro only DISPLAYS what arrived + runs devig math locally on
 * the provided market odds. No API calls from this component.
 *
 * Selection routing:
 *   FT Result / 1X2  → uses signal.marketOdds  (Home / Draw / Away)
 *   Over / Under     → uses signal.ouOdds      (Over / Under)
 *
 * onAddToSlip receives a leg compatible with the existing bet slip:
 *   { matchId, home, away, league, market, odds, stake }
 *   where stake = ¼ Kelly × bankroll.
 * ============================================================== */

// ----------------------- defaults for visual testing ----------------------

const TEST_SIGNAL = {
  homeTeam: "Реал Сосиедад",
  awayTeam: "Атлетико Мадрид",
  league: "La Liga",
  kickoffISO: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
  market: "FT Result",
  selection: "Away",
  pinnacleFrom: 3.20,
  pinnacleTo: 2.85,
  fixtureId: "test-001",
  marketOdds: { home: 2.60, draw: 3.39, away: 2.25 },
  ouOdds: { line: 2.5, over: 1.85, under: 2.00 },
};

const TEST_BOOKS = [
  { name: "Inbet", odds: 3.00 },
  { name: "Bet365", odds: 2.90 },
  { name: "Winbet", odds: 2.80 },
  { name: "efbet", odds: 2.85 },
];

// ----------------------- labels & formatting ----------------------

const SEL_LABEL = {
  home:  "1 (домакин)",
  draw:  "Равенство",
  away:  "2 (гост)",
  "1":   "1 (домакин)",
  x:     "Равенство",
  "2":   "2 (гост)",
  over:  "Над",
  under: "Под",
};

const MARKET_LABEL = {
  "ft result":  "Краен резултат",
  "1x2":        "Краен резултат",
  "over/under": "Тотал голове",
  "ou":         "Тотал голове",
};

const fmtPct = (v, withSign = false) => {
  if (!Number.isFinite(v)) return "—";
  const s = (v * 100).toFixed(1);
  return withSign && v > 0 ? `+${s}%` : `${s}%`;
};

const fmtOdds = (v) =>
  Number.isFinite(v) && v > 0 ? v.toFixed(2) : "—";

// ----------------------- hooks ----------------------

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

function useCountdown(kickoffISO) {
  const [text, setText] = useState("—");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!kickoffISO) return;
    const tick = () => {
      const target = new Date(kickoffISO).getTime();
      const diff = target - Date.now();
      if (diff <= 0) { setText("Започнал"); setStarted(true); return; }
      const h  = Math.floor(diff / 3600000);
      const mi = Math.floor((diff % 3600000) / 60000);
      const se = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, "0");
      setText(h > 0 ? `${h}:${pad(mi)}:${pad(se)}` : `${pad(mi)}:${pad(se)}`);
      setStarted(false);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [kickoffISO]);
  return { text, started };
}

// ----------------------- main component ----------------------

export default function SharpDropModal({
  signal = TEST_SIGNAL,
  books = TEST_BOOKS,
  bankroll = 100,
  currency = "€",
  onClose,
  onAddToSlip,
}) {
  const reducedMotion = useReducedMotion();
  const pulseClass = reducedMotion ? "" : "animate-pulse";

  // Lock background scroll while open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ---- pick which market & selection index to analyse ----
  const sel = (signal?.selection || "").toLowerCase();
  const marketKey = (signal?.market || "").toLowerCase();
  const isOU =
    sel === "over" || sel === "under" ||
    /over|under|o\/u|тотал|ou/.test(marketKey);

  let oddsArr = [];
  let selectionIndex = 0;
  if (isOU && signal?.ouOdds) {
    oddsArr = [signal.ouOdds.over, signal.ouOdds.under];
    selectionIndex = sel === "under" ? 1 : 0;
  } else if (signal?.marketOdds) {
    oddsArr = [
      signal.marketOdds.home,
      signal.marketOdds.draw,
      signal.marketOdds.away,
    ];
    selectionIndex =
      sel === "draw" || sel === "x" ? 1
      : sel === "away" || sel === "2" ? 2
      : 0;
  }

  const analysis = useMemo(
    () => analyzeMarket(oddsArr, selectionIndex),
    [oddsArr.join("|"), selectionIndex] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // primary fair prob for EV/Kelly is multiplicative (per spec)
  const primaryFairProb = analysis.fairProbMult;

  // ---- drop % (compute if not provided) ----
  const computedDrop =
    Number.isFinite(signal?.pinnacleFrom) && Number.isFinite(signal?.pinnacleTo) && signal.pinnacleFrom > 0
      ? (signal.pinnacleFrom - signal.pinnacleTo) / signal.pinnacleFrom
      : 0;
  const dropPct = Number.isFinite(signal?.dropPct) ? signal.dropPct : computedDrop;

  // ---- margin liquidity tier ----
  const m = analysis.margin;
  const marginTier =
    m < 0.04 ? "high"
    : m < 0.08 ? "medium"
    : "low";
  const marginClasses = {
    high:   "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
    medium: "bg-amber-500/15 border-amber-500/40 text-amber-400",
    low:    "bg-red-500/15 border-red-500/40 text-red-400",
  }[marginTier];
  const marginText = {
    high: "Висока ликвидност",
    medium: "Средна ликвидност",
    low: "Ниска ликвидност",
  }[marginTier];

  // ---- enrich + rank books ----
  const enrichedBooks = useMemo(
    () => rankBooks(books || [], primaryFairProb, bankroll),
    [books, primaryFairProb, bankroll]
  );

  // ---- live countdown ----
  const { text: countdownText, started } = useCountdown(signal?.kickoffISO);

  // ---- labels ----
  const selectionLabel = SEL_LABEL[sel] || signal?.selection || "—";
  const marketDisplayLabel = MARKET_LABEL[marketKey] || signal?.market || "—";

  // ---- add to slip ----
  const handleAdd = (book) => {
    if (!onAddToSlip) return;
    onAddToSlip({
      matchId: signal?.fixtureId,
      home: signal?.homeTeam,
      away: signal?.awayTeam,
      league: signal?.league,
      market: `${marketDisplayLabel} — ${selectionLabel}`,
      odds: book.odds,
      stake: Math.max(0.01, Math.round(book.stakeQuarter * 100) / 100),
    });
  };

  // ----------------------- render ----------------------
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Sheet */}
      <div
        className="relative bg-slate-900 border-t border-x border-slate-700 rounded-t-2xl w-full sm:max-w-md sm:rounded-2xl flex flex-col"
        style={{
          maxHeight: "calc(85vh - 72px)",
          marginBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
          maxWidth: "100vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-red-500/10 via-slate-900 to-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 ${pulseClass}`}
              aria-hidden
            >
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <div className="min-w-0">
              <h3
                className="font-bold text-sm truncate"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                ПАДНАЛ КОЕФИЦИЕНТ
              </h3>
              <div className="text-[10px] text-slate-400 truncate">
                Sharp money в Pinnacle
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 p-1 -mr-1 flex-shrink-0"
            aria-label="Затвори"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3"
          style={{ WebkitOverflowScrolling: "touch", minHeight: 0 }}
        >
          {/* Match info */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
            <div className="text-[10px] text-slate-500 mb-1 truncate">
              {signal?.league || "—"}
            </div>
            <div
              className="text-sm font-semibold truncate"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {signal?.homeTeam} <span className="text-slate-500">vs</span>{" "}
              {signal?.awayTeam}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400 min-w-0 truncate">
                {marketDisplayLabel} →{" "}
                <span className="text-emerald-400 font-semibold border-b border-emerald-400/50">
                  {selectionLabel}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] font-mono flex-shrink-0 ${
                  started ? "text-slate-500" : "text-emerald-400"
                }`}
              >
                <Clock size={11} />
                <span>{countdownText}</span>
              </div>
            </div>
          </div>

          {/* Pinnacle movement */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                Движение в Pinnacle
              </span>
              <span className={`text-[11px] font-bold text-red-400 ${pulseClass}`}>
                −{(dropPct * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-center bg-slate-800/40 rounded-lg py-2 border border-slate-700/50">
                <div className="text-[9px] text-slate-500">От</div>
                <div className="text-lg font-bold font-mono text-slate-300 line-through opacity-70">
                  {fmtOdds(signal?.pinnacleFrom)}
                </div>
              </div>
              <div className="text-red-400 flex-shrink-0" aria-hidden>
                <TrendingDown size={20} />
              </div>
              <div className="flex-1 text-center bg-red-500/10 rounded-lg py-2 border border-red-500/40">
                <div className="text-[9px] text-red-300">До</div>
                <div className="text-lg font-bold font-mono text-red-400">
                  {fmtOdds(signal?.pinnacleTo)}
                </div>
              </div>
            </div>
          </div>

          {/* Fair odds */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Activity size={12} className="text-emerald-400 flex-shrink-0" />
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider truncate">
                  Fair коефициенти
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${marginClasses}`}
              >
                {fmtPct(m)} · {marginText}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 rounded-lg p-2 text-center border border-slate-700/50">
                <div className="text-[9px] text-slate-500 uppercase">
                  Multiplicative
                </div>
                <div
                  className="text-xl font-bold font-mono text-emerald-400"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {fmtOdds(analysis.fairOddsMult)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {fmtPct(analysis.fairProbMult)}
                </div>
              </div>
              <div className="bg-slate-900 rounded-lg p-2 text-center border border-slate-700/50">
                <div className="text-[9px] text-slate-500 uppercase">Power</div>
                <div
                  className="text-xl font-bold font-mono text-purple-400"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {fmtOdds(analysis.fairOddsPower)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {fmtPct(analysis.fairProbPower)}
                </div>
              </div>
            </div>
          </div>

          {/* Books table */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-700/50 flex items-center gap-1.5">
              <BarChart3 size={12} className="text-amber-400" />
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Стойностни залози
              </span>
            </div>
            {enrichedBooks.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Няма налични букмейкъри
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {enrichedBooks.map((b, i) => {
                  const positiveEv = b.ev > 0;
                  return (
                    <div
                      key={`${b.name}-${i}`}
                      className="p-2.5 flex items-center gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">
                          {b.name}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px]">
                          <span
                            className={`font-bold ${
                              positiveEv ? "text-emerald-400" : "text-slate-500"
                            }`}
                          >
                            EV {fmtPct(b.ev, true)}
                          </span>
                          <span className="text-slate-500">
                            ¼K {fmtPct(b.kellyQuarter)}
                          </span>
                          {positiveEv && (
                            <span className="text-slate-400">
                              {currency}
                              {b.stakeQuarter.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-base font-bold font-mono text-white">
                          {fmtOdds(b.odds)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdd(b)}
                        disabled={!positiveEv}
                        className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-bold ${
                          positiveEv
                            ? "bg-emerald-500 text-slate-950 active:bg-emerald-600"
                            : "bg-slate-800 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        <Plus size={12} />
                        <span>Във фиш</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Low liquidity warning */}
          {marginTier === "low" && (
            <div className="bg-red-500/5 border border-red-500/30 rounded-xl px-3 py-2 flex items-start gap-2">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-red-300 leading-relaxed">
                Висок марж в Pinnacle — пазарът е тънък, fair прогнозата може да е по-малко надеждна.
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="text-[10px] text-slate-500 text-center px-2 leading-relaxed">
            EV и Kelly са изчислени спрямо{" "}
            <span className="text-emerald-400">Multiplicative</span> fair
            прогноза. Залогите се добавят с ¼ Kelly × {currency}
            {bankroll}.
          </div>
        </div>
      </div>
    </div>
  );
}
