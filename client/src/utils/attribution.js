// Simple attribution capture: UTM params, helper src=qr, and referrer

function getParam(search, key) {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(key) || '';
  } catch {
    // Fallback for older browsers
    const params = new URLSearchParams(search || window.location.search || '');
    return params.get(key) || '';
  }
}

function getDomain(ref) {
  try {
    const u = new URL(ref);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function classifySource(utmSource, srcFlag, referrer) {
  if ((srcFlag || '').toLowerCase() === 'qr') return 'QR';
  if ((utmSource || '').toLowerCase() === 'qr') return 'QR';
  if (utmSource) return utmSource;
  if (referrer) return getDomain(referrer);
  return 'Direct';
}

export function initAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const utm_source = getParam(null, 'utm_source');
    const utm_medium = getParam(null, 'utm_medium');
    const utm_campaign = getParam(null, 'utm_campaign');
    const src = getParam(null, 'src');
    const referrer = document.referrer || '';

    const source = classifySource(utm_source, src, referrer);

    // Only set once per browser session if already present
    const existingSessionId = localStorage.getItem('kp_session_id');
    if (!existingSessionId) {
      localStorage.setItem('kp_session_id', `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    }

    // Always keep last-touch for utms if present
    if (utm_source) localStorage.setItem('kp_utm_source', utm_source);
    if (utm_medium) localStorage.setItem('kp_utm_medium', utm_medium);
    if (utm_campaign) localStorage.setItem('kp_utm_campaign', utm_campaign);
    if (referrer) localStorage.setItem('kp_referrer', referrer);

    if (source) localStorage.setItem('kp_source', source);

    // Send a one-time visit event (per session)
    const visitSentKey = 'kp_visit_sent';
    const visitAlreadySent = sessionStorage.getItem(visitSentKey);
    if (!visitAlreadySent) {
      const payload = {
        sessionId: localStorage.getItem('kp_session_id') || '',
        source: localStorage.getItem('kp_source') || '',
        utm_source: localStorage.getItem('kp_utm_source') || '',
        utm_medium: localStorage.getItem('kp_utm_medium') || '',
        utm_campaign: localStorage.getItem('kp_utm_campaign') || '',
        referrer: localStorage.getItem('kp_referrer') || '',
        userAgent: navigator.userAgent
      };
      const base = (process.env.REACT_APP_API_URL || 'https://care-a6rj.onrender.com/api');
      const ensured = base.endsWith('/api') ? base : `${base.replace(/\/+$/, '')}/api`;
      fetch(ensured + '/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {}).finally(() => {
        sessionStorage.setItem(visitSentKey, '1');
      });
    }
  } catch {
    // no-op
  }
}

// Session analytics: track pageviews, time, and scroll depth
let kp_session_start = Date.now();
let kp_page_start = Date.now();
let kp_max_scroll = 0;
let kp_pageviews = [];

function kp_path() {
  try { return window.location.pathname + window.location.search + window.location.hash; } catch { return '/'; }
}

function kp_scroll_pct() {
  try {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (h <= vh) return 100;
    return Math.min(100, Math.round(((y + vh) / h) * 100));
  } catch { return 0; }
}

function kp_record_pageview() {
  const now = Date.now();
  const durationMs = now - kp_page_start;
  kp_pageviews.push({ path: kp_path(), durationMs, maxScrollPercent: kp_max_scroll });
  kp_page_start = now;
  kp_max_scroll = 0;
}

export function initSessionTracking() {
  try {
    kp_session_start = Date.now();
    kp_page_start = Date.now();
    kp_max_scroll = 0;
    kp_pageviews = [];

    window.addEventListener('scroll', () => {
      const p = kp_scroll_pct();
      if (p > kp_max_scroll) kp_max_scroll = p;
    }, { passive: true });

    const _push = history.pushState;
    history.pushState = function() {
      // @ts-ignore
      _push.apply(this, arguments);
      kp_record_pageview();
    };
    const _replace = history.replaceState;
    history.replaceState = function() {
      // @ts-ignore
      _replace.apply(this, arguments);
      kp_record_pageview();
    };
    window.addEventListener('popstate', kp_record_pageview);

    window.addEventListener('beforeunload', sendSessionSummary, { capture: true });
  } catch {}
}

export function sendSessionSummary() {
  try { kp_record_pageview(); } catch {}
  try {
    const payload = {
      sessionId: localStorage.getItem('kp_session_id') || '',
      source: localStorage.getItem('kp_source') || '',
      utm_source: localStorage.getItem('kp_utm_source') || '',
      utm_medium: localStorage.getItem('kp_utm_medium') || '',
      utm_campaign: localStorage.getItem('kp_utm_campaign') || '',
      referrer: localStorage.getItem('kp_referrer') || document.referrer || '',
      startedAt: new Date(kp_session_start).toISOString(),
      endedAt: new Date().toISOString(),
      pageviews: kp_pageviews
    };
    const base = (process.env.REACT_APP_API_URL || 'https://care-a6rj.onrender.com/api');
    const ensured = base.endsWith('/api') ? base : `${base.replace(/\/+$/, '')}/api`;
    const url = ensured + '/analytics/session';
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
  } catch {}
}

// Fire-and-forget event tracking
export function trackEvent(eventName, metadata = {}) {
  try {
    const payload = {
      sessionId: localStorage.getItem('kp_session_id') || '',
      eventName,
      path: (typeof window !== 'undefined') ? (window.location.pathname + window.location.search + window.location.hash) : '',
      timestamp: new Date().toISOString(),
      metadata,
      scrollPercent: kp_scroll_pct(),
      timeSincePageLoadMs: Date.now() - kp_page_start
    };
    const base = (process.env.REACT_APP_API_URL || 'https://care-a6rj.onrender.com/api');
    const ensured = base.endsWith('/api') ? base : `${base.replace(/\/+$/, '')}/api`;
    const url = ensured + '/analytics/event';
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(()=>{});
    }
  } catch {}
}
