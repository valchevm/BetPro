import React, { useState, useMemo, useEffect, createContext, useContext, useCallback } from "react";
import {
  Home, List, Trophy, User, ChevronRight, ChevronDown, ChevronUp,
  Search, Clock, TrendingUp, Star, Zap, Globe,
  Newspaper, ArrowRight, CheckCircle, AlertCircle,
  Brain, Dices, BarChart3, Activity,
  X, ArrowLeft, Target, Sparkles, Bell, Languages,
  Bookmark, Eye, Plus, Wallet, Edit2, Trash2, Play,
  Coins, ListChecks, PlusCircle, RefreshCw, Receipt
} from "lucide-react";

/* ==================== CONFIG (HIDDEN) ==================== */
const SUPABASE_URL = "https://fyahlwqwblgkvfgvwubi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5YWhsd3F3Ymxna3ZmZ3Z3dWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMjE0OTEsImV4cCI6MjA4ODY5NzQ5MX0.1HC5gPCAxb8dHS6qgoYPiWIJatGqFBcgj9-c8xK4gzM";
const FETCH_INTERVAL_SEC = 5;

/* ==================== I18N ==================== */
const T = {
  nav_home: { bg: "Начало", en: "Home" },
  nav_fixtures: { bg: "Мачове", en: "Matches" },
  nav_bets: { bg: "Залози", en: "Bets" },
  nav_evplus: { bg: "EV+", en: "EV+" },
  nav_profile: { bg: "Профил", en: "Profile" },
  cancel: { bg: "Отказ", en: "Cancel" },
  save: { bg: "Запази", en: "Save" },
  delete: { bg: "Изтрий", en: "Delete" },
  edit: { bg: "Редактирай", en: "Edit" },
  predictions_today: { bg: "Прогнози за днес", en: "Today's predictions" },
  see_all_matches: { bg: "Виж всички мачове по държави", en: "View all matches by country" },
  ev_plus_predictions: { bg: "EV+ ПРОГНОЗИ", en: "EV+ PICKS" },
  ev_plus_subtitle: { bg: "Стойностни залози от модела на OddAlerts", en: "Value picks from OddAlerts" },
  new: { bg: "НОВО", en: "NEW" },
  latest_news: { bg: "Последни новини", en: "Latest news" },
  show_all: { bg: "Всички", en: "All" },
  show_less: { bg: "По-малко", en: "Less" },
  transfers: { bg: "Трансфери", en: "Transfers" },
  filter_all: { bg: "Всички", en: "All" },
  status_confirmed: { bg: "Потвърдено", en: "Confirmed" },
  status_close: { bg: "Близо", en: "Close" },
  status_rumour: { bg: "Слух", en: "Rumour" },
  goal_of_week: { bg: "Гол на седмицата", en: "Goal of the week" },
  votes: { bg: "гласа", en: "votes" },
  vote_for_best: { bg: "Гласувай за най-красивия гол", en: "Vote for best goal" },
  click_to_vote: { bg: "Гласувай", en: "Vote" },
  watch_video: { bg: "Видео", en: "Video" },
  vote_recorded: { bg: "Гласът ти е записан!", en: "Vote recorded!" },
  leader: { bg: "Водещ", en: "Leader" },
  filter_top: { bg: "Топ", en: "Top" },
  filter_value: { bg: "Стойност", en: "Value" },
  filter_trends: { bg: "Трендове", en: "Trends" },
  search_placeholder: { bg: "Търси отбор или държава...", en: "Search team or country..." },
  countries: { bg: "държави", en: "countries" },
  matches: { bg: "мача", en: "matches" },
  details: { bg: "Детайли", en: "Details" },
  draw: { bg: "Равенство", en: "Draw" },
  no_matches: { bg: "Все още няма мачове за деня. Провери по-късно.", en: "No matches yet today. Check back later." },
  no_matches_filter: { bg: "Няма мачове за този филтър.", en: "No matches for this filter." },
  loading: { bg: "Зареждане...", en: "Loading..." },
  tab_overview: { bg: "Общ преглед", en: "Overview" },
  tab_stats: { bg: "Статистика", en: "Stats" },
  tab_odds: { bg: "Коефициенти", en: "Odds" },
  deep_analysis: { bg: "Анализ", en: "Analysis" },
  simulation_100k: { bg: "Симулация", en: "Simulation" },
  add_to_slip: { bg: "Добави във фиш", en: "Add to slip" },
  in_slip: { bg: "Във фиша", en: "In slip" },
  odds: { bg: "Коефициенти", en: "Odds" },
  prediction: { bg: "Прогноза", en: "Prediction" },
  probabilities: { bg: "Вероятности", en: "Probabilities" },
  win_1: { bg: "Победа 1", en: "Win 1" },
  win_2: { bg: "Победа 2", en: "Win 2" },
  ai_analysis: { bg: "Анализ от модела", en: "Model Analysis" },
  recommendation: { bg: "ПРЕПОРЪКА", en: "RECOMMENDATION" },
  forecast: { bg: "Прогноза", en: "Forecast" },
  rolling_matches: { bg: "Разиграване...", en: "Rolling..." },
  outcomes: { bg: "Изходи", en: "Outcomes" },
  top_scores: { bg: "Топ 8 резултата", en: "Top 8 scores" },
  avg_goals_match: { bg: "Средно голове", en: "Avg goals" },
  ev_powered_by: { bg: "Powered by OddAlerts", en: "Powered by OddAlerts" },
  ev_explainer: { bg: "Стойностни залози от модела на OddAlerts с по-висока вероятност от букмейкъра.", en: "Value picks from OddAlerts model with higher probability than the bookmaker." },
  ev_coming_soon: { bg: "Идва скоро", en: "Coming soon" },
  ev_api_message: { bg: "Активира се след свързване с OddAlerts API.", en: "Activates after OddAlerts API connection." },
  ev_api_progress: { bg: "Работи се по интеграцията", en: "Integration in progress" },
  pro_member: { bg: "PRO", en: "PRO" },
  watched: { bg: "Гледани", en: "Watched" },
  saved: { bg: "Запазени", en: "Saved" },
  accuracy: { bg: "Точност", en: "Accuracy" },
  notifications: { bg: "Известия", en: "Notifications" },
  on: { bg: "Включени", en: "On" },
  off: { bg: "Изключени", en: "Off" },
  language: { bg: "Език", en: "Language" },
  bg_animation: { bg: "Анимиран фон", en: "Animated background" },
  settings: { bg: "Настройки", en: "Settings" },
  bets_title: { bg: "Моите залози", en: "My bets" },
  pending: { bg: "Чакащи", en: "Pending" },
  won: { bg: "Печеливши", en: "Won" },
  lost: { bg: "Губещи", en: "Lost" },
  void: { bg: "Анулирани", en: "Void" },
  create_bank: { bg: "Нова банка", en: "New bank" },
  bank_name: { bg: "Име на банка", en: "Bank name" },
  bank_name_ph: { bg: "Например: Основна банка", en: "Example: Main bank" },
  currency: { bg: "Валута", en: "Currency" },
  initial_balance: { bg: "Начален баланс", en: "Initial balance" },
  current_balance: { bg: "Текущ баланс", en: "Current balance" },
  units: { bg: "Единици", en: "Units" },
  euro: { bg: "Евро", en: "Euro" },
  no_banks: { bg: "Все още нямаш банка.", en: "No bank yet." },
  no_banks_sub: { bg: "Създай банка, за да започнеш.", en: "Create a bank to start." },
  no_bets: { bg: "Няма залози.", en: "No bets." },
  bet_type: { bg: "Тип", en: "Type" },
  bet_single: { bg: "Сингъл", en: "Single" },
  bet_acca: { bg: "Колонка", en: "Acca" },
  select_bank: { bg: "Избери банка", en: "Select bank" },
  stake: { bg: "Залог", en: "Stake" },
  total_odds: { bg: "Общ коеф.", en: "Total odds" },
  potential_win: { bg: "Потенц. печалба", en: "Potential win" },
  potential_profit: { bg: "Печалба", en: "Profit" },
  legs: { bg: "Селекции", en: "Legs" },
  bet_status_pending: { bg: "Чакащ", en: "Pending" },
  bet_status_won: { bg: "Спечелен", en: "Won" },
  bet_status_lost: { bg: "Загубен", en: "Lost" },
  bet_status_void: { bg: "Анулиран", en: "Void" },
  mark_won: { bg: "Печеливш", en: "Won" },
  mark_lost: { bg: "Губещ", en: "Lost" },
  mark_void: { bg: "Анулирай", en: "Void" },
  reset_status: { bg: "Чакащ", en: "Pending" },
  edit_bet: { bg: "Редактирай залог", en: "Edit bet" },
  total_bets: { bg: "Залози", en: "Bets" },
  profit: { bg: "Печалба", en: "Profit" },
  roi: { bg: "ROI", en: "ROI" },
  win_rate: { bg: "% спечелени", en: "Win %" },
  goal_not_available: { bg: "Видеото не е налично", en: "Video not available" },
  reset_progress: { bg: "Нулирай данните", en: "Reset data" },
  confirm_reset: { bg: "Това ще изтрие всички банки, залози и настройки. Сигурен ли си?", en: "Erase all banks, bets, and settings?" },
  confirm_delete_bank: { bg: "Изтрий банката и всички нейни залози?", en: "Delete bank and all its bets?" },
  confirm_delete_bet: { bg: "Изтрий този залог?", en: "Delete this bet?" },
  view_standings: { bg: "Виж класирането", en: "View standings" },
  standings_title: { bg: "Класиране — Ла Лига", en: "Standings — La Liga" },
  team: { bg: "Отбор", en: "Team" },
  champions_league: { bg: "Шампионска лига", en: "Champions League" },
  relegation: { bg: "Изпадане", en: "Relegation" },
  model_pick: { bg: "Избор на модела", en: "Model pick" },
  // Bet slip
  slip: { bg: "Фиш", en: "Slip" },
  slip_empty: { bg: "Фишът е празен. Кликни на коефициент за да добавиш.", en: "Slip is empty. Tap an odd to add." },
  slip_clear: { bg: "Изчисти фиша", en: "Clear slip" },
  selections: { bg: "Селекции", en: "Selections" },
  no_bank_first: { bg: "Първо създай банка.", en: "Create a bank first." },
  remove: { bg: "Премахни", en: "Remove" },
  saved_bet: { bg: "✓ Залогът е запазен!", en: "✓ Bet saved!" },
};
const tx = (k, lang) => T[k]?.[lang] ?? T[k]?.bg ?? k;
const LangCtx = createContext({ lang: "bg", setLang: () => {} });
const useLang = () => useContext(LangCtx);
const useT = () => { const { lang } = useLang(); return useCallback((k) => tx(k, lang), [lang]); };

/* ==================== STATIC DATA ==================== */
const COUNTRY_MAP = {
  // Map from Supabase country values to our display codes/flags
  "England": { code: "ENG", name_bg: "Англия", name_en: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  "Spain": { code: "ESP", name_bg: "Испания", name_en: "Spain", flag: "🇪🇸" },
  "Germany": { code: "GER", name_bg: "Германия", name_en: "Germany", flag: "🇩🇪" },
  "France": { code: "FRA", name_bg: "Франция", name_en: "France", flag: "🇫🇷" },
  "Italy": { code: "ITA", name_bg: "Италия", name_en: "Italy", flag: "🇮🇹" },
  "Portugal": { code: "POR", name_bg: "Португалия", name_en: "Portugal", flag: "🇵🇹" },
  "Netherlands": { code: "NED", name_bg: "Холандия", name_en: "Netherlands", flag: "🇳🇱" },
  "Belgium": { code: "BEL", name_bg: "Белгия", name_en: "Belgium", flag: "🇧🇪" },
  "Bulgaria": { code: "BUL", name_bg: "България", name_en: "Bulgaria", flag: "🇧🇬" },
  "Turkey": { code: "TUR", name_bg: "Турция", name_en: "Turkey", flag: "🇹🇷" },
  "Greece": { code: "GRE", name_bg: "Гърция", name_en: "Greece", flag: "🇬🇷" },
  "Scotland": { code: "SCO", name_bg: "Шотландия", name_en: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  "Brazil": { code: "BRA", name_bg: "Бразилия", name_en: "Brazil", flag: "🇧🇷" },
  "Argentina": { code: "ARG", name_bg: "Аржентина", name_en: "Argentina", flag: "🇦🇷" },
  "USA": { code: "USA", name_bg: "САЩ", name_en: "USA", flag: "🇺🇸" },
  "Mexico": { code: "MEX", name_bg: "Мексико", name_en: "Mexico", flag: "🇲🇽" },
};
const getCountryInfo = (countryRaw) => {
  if (!countryRaw) return { code: "OTH", name_bg: "Други", name_en: "Other", flag: "🌍" };
  const trimmed = countryRaw.trim();
  if (COUNTRY_MAP[trimmed]) return COUNTRY_MAP[trimmed];
  return { code: trimmed.toUpperCase().slice(0, 3), name_bg: trimmed, name_en: trimmed, flag: "🌍" };
};

const NEWS = [
  { id: 1, emoji: "⚽", title_bg: "Реал Мадрид с рекордна победа", title_en: "Real Madrid record win",
    summary_bg: "Клубът надви Севиля с 4:0.", summary_en: "Club beat Sevilla 4:0.",
    source: "Marca", time_bg: "преди 2 ч.", time_en: "2h ago" },
  { id: 2, emoji: "🏆", title_bg: "Байерн в полуфиналите", title_en: "Bayern in semis",
    summary_bg: "Пети път за седем сезона.", summary_en: "5th time in 7 seasons.",
    source: "Kicker", time_bg: "преди 4 ч.", time_en: "4h ago" },
  { id: 3, emoji: "🔥", title_bg: "Холанд счупи рекорд", title_en: "Haaland breaks record",
    summary_bg: "35-и гол за сезона.", summary_en: "35th goal of the season.",
    source: "BBC Sport", time_bg: "преди 6 ч.", time_en: "6h ago" },
];

const TRANSFERS = [
  { id: 1, player: "Kylian Mbappé", from: "PSG", to: "Real Madrid", fee: "€180M", status: "confirmed" },
  { id: 2, player: "Erling Haaland", from: "Man City", to: "Real Madrid", fee: "€220M", status: "rumour" },
  { id: 3, player: "Bukayo Saka", from: "Arsenal", to: "Real Madrid", fee: "€140M", status: "close" },
];

const GOALS_OF_WEEK = [
  { id: 1, emoji: "🚀", player: "Vinicius Jr.", team_bg: "Реал Мадрид", team_en: "Real Madrid",
    opp_bg: "Севиля", opp_en: "Sevilla", league_bg: "Ла Лига", league_en: "La Liga",
    desc_bg: "Дрибъл през трима + удар от 25м.", desc_en: "Dribble past 3 + strike from 25y.",
    youtubeId: "vYR4Su1fE2A", votes: 412 },
  { id: 2, emoji: "💥", player: "Erling Haaland", team_bg: "Ман Сити", team_en: "Man City",
    opp_bg: "Уулвс", opp_en: "Wolves", league_bg: "Премиър лига", league_en: "Premier League",
    desc_bg: "Удар от 40 метра.", desc_en: "40-yard strike.",
    youtubeId: "ja2--hEDQpw", votes: 389 },
  { id: 3, emoji: "🎯", player: "Lautaro Martínez", team_bg: "Интер", team_en: "Inter",
    opp_bg: "Болоня", opp_en: "Bologna", league_bg: "Серия А", league_en: "Serie A",
    desc_bg: "Перфектен волейбол.", desc_en: "Perfect volley.",
    youtubeId: "BO2Gx2ARVrU", votes: 245 },
];

const STANDINGS = [
  { pos: 1, team: "Real Madrid", p: 32, w: 26, d: 4, l: 2, gd: "+58", pts: 82 },
  { pos: 2, team: "Barcelona", p: 32, w: 24, d: 5, l: 3, gd: "+52", pts: 77 },
  { pos: 3, team: "Atlético", p: 32, w: 20, d: 7, l: 5, gd: "+28", pts: 67 },
  { pos: 4, team: "Athletic Bilbao", p: 32, w: 18, d: 8, l: 6, gd: "+18", pts: 62 },
  { pos: 5, team: "Real Sociedad", p: 32, w: 16, d: 9, l: 7, gd: "+11", pts: 57 },
  { pos: 6, team: "Villarreal", p: 32, w: 15, d: 8, l: 9, gd: "+8", pts: 53 },
  { pos: 7, team: "Girona", p: 32, w: 14, d: 7, l: 11, gd: "+3", pts: 49 },
  { pos: 8, team: "Real Betis", p: 32, w: 13, d: 8, l: 11, gd: "-1", pts: 47 },
];

/* ==================== SUPABASE FETCH & NORMALIZE ==================== */

// Fake-but-stable odds based on probability if real odds missing.
// Same prob → same odds → no flicker between fetches.
const fakeOddsFromProb = (probPct) => {
  if (!probPct || probPct <= 0) return 2.0;
  const p = probPct / 100;
  // Margin around 6%, then add small jitter based on prob to feel realistic
  const odd = (1 / p) * 0.94;
  return Math.round(odd * 100) / 100;
};

function normalizeFromSupabase(row) {
  const top_market = row.top_market || "1";
  const top_prob = row.top_prob || 0;

  const odds = {
    "1": row.odds_1 ?? fakeOddsFromProb(row.prob_1),
    "X": row.odds_x ?? fakeOddsFromProb(row.prob_x),
    "2": row.odds_2 ?? fakeOddsFromProb(row.prob_2),
    over: row.odds_over25 ?? fakeOddsFromProb(row.prob_over25),
    under: row.odds_under25 ?? fakeOddsFromProb(row.prob_under25),
    btts_yes: row.odds_btts ?? fakeOddsFromProb(row.prob_btts),
    btts_no: fakeOddsFromProb(row.prob_btts_no),
  };

  const prob = {
    "1": Math.round(row.prob_1 || 33),
    "X": Math.round(row.prob_x || 33),
    "2": Math.round(row.prob_2 || 34),
    over: Math.round(row.prob_over25 || 50),
    under: Math.round(row.prob_under25 || 50),
    btts_yes: Math.round(row.prob_btts || 50),
    btts_no: Math.round(row.prob_btts_no || 50),
  };

  // Confidence from top_prob
  let confidence;
  if (top_prob >= 70) confidence = "Very High";
  else if (top_prob >= 58) confidence = "High";
  else if (top_prob >= 45) confidence = "Medium";
  else confidence = "Low";

  // Chips from alt_markets if present, else derive
  let chips = [];
  if (Array.isArray(row.alt_markets)) {
    chips = row.alt_markets.slice(0, 3).map(m => typeof m === "string" ? m : (m.market || m.name || ""));
  }
  if (chips.length === 0) {
    chips.push(top_market);
    if (prob.over >= 60 && top_market !== "Over 2.5") chips.push("Over 2.5");
    if (prob.btts_yes >= 60 && top_market !== "BTTS") chips.push("BTTS");
  }
  chips = chips.filter(Boolean);

  // Format date/time
  let date = "";
  let time = "—";
  let timestamp = null;
  if (row.kickoff) {
    try {
      const d = new Date(row.kickoff);
      date = d.toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" });
      time = d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
      timestamp = row.kickoff;
    } catch {}
  } else if (row.match_date) {
    try {
      date = new Date(row.match_date).toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" });
    } catch { date = row.match_date; }
  }

  const countryInfo = getCountryInfo(row.country);

  // Generate analysis text
  const analysis_bg = `Моделът дава ${top_prob}% вероятност за ${top_market}. λ домакин: ${row.lambda_h ?? "—"}, λ гост: ${row.lambda_a ?? "—"}. Очаквани общи голове: ${((row.lambda_h || 0) + (row.lambda_a || 0)).toFixed(2)}.`;
  const analysis_en = `Model finds ${top_prob}% probability for ${top_market}. λ home: ${row.lambda_h ?? "—"}, λ away: ${row.lambda_a ?? "—"}. Expected total goals: ${((row.lambda_h || 0) + (row.lambda_a || 0)).toFixed(2)}.`;

  return {
    id: row.fixture_id || `db_${row.id}`,
    countryCode: countryInfo.code,
    countryInfo,
    league: row.league || "—",
    date, time, timestamp,
    home: row.home_team || "Home",
    away: row.away_team || "Away",
    home_en: row.home_team || "Home",
    away_en: row.away_team || "Away",
    odds, prob,
    pred: top_market,
    top_prob,
    confidence,
    chips,
    lambda_h: row.lambda_h,
    lambda_a: row.lambda_a,
    analysis_bg, analysis_en,
    expires_at: row.expires_at,
  };
}

// Filter expired matches (defensive — DB also filters by expires_at)
function isMatchActive(m) {
  if (!m.expires_at) return true;
  try {
    return new Date(m.expires_at).getTime() > Date.now();
  } catch { return true; }
}

async function fetchMatchesFromSupabase() {
  const url = `${SUPABASE_URL}/rest/v1/xgpro_fixtures_public` +
    `?select=*` +
    `&expires_at=gt.${new Date().toISOString()}` +
    `&order=kickoff.asc.nullslast`;

  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Accept": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error("Bad shape");

  // Deduplicate by fixture_id (defensive — DB has unique constraint, but just in case)
  const seen = new Set();
  const dedup = [];
  for (const r of rows) {
    const key = r.fixture_id || r.id;
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(r);
  }

  return dedup.map(normalizeFromSupabase).filter(isMatchActive);
}

/* ==================== STORAGE / HELPERS ==================== */
const DEFAULT_STATE = {
  lang: "bg",
  banks: [],
  bets: [],
  betSlip: [], // [{matchId, home, away, league, market, odds}]
  settings: { bgAnimation: true, notifications: true }
};
const STORAGE_KEY = "betprobg:state:v4";
const loadState = async () => {
  try {
    if (!window.storage) return DEFAULT_STATE;
    const r = await window.storage.get(STORAGE_KEY);
    if (!r) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(r.value) };
  } catch { return DEFAULT_STATE; }
};
const saveState = async (s) => {
  try { if (window.storage) await window.storage.set(STORAGE_KEY, JSON.stringify(s)); } catch {}
};
const conf2color = (c) => ({
  "Very High": "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  "High": "text-green-400 bg-green-400/10 border-green-400/30",
  "Medium": "text-amber-400 bg-amber-400/10 border-amber-400/30",
  "Low": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
}[c] || "text-slate-400 bg-slate-800 border-slate-700");
const fmtMoney = (v, c) => c === "EUR" ? `€${v.toFixed(2)}` : `${v.toFixed(2)}u`;
const calcTotalOdds = (legs) => legs.reduce((a, l) => a * parseFloat(l.odds || 1), 1);
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(); } catch { return iso; } };

/* ==================== ANIMATED BG ==================== */
const SoccerBackground = ({ enabled }) => {
  const balls = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    id: i, left: Math.random() * 100, duration: 25 + Math.random() * 30,
    delay: Math.random() * -50, size: 16 + Math.random() * 20, opacity: 0.04 + Math.random() * 0.07,
  })), []);
  if (!enabled) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025]"
           style={{ background: "repeating-linear-gradient(90deg, transparent 0, transparent 80px, #10b981 80px, #10b981 160px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
           style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
      {balls.map((b) => (
        <div key={b.id} className="absolute" style={{
          left: `${b.left}%`, bottom: "-50px", fontSize: `${b.size}px`,
          opacity: b.opacity, animation: `floatUp ${b.duration}s linear infinite`,
          animationDelay: `${b.delay}s`
        }}>⚽</div>
      ))}
      <style>{`@keyframes floatUp { 0% { transform: translateY(0) rotate(0deg);} 100% { transform: translateY(-110vh) rotate(720deg);} }`}</style>
    </div>
  );
};

/* ==================== COMMON UI ==================== */
const LangSwitch = () => {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center bg-slate-800 rounded-md overflow-hidden text-[10px] font-bold border border-slate-700">
      <button onClick={() => setLang("bg")} className={`px-2 py-1 ${lang === "bg" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>BG</button>
      <button onClick={() => setLang("en")} className={`px-2 py-1 ${lang === "en" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>EN</button>
    </div>
  );
};

const Header = ({ slipCount, onOpenSlip }) => (
  <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/60 w-full"
          style={{ paddingTop: "env(safe-area-inset-top, 0)" }}>
    <div className="flex items-center justify-between px-3 py-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-base">⚽</div>
        <div className="font-bold tracking-wider text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          <span className="text-white">BetPro</span><span className="text-emerald-400">BG</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {slipCount > 0 && (
          <button onClick={onOpenSlip}
                  className="relative flex items-center gap-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 px-2 py-1 rounded-md text-[11px] font-bold">
            <Receipt size={12} />
            <span className="bg-amber-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{slipCount}</span>
          </button>
        )}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-semibold text-emerald-400">LIVE</span>
        </div>
        <LangSwitch />
      </div>
    </div>
  </header>
);

const BottomNav = ({ route, setRoute, slipCount }) => {
  const t = useT();
  const items = [
    { id: "home", icon: Home, label: t("nav_home") },
    { id: "fixtures", icon: List, label: t("nav_fixtures") },
    { id: "bets", icon: Wallet, label: t("nav_bets"), badge: slipCount > 0 ? slipCount : null },
    { id: "evplus", icon: Zap, label: t("nav_evplus"), special: true },
    { id: "profile", icon: User, label: t("nav_profile") },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 w-full"
         style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = route === it.id || (route === "match" && it.id === "fixtures");
          return (
            <button key={it.id} onClick={() => setRoute(it.id)}
              className={`flex flex-col items-center gap-1 py-3 ${active ? (it.special ? "text-amber-400" : "text-emerald-400") : "text-slate-500"}`}>
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {it.special && !active && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />}
                {it.badge && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                    {it.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const ConfirmModal = ({ msg, onCancel, onConfirm }) => {
  const t = useT();
  return (
    <div className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-4" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-center mb-4">{msg}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-slate-800 rounded-lg text-sm">{t("cancel")}</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold">{t("delete")}</button>
        </div>
      </div>
    </div>
  );
};

/* Bottom-sheet style modal — header & footer ALWAYS visible.
   Uses flex layout: header (fixed) + scrolling body + footer (fixed). */
const BottomSheet = ({ children, footer, onClose, title, icon }) => (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center" onClick={onClose}>
    <div className="bg-slate-900 border-t border-x sm:border border-slate-700 sm:rounded-2xl rounded-t-2xl w-full sm:max-w-md flex flex-col overflow-hidden"
         style={{ maxHeight: "92dvh", maxWidth: "100vw" }}
         onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex-shrink-0 bg-slate-900 flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">{icon}<h3 className="font-bold text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{title}</h3></div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X size={20} /></button>
      </div>
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
        {children}
      </div>
      {/* Footer (always visible) */}
      {footer && (
        <div className="flex-shrink-0 border-t border-slate-800 px-4 py-3 bg-slate-900"
             style={{ paddingBottom: "max(12px, calc(env(safe-area-inset-bottom, 0px) + 12px))" }}>
          {footer}
        </div>
      )}
    </div>
  </div>
);

const GoalVideoModal = ({ goal, onClose }) => {
  const { lang } = useLang();
  const t = useT();
  if (!goal) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{goal.emoji}</span>
            <div>
              <div className="font-bold text-sm">{goal.player}</div>
              <div className="text-[10px] text-slate-400">{goal[`team_${lang}`]} · {goal[`league_${lang}`]}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 p-1"><X size={18} /></button>
        </div>
        <div className="aspect-video bg-black">
          {goal.youtubeId ? (
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${goal.youtubeId}?autoplay=1&rel=0`}
                    allow="autoplay; encrypted-media" allowFullScreen />
          ) : <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">{t("goal_not_available")}</div>}
        </div>
        <div className="p-3 text-xs text-slate-300 italic">{goal[`desc_${lang}`]}</div>
      </div>
    </div>
  );
};

/* ==================== HOME ==================== */
const HomePage = ({ setRoute }) => {
  const t = useT();
  const { lang } = useLang();
  const [showAllNews, setShowAllNews] = useState(false);
  const [transferFilter, setTransferFilter] = useState("all");
  const [vote, setVote] = useState(null);
  const [videoGoal, setVideoGoal] = useState(null);

  const visibleNews = showAllNews ? NEWS : NEWS.slice(0, 3);
  const filteredTransfers = transferFilter === "all" ? TRANSFERS : TRANSFERS.filter((tr) => tr.status === transferFilter);
  const totalVotes = GOALS_OF_WEEK.reduce((s, g) => s + g.votes, 0) + (vote ? 1 : 0);
  const leaderId = GOALS_OF_WEEK.reduce((max, g) => g.votes > max.votes ? g : max, GOALS_OF_WEEK[0]).id;

  return (
    <div className="px-3 pt-4 pb-24 space-y-5 relative z-10 w-full">
      <button onClick={() => setRoute("fixtures")}
              className="w-full flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
        <div className="text-left">
          <div className="text-emerald-400 font-semibold text-sm">⚽ {t("predictions_today")}</div>
          <div className="text-xs text-slate-400 mt-0.5">{t("see_all_matches")}</div>
        </div>
        <ArrowRight size={18} className="text-emerald-400 flex-shrink-0" />
      </button>
      <button onClick={() => setRoute("evplus")}
              className="w-full relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-orange-500/10 px-4 py-4">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-amber-400" fill="currentColor" />
              <span className="text-amber-400 font-bold text-sm">{t("ev_plus_predictions")}</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">{t("new")}</span>
            </div>
            <div className="text-xs text-slate-300">{t("ev_plus_subtitle")}</div>
          </div>
          <ArrowRight size={18} className="text-amber-400 flex-shrink-0" />
        </div>
      </button>

      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Newspaper size={18} className="text-emerald-400" />
            <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t("latest_news")}</h2>
          </div>
          <button onClick={() => setShowAllNews(!showAllNews)} className="flex items-center gap-1 text-emerald-400 text-xs">
            {showAllNews ? t("show_less") : t("show_all")}<ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {visibleNews.map((n) => (
            <article key={n.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{n.emoji}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold line-clamp-2">{n[`title_${lang}`]}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{n[`summary_${lang}`]}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-500">
                  <span className="text-emerald-400 font-medium">{n.source}</span><span>·</span>
                  <Clock size={10} /><span>{n[`time_${lang}`]}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3"><TrendingUp size={18} className="text-emerald-400" />
          <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t("transfers")}</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {[{ k: "all", l: t("filter_all") }, { k: "confirmed", l: t("status_confirmed") },
            { k: "close", l: t("status_close") }, { k: "rumour", l: t("status_rumour") }].map((p) => (
            <button key={p.k} onClick={() => setTransferFilter(p.k)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
                      transferFilter === p.k ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>{p.l}</button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredTransfers.map((tr) => {
            const map = {
              confirmed: { c: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", l: t("status_confirmed"), I: CheckCircle },
              close: { c: "text-amber-400 bg-amber-400/10 border-amber-400/30", l: t("status_close"), I: AlertCircle },
              rumour: { c: "text-slate-400 bg-slate-800 border-slate-700", l: t("status_rumour"), I: Clock },
            };
            const s = map[tr.status]; const SI = s.I;
            return (
              <div key={tr.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold">{tr.player}</h4>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${s.c}`}>
                    <SI size={10} /><span>{s.l}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1.5">
                  <span>{tr.from}</span><ArrowRight size={12} className="text-emerald-400" />
                  <span className="font-semibold">{tr.to}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">{tr.fee}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Star size={18} className="text-amber-400" fill="currentColor" />
            <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t("goal_of_week")}</h2>
          </div>
          <span className="text-xs text-slate-400">{totalVotes} {t("votes")}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-3">{t("vote_for_best")}</p>
          <div className="space-y-2">
            {GOALS_OF_WEEK.map((g) => {
              const isVoted = vote === g.id;
              const isLeader = g.id === leaderId;
              const adjVotes = isVoted ? g.votes + 1 : g.votes;
              const pct = totalVotes ? Math.round((adjVotes / totalVotes) * 100) : 0;
              const showResults = vote !== null;
              return (
                <div key={g.id}
                     className={`p-3 rounded-xl border ${
                       isVoted ? "bg-emerald-500/10 border-emerald-500"
                       : isLeader && showResults ? "bg-amber-500/5 border-amber-500/40"
                       : "bg-slate-800/40 border-slate-700/50"
                     }`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{g.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold truncate">{g.player}</h4>
                        {isLeader && showResults && !isVoted && <span className="text-amber-400 text-[10px] font-semibold">👑 {t("leader")}</span>}
                        {isVoted && <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{g[`team_${lang}`]} vs {g[`opp_${lang}`]} · {g[`league_${lang}`]}</div>
                      <div className="text-[11px] text-slate-300 italic mt-1 line-clamp-2">{g[`desc_${lang}`]}</div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button onClick={() => setVideoGoal(g)}
                                className="flex items-center gap-1 text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-semibold">
                          <Play size={10} fill="currentColor" />{t("watch_video")}
                        </button>
                        {!showResults && (
                          <button onClick={() => setVote(g.id)}
                                  className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                            ✓ {t("click_to_vote")}
                          </button>
                        )}
                      </div>
                      {showResults && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{adjVotes} {t("votes")}</span><span className="font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isVoted ? "bg-emerald-500" : isLeader ? "bg-amber-400" : "bg-slate-600"}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {vote && <p className="text-center text-emerald-400 text-xs font-medium mt-3">✓ {t("vote_recorded")}</p>}
        </div>
      </section>

      {videoGoal && <GoalVideoModal goal={videoGoal} onClose={() => setVideoGoal(null)} />}
    </div>
  );
};

/* ==================== FIXTURES ==================== */

// Tappable odd button — adds to bet slip on click
const OddButton = ({ market, label, value, isPred, isInSlip, onTap, compact }) => (
  <button onClick={onTap}
          className={`rounded-lg ${compact ? "py-1.5 px-1" : "p-2"} text-center border transition-all relative ${
            isInSlip ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50"
            : isPred ? "bg-emerald-500/15 border-emerald-500"
            : "bg-slate-800/60 border-slate-700 active:bg-slate-700"
          }`}>
    {isInSlip && <span className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-full" />}
    <div className={`text-[9px] ${isInSlip ? "text-amber-300" : "text-slate-400"}`}>{label}</div>
    <div className={`${compact ? "text-sm" : "text-base"} font-bold ${isInSlip ? "text-amber-300" : isPred ? "text-emerald-400" : "text-white"}`}>{value}</div>
  </button>
);

const MatchCard = ({ m, onClick, onAddToSlip, slipKeys }) => {
  const t = useT();
  const inSlip = (market) => slipKeys.has(`${m.id}|${market}`);
  const tapOdd = (e, market, label) => {
    e.stopPropagation();
    onAddToSlip(m, market, label);
  };
  return (
    <div className="border-b border-slate-800/40">
      <button onClick={onClick} className="w-full text-left px-3 pt-3 pb-1 active:bg-slate-800/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 min-w-0">
            <Clock size={10} className="flex-shrink-0" /><span className="font-medium">{m.time}</span><span>·</span>
            <span className="truncate">{m.league}</span>
          </div>
          <div className={`flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${conf2color(m.confidence)}`}>
            <TrendingUp size={9} /><span>{m.confidence}</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3">
          <div className="font-semibold text-sm truncate">{m.home}</div>
          <div className="text-slate-500 text-xs font-bold">vs</div>
          <div className="font-semibold text-sm text-right truncate">{m.away}</div>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-2 py-1.5 mb-2 flex items-center justify-between">
          <span className="text-[10px] text-emerald-400 font-semibold">⚡ {t("model_pick")}</span>
          <span className="text-xs font-bold text-emerald-300">{m.pred} <span className="text-[10px] text-emerald-400/70">({m.top_prob}%)</span></span>
        </div>
      </button>
      <div className="px-3 pb-3 space-y-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          <OddButton market="1" label="1" value={m.odds["1"]} isPred={m.pred === "1"} isInSlip={inSlip("1")} onTap={(e) => tapOdd(e, "1", "1")} />
          <OddButton market="X" label="X" value={m.odds["X"]} isPred={m.pred === "X"} isInSlip={inSlip("X")} onTap={(e) => tapOdd(e, "X", "X")} />
          <OddButton market="2" label="2" value={m.odds["2"]} isPred={m.pred === "2"} isInSlip={inSlip("2")} onTap={(e) => tapOdd(e, "2", "2")} />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <OddButton market="Over 2.5" label="Over 2.5" value={m.odds.over} isPred={m.pred?.toLowerCase().includes("over")} isInSlip={inSlip("Over 2.5")} onTap={(e) => tapOdd(e, "Over 2.5", "Over 2.5")} compact />
          <OddButton market="Under 2.5" label="Under 2.5" value={m.odds.under} isPred={m.pred?.toLowerCase().includes("under")} isInSlip={inSlip("Under 2.5")} onTap={(e) => tapOdd(e, "Under 2.5", "Under 2.5")} compact />
          <OddButton market="BTTS" label="BTTS" value={m.odds.btts_yes} isPred={m.pred === "BTTS"} isInSlip={inSlip("BTTS")} onTap={(e) => tapOdd(e, "BTTS", "BTTS")} compact />
        </div>
        <button onClick={onClick} className="w-full mt-1 text-[10px] text-emerald-400/80 bg-emerald-500/5 hover:bg-emerald-500/10 px-2 py-1 rounded">
          {t("details")} →
        </button>
      </div>
    </div>
  );
};

const CountryRow = ({ country, matches, openMatch, openByDefault, onAddToSlip, slipKeys }) => {
  const { lang } = useLang();
  const [open, setOpen] = useState(openByDefault);
  return (
    <div className="border-b border-slate-800/60">
      <button onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between py-3 px-3 border-l-[3px] border-l-emerald-500 bg-gradient-to-r from-slate-900 to-slate-900/40">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl flex-shrink-0">{country.flag}</span>
          <span className="font-semibold text-base truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{country[`name_${lang}`]}</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 flex-shrink-0">{matches.length}</span>
        </div>
        {open ? <ChevronDown size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && <div>{matches.map((m) => <MatchCard key={m.id} m={m} onClick={() => openMatch(m)} onAddToSlip={onAddToSlip} slipKeys={slipKeys} />)}</div>}
    </div>
  );
};

const FixturesPage = ({ openMatch, allMatches, loading, onAddToSlip, slipKeys }) => {
  const t = useT();
  const { lang } = useLang();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let m = allMatches;
    if (tab === "top") m = m.filter((x) => x.confidence === "Very High" || x.confidence === "High");
    if (tab === "value") m = m.filter((x) => (x.chips || []).length >= 2);
    if (tab === "trends") m = m.filter((x) => x.confidence === "Very High");
    if (q.trim()) {
      const s = q.toLowerCase();
      m = m.filter((x) =>
        (x.home || "").toLowerCase().includes(s) || (x.away || "").toLowerCase().includes(s) ||
        (x.countryInfo?.[`name_${lang}`] || "").toLowerCase().includes(s) ||
        (x.league || "").toLowerCase().includes(s)
      );
    }
    return m;
  }, [allMatches, tab, q, lang]);

  // Group by country
  const groupedMap = new Map();
  for (const m of filtered) {
    const key = m.countryCode || "OTH";
    if (!groupedMap.has(key)) groupedMap.set(key, { country: m.countryInfo, matches: [] });
    groupedMap.get(key).matches.push(m);
  }
  const byCountry = Array.from(groupedMap.values()).sort((a, b) => b.matches.length - a.matches.length);

  return (
    <div className="pb-24 relative z-10 w-full">
      <div className="bg-slate-900/50 border-b border-slate-800 px-1">
        <div className="flex">
          {[{ k: "all", l: t("filter_all"), I: Globe }, { k: "top", l: t("filter_top"), I: Star },
            { k: "value", l: t("filter_value"), I: Zap }, { k: "trends", l: t("filter_trends"), I: TrendingUp }].map((tt2) => {
            const I = tt2.I; const active = tab === tt2.k;
            return (
              <button key={tt2.k} onClick={() => setTab(tt2.k)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium ${
                        active ? "bg-emerald-500 text-slate-950" : "text-slate-400"
                      }`}>
                <I size={12} /><span>{tt2.l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 py-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search_placeholder")}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
        </div>
      </div>

      <div className="bg-slate-900/30 border-y border-slate-800/40 px-3 py-2 text-[10px] text-slate-400 flex items-center gap-2 flex-wrap">
        <span>🌍 {byCountry.length} {t("countries")}</span>
        <span>·</span>
        <span>⚽ {filtered.length} {t("matches")}</span>
      </div>

      {loading && allMatches.length === 0 && (
        <div className="text-center text-slate-500 py-12 text-sm flex flex-col items-center gap-2">
          <RefreshCw size={20} className="animate-spin text-emerald-400" />
          <span>{t("loading")}</span>
        </div>
      )}
      {!loading && byCountry.length === 0 && (
        <div className="text-center text-slate-500 py-12 px-6 text-sm">
          {q.trim() ? t("no_matches_filter") : t("no_matches")}
        </div>
      )}
      {byCountry.map((cb, i) => (
        <CountryRow key={cb.country.code} country={cb.country} matches={cb.matches}
                    openMatch={openMatch} openByDefault={i === 0}
                    onAddToSlip={onAddToSlip} slipKeys={slipKeys} />
      ))}
    </div>
  );
};

/* ==================== EV+ PLACEHOLDER ==================== */
const EVPlusPage = () => {
  const t = useT();
  return (
    <div className="pb-24 relative z-10 w-full">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-b border-amber-500/30 px-3 pt-5 pb-4">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center"><Zap size={18} className="text-white" fill="currentColor" /></div>
            <div>
              <h1 className="font-bold text-xl" style={{ fontFamily: "'Rajdhani', sans-serif" }}><span className="text-white">EV</span><span className="text-amber-400">+</span></h1>
              <p className="text-[10px] text-slate-400">{t("ev_powered_by")}</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{t("ev_explainer")}</p>
        </div>
      </div>
      <div className="px-3 py-12">
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4">
            <Zap size={32} className="text-amber-400 animate-pulse" fill="currentColor" />
          </div>
          <h2 className="font-bold text-lg mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t("ev_coming_soon")}</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">{t("ev_api_message")}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <RefreshCw size={10} className="text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-[10px] text-amber-400 font-medium">{t("ev_api_progress")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== MATCH PAGE ==================== */
const ProbBar = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
    <span className="w-20 text-[10px] text-slate-400 text-right flex-shrink-0">{label}</span>
    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
    <span className="w-10 text-[10px] font-bold text-right flex-shrink-0">{value}%</span>
  </div>
);

const AnalysisModal = ({ m, onClose }) => {
  const t = useT();
  const { lang } = useLang();
  return (
    <BottomSheet title={t("deep_analysis")} icon={<Brain size={18} className="text-emerald-400" />} onClose={onClose}>
      <div className="p-4 space-y-4">
        <div className="text-center">
          <div className="text-sm font-semibold">{m.home} vs {m.away}</div>
          <div className="text-[10px] text-slate-500">{m.league} · {m.date} {m.time}</div>
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${conf2color(m.confidence)}`}>{m.confidence}</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2"><Brain size={13} className="text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400 uppercase">{t("ai_analysis")}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{m[`analysis_${lang}`]}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
          <div className="text-[10px] font-semibold text-emerald-400 mb-1">⚡ {t("recommendation")}</div>
          <div className="text-sm font-bold">{t("forecast")}: {m.pred} ({m.top_prob}%)</div>
        </div>
      </div>
    </BottomSheet>
  );
};

const SimulationModal = ({ m, onClose }) => {
  const t = useT();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (progress >= 100) { setDone(true); return; }
    const tt = setTimeout(() => setProgress((p) => Math.min(p + 4, 100)), 60);
    return () => clearTimeout(tt);
  }, [progress]);
  const results = useMemo(() => ({
    homeWin: m.prob["1"], draw: m.prob["X"], awayWin: m.prob["2"],
    avgGoals: ((m.lambda_h || 1.3) + (m.lambda_a || 1.1)).toFixed(2),
    topScores: [
      { score: "2:1", pct: 12.3 }, { score: "1:1", pct: 11.4 }, { score: "2:0", pct: 9.8 },
      { score: "1:0", pct: 8.6 }, { score: "2:2", pct: 7.2 }, { score: "3:1", pct: 6.1 },
      { score: "0:0", pct: 5.4 }, { score: "3:2", pct: 4.8 },
    ],
  }), [m]);
  return (
    <BottomSheet title="100 000" icon={<Dices size={18} className="text-purple-400" />} onClose={onClose}>
      <div className="p-4">
        <div className="text-xs text-slate-400 text-center mb-4">{m.home} vs {m.away}</div>
        {!done ? (
          <div className="space-y-3">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-slate-400 text-center">{Math.floor((progress / 100) * 100000).toLocaleString()} / 100 000</div>
            <div className="text-purple-400 text-sm font-medium text-center animate-pulse">🎲 {t("rolling_matches")}</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Trophy size={13} className="text-amber-400" /><span className="text-xs font-semibold">{t("outcomes")}</span></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800/50 rounded-xl p-2 text-center"><div className="text-[9px] text-slate-500 truncate">{m.home}</div><div className="text-lg font-bold text-blue-400">{results.homeWin}%</div></div>
                <div className="bg-slate-800/50 rounded-xl p-2 text-center"><div className="text-[9px] text-slate-500">{t("draw")}</div><div className="text-lg font-bold text-amber-400">{results.draw}%</div></div>
                <div className="bg-slate-800/50 rounded-xl p-2 text-center"><div className="text-[9px] text-slate-500 truncate">{m.away}</div><div className="text-lg font-bold text-red-400">{results.awayWin}%</div></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2"><Target size={13} className="text-emerald-400" /><span className="text-xs font-semibold">{t("top_scores")}</span></div>
              <div className="space-y-1.5">
                {results.topScores.map((s, i) => {
                  const isFirst = i === 0;
                  return (
                    <div key={s.score} className="flex items-center gap-2">
                      <span className={`text-[10px] w-4 ${isFirst ? "text-emerald-400 font-bold" : "text-slate-500"}`}>#{i + 1}</span>
                      <span className="text-sm font-bold w-10" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{s.score}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isFirst ? "bg-emerald-500" : "bg-slate-600"}`} style={{ width: `${(s.pct / 12.3) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-bold w-10 text-right">{s.pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500">{t("avg_goals_match")}</div>
              <div className="text-2xl font-bold text-emerald-400">{results.avgGoals}</div>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

const MatchPage = ({ match, onBack, onAddToSlip, slipKeys }) => {
  const t = useT();
  const [tab, setTab] = useState("overview");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSim, setShowSim] = useState(false);

  const inSlip = (market) => slipKeys.has(`${match.id}|${market}`);

  return (
    <div className="pb-24 relative z-10 w-full">
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={onBack} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><ArrowLeft size={16} /></button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{match.home} vs {match.away}</div>
            <div className="text-[10px] text-slate-500 truncate">{match.league} · {match.date} {match.time}</div>
          </div>
          <div className={`flex-shrink-0 px-2 py-1 rounded text-[10px] font-bold border ${conf2color(match.confidence)}`}>{match.confidence}</div>
        </div>
        <div className="flex border-t border-slate-800/40">
          {[{ k: "overview", l: t("tab_overview"), I: BarChart3 }, { k: "stats", l: t("tab_stats"), I: Activity }].map((tt2) => {
            const I = tt2.I; const active = tab === tt2.k;
            return (
              <button key={tt2.k} onClick={() => setTab(tt2.k)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium border-b-2 ${
                        active ? "text-emerald-400 border-emerald-500" : "text-slate-400 border-transparent"
                      }`}>
                <I size={12} /><span>{tt2.l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mx-3 mt-4">
        <div className="text-[10px] text-center text-slate-500 mb-3">{match.league}</div>
        <div className="grid grid-cols-3 items-center gap-2">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-3xl mb-1.5">⚽</div>
            <div className="font-bold text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{match.home}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-500" style={{ fontFamily: "'Rajdhani', sans-serif" }}>VS</div>
            <div className="text-emerald-400 font-bold">{match.time}</div>
            <div className="text-[10px] text-slate-500">{match.date}</div>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-3xl mb-1.5">⚽</div>
            <div className="font-bold text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{match.away}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mx-3 mt-3">
        <button onClick={() => setShowAnalysis(true)} className="flex items-center justify-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl py-2.5 text-xs font-semibold">
          <Brain size={14} /><span>{t("deep_analysis")}</span>
        </button>
        <button onClick={() => setShowSim(true)} className="flex items-center justify-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl py-2.5 text-xs font-semibold">
          <Dices size={14} /><span>{t("simulation_100k")}</span>
        </button>
      </div>

      <div className="px-3 pt-3 space-y-3">
        {tab === "overview" && (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5"><BarChart3 size={14} className="text-emerald-400" /><h3 className="font-semibold text-sm">{t("odds")}</h3></div>
                <span className="text-[9px] text-slate-500">↑ Кликни за фиш</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[{ k: "1", lbl: "1", team: match.home }, { k: "X", lbl: "X", team: t("draw") }, { k: "2", lbl: "2", team: match.away }].map((b) => {
                  const isPred = match.pred === b.k;
                  const sel = inSlip(b.k);
                  return (
                    <button key={b.k} onClick={() => onAddToSlip(match, b.k, b.k)}
                            className={`rounded-xl p-2 text-center border relative ${
                              sel ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50"
                              : isPred ? "bg-emerald-500/15 border-emerald-500"
                              : "bg-slate-800/60 border-slate-700"}`}>
                      {sel && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />}
                      <div className={`text-[10px] ${sel ? "text-amber-300" : "text-slate-400"}`}>{b.lbl}</div>
                      <div className={`text-[9px] truncate ${sel ? "text-amber-300/70" : "text-slate-500"}`}>{b.team}</div>
                      <div className={`text-lg font-bold mt-0.5 ${sel ? "text-amber-300" : ""}`}>{match.odds[b.k]}</div>
                      <div className={`text-[10px] ${sel ? "text-amber-300/80" : "text-emerald-400"}`}>{match.prob[b.k]}%</div>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[{ k: "Over 2.5", oddsKey: "over", probKey: "over", lbl: "Over 2.5" },
                  { k: "Under 2.5", oddsKey: "under", probKey: "under", lbl: "Under 2.5" },
                  { k: "BTTS", oddsKey: "btts_yes", probKey: "btts_yes", lbl: "BTTS" }].map((b) => {
                  const isPred = match.pred === b.k || match.pred?.toLowerCase().includes(b.lbl.toLowerCase());
                  const sel = inSlip(b.k);
                  return (
                    <button key={b.k} onClick={() => onAddToSlip(match, b.k, b.lbl)}
                            className={`rounded-xl p-2 text-center border relative ${
                              sel ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50"
                              : isPred ? "bg-emerald-500/15 border-emerald-500"
                              : "bg-slate-800/60 border-slate-700"}`}>
                      {sel && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />}
                      <div className={`text-[10px] ${sel ? "text-amber-300" : "text-slate-400"}`}>{b.lbl}</div>
                      <div className={`text-base font-bold mt-0.5 ${sel ? "text-amber-300" : ""}`}>{match.odds[b.oddsKey]}</div>
                      <div className={`text-[10px] ${sel ? "text-amber-300/80" : "text-emerald-400"}`}>{match.prob[b.probKey]}%</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-center text-[10px] text-emerald-400">
                ✓ {t("model_pick")}: <span className="font-bold">{match.pred}</span> ({match.top_prob}%)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-3"><TrendingUp size={14} className="text-emerald-400" /><h3 className="font-semibold text-sm">{t("probabilities")}</h3></div>
              <div className="space-y-1.5">
                <ProbBar label={t("win_1")} value={match.prob["1"]} color="bg-blue-500" />
                <ProbBar label={t("draw")} value={match.prob["X"]} color="bg-amber-500" />
                <ProbBar label={t("win_2")} value={match.prob["2"]} color="bg-red-500" />
                <div className="border-t border-slate-800/40 my-2" />
                <ProbBar label="Over 2.5" value={match.prob.over} color="bg-emerald-500" />
                <ProbBar label="BTTS" value={match.prob.btts_yes} color="bg-purple-500" />
              </div>
            </div>
          </>
        )}
        {tab === "stats" && (
          <div className="space-y-3">
            {(match.lambda_h !== null && match.lambda_h !== undefined) && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <h3 className="text-xs font-semibold text-emerald-400 mb-3">⚽ Очаквани голове (λ)</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/40 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-slate-400 mb-1 truncate">{match.home}</div>
                    <div className="text-2xl font-bold text-blue-400">{match.lambda_h}</div>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-slate-400 mb-1 truncate">{match.away}</div>
                    <div className="text-2xl font-bold text-red-400">{match.lambda_a}</div>
                  </div>
                </div>
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-center">
                  <div className="text-[10px] text-slate-400">Очаквани общи голове</div>
                  <div className="text-xl font-bold text-emerald-400">{((match.lambda_h || 0) + (match.lambda_a || 0)).toFixed(2)}</div>
                </div>
              </div>
            )}
            {match.chips.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <h3 className="text-xs font-semibold text-emerald-400 mb-2">🎯 Препоръчани пазари</h3>
                <div className="flex flex-wrap gap-1.5">
                  {match.chips.map((c, i) => (
                    <span key={i} className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAnalysis && <AnalysisModal m={match} onClose={() => setShowAnalysis(false)} />}
      {showSim && <SimulationModal m={match} onClose={() => setShowSim(false)} />}
    </div>
  );
};

/* ==================== BET SLIP ==================== */
const BetSlipModal = ({ slip, banks, onClose, onClear, onRemoveLeg, onSubmit }) => {
  const t = useT();
  const [bankId, setBankId] = useState(banks[0]?.id || "");
  const [stake, setStake] = useState("10");
  const [editedLegs, setEditedLegs] = useState(slip.map(l => ({ ...l })));
  const [savedMsg, setSavedMsg] = useState(false);

  // Sync legs if slip changes externally
  useEffect(() => { setEditedLegs(slip.map(l => ({ ...l }))); }, [slip]);

  const totalOdds = useMemo(() => calcTotalOdds(editedLegs), [editedLegs]);
  const stakeNum = parseFloat(stake) || 0;
  const bank = banks.find(b => b.id === bankId);
  const potentialWin = stakeNum * totalOdds;
  const potentialProfit = potentialWin - stakeNum;
  const isAcca = editedLegs.length > 1;

  const updateLeg = (i, patch) => { const next = [...editedLegs]; next[i] = { ...next[i], ...patch }; setEditedLegs(next); };

  const handleSubmit = () => {
    if (editedLegs.length === 0 || !bankId || stakeNum <= 0) return;
    onSubmit({
      id: `bet_${Date.now()}`,
      bankId,
      type: isAcca ? "accumulator" : "single",
      legs: editedLegs.map(l => ({
        matchId: l.matchId, home: l.home, away: l.away, league: l.league,
        market: l.market, odds: parseFloat(l.odds) || 1
      })),
      totalOdds, stake: stakeNum,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setSavedMsg(true);
    setTimeout(() => { setSavedMsg(false); onClose(); }, 1000);
  };

  const canSave = editedLegs.length > 0 && stakeNum > 0 && bankId;

  const footer = (
    <div className="space-y-2">
      {savedMsg && (
        <div className="text-center text-emerald-400 text-sm font-bold py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          {t("saved_bet")}
        </div>
      )}
      {banks.length === 0 && (
        <div className="text-center text-amber-400 text-xs py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          ⚠ {t("no_bank_first")}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={onClear} disabled={editedLegs.length === 0}
                className="px-3 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold disabled:opacity-50">
          <Trash2 size={14} />
        </button>
        <button onClick={onClose} className="flex-1 py-3 bg-slate-800 rounded-lg text-sm font-medium">{t("cancel")}</button>
        <button onClick={handleSubmit} disabled={!canSave}
                className="flex-1 py-3 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-1">
          <CheckCircle size={14} />{t("save")}
        </button>
      </div>
    </div>
  );

  return (
    <BottomSheet title={t("slip")} icon={<Receipt size={18} className="text-amber-400" />} onClose={onClose} footer={footer}>
      <div className="p-3 space-y-3">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">{t("bet_type")}</span>
          <span className={`text-xs font-bold ${isAcca ? "text-amber-400" : "text-emerald-400"}`}>
            {isAcca ? `${t("bet_acca")} (${editedLegs.length})` : t("bet_single")}
          </span>
        </div>

        {editedLegs.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-xs px-4">{t("slip_empty")}</div>
        ) : (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider px-1">{t("selections")}</div>
            {editedLegs.map((leg, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{leg.home} vs {leg.away}</div>
                    <div className="text-[10px] text-slate-500 truncate">{leg.league}</div>
                  </div>
                  <button onClick={() => onRemoveLeg(leg.matchId, leg.market)}
                          className="text-red-400 p-1 -m-1 flex-shrink-0"><X size={14} /></button>
                </div>
                <div className="grid grid-cols-[1fr_70px] gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500">{t("bet_type")}</label>
                    <input value={leg.market} onChange={(e) => updateLeg(i, { market: e.target.value })}
                           className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500">{t("odds")}</label>
                    <input type="number" step="0.01" inputMode="decimal" value={leg.odds}
                           onChange={(e) => updateLeg(i, { odds: e.target.value })}
                           className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs font-mono text-emerald-400 font-bold" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {banks.length > 0 && editedLegs.length > 0 && (
          <>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{t("select_bank")}</label>
              <select value={bankId} onChange={(e) => setBankId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                {banks.map(b => <option key={b.id} value={b.id}>{b.name} — {fmtMoney(b.balance, b.currency)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                {t("stake")} {bank && <span className="text-slate-500">({bank.currency === "EUR" ? "€" : "u"})</span>}
              </label>
              <input type="number" inputMode="decimal" step="0.01" value={stake} onChange={(e) => setStake(e.target.value)}
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 grid grid-cols-3 gap-2 text-center">
              <div><div className="text-[9px] text-slate-400">{t("total_odds")}</div><div className="text-base font-bold text-emerald-400">{totalOdds.toFixed(2)}</div></div>
              <div><div className="text-[9px] text-slate-400">{t("potential_win")}</div><div className="text-sm font-bold">{bank ? fmtMoney(potentialWin, bank.currency) : potentialWin.toFixed(2)}</div></div>
              <div><div className="text-[9px] text-slate-400">{t("potential_profit")}</div><div className="text-sm font-bold text-emerald-400">+{bank ? fmtMoney(potentialProfit, bank.currency) : potentialProfit.toFixed(2)}</div></div>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
};

/* ==================== BANKS ==================== */
const CreateBankModal = ({ onClose, onCreate }) => {
  const t = useT();
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [initialBalance, setInitialBalance] = useState("100");
  const handleCreate = () => {
    if (!name.trim()) return;
    const bal = parseFloat(initialBalance) || 0;
    onCreate({ id: `bank_${Date.now()}`, name: name.trim(), currency, initialBalance: bal, balance: bal, createdAt: new Date().toISOString() });
    onClose();
  };
  const footer = (
    <div className="flex gap-2">
      <button onClick={onClose} className="flex-1 py-3 bg-slate-800 rounded-lg text-sm font-medium">{t("cancel")}</button>
      <button onClick={handleCreate} disabled={!name.trim()}
              className="flex-1 py-3 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-1">
        <CheckCircle size={14} />{t("save")}
      </button>
    </div>
  );
  return (
    <BottomSheet title={t("create_bank")} icon={<Wallet size={18} className="text-emerald-400" />} onClose={onClose} footer={footer}>
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">{t("bank_name")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("bank_name_ph")}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">{t("currency")}</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setCurrency("EUR")} className={`py-2.5 rounded-lg text-sm font-bold border ${currency === "EUR" ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 border-slate-700 text-slate-400"}`}>€ {t("euro")}</button>
            <button onClick={() => setCurrency("UNITS")} className={`py-2.5 rounded-lg text-sm font-bold border ${currency === "UNITS" ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 border-slate-700 text-slate-400"}`}>u {t("units")}</button>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">{t("initial_balance")}</label>
          <input type="number" inputMode="decimal" step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none" />
        </div>
      </div>
    </BottomSheet>
  );
};

const EditBetModal = ({ bet, onClose, onSave }) => {
  const t = useT();
  const [legs, setLegs] = useState(bet.legs.map(l => ({ ...l })));
  const [stake, setStake] = useState(String(bet.stake));
  const totalOdds = useMemo(() => calcTotalOdds(legs), [legs]);
  const stakeNum = parseFloat(stake) || 0;
  const updateLeg = (i, patch) => { const next = [...legs]; next[i] = { ...next[i], ...patch }; setLegs(next); };

  const handleSave = () => {
    if (legs.length === 0 || stakeNum <= 0) return;
    onSave({ ...bet, legs, totalOdds, stake: stakeNum });
    onClose();
  };
  const footer = (
    <div className="flex gap-2">
      <button onClick={onClose} className="flex-1 py-3 bg-slate-800 rounded-lg text-sm font-medium">{t("cancel")}</button>
      <button onClick={handleSave} disabled={legs.length === 0 || stakeNum <= 0}
              className="flex-1 py-3 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-1">
        <CheckCircle size={14} />{t("save")}
      </button>
    </div>
  );
  return (
    <BottomSheet title={t("edit_bet")} icon={<Edit2 size={18} className="text-emerald-400" />} onClose={onClose} footer={footer}>
      <div className="p-3 space-y-2">
        {legs.map((leg, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5">
            <div className="text-xs font-semibold mb-1 truncate">{leg.home} vs {leg.away}</div>
            <div className="text-[10px] text-slate-500 mb-2">{leg.league}</div>
            <div className="grid grid-cols-[1fr_70px] gap-2">
              <input value={leg.market} onChange={(e) => updateLeg(i, { market: e.target.value })}
                     className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs" />
              <input type="number" inputMode="decimal" step="0.01" value={leg.odds}
                     onChange={(e) => updateLeg(i, { odds: parseFloat(e.target.value) || 0 })}
                     className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs font-mono text-emerald-400 font-bold" />
            </div>
          </div>
        ))}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">{t("stake")}</label>
          <input type="number" inputMode="decimal" step="0.01" value={stake} onChange={(e) => setStake(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none" />
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">{t("total_odds")}</div>
          <div className="text-lg font-bold text-emerald-400">{totalOdds.toFixed(2)}</div>
        </div>
      </div>
    </BottomSheet>
  );
};

const BetCard = ({ bet, bank, onSettle, onEdit, onDelete }) => {
  const t = useT();
  const statusMap = {
    pending: { c: "text-amber-400 bg-amber-400/10 border-amber-400/30", l: t("bet_status_pending") },
    won: { c: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", l: t("bet_status_won") },
    lost: { c: "text-red-400 bg-red-400/10 border-red-400/30", l: t("bet_status_lost") },
    void: { c: "text-slate-400 bg-slate-700/40 border-slate-600", l: t("bet_status_void") },
  };
  const s = statusMap[bet.status];
  const profit = bet.status === "won" ? bet.stake * (bet.totalOdds - 1) : bet.status === "lost" ? -bet.stake : 0;

  return (
    <div className={`bg-slate-900 border rounded-xl ${
      bet.status === "won" ? "border-emerald-500/40" : bet.status === "lost" ? "border-red-500/30" : "border-slate-800"
    }`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${s.c} flex-shrink-0`}>{s.l}</span>
            <span className={`text-[10px] font-semibold truncate ${bet.type === "accumulator" ? "text-amber-400" : "text-slate-400"}`}>
              {bet.type === "accumulator" ? `${t("bet_acca")} (${bet.legs.length})` : t("bet_single")}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 flex-shrink-0">{fmtDate(bet.createdAt)}</span>
        </div>
        <div className="space-y-1.5 mb-2.5">
          {bet.legs.map((leg, i) => (
            <div key={i} className="bg-slate-800/40 rounded-lg px-2.5 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{leg.home} vs {leg.away}</div>
                  <div className="text-[10px] text-slate-500 truncate">{leg.market}</div>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-400 flex-shrink-0">{leg.odds.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/50">
          <div><div className="text-[9px] text-slate-500">{t("stake")}</div><div className="text-sm font-semibold">{fmtMoney(bet.stake, bank.currency)}</div></div>
          <div><div className="text-[9px] text-slate-500">{t("total_odds")}</div><div className="text-sm font-semibold">{bet.totalOdds.toFixed(2)}</div></div>
          <div>
            <div className="text-[9px] text-slate-500">{bet.status === "pending" ? t("potential_profit") : t("profit")}</div>
            <div className={`text-sm font-bold ${profit > 0 ? "text-emerald-400" : profit < 0 ? "text-red-400" : "text-slate-300"}`}>
              {bet.status === "pending" ? `+${fmtMoney(bet.stake * (bet.totalOdds - 1), bank.currency)}`
                : `${profit > 0 ? "+" : ""}${fmtMoney(profit, bank.currency)}`}
            </div>
          </div>
        </div>
        {bet.status === "pending" && (
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            <button onClick={() => onSettle(bet, "won")} className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded py-1.5 text-[10px] font-bold">✓ {t("mark_won")}</button>
            <button onClick={() => onSettle(bet, "lost")} className="bg-red-500/15 border border-red-500/30 text-red-400 rounded py-1.5 text-[10px] font-bold">✗ {t("mark_lost")}</button>
            <button onClick={() => onSettle(bet, "void")} className="bg-slate-700/40 border border-slate-600 text-slate-300 rounded py-1.5 text-[10px] font-bold">⊘ {t("mark_void")}</button>
          </div>
        )}
        <div className="flex gap-1.5 mt-2">
          {bet.status !== "pending" && (
            <button onClick={() => onSettle(bet, "pending")} className="flex-1 bg-slate-800 text-slate-300 rounded py-1.5 text-[10px]">↺ {t("reset_status")}</button>
          )}
          <button onClick={() => onEdit(bet)} className="flex-1 bg-slate-800 text-slate-300 rounded py-1.5 text-[10px] flex items-center justify-center gap-1"><Edit2 size={10} />{t("edit")}</button>
          <button onClick={() => onDelete(bet)} className="flex-1 bg-red-500/10 text-red-400 rounded py-1.5 text-[10px] flex items-center justify-center gap-1"><Trash2 size={10} />{t("delete")}</button>
        </div>
      </div>
    </div>
  );
};

const BankDetailView = ({ bank, bets, onBack, onSettle, onEditBet, onDeleteBet, onDeleteBank, onOpenSlip, slipCount }) => {
  const t = useT();
  const [filter, setFilter] = useState("all");
  const bankBets = bets.filter((b) => b.bankId === bank.id);
  const filteredBets = filter === "all" ? bankBets : bankBets.filter((b) => b.status === filter);
  const settled = bankBets.filter((b) => b.status === "won" || b.status === "lost");
  const wonBets = settled.filter((b) => b.status === "won");
  const totalStaked = settled.reduce((s, b) => s + b.stake, 0);
  const totalProfit = settled.reduce((s, b) => s + (b.status === "won" ? b.stake * (b.totalOdds - 1) : -b.stake), 0);
  const winRate = settled.length > 0 ? Math.round((wonBets.length / settled.length) * 100) : 0;
  const roi = totalStaked > 0 ? ((totalProfit / totalStaked) * 100).toFixed(1) : "0.0";

  return (
    <div className="pb-24 w-full">
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-3 flex items-center gap-2">
        <button onClick={onBack} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><ArrowLeft size={16} /></button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{bank.name}</h2>
          <div className="text-[10px] text-slate-400">{bank.currency === "EUR" ? "€ " + t("euro") : "u " + t("units")}</div>
        </div>
        <button onClick={() => onDeleteBank(bank)} className="w-8 h-8 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center flex-shrink-0"><Trash2 size={14} /></button>
      </div>
      <div className="px-3 pt-4">
        <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4">
          <div className="text-[10px] text-slate-400 uppercase mb-1">{t("current_balance")}</div>
          <div className="text-3xl font-bold font-mono">{fmtMoney(bank.balance, bank.currency)}</div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
            <span>{t("initial_balance")}: {fmtMoney(bank.initialBalance, bank.currency)}</span>
            <span className={bank.balance > bank.initialBalance ? "text-emerald-400 font-bold" : bank.balance < bank.initialBalance ? "text-red-400 font-bold" : ""}>
              {bank.balance >= bank.initialBalance ? "+" : ""}{fmtMoney(bank.balance - bank.initialBalance, bank.currency)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-3 pt-3">
        <div className="grid grid-cols-4 gap-1.5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{t("total_bets")}</div><div className="text-sm font-bold">{bankBets.length}</div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{t("win_rate")}</div><div className="text-sm font-bold text-emerald-400">{winRate}%</div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{t("profit")}</div>
            <div className={`text-sm font-bold ${totalProfit > 0 ? "text-emerald-400" : totalProfit < 0 ? "text-red-400" : ""}`}>{totalProfit >= 0 ? "+" : ""}{fmtMoney(totalProfit, bank.currency)}</div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{t("roi")}</div>
            <div className={`text-sm font-bold ${parseFloat(roi) > 0 ? "text-emerald-400" : parseFloat(roi) < 0 ? "text-red-400" : ""}`}>{parseFloat(roi) >= 0 ? "+" : ""}{roi}%</div></div>
        </div>
      </div>
      {slipCount > 0 && (
        <div className="px-3 pt-3">
          <button onClick={onOpenSlip} className="w-full bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
            <Receipt size={14} />{t("slip")} ({slipCount})
          </button>
        </div>
      )}
      <div className="px-3 pt-3 flex gap-1.5 overflow-x-auto pb-1">
        {[{ k: "all", l: t("filter_all") }, { k: "pending", l: t("pending") }, { k: "won", l: t("won") }, { k: "lost", l: t("lost") }, { k: "void", l: t("void") }].map((p) => (
          <button key={p.k} onClick={() => setFilter(p.k)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border ${
                    filter === p.k ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>{p.l}</button>
        ))}
      </div>
      <div className="px-3 pt-3 space-y-2">
        {filteredBets.length === 0 && <div className="text-center text-slate-500 py-12 text-sm">{t("no_bets")}</div>}
        {filteredBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((bet) => (
          <BetCard key={bet.id} bet={bet} bank={bank} onSettle={onSettle} onEdit={onEditBet} onDelete={onDeleteBet} />
        ))}
      </div>
    </div>
  );
};

const BetsPage = ({ banks, bets, onCreateBank, onSettleBet, onEditBet, onDeleteBet, onDeleteBank, onOpenSlip, slipCount }) => {
  const t = useT();
  const [activeBank, setActiveBank] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingBet, setEditingBet] = useState(null);

  if (activeBank) {
    const bank = banks.find((b) => b.id === activeBank.id);
    if (bank) {
      return (
        <>
          <BankDetailView
            bank={bank} bets={bets} onBack={() => setActiveBank(null)}
            onSettle={onSettleBet}
            onEditBet={(bet) => setEditingBet(bet)}
            onDeleteBet={onDeleteBet}
            onDeleteBank={(b) => { onDeleteBank(b); setActiveBank(null); }}
            onOpenSlip={onOpenSlip} slipCount={slipCount}
          />
          {editingBet && <EditBetModal bet={editingBet} onClose={() => setEditingBet(null)} onSave={onEditBet} />}
        </>
      );
    }
  }

  return (
    <div className="px-3 pt-4 pb-24 relative z-10 w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><Wallet size={18} className="text-emerald-400" />
          <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t("bets_title")}</h2>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1 bg-emerald-500 text-slate-950 rounded-lg px-3 py-1.5 text-xs font-bold">
          <Plus size={12} />{t("create_bank")}
        </button>
      </div>

      {slipCount > 0 && (
        <button onClick={onOpenSlip}
                className="w-full mb-3 bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2">
          <Receipt size={16} />{t("slip")} ({slipCount}) →
        </button>
      )}

      {banks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Coins size={40} className="mx-auto text-emerald-400 mb-3" />
          <div className="text-sm font-semibold mb-1">{t("no_banks")}</div>
          <div className="text-xs text-slate-500 mb-4">{t("no_banks_sub")}</div>
          <button onClick={() => setShowCreate(true)} className="bg-emerald-500 text-slate-950 rounded-lg px-4 py-2.5 text-sm font-bold inline-flex items-center gap-2">
            <PlusCircle size={14} />{t("create_bank")}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {banks.map((b) => {
            const bankBets = bets.filter((bt) => bt.bankId === b.id);
            const settled = bankBets.filter((bt) => bt.status === "won" || bt.status === "lost");
            const totalProfit = settled.reduce((s, bt) => s + (bt.status === "won" ? bt.stake * (bt.totalOdds - 1) : -bt.stake), 0);
            const pendingCount = bankBets.filter((bt) => bt.status === "pending").length;
            return (
              <button key={b.id} onClick={() => setActiveBank(b)}
                      className="w-full text-left bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{b.name}</div>
                  <ChevronRight size={16} className="text-slate-500 flex-shrink-0" />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-2xl font-bold font-mono">{fmtMoney(b.balance, b.currency)}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {bankBets.length} {t("total_bets").toLowerCase()}
                      {pendingCount > 0 && <span className="text-amber-400 ml-1">· {pendingCount} {t("pending").toLowerCase()}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[9px] text-slate-500">{t("profit")}</div>
                    <div className={`text-sm font-bold ${totalProfit > 0 ? "text-emerald-400" : totalProfit < 0 ? "text-red-400" : "text-slate-300"}`}>
                      {totalProfit >= 0 ? "+" : ""}{fmtMoney(totalProfit, b.currency)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {showCreate && <CreateBankModal onClose={() => setShowCreate(false)} onCreate={onCreateBank} />}
    </div>
  );
};

/* ==================== STANDINGS ==================== */
const StandingsPage = ({ onBack }) => {
  const t = useT();
  return (
    <div className="px-3 pt-4 pb-24 relative z-10 w-full">
      <div className="flex items-center gap-2 mb-3">
        {onBack && <button onClick={onBack} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><ArrowLeft size={16} /></button>}
        <Trophy size={18} className="text-emerald-400" />
        <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t("standings_title")}</h2>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[24px_1fr_24px_24px_24px_36px_32px] items-center gap-1 px-3 py-2 bg-slate-800/30 text-[10px] font-semibold text-slate-400 uppercase">
          <div className="text-center">#</div><div>{t("team")}</div><div className="text-center">M</div>
          <div className="text-center text-emerald-400">W</div><div className="text-center text-amber-400">D</div>
          <div className="text-center text-slate-500">GD</div><div className="text-center">P</div>
        </div>
        {STANDINGS.map((row) => {
          const isTop = row.pos <= 4;
          const isBottom = row.pos >= 9;
          return (
            <div key={row.pos} className={`grid grid-cols-[24px_1fr_24px_24px_24px_36px_32px] items-center gap-1 px-3 py-2.5 text-xs border-b border-slate-800/30 ${
              isTop ? "border-l-2 border-l-emerald-500" : isBottom ? "border-l-2 border-l-red-500/50" : ""
            }`}>
              <div className={`text-center font-bold ${isTop ? "text-emerald-400" : ""}`}>{row.pos}</div>
              <div className="font-medium truncate">{row.team}</div>
              <div className="text-center text-slate-400">{row.p}</div>
              <div className="text-center text-emerald-400 font-medium">{row.w}</div>
              <div className="text-center text-amber-400">{row.d}</div>
              <div className="text-center text-slate-500">{row.gd}</div>
              <div className="text-center font-bold">{row.pts}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm" /><span>{t("champions_league")}</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/50 rounded-sm" /><span>{t("relegation")}</span></div>
      </div>
    </div>
  );
};

/* ==================== PROFILE ==================== */
const ProfilePage = ({ settings, updateSettings, onResetData, onShowStandings }) => {
  const t = useT();
  const { lang, setLang } = useLang();
  return (
    <div className="px-3 pt-4 pb-24 space-y-3 relative z-10 w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3">М</div>
        <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Miroslav</h2>
        <p className="text-xs text-slate-400">miroslav@betpro.bg</p>
        <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-semibold">
          <Sparkles size={10} />{t("pro_member")}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[{ l: t("watched"), v: "147", I: Eye }, { l: t("saved"), v: "23", I: Bookmark }, { l: t("accuracy"), v: "62%", I: Target }].map((s, i) => {
          const I = s.I;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <I size={14} className="mx-auto text-emerald-400 mb-1" />
              <div className="text-lg font-bold">{s.v}</div>
              <div className="text-[10px] text-slate-500">{s.l}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800">{t("settings")}</div>
        <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><Languages size={14} className="text-emerald-400" /></div>
          <div className="flex-1"><div className="text-sm font-medium">{t("language")}</div></div>
          <div className="flex items-center bg-slate-800 rounded-md overflow-hidden text-[10px] font-bold">
            <button onClick={() => setLang("bg")} className={`px-3 py-1 ${lang === "bg" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>BG</button>
            <button onClick={() => setLang("en")} className={`px-3 py-1 ${lang === "en" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>EN</button>
          </div>
        </div>
        <button onClick={() => updateSettings({ bgAnimation: !settings.bgAnimation })} className="w-full flex items-center gap-3 px-3 py-3 border-b border-slate-800/50 text-left">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><Sparkles size={14} className="text-emerald-400" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{t("bg_animation")}</div>
            <div className="text-[10px] text-slate-500">{settings.bgAnimation ? t("on") : t("off")}</div>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 flex-shrink-0 ${settings.bgAnimation ? "bg-emerald-500" : "bg-slate-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.bgAnimation ? "translate-x-5" : ""}`} />
          </div>
        </button>
        <button onClick={() => updateSettings({ notifications: !settings.notifications })} className="w-full flex items-center gap-3 px-3 py-3 text-left">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><Bell size={14} className="text-emerald-400" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{t("notifications")}</div>
            <div className="text-[10px] text-slate-500">{settings.notifications ? t("on") : t("off")}</div>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 flex-shrink-0 ${settings.notifications ? "bg-emerald-500" : "bg-slate-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? "translate-x-5" : ""}`} />
          </div>
        </button>
      </div>

      <button onClick={onShowStandings} className="w-full flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><Trophy size={14} className="text-emerald-400" /></div>
        <div className="flex-1 text-left min-w-0"><div className="text-sm font-medium">{t("view_standings")}</div></div>
        <ChevronRight size={16} className="text-slate-500 flex-shrink-0" />
      </button>

      <button onClick={onResetData} className="w-full flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
        <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><Trash2 size={14} className="text-red-400" /></div>
        <div className="flex-1 text-left min-w-0"><div className="text-sm font-medium text-red-400">{t("reset_progress")}</div></div>
        <ChevronRight size={16} className="text-red-400/50 flex-shrink-0" />
      </button>
    </div>
  );
};

/* ==================== ROOT APP ==================== */
export default function App() {
  const [state, setState] = useState(null);
  const [route, setRoute] = useState("home");
  const [match, setMatch] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSlip, setShowSlip] = useState(false);

  useEffect(() => { loadState().then(setState); }, []);
  useEffect(() => { if (state) saveState(state); }, [state]);

  // Silent receiver — pulls from Supabase every 5 seconds
  useEffect(() => {
    let cancelled = false;
    const fetchAndSet = async () => {
      try {
        const arr = await fetchMatchesFromSupabase();
        if (cancelled) return;
        // Deduplicate by id (defensive)
        const seen = new Set();
        const unique = [];
        for (const m of arr) {
          if (seen.has(m.id)) continue;
          seen.add(m.id);
          unique.push(m);
        }
        setMatches(unique);
        setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAndSet();
    const id = setInterval(fetchAndSet, FETCH_INTERVAL_SEC * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-emerald-400 text-2xl animate-pulse">⚽</div>
      </div>
    );
  }

  const setLang = (l) => setState({ ...state, lang: l });
  const updateSettings = (patch) => setState({ ...state, settings: { ...state.settings, ...patch } });

  const openMatch = (m) => { setMatch(m); setRoute("match"); };
  const handleSetRoute = (r) => { setRoute(r); if (r !== "match") setMatch(null); };

  // Bet Slip operations
  const slipKeys = useMemo(() => new Set((state.betSlip || []).map(l => `${l.matchId}|${l.market}`)), [state.betSlip]);

  const handleAddToSlip = (m, market, label) => {
    const key = `${m.id}|${market}`;
    const oddsKey = market === "Over 2.5" ? "over" : market === "Under 2.5" ? "under" : market === "BTTS" ? "btts_yes" : market;
    const odds = m.odds[oddsKey] || 2;
    const exists = (state.betSlip || []).some(l => `${l.matchId}|${l.market}` === key);
    if (exists) {
      // Tap again to remove
      setState({ ...state, betSlip: (state.betSlip || []).filter(l => `${l.matchId}|${l.market}` !== key) });
    } else {
      setState({
        ...state,
        betSlip: [...(state.betSlip || []), {
          matchId: m.id, home: m.home, away: m.away, league: m.league,
          market: label, odds
        }]
      });
    }
  };
  const handleRemoveFromSlip = (matchId, market) => {
    setState({ ...state, betSlip: (state.betSlip || []).filter(l => !(l.matchId === matchId && l.market === market)) });
  };
  const handleClearSlip = () => setState({ ...state, betSlip: [] });

  const handleCreateBank = (bank) => setState({ ...state, banks: [...state.banks, bank] });

  const handlePlaceBet = (bet) => {
    setState({ ...state, bets: [...state.bets, bet], betSlip: [] });
  };

  const handleSettleBet = (bet, newStatus) => {
    const banks = state.banks.map((b) => {
      if (b.id !== bet.bankId) return b;
      let balance = b.balance;
      if (bet.status === "won") balance -= bet.stake * (bet.totalOdds - 1);
      else if (bet.status === "lost") balance += bet.stake;
      if (newStatus === "won") balance += bet.stake * (bet.totalOdds - 1);
      else if (newStatus === "lost") balance -= bet.stake;
      return { ...b, balance };
    });
    const bets = state.bets.map((b) => b.id === bet.id ? { ...b, status: newStatus, settledAt: new Date().toISOString() } : b);
    setState({ ...state, banks, bets });
  };

  const handleEditBet = (updated) => {
    const old = state.bets.find((b) => b.id === updated.id);
    if (!old) return;
    const banks = state.banks.map((b) => {
      if (b.id !== old.bankId && b.id !== updated.bankId) return b;
      let balance = b.balance;
      if (b.id === old.bankId) {
        if (old.status === "won") balance -= old.stake * (old.totalOdds - 1);
        else if (old.status === "lost") balance += old.stake;
      }
      if (b.id === updated.bankId) {
        if (updated.status === "won") balance += updated.stake * (updated.totalOdds - 1);
        else if (updated.status === "lost") balance -= updated.stake;
      }
      return { ...b, balance };
    });
    const bets = state.bets.map((b) => b.id === updated.id ? updated : b);
    setState({ ...state, banks, bets });
  };

  const handleDeleteBet = (bet) => {
    setConfirmModal({
      msg: tx("confirm_delete_bet", state.lang),
      onConfirm: () => {
        const banks = state.banks.map((b) => {
          if (b.id !== bet.bankId) return b;
          let balance = b.balance;
          if (bet.status === "won") balance -= bet.stake * (bet.totalOdds - 1);
          else if (bet.status === "lost") balance += bet.stake;
          return { ...b, balance };
        });
        setState({ ...state, banks, bets: state.bets.filter((b) => b.id !== bet.id) });
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteBank = (bank) => {
    setConfirmModal({
      msg: tx("confirm_delete_bank", state.lang),
      onConfirm: () => {
        setState({ ...state, banks: state.banks.filter((b) => b.id !== bank.id),
                   bets: state.bets.filter((bt) => bt.bankId !== bank.id) });
        setConfirmModal(null);
      }
    });
  };

  const handleResetData = () => {
    setConfirmModal({
      msg: tx("confirm_reset", state.lang),
      onConfirm: () => { setState({ ...DEFAULT_STATE }); setConfirmModal(null); }
    });
  };

  const slipCount = (state.betSlip || []).length;

  return (
    <LangCtx.Provider value={{ lang: state.lang, setLang }}>
      <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden"
           style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <SoccerBackground enabled={state.settings.bgAnimation} />
        <Header slipCount={slipCount} onOpenSlip={() => setShowSlip(true)} />
        {route === "home" && <HomePage setRoute={handleSetRoute} />}
        {route === "fixtures" && (
          <FixturesPage openMatch={openMatch} allMatches={matches} loading={loading}
                        onAddToSlip={handleAddToSlip} slipKeys={slipKeys} />
        )}
        {route === "bets" && (
          <BetsPage banks={state.banks} bets={state.bets}
                    onCreateBank={handleCreateBank}
                    onSettleBet={handleSettleBet} onEditBet={handleEditBet}
                    onDeleteBet={handleDeleteBet} onDeleteBank={handleDeleteBank}
                    onOpenSlip={() => setShowSlip(true)} slipCount={slipCount} />
        )}
        {route === "evplus" && <EVPlusPage />}
        {route === "match" && match && (
          <MatchPage match={match} onBack={() => setRoute("fixtures")}
                     onAddToSlip={handleAddToSlip} slipKeys={slipKeys} />
        )}
        {route === "standings" && <StandingsPage onBack={() => setRoute("profile")} />}
        {route === "profile" && (
          <ProfilePage settings={state.settings} updateSettings={updateSettings}
                       onResetData={handleResetData} onShowStandings={() => setRoute("standings")} />
        )}
        <BottomNav route={route} setRoute={handleSetRoute} slipCount={slipCount} />
        {showSlip && (
          <BetSlipModal slip={state.betSlip || []} banks={state.banks}
                        onClose={() => setShowSlip(false)}
                        onClear={handleClearSlip}
                        onRemoveLeg={handleRemoveFromSlip}
                        onSubmit={handlePlaceBet} />
        )}
        {confirmModal && <ConfirmModal msg={confirmModal.msg} onCancel={() => setConfirmModal(null)} onConfirm={confirmModal.onConfirm} />}
      </div>
    </LangCtx.Provider>
  );
}
