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


