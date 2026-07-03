// ════════════════════════════════════════════════════════════════
// Server-side proxy към Oracle ORDS — клиентът никога не вижда
// директно Oracle домейна в Network таба на браузъра. Той вика само
// /api/fixtures на собствения ни домейн.
// ════════════════════════════════════════════════════════════════
const ORACLE_URL =
  "https://gb975ca8378ff79-home.adb.eu-turin-1.oraclecloudapps.com/ords/admin/xgpro_fixtures_public/";

export default async function handler(req, res) {
  try {
    const limit = req.query.limit || "100";
    const offset = req.query.offset || "0";
    const url = `${ORACLE_URL}?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;

    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: "upstream_error", status: upstream.status });
      return;
    }
    const data = await upstream.json();

    // Кешираме кратко на CDN ниво (Vercel Edge/CDN), но не при клиента —
    // намалява натоварването на Oracle без да пречи на свежестта на данните.
    res.setHeader("Cache-Control", "s-maxage=3, stale-while-revalidate=8");
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "proxy_failed", message: String(e && e.message || e) });
  }
}
