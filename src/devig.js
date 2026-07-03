/* ================================================================
 * devig.js — Pure math utilities for devigging odds & sizing bets.
 *
 * No React, no DOM, no I/O. Safe to use anywhere (browser or Node).
 *
 * Concepts:
 *   raw_i      = 1 / odds_i              (book-implied probability)
 *   sum        = Σ raw_i
 *   margin     = sum − 1                 (the book's overround)
 *
 *   multiplicative devig: fair_prob_i = raw_i / sum
 *   power devig:          find k ∈ [1,40] s.t. Σ raw_i^k = 1,
 *                          then fair_prob_i = raw_i^k (renormalize for safety)
 *
 *   EV(book)     = book.odds × fair_prob_target − 1
 *   kellyFull(b) = EV / (book.odds − 1)
 *   kellyQuart(b)= kellyFull / 4
 *
 * Each market is analysed *independently* — no mixing of 1X2 and O/U.
 * ============================================================== */

/** Raw implied probabilities (with margin) from a list of decimal odds. */
export function rawProbabilities(oddsArr) {
  return oddsArr.map((o) => (Number.isFinite(o) && o > 0 ? 1 / o : 0));
}

/** Numeric sum of an array. */
export function sum(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i];
  return s;
}

/** Bookmaker's overround / margin for a single market. */
export function margin(oddsArr) {
  return sum(rawProbabilities(oddsArr)) - 1;
}

/* ---------------- multiplicative devig ---------------- */

/** Devig using multiplicative (proportional) method.
 *  Returns fair probabilities that sum to exactly 1. */
export function devigMultiplicative(oddsArr) {
  const raws = rawProbabilities(oddsArr);
  const s = sum(raws);
  if (s <= 0) return raws.map(() => 0);
  return raws.map((r) => r / s);
}

/* ---------------- power devig (bisection) ---------------- */

/** Devig using the power method: find k such that Σ raw_i^k = 1.
 *  Bisection on k ∈ [1, 40]. Returns normalized fair probabilities. */
export function devigPower(oddsArr) {
  const raws = rawProbabilities(oddsArr);
  if (sum(raws) <= 0) return raws.map(() => 0);

  // Already fair? Skip the search.
  if (Math.abs(sum(raws) - 1) < 1e-9) return raws.slice();

  let lo = 1;
  let hi = 40;
  // Bisection: when k grows, individual raw_i^k shrink (raw_i < 1),
  // so Σ raw_i^k decreases monotonically. Find k where the sum hits 1.
  for (let i = 0; i < 100; i++) {
    const k = (lo + hi) / 2;
    const s = sum(raws.map((r) => Math.pow(r, k)));
    if (Math.abs(s - 1) < 1e-12) {
      lo = k;
      hi = k;
      break;
    }
    if (s > 1) lo = k;
    else hi = k;
  }
  const k = (lo + hi) / 2;
  const powered = raws.map((r) => Math.pow(r, k));
  const sp = sum(powered);
  // Renormalize defensively
  return sp > 0 ? powered.map((p) => p / sp) : powered;
}

/* ---------------- derived quantities ---------------- */

/** Convert a fair probability to fair decimal odds. */
export function fairOdds(fairProb) {
  return Number.isFinite(fairProb) && fairProb > 0 ? 1 / fairProb : 0;
}

/** Expected value of a single-shot bet. Positive = +EV. */
export function ev(bookOdds, fairProb) {
  if (!Number.isFinite(bookOdds) || !Number.isFinite(fairProb)) return 0;
  return bookOdds * fairProb - 1;
}

/** Full Kelly stake fraction. Returns 0 if no edge or bad inputs. */
export function kellyFull(bookOdds, fairProb) {
  if (!Number.isFinite(bookOdds) || bookOdds <= 1) return 0;
  const e = ev(bookOdds, fairProb);
  if (e <= 0) return 0;
  return e / (bookOdds - 1);
}

/** Quarter Kelly — more conservative sizing for live use. */
export function kellyQuarter(bookOdds, fairProb) {
  return kellyFull(bookOdds, fairProb) / 4;
}

/* ---------------- convenience: full analysis ---------------- */

/** One-shot analysis: takes a market's odds + the selection index,
 *  returns { margin, fairProbMult, fairProbPower, fairOddsMult, fairOddsPower, allMult, allPower }. */
export function analyzeMarket(oddsArr, selectionIndex) {
  const m = margin(oddsArr);
  const mult = devigMultiplicative(oddsArr);
  const pow = devigPower(oddsArr);
  const i = selectionIndex;
  return {
    margin: m,
    fairProbMult: mult[i] ?? 0,
    fairProbPower: pow[i] ?? 0,
    fairOddsMult: fairOdds(mult[i] ?? 0),
    fairOddsPower: fairOdds(pow[i] ?? 0),
    allMult: mult,
    allPower: pow,
  };
}

/** Enrich a list of books with EV and Kelly fields, sorted by EV desc. */
export function rankBooks(books, fairProb, bankroll = 1) {
  return books
    .map((b) => {
      const e = ev(b.odds, fairProb);
      const k = kellyFull(b.odds, fairProb);
      const kq = k / 4;
      return {
        ...b,
        ev: e,
        kelly: k,
        kellyQuarter: kq,
        stakeQuarter: kq * bankroll,
      };
    })
    .sort((a, b) => b.ev - a.ev);
}
