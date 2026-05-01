import React, { useState, useMemo, useEffect, createContext, useContext, useCallback } from "react";
import {
  Home, List, Trophy, User, ChevronRight, ChevronDown, ChevronUp,
  Search, Clock, TrendingUp, TrendingDown, Star, Zap, Globe,
  Newspaper, ArrowRight, CheckCircle, AlertCircle,
  Brain, Dices, BarChart3, Activity, LineChart as LineChartIcon,
  X, ArrowLeft, History, Target, Minus, Sparkles, Bell, Languages,
  Bookmark, Eye, Plus, Wallet, Edit2, Trash2, Play, Download,
  Coins, ListChecks, PlusCircle, RefreshCw
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer
} from "recharts";

/* I18N ============================================================ */
const T = {
  live: { bg: "LIVE", en: "LIVE" },
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
  ev_plus_subtitle: { bg: "Стойностни залози от модела на OddAlerts", en: "Value picks from OddAlerts model" },
  new: { bg: "НОВО", en: "NEW" },
  latest_news: { bg: "Последни новини", en: "Latest news" },
  show_all: { bg: "Всички", en: "Show all" },
  show_less: { bg: "По-малко", en: "Less" },
  transfers: { bg: "Трансфери", en: "Transfers" },
  filter_all: { bg: "Всички", en: "All" },
  status_confirmed: { bg: "Потвърдено", en: "Confirmed" },
  status_close: { bg: "Близо", en: "Close" },
  status_rumour: { bg: "Слух", en: "Rumour" },
  goal_of_week: { bg: "Гол на седмицата", en: "Goal of the week" },
  votes: { bg: "гласа", en: "votes" },
  vote_for_best: { bg: "Гласувай за най-красивия гол от миналата седмица", en: "Vote for last week's best goal" },
  click_to_vote: { bg: "Гласувай", en: "Vote" },
  watch_video: { bg: "Видео", en: "Video" },
  vote_recorded: { bg: "Гласът ти е записан!", en: "Vote recorded!" },
  leader: { bg: "Водещ", en: "Leader" },
  filter_top: { bg: "Топ", en: "Top" },
  filter_value: { bg: "Стойност", en: "Value" },
  filter_trends: { bg: "Трендове", en: "Trends" },
  yesterday: { bg: "Вчера", en: "Yesterday" },
  today: { bg: "Днес", en: "Today" },
  tomorrow: { bg: "Утре", en: "Tomorrow" },
  search_placeholder: { bg: "Търси отбор или държава...", en: "Search team or country..." },
  countries: { bg: "държави", en: "countries" },
  matches: { bg: "мача", en: "matches" },
  top_predictions: { bg: "топ прогнози", en: "top picks" },
  details: { bg: "Детайли", en: "Details" },
  played: { bg: "Изиграни", en: "Played" },
  win_pct: { bg: "Победи %", en: "Win %" },
  avg_goals: { bg: "Ср. голове", en: "Avg goals" },
  draw: { bg: "Равенство", en: "Draw" },
  no_matches_filter: { bg: "Няма намерени мачове.", en: "No matches found." },
  import_matches: { bg: "Импорт", en: "Import" },
  tab_overview: { bg: "Общ преглед", en: "Overview" },
  tab_stats: { bg: "Статистика", en: "Stats" },
  tab_odds: { bg: "Коефициенти", en: "Odds" },
  deep_analysis: { bg: "Анализ", en: "Analysis" },
  simulation_100k: { bg: "Симулация", en: "Simulation" },
  add_to_bet: { bg: "Към залог", en: "Add to bet" },
  odds: { bg: "Коефициенти", en: "Odds" },
  see_movement: { bg: "Виж движение", en: "See movement" },
  prediction: { bg: "Прогноза", en: "Prediction" },
  probabilities: { bg: "Вероятности", en: "Probabilities" },
  win_1: { bg: "Победа 1", en: "Win 1" },
  win_2: { bg: "Победа 2", en: "Win 2" },
  h2h_title: { bg: "Директни срещи", en: "Head-to-head" },
  h2h_total: { bg: "Общо", en: "Total" },
  h2h_meetings: { bg: "срещи", en: "meetings" },
  click_odds_history: { bg: "💡 Кликни на коефициент за да видиш историята.", en: "💡 Tap an odd to see its history." },
  market: { bg: "Пазар", en: "Market" },
  change_from_open: { bg: "Промяна", en: "Change" },
  open_odd: { bg: "Открит", en: "Opened" },
  min: { bg: "Мин.", en: "Min." },
  max: { bg: "Макс.", en: "Max." },
  range: { bg: "Диапазон", en: "Range" },
  ai_analysis: { bg: "AI Анализ", en: "AI Analysis" },
  recommendation: { bg: "ПРЕПОРЪКА", en: "RECOMMENDATION" },
  forecast: { bg: "Прогноза", en: "Forecast" },
  rolling_matches: { bg: "Разиграване...", en: "Rolling..." },
  outcomes: { bg: "Изходи", en: "Outcomes" },
  top_scores: { bg: "Топ 8 резултата", en: "Top 8 scores" },
  avg_goals_match: { bg: "Средно голове", en: "Avg goals" },
  ev_powered_by: { bg: "Powered by OddAlerts", en: "Powered by OddAlerts" },
  ev_explainer: { bg: "Стойностни залози от модела на OddAlerts с по-висока вероятност от букмейкъра.", en: "Value picks from OddAlerts model with higher probability than the bookmaker." },
  ev_coming_soon: { bg: "Идва скоро", en: "Coming soon" },
  ev_api_message: { bg: "Тази секция ще се активира след свързване с OddAlerts API.", en: "This section activates after the OddAlerts API is connected." },
  ev_api_progress: { bg: "Работи се по интеграцията", en: "Integration in progress" },
  standings_title: { bg: "Класиране — Ла Лига", en: "Standings — La Liga" },
  team: { bg: "Отбор", en: "Team" },
  champions_league: { bg: "Шампионска лига", en: "Champions League" },
  relegation: { bg: "Изпадане", en: "Relegation" },
  pro_member: { bg: "PRO", en: "PRO" },
  watched: { bg: "Гледани", en: "Watched" },
  saved: { bg: "Запазени", en: "Saved" },
  accuracy: { bg: "Точност", en: "Accuracy" },
  notifications: { bg: "Известия", en: "Notifications" },
  on: { bg: "Включени", en: "On" },
  off: { bg: "Изключени", en: "Off" },
  ev_notifications: { bg: "EV+ известия", en: "EV+ alerts" },
  language: { bg: "Език", en: "Language" },
  bg_animation: { bg: "Анимиран фон", en: "Animated background" },
  view_standings: { bg: "Виж класирането", en: "View standings" },
  settings: { bg: "Настройки", en: "Settings" },
  bets_title: { bg: "Моите залози", en: "My bets" },
  banks: { bg: "Банки", en: "Banks" },
  bank: { bg: "Банка", en: "Bank" },
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
  no_bets: { bg: "Няма залози в тази банка.", en: "No bets in this bank." },
  place_bet: { bg: "Нов залог", en: "New bet" },
  bet_type: { bg: "Тип", en: "Type" },
  bet_single: { bg: "Сингъл", en: "Single" },
  bet_accumulator: { bg: "Колонка", en: "Acca" },
  select_bank: { bg: "Избери банка", en: "Select bank" },
  add_match: { bg: "Добави мач", en: "Add match" },
  stake: { bg: "Залог", en: "Stake" },
  total_odds: { bg: "Общ коеф.", en: "Total odds" },
  potential_win: { bg: "Потенциална печалба", en: "Potential win" },
  potential_profit: { bg: "Печалба", en: "Profit" },
  legs: { bg: "Мачове", en: "Legs" },
  pick_match: { bg: "Избери мач", en: "Pick a match" },
  pick_market: { bg: "Пазар", en: "Market" },
  no_matches_imported: { bg: "Няма мачове. Импортирай или избери.", en: "No matches. Import or select." },
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
  import_title: { bg: "Импортирай мачове", en: "Import matches" },
  import_paste: { bg: "Постави JSON", en: "Paste JSON" },
  import_url: { bg: "От URL", en: "From URL" },
  import_paste_label: { bg: "JSON масив с мачове:", en: "Matches JSON array:" },
  import_url_label: { bg: "Endpoint URL:", en: "Endpoint URL:" },
  import_btn: { bg: "Импортирай", en: "Import" },
  import_fetching: { bg: "Зареждане...", en: "Fetching..." },
  import_success: { bg: "Импортирани", en: "Imported" },
  import_error: { bg: "Грешка. Провери JSON или CORS.", en: "Error. Check JSON or CORS." },
  import_cors_note: { bg: "Бележка: ендпойнтът трябва да позволява CORS.", en: "Note: endpoint must allow CORS." },
  imported_label: { bg: "импортирани", en: "imported" },
  goal_not_available: { bg: "Видеото не е налично", en: "Video not available" },
  reset_progress: { bg: "Нулирай данните", en: "Reset data" },
  confirm_reset: { bg: "Това ще изтрие всички банки, залози и настройки. Сигурен ли си?", en: "This deletes all banks, bets and settings. Are you sure?" },
  confirm_delete_bank: { bg: "Изтрий банката и всички нейни залози?", en: "Delete bank and all its bets?" },
  confirm_delete_bet: { bg: "Изтрий този залог?", en: "Delete this bet?" },
  goals: { bg: "ГОЛОВЕ", en: "GOALS" },
  corners: { bg: "ЪГЛОВИ", en: "CORNERS" },
  cards: { bg: "КАРТИ", en: "CARDS" },
  shots: { bg: "УДАРИ", en: "SHOTS" },
};
const tt = (k, lang) => T[k]?.[lang] ?? T[k]?.bg ?? k;
const LangCtx = createContext({ lang: "bg", setLang: () => {} });
const useLang = () => useContext(LangCtx);
const useT = () => { const { lang } = useLang(); return useCallback((k) => tt(k, lang), [lang]); };

/* DATA ============================================================ */
const COUNTRIES = [
  { code: "ENG", name_bg: "Англия", name_en: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "ESP", name_bg: "Испания", name_en: "Spain", flag: "🇪🇸" },
  { code: "GER", name_bg: "Германия", name_en: "Germany", flag: "🇩🇪" },
  { code: "FRA", name_bg: "Франция", name_en: "France", flag: "🇫🇷" },
  { code: "ITA", name_bg: "Италия", name_en: "Italy", flag: "🇮🇹" },
  { code: "POR", name_bg: "Португалия", name_en: "Portugal", flag: "🇵🇹" },
  { code: "NED", name_bg: "Холандия", name_en: "Netherlands", flag: "🇳🇱" },
  { code: "BEL", name_bg: "Белгия", name_en: "Belgium", flag: "🇧🇪" },
  { code: "OTH", name_bg: "Други", name_en: "Other", flag: "🌍" },
];

const SAMPLE_FIXTURES = [
  { id: "m1", country: "ENG", league: "Premier League", date: "01.05", time: "17:30",
    home: "Арсенал", away: "Челси", home_en: "Arsenal", away_en: "Chelsea",
    form_h: "WWDWL", form_a: "WLWDW", played_h: 32, played_a: 32,
    win_pct_h: 65, win_pct_a: 52, avg_goals_h: 2.4, avg_goals_a: 1.9,
    odds: { "1": 1.85, X: 3.6, "2": 4.2, over: 1.78, under: 2.05, btts_yes: 1.65, btts_no: 2.25 },
    prob: { "1": 54, X: 25, "2": 21, over: 62, under: 38, btts_yes: 65, btts_no: 35 },
    pred: "1", confidence: "High", chips: ["1", "Over 2.5", "BTTS"],
    analysis_bg: "Арсенал със стабилен дом. Стойност в 1 + Over 2.5.",
    analysis_en: "Arsenal strong at home. Value in 1 + Over 2.5." },
  { id: "m2", country: "ENG", league: "Premier League", date: "01.05", time: "20:00",
    home: "Манчестър Сити", away: "Ливърпул", home_en: "Man City", away_en: "Liverpool",
    form_h: "WWWDW", form_a: "WWLWW", played_h: 32, played_a: 32,
    win_pct_h: 78, win_pct_a: 71, avg_goals_h: 2.9, avg_goals_a: 2.5,
    odds: { "1": 2.1, X: 3.4, "2": 3.3, over: 1.55, under: 2.4, btts_yes: 1.45, btts_no: 2.6 },
    prob: { "1": 42, X: 27, "2": 31, over: 73, under: 27, btts_yes: 76, btts_no: 24 },
    pred: "Over 2.5", confidence: "Very High", chips: ["1X2: 1", "Over 2.5", "BTTS"],
    analysis_bg: "Дерби с очаквани голове.", analysis_en: "Derby with goals expected." },
  { id: "m3", country: "ESP", league: "La Liga", date: "01.05", time: "21:00",
    home: "Реал Мадрид", away: "Барселона", home_en: "Real Madrid", away_en: "Barcelona",
    form_h: "WWWWW", form_a: "WDWWL", played_h: 32, played_a: 32,
    win_pct_h: 81, win_pct_a: 75, avg_goals_h: 2.7, avg_goals_a: 2.6,
    odds: { "1": 2.0, X: 3.6, "2": 3.4, over: 1.65, under: 2.25, btts_yes: 1.5, btts_no: 2.5 },
    prob: { "1": 45, X: 26, "2": 29, over: 68, under: 32, btts_yes: 72, btts_no: 28 },
    pred: "Over 2.5", confidence: "Very High", chips: ["Over 2.5", "BTTS"],
    analysis_bg: "Ел Класико — голов мач.", analysis_en: "El Clasico — goal-fest." },
  { id: "m4", country: "GER", league: "Bundesliga", date: "01.05", time: "16:30",
    home: "Байерн", away: "Дортмунд", home_en: "Bayern", away_en: "Dortmund",
    form_h: "WWWWD", form_a: "WLWWL", played_h: 30, played_a: 30,
    win_pct_h: 80, win_pct_a: 60, avg_goals_h: 3.1, avg_goals_a: 2.3,
    odds: { "1": 1.7, X: 4.1, "2": 4.5, over: 1.45, under: 2.7, btts_yes: 1.4, btts_no: 2.85 },
    prob: { "1": 58, X: 22, "2": 20, over: 78, under: 22, btts_yes: 80, btts_no: 20 },
    pred: "Over 2.5", confidence: "Very High", chips: ["1X2: 1", "Over 2.5", "BTTS"],
    analysis_bg: "Дер Класикер с висок темп.", analysis_en: "Der Klassiker with high tempo." },
  { id: "m5", country: "ITA", league: "Serie A", date: "01.05", time: "20:45",
    home: "Интер", away: "Милан", home_en: "Inter", away_en: "Milan",
    form_h: "WWDWW", form_a: "WLWDW", played_h: 32, played_a: 32,
    win_pct_h: 72, win_pct_a: 60, avg_goals_h: 2.4, avg_goals_a: 2.0,
    odds: { "1": 2.05, X: 3.4, "2": 3.5, over: 1.85, under: 1.95, btts_yes: 1.55, btts_no: 2.4 },
    prob: { "1": 44, X: 28, "2": 28, over: 58, under: 42, btts_yes: 68, btts_no: 32 },
    pred: "BTTS", confidence: "High", chips: ["BTTS", "Over 2.5"],
    analysis_bg: "Дербито на Италия.", analysis_en: "Italy's derby." },
];

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
  { id: 4, emoji: "📰", title_bg: "Промени в офсайд правилата", title_en: "Offside rule changes",
    summary_bg: "Нови VAR насоки.", summary_en: "New VAR guidelines.",
    source: "FIFA", time_bg: "преди 8 ч.", time_en: "8h ago" },
];

const TRANSFERS = [
  { id: 1, player: "Kylian Mbappé", from: "PSG", to: "Real Madrid", fee: "€180M", status: "confirmed" },
  { id: 2, player: "Erling Haaland", from: "Man City", to: "Real Madrid", fee: "€220M", status: "rumour" },
  { id: 3, player: "Pedri", from: "Barcelona", to: "Man City", fee: "€150M", status: "rumour" },
  { id: 4, player: "Bukayo Saka", from: "Arsenal", to: "Real Madrid", fee: "€140M", status: "close" },
  { id: 5, player: "Victor Osimhen", from: "Napoli", to: "Chelsea", fee: "€110M", status: "confirmed" },
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
  { id: 4, emoji: "✨", player: "Martin Ødegaard", team_bg: "Арсенал", team_en: "Arsenal",
    opp_bg: "Брайтън", opp_en: "Brighton", league_bg: "Премиър лига", league_en: "Premier League",
    desc_bg: "Финт + чип над вратаря.", desc_en: "Heel flick + dink.",
    youtubeId: "M6PpA6mCB6E", votes: 178 },
  { id: 5, emoji: "⭐", player: "Lamine Yamal", team_bg: "Барселона", team_en: "Barcelona",
    opp_bg: "Валенсия", opp_en: "Valencia", league_bg: "Ла Лига", league_en: "La Liga",
    desc_bg: "Соло пробег + чип.", desc_en: "Solo run + chip.",
    youtubeId: "0gEfcUJjqCY", votes: 502 },
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
  { pos: 9, team: "Sevilla", p: 32, w: 9, d: 6, l: 17, gd: "-15", pts: 33 },
  { pos: 10, team: "Alavés", p: 32, w: 7, d: 7, l: 18, gd: "-22", pts: 28 },
];

const DETAILED_STATS = {
  goals: [
    { metric_bg: "Голове отбелязани/мач", metric_en: "Goals scored/match", h: 2.4, a: 1.9 },
    { metric_bg: "Голове допуснати/мач", metric_en: "Goals conceded/match", h: 1.1, a: 1.6 },
    { metric_bg: "1-во полувреме", metric_en: "1st half goals", h: 1.2, a: 0.8 },
    { metric_bg: "2-ро полувреме", metric_en: "2nd half goals", h: 1.2, a: 1.1 },
  ],
  corners: [
    { metric_bg: "Ъглови за/мач", metric_en: "Corners for/match", h: 6.8, a: 4.5 },
    { metric_bg: "Ъглови против/мач", metric_en: "Corners against/match", h: 4.2, a: 6.1 },
    { metric_bg: "Тотал/мач", metric_en: "Total/match", h: 11.0, a: 10.6 },
  ],
  cards: [
    { metric_bg: "Жълти/мач", metric_en: "Yellows/match", h: 2.1, a: 2.6 },
    { metric_bg: "Червени/мач", metric_en: "Reds/match", h: 0.1, a: 0.2 },
    { metric_bg: "Фолове/мач", metric_en: "Fouls/match", h: 11.4, a: 13.2 },
  ],
  shots: [
    { metric_bg: "Удари/мач", metric_en: "Shots/match", h: 14.5, a: 11.8 },
    { metric_bg: "В рамки/мач", metric_en: "On target/match", h: 5.4, a: 4.0 },
    { metric_bg: "Притежание %", metric_en: "Possession %", h: 58, a: 48 },
  ],
};

const ODDS_HISTORY = {
  "1": [{ time: "10:00", value: 1.95 }, { time: "12:00", value: 1.92 }, { time: "14:00", value: 1.88 },
        { time: "16:00", value: 1.87 }, { time: "18:00", value: 1.86 }, { time: "20:00", value: 1.85 }],
  "X": [{ time: "10:00", value: 3.5 }, { time: "12:00", value: 3.55 }, { time: "14:00", value: 3.6 },
        { time: "16:00", value: 3.6 }, { time: "18:00", value: 3.55 }, { time: "20:00", value: 3.6 }],
  "2": [{ time: "10:00", value: 4.0 }, { time: "12:00", value: 4.1 }, { time: "14:00", value: 4.15 },
        { time: "16:00", value: 4.18 }, { time: "18:00", value: 4.2 }, { time: "20:00", value: 4.2 }],
  "Over 2.5": [{ time: "10:00", value: 1.85 }, { time: "12:00", value: 1.82 }, { time: "14:00", value: 1.8 },
               { time: "16:00", value: 1.79 }, { time: "18:00", value: 1.78 }, { time: "20:00", value: 1.78 }],
};

/* STORAGE / HELPERS ============================================================ */
const DEFAULT_STATE = {
  lang: "bg", banks: [], bets: [], importedMatches: [],
  settings: { bgAnimation: true, evNotifications: true, notifications: true }
};
const STORAGE_KEY = "betprobg:state";
const loadState = async () => {
  try {
    if (typeof window === "undefined" || !window.storage) return DEFAULT_STATE;
    const r = await window.storage.get(STORAGE_KEY);
    if (!r) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(r.value) };
  } catch { return DEFAULT_STATE; }
};
const saveState = async (s) => {
  try { if (window.storage) await window.storage.set(STORAGE_KEY, JSON.stringify(s)); } catch {}
};
const confidenceColor = (c) => {
  switch (c) {
    case "Very High": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    case "High": return "text-green-400 bg-green-400/10 border-green-400/30";
    case "Medium": return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    default: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  }
};
const formColor = (l) => l === "W" ? "bg-emerald-500" : l === "D" ? "bg-amber-500" : "bg-red-500";
const fmtMoney = (v, c) => c === "EUR" ? `€${v.toFixed(2)}` : `${v.toFixed(2)}u`;
const teamName = (m, side, lang) => {
  const enKey = side === "h" ? "home_en" : "away_en";
  const bgKey = side === "h" ? "home" : "away";
  return (lang === "en" && m[enKey]) ? m[enKey] : m[bgKey];
};
const calcTotalOdds = (legs) => legs.reduce((a, l) => a * parseFloat(l.odds || 1), 1);
const formatDate = (iso) => { try { return new Date(iso).toLocaleDateString(); } catch { return iso; } };

/* COMPONENTS ============================================================ */

const SoccerBackground = ({ enabled }) => {
  const balls = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i, left: Math.random() * 100,
      duration: 25 + Math.random() * 30, delay: Math.random() * -50,
      size: 16 + Math.random() * 24, opacity: 0.05 + Math.random() * 0.1,
    })), []);
  if (!enabled) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ background: "repeating-linear-gradient(90deg, transparent 0, transparent 80px, #10b981 80px, #10b981 160px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
           style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      {balls.map((b) => (
        <div key={b.id} className="absolute"
             style={{ left: `${b.left}%`, bottom: "-50px", fontSize: `${b.size}px`,
                      opacity: b.opacity, animation: `floatUp ${b.duration}s linear infinite`,
                      animationDelay: `${b.delay}s` }}>⚽</div>
      ))}
      <style>{`@keyframes floatUp { 0% { transform: translateY(0) rotate(0deg);} 100% { transform: translateY(-110vh) rotate(720deg);} }`}</style>
    </div>
  );
};

const LangSwitch = () => {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center bg-slate-800 rounded-md overflow-hidden text-[10px] font-bold border border-slate-700">
      <button onClick={() => setLang("bg")} className={`px-2 py-1 ${lang === "bg" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>BG</button>
      <button onClick={() => setLang("en")} className={`px-2 py-1 ${lang === "en" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>EN</button>
    </div>
  );
};

const Header = () => (
  <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/60">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-base">⚽</div>
        <div className="font-bold tracking-wider text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          <span className="text-white">BetPro</span><span className="text-emerald-400">BG</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-400">LIVE</span>
        </div>
        <LangSwitch />
      </div>
    </div>
  </header>
);

const BottomNav = ({ route, setRoute }) => {
  const tr = useT();
  const items = [
    { id: "home", icon: Home, label: tr("nav_home") },
    { id: "fixtures", icon: List, label: tr("nav_fixtures") },
    { id: "bets", icon: Wallet, label: tr("nav_bets") },
    { id: "evplus", icon: Zap, label: tr("nav_evplus"), special: true },
    { id: "profile", icon: User, label: tr("nav_profile") },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = route === it.id || (route === "match" && it.id === "fixtures");
          return (
            <button key={it.id} onClick={() => setRoute(it.id)}
                    className={`flex flex-col items-center gap-1 py-3 ${
                      active ? (it.special ? "text-amber-400" : "text-emerald-400") : "text-slate-500"
                    }`}>
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {it.special && !active && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
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
  const tr = useT();
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-4" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-center mb-4">{msg}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 bg-slate-800 rounded-lg text-sm">{tr("cancel")}</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">{tr("delete")}</button>
        </div>
      </div>
    </div>
  );
};

const GoalVideoModal = ({ goal, onClose }) => {
  const { lang } = useLang();
  const tr = useT();
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
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="aspect-video bg-black">
          {goal.youtubeId ? (
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${goal.youtubeId}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">{tr("goal_not_available")}</div>}
        </div>
        <div className="p-3 text-xs text-slate-300 italic">{goal[`desc_${lang}`]}</div>
      </div>
    </div>
  );
};

const ImportModal = ({ onClose, onImport }) => {
  const tr = useT();
  const [method, setMethod] = useState("paste");
  const [pasteValue, setPasteValue] = useState("");
  const [urlValue, setUrlValue] = useState("https://modelmarket.netlify.app/.netlify/functions/matches");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const normalize = (raw) => Array.isArray(raw) ? raw.map((m, i) => ({
    id: m.id || `imp_${Date.now()}_${i}`,
    country: m.country || "OTH", league: m.league || "Imported",
    date: m.date || new Date().toLocaleDateString("bg-BG"), time: m.time || "—",
    home: m.home || m.homeTeam || "Home", away: m.away || m.awayTeam || "Away",
    home_en: m.home_en || m.home, away_en: m.away_en || m.away,
    form_h: m.form_h || "-----", form_a: m.form_a || "-----",
    played_h: m.played_h ?? 0, played_a: m.played_a ?? 0,
    win_pct_h: m.win_pct_h ?? 0, win_pct_a: m.win_pct_a ?? 0,
    avg_goals_h: m.avg_goals_h ?? 0, avg_goals_a: m.avg_goals_a ?? 0,
    odds: m.odds || { "1": 2, X: 3, "2": 3, over: 2, under: 2, btts_yes: 2, btts_no: 2 },
    prob: m.prob || { "1": 33, X: 33, "2": 34, over: 50, under: 50, btts_yes: 50, btts_no: 50 },
    pred: m.pred || "1", confidence: m.confidence || "Medium", chips: m.chips || [],
    analysis_bg: m.analysis_bg || m.analysis || "", analysis_en: m.analysis_en || m.analysis || "",
    _imported: true,
  })) : null;

  const handlePaste = () => {
    setMsg(null);
    try {
      const parsed = JSON.parse(pasteValue.trim());
      const data = Array.isArray(parsed) ? parsed : (parsed.matches || parsed.fixtures || parsed.data);
      const norm = normalize(data);
      if (!norm) throw new Error();
      onImport(norm);
      setMsg({ ok: true, text: `${tr("import_success")}: ${norm.length}` });
      setTimeout(onClose, 800);
    } catch { setMsg({ ok: false, text: tr("import_error") }); }
  };

  const handleFetch = async () => {
    setLoading(true); setMsg(null);
    try {
      const r = await fetch(urlValue.trim());
      if (!r.ok) throw new Error();
      const data = await r.json();
      const arr = Array.isArray(data) ? data : (data.matches || data.fixtures || data.data);
      const norm = normalize(arr);
      if (!norm) throw new Error();
      onImport(norm);
      setMsg({ ok: true, text: `${tr("import_success")}: ${norm.length}` });
      setTimeout(onClose, 800);
    } catch { setMsg({ ok: false, text: tr("import_error") }); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-2" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Download size={18} className="text-emerald-400" />
            <h3 className="font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("import_title")}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-1.5 bg-slate-800 p-1 rounded-lg">
            <button onClick={() => setMethod("paste")}
                    className={`py-1.5 rounded text-xs font-semibold ${method === "paste" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>{tr("import_paste")}</button>
            <button onClick={() => setMethod("url")}
                    className={`py-1.5 rounded text-xs font-semibold ${method === "url" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>{tr("import_url")}</button>
          </div>
          {method === "paste" ? (
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{tr("import_paste_label")}</label>
              <textarea value={pasteValue} onChange={(e) => setPasteValue(e.target.value)} rows={8}
                        placeholder='[{"id":"...","home":"...","away":"...","odds":{...}}]'
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none resize-none" />
              <button onClick={handlePaste} disabled={!pasteValue.trim()}
                      className="w-full mt-2 bg-emerald-500 text-slate-950 rounded-lg py-2 text-sm font-bold disabled:opacity-50">
                {tr("import_btn")}
              </button>
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{tr("import_url_label")}</label>
              <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)}
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none" />
              <p className="text-[10px] text-slate-500 mt-1.5">{tr("import_cors_note")}</p>
              <button onClick={handleFetch} disabled={loading || !urlValue.trim()}
                      className="w-full mt-2 bg-emerald-500 text-slate-950 rounded-lg py-2 text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                {loading ? tr("import_fetching") : tr("import_btn")}
              </button>
            </div>
          )}
          {msg && <div className={`text-xs rounded-lg px-3 py-2 ${msg.ok ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>{msg.text}</div>}
        </div>
      </div>
    </div>
  );
};

/* HOME ============================================================ */

const HomePage = ({ setRoute }) => {
  const tr = useT();
  const { lang } = useLang();
  const [showAllNews, setShowAllNews] = useState(false);
  const [transferFilter, setTransferFilter] = useState("all");
  const [vote, setVote] = useState(null);
  const [videoGoal, setVideoGoal] = useState(null);

  const visibleNews = showAllNews ? NEWS : NEWS.slice(0, 3);
  const filteredTransfers = transferFilter === "all" ? TRANSFERS : TRANSFERS.filter((t) => t.status === transferFilter);
  const totalVotes = GOALS_OF_WEEK.reduce((s, g) => s + g.votes, 0) + (vote ? 1 : 0);
  const leaderId = GOALS_OF_WEEK.reduce((max, g) => g.votes > max.votes ? g : max, GOALS_OF_WEEK[0]).id;

  return (
    <div className="px-4 pt-4 pb-24 space-y-6 relative z-10">
      <button onClick={() => setRoute("fixtures")}
              className="w-full flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
        <div className="text-left">
          <div className="text-emerald-400 font-semibold text-sm">⚽ {tr("predictions_today")}</div>
          <div className="text-xs text-slate-400 mt-0.5">{tr("see_all_matches")}</div>
        </div>
        <ArrowRight size={18} className="text-emerald-400" />
      </button>

      <button onClick={() => setRoute("evplus")}
              className="w-full relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-orange-500/10 px-4 py-4">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-amber-400" fill="currentColor" />
              <span className="text-amber-400 font-bold text-sm">{tr("ev_plus_predictions")}</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">{tr("new")}</span>
            </div>
            <div className="text-xs text-slate-300">{tr("ev_plus_subtitle")}</div>
          </div>
          <ArrowRight size={18} className="text-amber-400" />
        </div>
      </button>

      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Newspaper size={18} className="text-emerald-400" />
            <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("latest_news")}</h2>
          </div>
          <button onClick={() => setShowAllNews(!showAllNews)} className="flex items-center gap-1 text-emerald-400 text-xs">
            {showAllNews ? tr("show_less") : tr("show_all")}<ArrowRight size={12} />
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
          <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("transfers")}</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {[{ k: "all", l: tr("filter_all") }, { k: "confirmed", l: tr("status_confirmed") },
            { k: "close", l: tr("status_close") }, { k: "rumour", l: tr("status_rumour") }].map((p) => (
            <button key={p.k} onClick={() => setTransferFilter(p.k)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
                      transferFilter === p.k ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>{p.l}</button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredTransfers.map((tt2) => {
            const map = {
              confirmed: { c: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", l: tr("status_confirmed"), I: CheckCircle },
              close: { c: "text-amber-400 bg-amber-400/10 border-amber-400/30", l: tr("status_close"), I: AlertCircle },
              rumour: { c: "text-slate-400 bg-slate-800 border-slate-700", l: tr("status_rumour"), I: Clock },
            };
            const s = map[tt2.status]; const SI = s.I;
            return (
              <div key={tt2.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold">{tt2.player}</h4>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${s.c}`}>
                    <SI size={10} /><span>{s.l}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-1.5">
                  <span>{tt2.from}</span><ArrowRight size={12} className="text-emerald-400" />
                  <span className="font-semibold">{tt2.to}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">{tt2.fee}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Star size={18} className="text-amber-400" fill="currentColor" />
            <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("goal_of_week")}</h2>
          </div>
          <span className="text-xs text-slate-400">{totalVotes} {tr("votes")}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-3">{tr("vote_for_best")}</p>
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
                    <div className="text-2xl">{g.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold truncate">{g.player}</h4>
                        {isLeader && showResults && !isVoted && <span className="text-amber-400 text-[10px] font-semibold">👑 {tr("leader")}</span>}
                        {isVoted && <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-400">{g[`team_${lang}`]} vs {g[`opp_${lang}`]} · {g[`league_${lang}`]}</div>
                      <div className="text-[11px] text-slate-300 italic mt-1 line-clamp-2">{g[`desc_${lang}`]}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => setVideoGoal(g)}
                                className="flex items-center gap-1 text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-semibold">
                          <Play size={10} fill="currentColor" />{tr("watch_video")}
                        </button>
                        {!showResults && (
                          <button onClick={() => setVote(g.id)}
                                  className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                            ✓ {tr("click_to_vote")}
                          </button>
                        )}
                      </div>
                      {showResults && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{adjVotes} {tr("votes")}</span><span className="font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isVoted ? "bg-emerald-500" : isLeader ? "bg-amber-400" : "bg-slate-600"}`}
                                 style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {vote && <p className="text-center text-emerald-400 text-xs font-medium mt-3">✓ {tr("vote_recorded")}</p>}
        </div>
      </section>

      {videoGoal && <GoalVideoModal goal={videoGoal} onClose={() => setVideoGoal(null)} />}
    </div>
  );
};

/* FIXTURES ============================================================ */

const MatchCard = ({ m, onClick }) => {
  const tr = useT();
  const { lang } = useLang();
  return (
    <button onClick={onClick} className="w-full text-left p-3 hover:bg-slate-800/40 border-b border-slate-800/40">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Clock size={10} /><span className="font-medium">{m.time}</span><span>·</span><span>{m.league}</span>
          {m._imported && <span className="ml-1 text-emerald-400 text-[9px] font-bold">⬇</span>}
        </div>
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold ${confidenceColor(m.confidence)}`}>
          <TrendingUp size={9} /><span>{m.confidence}</span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3">
        <div className="font-semibold text-sm">{teamName(m, "h", lang)}</div>
        <div className="text-slate-500 text-xs font-bold">vs</div>
        <div className="font-semibold text-sm text-right">{teamName(m, "a", lang)}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
        <div className="bg-slate-800/40 rounded p-1.5 text-center"><div className="text-slate-500">{tr("played")}</div><div className="font-medium">{m.played_h} / {m.played_a}</div></div>
        <div className="bg-slate-800/40 rounded p-1.5 text-center"><div className="text-slate-500">{tr("win_pct")}</div><div className="font-medium">{m.win_pct_h}% / {m.win_pct_a}%</div></div>
        <div className="bg-slate-800/40 rounded p-1.5 text-center"><div className="text-slate-500">{tr("avg_goals")}</div><div className="font-medium">{m.avg_goals_h} / {m.avg_goals_a}</div></div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {["1", "X", "2"].map((k) => {
          const isPred = m.pred === k;
          return (
            <div key={k} className={`rounded-lg py-1.5 px-2 text-center border ${
              isPred ? "bg-emerald-500/15 border-emerald-500" : "bg-gradient-to-br from-emerald-900/40 to-slate-800/60 border-emerald-700/30"
            }`}>
              <div className="text-[10px] text-slate-400">{k}</div>
              <div className={`text-sm font-bold ${isPred ? "text-emerald-400" : "text-white"}`}>{m.odds[k]}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {(m.chips || []).map((c) => (
            <span key={c} className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">{c}</span>
          ))}
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold">{tr("details")} →</span>
      </div>
    </button>
  );
};

const FixturesPage = ({ openMatch, allMatches, importedCount, onImport }) => {
  const tr = useT();
  const { lang } = useLang();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [showImport, setShowImport] = useState(false);

  const filtered = useMemo(() => {
    let m = allMatches;
    if (tab === "top") m = m.filter((x) => x.confidence === "Very High" || x.confidence === "High");
    if (tab === "value") m = m.filter((x) => (x.chips || []).length >= 2);
    if (tab === "trends") m = m.filter((x) => x.confidence === "Very High");
    if (q.trim()) {
      const s = q.toLowerCase();
      m = m.filter((x) =>
        (x.home || "").toLowerCase().includes(s) || (x.away || "").toLowerCase().includes(s) ||
        (x.home_en || "").toLowerCase().includes(s) || (x.away_en || "").toLowerCase().includes(s) ||
        (COUNTRIES.find((c) => c.code === x.country)?.[`name_${lang}`] || "").toLowerCase().includes(s)
      );
    }
    return m;
  }, [allMatches, tab, q, lang]);

  const byCountry = COUNTRIES.map((c) => ({
    country: c, matches: filtered.filter((m) => (m.country || "OTH") === c.code),
  })).filter((x) => x.matches.length > 0);

  return (
    <div className="pb-24 relative z-10">
      <div className="bg-slate-900/50 border-b border-slate-800 px-2">
        <div className="flex">
          {[{ k: "all", l: tr("filter_all"), I: Globe }, { k: "top", l: tr("filter_top"), I: Star },
            { k: "value", l: tr("filter_value"), I: Zap }, { k: "trends", l: tr("filter_trends"), I: TrendingUp }].map((t2) => {
            const I = t2.I; const active = tab === t2.k;
            return (
              <button key={t2.k} onClick={() => setTab(t2.k)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium ${
                        active ? "bg-emerald-500 text-slate-950" : "text-slate-400"
                      }`}>
                <I size={13} /><span>{t2.l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-3 flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("search_placeholder")}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
        </div>
        <button onClick={() => setShowImport(true)}
                className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 rounded-lg px-3 flex items-center gap-1.5 text-xs font-bold">
          <Download size={14} />{tr("import_matches")}
        </button>
      </div>

      <div className="bg-slate-900/30 border-y border-slate-800/40 px-4 py-2 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
        <span>🌍 {byCountry.length} {tr("countries")}</span><span>·</span>
        <span>⚽ {filtered.length} {tr("matches")}</span>
        {importedCount > 0 && <><span>·</span><span className="text-emerald-300">⬇ {importedCount} {tr("imported_label")}</span></>}
      </div>

      {byCountry.length === 0 && <div className="text-center text-slate-500 py-12 text-sm">{tr("no_matches_filter")}</div>}
      {byCountry.map((cb, i) => <CountryRow key={cb.country.code} country={cb.country} matches={cb.matches} openMatch={openMatch} openByDefault={i === 0} />)}

      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={onImport} />}
    </div>
  );
};

const CountryRow = ({ country, matches, openMatch, openByDefault }) => {
  const { lang } = useLang();
  const [open, setOpen] = useState(openByDefault);
  return (
    <div className="border-b border-slate-800/60">
      <button onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between py-3 px-4 border-l-[3px] border-l-emerald-500 bg-gradient-to-r from-slate-900 to-slate-900/40">
        <div className="flex items-center gap-3">
          <span className="text-xl">{country.flag}</span>
          <span className="font-semibold text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{country[`name_${lang}`]}</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{matches.length}</span>
        </div>
        {open ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      {open && <div>{matches.map((m) => <MatchCard key={m.id} m={m} onClick={() => openMatch(m)} />)}</div>}
    </div>
  );
};

/* EV+ ============================================================ */

const EVPlusPage = () => {
  const tr = useT();
  return (
    <div className="pb-24 relative z-10">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-b border-amber-500/30 px-4 pt-5 pb-4">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center"><Zap size={18} className="text-white" fill="currentColor" /></div>
            <div>
              <h1 className="font-bold text-xl" style={{ fontFamily: "'Rajdhani', sans-serif" }}><span className="text-white">EV</span><span className="text-amber-400">+</span></h1>
              <p className="text-[10px] text-slate-400">{tr("ev_powered_by")}</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{tr("ev_explainer")}</p>
        </div>
      </div>
      <div className="px-4 py-12">
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 text-center max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4">
            <Zap size={32} className="text-amber-400 animate-pulse" fill="currentColor" />
          </div>
          <h2 className="font-bold text-lg mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("ev_coming_soon")}</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">{tr("ev_api_message")}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <RefreshCw size={10} className="text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-[10px] text-amber-400 font-medium">{tr("ev_api_progress")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* MATCH PAGE ============================================================ */

const ProbBar = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
    <span className="w-20 text-[10px] text-slate-400 text-right">{label}</span>
    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
    <span className="w-10 text-[10px] font-bold text-right">{value}%</span>
  </div>
);

const StatSection = ({ emoji, title, color, rows, defaultOpen, lang }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2"><span className="text-lg">{emoji}</span>
          <span className={`font-bold text-sm tracking-wider ${color}`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>{title}</span>
          <span className="text-[10px] text-slate-500">({rows.length})</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && <div className="px-3 pb-2">{rows.map((r, i) => {
        const hWins = r.h > r.a;
        return (
          <div key={i} className="grid grid-cols-3 items-center gap-2 py-2 border-b border-slate-800/30 last:border-0">
            <div className={`text-center text-sm font-semibold rounded-md py-1.5 ${hWins ? "bg-emerald-500/15 text-emerald-400" : "text-slate-300"}`}>{r.h}</div>
            <div className="text-center text-[10px] text-slate-400">{r[`metric_${lang}`]}</div>
            <div className={`text-center text-sm font-semibold rounded-md py-1.5 ${!hWins ? "bg-blue-500/15 text-blue-400" : "text-slate-300"}`}>{r.a}</div>
          </div>
        );
      })}</div>}
    </div>
  );
};

const OddsMovement = () => {
  const tr = useT();
  const markets = [
    { k: "1", line: "#60a5fa" }, { k: "X", line: "#fbbf24" },
    { k: "2", line: "#f87171" }, { k: "Over 2.5", line: "#34d399" },
  ];
  const [active, setActive] = useState("1");
  const data = ODDS_HISTORY[active] || ODDS_HISTORY["1"];
  const meta = markets.find((m) => m.k === active);
  const opening = data[0].value;
  const current = data[data.length - 1].value;
  const change = current - opening;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {markets.map((m) => (
          <button key={m.k} onClick={() => setActive(m.k)}
                  className={`text-[10px] px-2 py-1 rounded-md border font-semibold ${
                    active === m.k ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}>{m.k}</button>
        ))}
      </div>
      <div className="flex items-end justify-between mb-3">
        <div><div className="text-[10px] text-slate-500">{tr("market")}: {active}</div><div className="text-3xl font-bold font-mono">{current}</div></div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500">{tr("change_from_open")}</div>
          <div className={`text-sm font-semibold ${change < 0 ? "text-emerald-400" : change > 0 ? "text-red-400" : "text-slate-400"}`}>
            {change > 0 ? "+" : ""}{change.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[min - 0.1, max + 0.1]} />
            <ReferenceLine y={opening} stroke="#475569" strokeDasharray="3 3" />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="value" stroke={meta.line} strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-slate-800/40 rounded-lg py-2 text-center"><div className="text-[9px] text-slate-500">{tr("min")}</div><div className="text-sm font-bold text-emerald-400">{min}</div></div>
        <div className="bg-slate-800/40 rounded-lg py-2 text-center"><div className="text-[9px] text-slate-500">{tr("max")}</div><div className="text-sm font-bold text-red-400">{max}</div></div>
        <div className="bg-slate-800/40 rounded-lg py-2 text-center"><div className="text-[9px] text-slate-500">{tr("range")}</div><div className="text-sm font-bold">{(max - min).toFixed(2)}</div></div>
      </div>
    </div>
  );
};

const AnalysisModal = ({ m, onClose }) => {
  const tr = useT();
  const { lang } = useLang();
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-2" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Brain size={18} className="text-emerald-400" />
            <h3 className="font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("deep_analysis")}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-center">
            <div className="text-sm font-semibold">{teamName(m, "h", lang)} vs {teamName(m, "a", lang)}</div>
            <div className="text-[10px] text-slate-500">{m.league} · {m.date} {m.time}</div>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${confidenceColor(m.confidence)}`}>{m.confidence}</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2"><Brain size={13} className="text-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase">{tr("ai_analysis")}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{m[`analysis_${lang}`] || m.analysis_bg}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
            <div className="text-[10px] font-semibold text-emerald-400 mb-1">⚡ {tr("recommendation")}</div>
            <div className="text-sm font-bold">{tr("forecast")}: {(m.chips || []).join(" · ") || m.pred}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimulationModal = ({ m, onClose }) => {
  const tr = useT();
  const { lang } = useLang();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (progress >= 100) { setDone(true); return; }
    const t = setTimeout(() => setProgress((p) => Math.min(p + 4, 100)), 60);
    return () => clearTimeout(t);
  }, [progress]);
  const results = useMemo(() => ({
    homeWin: m.prob["1"], draw: m.prob["X"], awayWin: m.prob["2"],
    avgGoals: ((m.avg_goals_h + m.avg_goals_a) * 0.95).toFixed(2),
    topScores: [
      { score: "2:1", pct: 12.3 }, { score: "1:1", pct: 11.4 }, { score: "2:0", pct: 9.8 },
      { score: "1:0", pct: 8.6 }, { score: "2:2", pct: 7.2 }, { score: "3:1", pct: 6.1 },
      { score: "0:0", pct: 5.4 }, { score: "3:2", pct: 4.8 },
    ],
  }), [m]);
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-2" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Dices size={18} className="text-purple-400" />
            <h3 className="font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>100 000</h3>
          </div>
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-4">
          <div className="text-xs text-slate-400 text-center mb-4">{teamName(m, "h", lang)} vs {teamName(m, "a", lang)}</div>
          {!done ? (
            <div className="space-y-3">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-slate-400 text-center">{Math.floor((progress / 100) * 100000).toLocaleString()} / 100 000</div>
              <div className="text-purple-400 text-sm font-medium text-center animate-pulse">🎲 {tr("rolling_matches")}</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2"><Trophy size={13} className="text-amber-400" /><span className="text-xs font-semibold">{tr("outcomes")}</span></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-800/50 rounded-xl p-2 text-center"><div className="text-[9px] text-slate-500 truncate">{teamName(m, "h", lang)}</div><div className="text-lg font-bold text-blue-400">{results.homeWin}%</div></div>
                  <div className="bg-slate-800/50 rounded-xl p-2 text-center"><div className="text-[9px] text-slate-500">{tr("draw")}</div><div className="text-lg font-bold text-amber-400">{results.draw}%</div></div>
                  <div className="bg-slate-800/50 rounded-xl p-2 text-center"><div className="text-[9px] text-slate-500 truncate">{teamName(m, "a", lang)}</div><div className="text-lg font-bold text-red-400">{results.awayWin}%</div></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2"><Target size={13} className="text-emerald-400" /><span className="text-xs font-semibold">{tr("top_scores")}</span></div>
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
                <div className="text-[10px] text-slate-500">{tr("avg_goals_match")}</div>
                <div className="text-2xl font-bold text-emerald-400">{results.avgGoals}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MatchPage = ({ match, onBack, onAddToBet }) => {
  const tr = useT();
  const { lang } = useLang();
  const [tab, setTab] = useState("overview");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSim, setShowSim] = useState(false);

  return (
    <div className="pb-24 relative z-10">
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={onBack} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><ArrowLeft size={16} /></button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{teamName(match, "h", lang)} vs {teamName(match, "a", lang)}</div>
            <div className="text-[10px] text-slate-500">{match.league} · {match.date} {match.time}</div>
          </div>
          <div className={`px-2 py-1 rounded text-[10px] font-bold border ${confidenceColor(match.confidence)}`}>{match.confidence}</div>
        </div>
        <div className="flex border-t border-slate-800/40">
          {[{ k: "overview", l: tr("tab_overview"), I: BarChart3 }, { k: "stats", l: tr("tab_stats"), I: Activity }, { k: "odds", l: tr("tab_odds"), I: LineChartIcon }].map((t2) => {
            const I = t2.I; const active = tab === t2.k;
            return (
              <button key={t2.k} onClick={() => setTab(t2.k)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium border-b-2 ${
                        active ? "text-emerald-400 border-emerald-500" : "text-slate-400 border-transparent"
                      }`}>
                <I size={12} /><span>{t2.l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mx-4 mt-4">
        <div className="text-[10px] text-center text-slate-500 mb-3">{match.league}</div>
        <div className="grid grid-cols-3 items-center gap-2">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-3xl mb-1.5">⚽</div>
            <div className="font-bold text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{teamName(match, "h", lang)}</div>
            <div className="flex justify-center gap-0.5 mt-1">{match.form_h.split("").map((l, i) => <div key={i} className={`w-2 h-2 rounded-full ${formColor(l)}`} />)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-500" style={{ fontFamily: "'Rajdhani', sans-serif" }}>VS</div>
            <div className="text-emerald-400 font-bold">{match.time}</div>
            <div className="text-[10px] text-slate-500">{match.date}</div>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-3xl mb-1.5">⚽</div>
            <div className="font-bold text-xs" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{teamName(match, "a", lang)}</div>
            <div className="flex justify-center gap-0.5 mt-1">{match.form_a.split("").map((l, i) => <div key={i} className={`w-2 h-2 rounded-full ${formColor(l)}`} />)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mx-4 mt-3">
        <button onClick={() => setShowAnalysis(true)} className="flex flex-col items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl py-2 text-[10px] font-semibold">
          <Brain size={14} /><span>{tr("deep_analysis")}</span>
        </button>
        <button onClick={() => setShowSim(true)} className="flex flex-col items-center gap-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl py-2 text-[10px] font-semibold">
          <Dices size={14} /><span>{tr("simulation_100k")}</span>
        </button>
        <button onClick={() => onAddToBet(match)} className="flex flex-col items-center gap-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl py-2 text-[10px] font-semibold">
          <Plus size={14} /><span>{tr("add_to_bet")}</span>
        </button>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {tab === "overview" && (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-3"><BarChart3 size={14} className="text-emerald-400" /><h3 className="font-semibold text-sm">{tr("odds")}</h3></div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[{ k: "1", lbl: "1", team: teamName(match, "h", lang) }, { k: "X", lbl: "X", team: tr("draw") }, { k: "2", lbl: "2", team: teamName(match, "a", lang) }].map((b) => {
                  const isPred = match.pred === b.k;
                  return (
                    <div key={b.k} className={`rounded-xl p-2 text-center border ${isPred ? "bg-emerald-500/15 border-emerald-500" : "bg-slate-800/60 border-slate-700"}`}>
                      <div className="text-[10px] text-slate-400">{b.lbl}</div>
                      <div className="text-[9px] text-slate-500 truncate">{b.team}</div>
                      <div className="text-lg font-bold mt-0.5">{match.odds[b.k]}</div>
                      <div className="text-[10px] text-emerald-400">{match.prob[b.k]}%</div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="rounded-xl p-2 text-center border bg-slate-800/60 border-slate-700"><div className="text-[10px] text-slate-400">Over 2.5</div><div className="text-lg font-bold">{match.odds.over}</div></div>
                <div className="rounded-xl p-2 text-center border bg-slate-800/60 border-slate-700"><div className="text-[10px] text-slate-400">Under 2.5</div><div className="text-lg font-bold">{match.odds.under}</div></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-3"><TrendingUp size={14} className="text-emerald-400" /><h3 className="font-semibold text-sm">{tr("probabilities")}</h3></div>
              <div className="space-y-1.5">
                <ProbBar label={tr("win_1")} value={match.prob["1"]} color="bg-blue-500" />
                <ProbBar label={tr("draw")} value={match.prob["X"]} color="bg-amber-500" />
                <ProbBar label={tr("win_2")} value={match.prob["2"]} color="bg-red-500" />
                <div className="border-t border-slate-800/40 my-2" />
                <ProbBar label="Over 2.5" value={match.prob.over} color="bg-emerald-500" />
                <ProbBar label="BTTS" value={match.prob.btts_yes} color="bg-purple-500" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-3"><History size={14} className="text-emerald-400" /><h3 className="font-semibold text-sm">{tr("h2h_title")}</h3></div>
              <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                <div><div className="text-2xl font-bold text-blue-400">5</div><div className="text-[9px] text-slate-500">{teamName(match, "h", lang)}</div></div>
                <div><div className="text-2xl font-bold text-amber-400">3</div><div className="text-[9px] text-slate-500">{tr("draw")}</div></div>
                <div><div className="text-2xl font-bold text-red-400">2</div><div className="text-[9px] text-slate-500">{teamName(match, "a", lang)}</div></div>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500" style={{ width: "50%" }} /><div className="bg-amber-500" style={{ width: "30%" }} /><div className="bg-red-500" style={{ width: "20%" }} />
              </div>
              <div className="text-[10px] text-center text-slate-500 mt-2">{tr("h2h_total")} 10 {tr("h2h_meetings")}</div>
            </div>
          </>
        )}
        {tab === "stats" && (
          <>
            <div className="grid grid-cols-3 gap-2 px-1">
              <div className="text-emerald-400 text-xs font-semibold text-center truncate">{teamName(match, "h", lang)}</div>
              <div className="text-slate-500 text-[10px] text-center">{tr("tab_stats")}</div>
              <div className="text-blue-400 text-xs font-semibold text-center truncate">{teamName(match, "a", lang)}</div>
            </div>
            <StatSection emoji="⚽" title={tr("goals")} color="text-emerald-400" rows={DETAILED_STATS.goals} defaultOpen lang={lang} />
            <StatSection emoji="🚩" title={tr("corners")} color="text-blue-400" rows={DETAILED_STATS.corners} lang={lang} />
            <StatSection emoji="🟨" title={tr("cards")} color="text-amber-400" rows={DETAILED_STATS.cards} lang={lang} />
            <StatSection emoji="📊" title={tr("shots")} color="text-purple-400" rows={DETAILED_STATS.shots} lang={lang} />
          </>
        )}
        {tab === "odds" && (
          <>
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-3 py-2 text-[11px] text-slate-400">{tr("click_odds_history")}</div>
            <OddsMovement />
          </>
        )}
      </div>

      {showAnalysis && <AnalysisModal m={match} onClose={() => setShowAnalysis(false)} />}
      {showSim && <SimulationModal m={match} onClose={() => setShowSim(false)} />}
    </div>
  );
};

/* BETS ============================================================ */

const CreateBankModal = ({ onClose, onCreate }) => {
  const tr = useT();
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [initialBalance, setInitialBalance] = useState("100");
  const handleCreate = () => {
    if (!name.trim()) return;
    const bal = parseFloat(initialBalance) || 0;
    onCreate({ id: `bank_${Date.now()}`, name: name.trim(), currency, initialBalance: bal, balance: bal, createdAt: new Date().toISOString() });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-2" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><Wallet size={18} className="text-emerald-400" /><h3 className="font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("create_bank")}</h3></div>
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{tr("bank_name")}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tr("bank_name_ph")}
                   className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{tr("currency")}</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCurrency("EUR")} className={`py-2 rounded-lg text-sm font-bold border ${currency === "EUR" ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 border-slate-700 text-slate-400"}`}>€ {tr("euro")}</button>
              <button onClick={() => setCurrency("UNITS")} className={`py-2 rounded-lg text-sm font-bold border ${currency === "UNITS" ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 border-slate-700 text-slate-400"}`}>u {tr("units")}</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{tr("initial_balance")}</label>
            <input type="number" step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)}
                   className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 bg-slate-800 rounded-lg text-sm">{tr("cancel")}</button>
            <button onClick={handleCreate} disabled={!name.trim()} className="flex-1 py-2 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold disabled:opacity-50">{tr("save")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceBetModal = ({ onClose, onSubmit, banks, allMatches, prefilledMatch, editingBet }) => {
  const tr = useT();
  const { lang } = useLang();
  const initLegs = editingBet ? editingBet.legs.map((l) => ({ ...l }))
    : prefilledMatch ? [{ matchId: prefilledMatch.id, home: teamName(prefilledMatch, "h", lang), away: teamName(prefilledMatch, "a", lang),
                          league: prefilledMatch.league, market: "1", odds: prefilledMatch.odds["1"] }] : [];
  const [legs, setLegs] = useState(initLegs);
  const [bankId, setBankId] = useState(editingBet?.bankId || banks[0]?.id || "");
  const [stake, setStake] = useState(editingBet ? String(editingBet.stake) : "10");
  const [showPicker, setShowPicker] = useState(legs.length === 0);
  const totalOdds = useMemo(() => calcTotalOdds(legs), [legs]);
  const stakeNum = parseFloat(stake) || 0;
  const bank = banks.find((b) => b.id === bankId);
  const potentialProfit = stakeNum * totalOdds - stakeNum;

  const addLeg = (m, market) => {
    const oddsKey = market === "Over 2.5" ? "over" : market === "Under 2.5" ? "under" : market === "BTTS Yes" ? "btts_yes" : market === "BTTS No" ? "btts_no" : market;
    setLegs([...legs, { matchId: m.id, home: teamName(m, "h", lang), away: teamName(m, "a", lang),
                        league: m.league, market, odds: parseFloat(m.odds[oddsKey] || 2) }]);
    setShowPicker(false);
  };
  const updateLeg = (i, patch) => { const next = [...legs]; next[i] = { ...next[i], ...patch }; setLegs(next); };
  const removeLeg = (i) => setLegs(legs.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (legs.length === 0 || !bankId || stakeNum <= 0) return;
    onSubmit({
      id: editingBet?.id || `bet_${Date.now()}`,
      bankId, type: legs.length === 1 ? "single" : "accumulator",
      legs, totalOdds, stake: stakeNum,
      status: editingBet?.status || "pending",
      createdAt: editingBet?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-2" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2"><ListChecks size={18} className="text-emerald-400" />
            <h3 className="font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{editingBet ? tr("edit_bet") : tr("place_bet")}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{tr("select_bank")}</label>
            <select value={bankId} onChange={(e) => setBankId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
              {banks.map((b) => <option key={b.id} value={b.id}>{b.name} — {fmtMoney(b.balance, b.currency)}</option>)}
            </select>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{tr("bet_type")}</span>
            <span className={`text-xs font-bold ${legs.length > 1 ? "text-amber-400" : "text-emerald-400"}`}>
              {legs.length > 1 ? `${tr("bet_accumulator")} (${legs.length})` : tr("bet_single")}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400">{tr("legs")}</label>
              <button onClick={() => setShowPicker(true)} className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <PlusCircle size={12} />{tr("add_match")}
              </button>
            </div>
            {legs.length === 0 && <div className="text-center py-6 bg-slate-800/30 rounded-lg text-xs text-slate-500">{tr("no_matches_imported")}</div>}
            <div className="space-y-2">
              {legs.map((leg, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{leg.home} vs {leg.away}</div>
                      <div className="text-[10px] text-slate-500">{leg.league}</div>
                    </div>
                    <button onClick={() => removeLeg(i)} className="text-red-400 p-1"><Trash2 size={12} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-500">{tr("pick_market")}</label>
                      <input value={leg.market} onChange={(e) => updateLeg(i, { market: e.target.value })}
                             className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500">{tr("odds")}</label>
                      <input type="number" step="0.01" value={leg.odds}
                             onChange={(e) => updateLeg(i, { odds: parseFloat(e.target.value) || 0 })}
                             className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{tr("stake")} {bank && <span className="text-slate-500">({bank.currency === "EUR" ? "€" : "u"})</span>}</label>
            <input type="number" step="0.01" value={stake} onChange={(e) => setStake(e.target.value)}
                   className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 grid grid-cols-3 gap-2 text-center">
            <div><div className="text-[9px] text-slate-400">{tr("total_odds")}</div><div className="font-bold text-emerald-400">{totalOdds.toFixed(2)}</div></div>
            <div><div className="text-[9px] text-slate-400">{tr("potential_win")}</div><div className="font-bold">{bank ? fmtMoney(stakeNum * totalOdds, bank.currency) : (stakeNum * totalOdds).toFixed(2)}</div></div>
            <div><div className="text-[9px] text-slate-400">{tr("potential_profit")}</div><div className="font-bold text-emerald-400">+{bank ? fmtMoney(potentialProfit, bank.currency) : potentialProfit.toFixed(2)}</div></div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 bg-slate-800 rounded-lg text-sm">{tr("cancel")}</button>
            <button onClick={handleSubmit} disabled={legs.length === 0 || stakeNum <= 0 || !bankId}
                    className="flex-1 py-2 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold disabled:opacity-50">{tr("save")}</button>
          </div>
        </div>
        {showPicker && (
          <div className="fixed inset-0 z-[60] bg-black/85 flex items-end sm:items-center justify-center p-2" onClick={() => setShowPicker(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-3 border-b border-slate-800">
                <h3 className="font-bold text-sm">{tr("pick_match")}</h3>
                <button onClick={() => setShowPicker(false)} className="text-slate-400"><X size={16} /></button>
              </div>
              <div className="p-2 space-y-1">
                {allMatches.length === 0 && <div className="text-center text-slate-500 py-6 text-xs">{tr("no_matches_imported")}</div>}
                {allMatches.map((m) => (
                  <div key={m.id} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2">
                    <div className="text-xs font-semibold mb-1">{teamName(m, "h", lang)} vs {teamName(m, "a", lang)}</div>
                    <div className="text-[10px] text-slate-500 mb-2">{m.league} · {m.time}</div>
                    <div className="grid grid-cols-3 gap-1">
                      {[{ k: "1", lbl: "1" }, { k: "X", lbl: "X" }, { k: "2", lbl: "2" },
                        { k: "Over 2.5", lbl: "Over" }, { k: "Under 2.5", lbl: "Under" }, { k: "BTTS Yes", lbl: "BTTS" }].map((b) => {
                        const oddsKey = b.k === "Over 2.5" ? "over" : b.k === "Under 2.5" ? "under" : b.k === "BTTS Yes" ? "btts_yes" : b.k;
                        return (
                          <button key={b.k} onClick={() => addLeg(m, b.k)}
                                  className="bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded text-[10px] py-1">
                            <div className="text-slate-400">{b.lbl}</div>
                            <div className="font-bold text-emerald-400">{m.odds[oddsKey]}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BetCard = ({ bet, bank, onSettle, onEdit, onDelete }) => {
  const tr = useT();
  const statusMap = {
    pending: { c: "text-amber-400 bg-amber-400/10 border-amber-400/30", l: tr("bet_status_pending") },
    won: { c: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", l: tr("bet_status_won") },
    lost: { c: "text-red-400 bg-red-400/10 border-red-400/30", l: tr("bet_status_lost") },
    void: { c: "text-slate-400 bg-slate-700/40 border-slate-600", l: tr("bet_status_void") },
  };
  const s = statusMap[bet.status];
  const profit = bet.status === "won" ? bet.stake * (bet.totalOdds - 1) : bet.status === "lost" ? -bet.stake : 0;

  return (
    <div className={`bg-slate-900 border rounded-xl ${
      bet.status === "won" ? "border-emerald-500/40" : bet.status === "lost" ? "border-red-500/30" : "border-slate-800"
    }`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${s.c}`}>{s.l}</span>
            <span className={`text-[10px] font-semibold ${bet.type === "accumulator" ? "text-amber-400" : "text-slate-400"}`}>
              {bet.type === "accumulator" ? `${tr("bet_accumulator")} (${bet.legs.length})` : tr("bet_single")}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">{formatDate(bet.createdAt)}</span>
        </div>
        <div className="space-y-1.5 mb-2.5">
          {bet.legs.map((leg, i) => (
            <div key={i} className="bg-slate-800/40 rounded-lg px-2.5 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{leg.home} vs {leg.away}</div>
                  <div className="text-[10px] text-slate-500">{leg.market}</div>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-400">{leg.odds.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/50">
          <div><div className="text-[9px] text-slate-500">{tr("stake")}</div><div className="text-sm font-semibold">{fmtMoney(bet.stake, bank.currency)}</div></div>
          <div><div className="text-[9px] text-slate-500">{tr("total_odds")}</div><div className="text-sm font-semibold">{bet.totalOdds.toFixed(2)}</div></div>
          <div>
            <div className="text-[9px] text-slate-500">{bet.status === "pending" ? tr("potential_profit") : tr("profit")}</div>
            <div className={`text-sm font-bold ${profit > 0 ? "text-emerald-400" : profit < 0 ? "text-red-400" : "text-slate-300"}`}>
              {bet.status === "pending" ? `+${fmtMoney(bet.stake * (bet.totalOdds - 1), bank.currency)}`
                : `${profit > 0 ? "+" : ""}${fmtMoney(profit, bank.currency)}`}
            </div>
          </div>
        </div>
        {bet.status === "pending" && (
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            <button onClick={() => onSettle(bet, "won")} className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded py-1.5 text-[10px] font-bold">✓ {tr("mark_won")}</button>
            <button onClick={() => onSettle(bet, "lost")} className="bg-red-500/15 border border-red-500/30 text-red-400 rounded py-1.5 text-[10px] font-bold">✗ {tr("mark_lost")}</button>
            <button onClick={() => onSettle(bet, "void")} className="bg-slate-700/40 border border-slate-600 text-slate-300 rounded py-1.5 text-[10px] font-bold">⊘ {tr("mark_void")}</button>
          </div>
        )}
        <div className="flex gap-1.5 mt-2">
          {bet.status !== "pending" && (
            <button onClick={() => onSettle(bet, "pending")} className="flex-1 bg-slate-800 text-slate-300 rounded py-1 text-[10px]">↺ {tr("reset_status")}</button>
          )}
          <button onClick={() => onEdit(bet)} className="flex-1 bg-slate-800 text-slate-300 rounded py-1 text-[10px] flex items-center justify-center gap-1"><Edit2 size={10} />{tr("edit")}</button>
          <button onClick={() => onDelete(bet)} className="flex-1 bg-red-500/10 text-red-400 rounded py-1 text-[10px] flex items-center justify-center gap-1"><Trash2 size={10} />{tr("delete")}</button>
        </div>
      </div>
    </div>
  );
};

const BankDetailView = ({ bank, bets, onBack, onPlaceBet, onSettle, onEditBet, onDeleteBet, onDeleteBank }) => {
  const tr = useT();
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
    <div className="pb-24">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
        <button onClick={onBack} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><ArrowLeft size={16} /></button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{bank.name}</h2>
          <div className="text-[10px] text-slate-400">{bank.currency === "EUR" ? "€ " + tr("euro") : "u " + tr("units")}</div>
        </div>
        <button onClick={() => onDeleteBank(bank)} className="w-8 h-8 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center"><Trash2 size={14} /></button>
      </div>
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4">
          <div className="text-[10px] text-slate-400 uppercase mb-1">{tr("current_balance")}</div>
          <div className="text-3xl font-bold font-mono">{fmtMoney(bank.balance, bank.currency)}</div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
            <span>{tr("initial_balance")}: {fmtMoney(bank.initialBalance, bank.currency)}</span>
            <span className={bank.balance > bank.initialBalance ? "text-emerald-400 font-bold" : bank.balance < bank.initialBalance ? "text-red-400 font-bold" : ""}>
              {bank.balance >= bank.initialBalance ? "+" : ""}{fmtMoney(bank.balance - bank.initialBalance, bank.currency)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 pt-3">
        <div className="grid grid-cols-4 gap-1.5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{tr("total_bets")}</div><div className="text-sm font-bold">{bankBets.length}</div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{tr("win_rate")}</div><div className="text-sm font-bold text-emerald-400">{winRate}%</div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{tr("profit")}</div>
            <div className={`text-sm font-bold ${totalProfit > 0 ? "text-emerald-400" : totalProfit < 0 ? "text-red-400" : ""}`}>{totalProfit >= 0 ? "+" : ""}{fmtMoney(totalProfit, bank.currency)}</div></div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center"><div className="text-[9px] text-slate-500">{tr("roi")}</div>
            <div className={`text-sm font-bold ${parseFloat(roi) > 0 ? "text-emerald-400" : parseFloat(roi) < 0 ? "text-red-400" : ""}`}>{parseFloat(roi) >= 0 ? "+" : ""}{roi}%</div></div>
        </div>
      </div>
      <div className="px-4 pt-3">
        <button onClick={() => onPlaceBet(bank)} className="w-full bg-emerald-500 text-slate-950 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2">
          <Plus size={16} />{tr("place_bet")}
        </button>
      </div>
      <div className="px-4 pt-3 flex gap-1.5 overflow-x-auto pb-1">
        {[{ k: "all", l: tr("filter_all") }, { k: "pending", l: tr("pending") }, { k: "won", l: tr("won") }, { k: "lost", l: tr("lost") }, { k: "void", l: tr("void") }].map((p) => (
          <button key={p.k} onClick={() => setFilter(p.k)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border ${
                    filter === p.k ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>{p.l}</button>
        ))}
      </div>
      <div className="px-4 pt-3 space-y-2">
        {filteredBets.length === 0 && <div className="text-center text-slate-500 py-12 text-sm">{tr("no_bets")}</div>}
        {filteredBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((bet) => (
          <BetCard key={bet.id} bet={bet} bank={bank} onSettle={onSettle} onEdit={onEditBet} onDelete={onDeleteBet} />
        ))}
      </div>
    </div>
  );
};

const BetsPage = ({ banks, bets, onCreateBank, onPlaceBet, onSettleBet, onEditBet, onDeleteBet, onDeleteBank, prefilledMatch, onClearPrefilled, allMatches }) => {
  const tr = useT();
  const [activeBank, setActiveBank] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showPlaceBet, setShowPlaceBet] = useState(false);
  const [editingBet, setEditingBet] = useState(null);

  useEffect(() => {
    if (prefilledMatch && banks.length > 0) setShowPlaceBet(true);
    else if (prefilledMatch && banks.length === 0) setShowCreate(true);
  }, [prefilledMatch]);

  if (activeBank) {
    const bank = banks.find((b) => b.id === activeBank.id);
    if (bank) {
      return (
        <BankDetailView
          bank={bank} bets={bets} onBack={() => setActiveBank(null)}
          onPlaceBet={() => setShowPlaceBet(true)} onSettle={onSettleBet}
          onEditBet={(bet) => { setEditingBet(bet); setShowPlaceBet(true); }}
          onDeleteBet={onDeleteBet}
          onDeleteBank={(b) => { onDeleteBank(b); setActiveBank(null); }}
        />
      );
    }
    setActiveBank(null);
  }

  return (
    <div className="px-4 pt-4 pb-24 relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><Wallet size={18} className="text-emerald-400" />
          <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("bets_title")}</h2>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1 bg-emerald-500 text-slate-950 rounded-lg px-3 py-1.5 text-xs font-bold">
          <Plus size={12} />{tr("create_bank")}
        </button>
      </div>
      {banks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Coins size={40} className="mx-auto text-emerald-400 mb-3" />
          <div className="text-sm font-semibold mb-1">{tr("no_banks")}</div>
          <div className="text-xs text-slate-500 mb-4">{tr("no_banks_sub")}</div>
          <button onClick={() => setShowCreate(true)} className="bg-emerald-500 text-slate-950 rounded-lg px-4 py-2 text-sm font-bold inline-flex items-center gap-2">
            <PlusCircle size={14} />{tr("create_bank")}
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
                  <div className="font-bold text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{b.name}</div>
                  <ChevronRight size={16} className="text-slate-500" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold font-mono">{fmtMoney(b.balance, b.currency)}</div>
                    <div className="text-[10px] text-slate-500">
                      {bankBets.length} {tr("total_bets").toLowerCase()}
                      {pendingCount > 0 && <span className="text-amber-400 ml-1">· {pendingCount} {tr("pending").toLowerCase()}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500">{tr("profit")}</div>
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
      {showPlaceBet && (
        <PlaceBetModal
          onClose={() => { setShowPlaceBet(false); setEditingBet(null); onClearPrefilled?.(); }}
          onSubmit={(b) => { editingBet ? onEditBet(b) : onPlaceBet(b); setShowPlaceBet(false); setEditingBet(null); onClearPrefilled?.(); }}
          banks={banks} allMatches={allMatches} prefilledMatch={prefilledMatch} editingBet={editingBet}
        />
      )}
    </div>
  );
};

/* STANDINGS + PROFILE ============================================================ */

const StandingsPage = ({ onBack }) => {
  const tr = useT();
  return (
    <div className="px-4 pt-4 pb-24 relative z-10">
      <div className="flex items-center gap-2 mb-3">
        {onBack && <button onClick={onBack} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><ArrowLeft size={16} /></button>}
        <Trophy size={18} className="text-emerald-400" />
        <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{tr("standings_title")}</h2>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[24px_1fr_24px_24px_24px_36px_32px] items-center gap-1 px-3 py-2 bg-slate-800/30 text-[10px] font-semibold text-slate-400 uppercase">
          <div className="text-center">#</div><div>{tr("team")}</div><div className="text-center">M</div>
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
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm" /><span>{tr("champions_league")}</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/50 rounded-sm" /><span>{tr("relegation")}</span></div>
      </div>
    </div>
  );
};

const ProfilePage = ({ settings, updateSettings, onResetData, onShowStandings }) => {
  const tr = useT();
  const { lang, setLang } = useLang();
  return (
    <div className="px-4 pt-4 pb-24 space-y-3 relative z-10">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3">М</div>
        <h2 className="font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Miroslav</h2>
        <p className="text-xs text-slate-400">miroslav@betpro.bg</p>
        <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-[10px] text-emerald-400 font-semibold">
          <Sparkles size={10} />{tr("pro_member")}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{ l: tr("watched"), v: "147", I: Eye }, { l: tr("saved"), v: "23", I: Bookmark }, { l: tr("accuracy"), v: "62%", I: Target }].map((s, i) => {
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
        <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800">{tr("settings")}</div>
        <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><Languages size={14} className="text-emerald-400" /></div>
          <div className="flex-1"><div className="text-sm font-medium">{tr("language")}</div></div>
          <div className="flex items-center bg-slate-800 rounded-md overflow-hidden text-[10px] font-bold">
            <button onClick={() => setLang("bg")} className={`px-3 py-1 ${lang === "bg" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>BG</button>
            <button onClick={() => setLang("en")} className={`px-3 py-1 ${lang === "en" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}>EN</button>
          </div>
        </div>
        <button onClick={() => updateSettings({ bgAnimation: !settings.bgAnimation })} className="w-full flex items-center gap-3 px-3 py-3 border-b border-slate-800/50 text-left">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><Sparkles size={14} className="text-emerald-400" /></div>
          <div className="flex-1">
            <div className="text-sm font-medium">{tr("bg_animation")}</div>
            <div className="text-[10px] text-slate-500">{settings.bgAnimation ? tr("on") : tr("off")}</div>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 ${settings.bgAnimation ? "bg-emerald-500" : "bg-slate-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.bgAnimation ? "translate-x-5" : ""}`} />
          </div>
        </button>
        <button onClick={() => updateSettings({ notifications: !settings.notifications })} className="w-full flex items-center gap-3 px-3 py-3 border-b border-slate-800/50 text-left">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><Bell size={14} className="text-emerald-400" /></div>
          <div className="flex-1">
            <div className="text-sm font-medium">{tr("notifications")}</div>
            <div className="text-[10px] text-slate-500">{settings.notifications ? tr("on") : tr("off")}</div>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 ${settings.notifications ? "bg-emerald-500" : "bg-slate-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? "translate-x-5" : ""}`} />
          </div>
        </button>
        <button onClick={() => updateSettings({ evNotifications: !settings.evNotifications })} className="w-full flex items-center gap-3 px-3 py-3 text-left">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><Zap size={14} className="text-amber-400" /></div>
          <div className="flex-1">
            <div className="text-sm font-medium">{tr("ev_notifications")}</div>
          </div>
          <div className={`w-10 h-5 rounded-full p-0.5 ${settings.evNotifications ? "bg-amber-500" : "bg-slate-700"}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.evNotifications ? "translate-x-5" : ""}`} />
          </div>
        </button>
      </div>
      <button onClick={onShowStandings} className="w-full flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center"><Trophy size={14} className="text-emerald-400" /></div>
        <div className="flex-1 text-left"><div className="text-sm font-medium">{tr("view_standings")}</div></div>
        <ChevronRight size={16} className="text-slate-500" />
      </button>
      <button onClick={onResetData} className="w-full flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
        <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-400" /></div>
        <div className="flex-1 text-left"><div className="text-sm font-medium text-red-400">{tr("reset_progress")}</div></div>
        <ChevronRight size={16} className="text-red-400/50" />
      </button>
    </div>
  );
};

/* ROOT APP ============================================================ */

export default function App() {
  const [state, setState] = useState(null);
  const [route, setRoute] = useState("home");
  const [match, setMatch] = useState(null);
  const [prefilledBetMatch, setPrefilledBetMatch] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => { loadState().then(setState); }, []);
  useEffect(() => { if (state) saveState(state); }, [state]);

  if (!state) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center"><div className="text-emerald-400 text-2xl animate-pulse">⚽</div></div>;
  }

  const allMatches = [...state.importedMatches, ...SAMPLE_FIXTURES];
  const setLang = (l) => setState({ ...state, lang: l });
  const updateSettings = (patch) => setState({ ...state, settings: { ...state.settings, ...patch } });

  const openMatch = (m) => { setMatch(m); setRoute("match"); };
  const handleSetRoute = (r) => { setRoute(r); if (r !== "match") setMatch(null); };

  const handleAddToBet = (m) => { setPrefilledBetMatch(m); setRoute("bets"); };

  const handleCreateBank = (bank) => setState({ ...state, banks: [...state.banks, bank] });

  const handlePlaceBet = (bet) => setState({ ...state, bets: [...state.bets, bet] });

  const handleSettleBet = (bet, newStatus) => {
    // Reverse old effect on bank, apply new
    const banks = state.banks.map((b) => {
      if (b.id !== bet.bankId) return b;
      let balance = b.balance;
      // Reverse old status
      if (bet.status === "won") balance -= bet.stake * (bet.totalOdds - 1);
      else if (bet.status === "lost") balance += bet.stake;
      // Apply new status
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
    // Reverse old status effect, apply new with new stake/odds
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
      msg: tt("confirm_delete_bet", state.lang),
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
      msg: tt("confirm_delete_bank", state.lang),
      onConfirm: () => {
        setState({ ...state, banks: state.banks.filter((b) => b.id !== bank.id),
                   bets: state.bets.filter((bt) => bt.bankId !== bank.id) });
        setConfirmModal(null);
      }
    });
  };

  const handleImport = (matches) => {
    // Replace by id (deduplicate)
    const existing = new Set(state.importedMatches.map((m) => m.id));
    const toAdd = matches.filter((m) => !existing.has(m.id));
    setState({ ...state, importedMatches: [...state.importedMatches, ...toAdd] });
  };

  const handleResetData = () => {
    setConfirmModal({
      msg: tt("confirm_reset", state.lang),
      onConfirm: () => { setState({ ...DEFAULT_STATE }); setConfirmModal(null); }
    });
  };

  return (
    <LangCtx.Provider value={{ lang: state.lang, setLang }}>
      <div className="min-h-screen bg-slate-950 text-white relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <SoccerBackground enabled={state.settings.bgAnimation} />
        <Header />
        {route === "home" && <HomePage setRoute={handleSetRoute} />}
        {route === "fixtures" && <FixturesPage openMatch={openMatch} allMatches={allMatches}
                                                importedCount={state.importedMatches.length} onImport={handleImport} />}
        {route === "bets" && <BetsPage banks={state.banks} bets={state.bets} allMatches={allMatches}
                                       onCreateBank={handleCreateBank} onPlaceBet={handlePlaceBet}
                                       onSettleBet={handleSettleBet} onEditBet={handleEditBet}
                                       onDeleteBet={handleDeleteBet} onDeleteBank={handleDeleteBank}
                                       prefilledMatch={prefilledBetMatch}
                                       onClearPrefilled={() => setPrefilledBetMatch(null)} />}
        {route === "evplus" && <EVPlusPage />}
        {route === "match" && match && <MatchPage match={match} onBack={() => setRoute("fixtures")} onAddToBet={handleAddToBet} />}
        {route === "standings" && <StandingsPage onBack={() => setRoute("profile")} />}
        {route === "profile" && <ProfilePage settings={state.settings} updateSettings={updateSettings}
                                             onResetData={handleResetData} onShowStandings={() => setRoute("standings")} />}
        <BottomNav route={route} setRoute={handleSetRoute} />
        {confirmModal && <ConfirmModal msg={confirmModal.msg} onCancel={() => setConfirmModal(null)} onConfirm={confirmModal.onConfirm} />}
      </div>
    </LangCtx.Provider>
  );
}
