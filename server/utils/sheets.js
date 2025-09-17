const { google } = require('googleapis');

function getEnvBoolean(name, defaultValue = false) {
  const v = (process.env[name] || '').toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes') return true;
  if (v === '0' || v === 'false' || v === 'no') return false;
  return defaultValue;
}

const SHEETS_ENABLED = getEnvBoolean('GOOGLE_SHEETS_ENABLED', false);
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
const USERS_SHEET_NAME = process.env.GOOGLE_SHEETS_USERS_SHEET || 'Users';
const BOOKINGS_SHEET_NAME = process.env.GOOGLE_SHEETS_BOOKINGS_SHEET || 'Bookings';
const ANALYTICS_SHEET_NAME = process.env.GOOGLE_SHEETS_ANALYTICS_SHEET || 'Analytics';
const SESSIONS_SHEET_NAME = process.env.GOOGLE_SHEETS_SESSIONS_SHEET || 'Sessions';
const PAGEVIEWS_SHEET_NAME = process.env.GOOGLE_SHEETS_PAGEVIEWS_SHEET || 'Pageviews';
const EVENTS_SHEET_NAME = process.env.GOOGLE_SHEETS_EVENTS_SHEET || 'Events';

async function getSheetsClient() {
  if (!SHEETS_ENABLED || !SPREADSHEET_ID) return null;

  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const credsJson = process.env.GOOGLE_SHEETS_CREDENTIALS_JSON;

  if (credsJson) {
    try {
      const parsed = JSON.parse(credsJson);
      clientEmail = parsed.client_email;
      privateKey = parsed.private_key;
    } catch (e) {
      console.error('Invalid GOOGLE_SHEETS_CREDENTIALS_JSON');
      return null;
    }
  }

  if (!clientEmail || !privateKey) return null;

  // Handle escaped newlines in env var
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  return google.sheets({ version: 'v4', auth });
}

async function appendRow(rangeA1, values) {
  try {
    const sheetsClient = await getSheetsClient();
    if (!sheetsClient) {
      console.error('Sheets: client not initialized or disabled');
      return false;
    }
    await sheetsClient.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: rangeA1,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
    return true;
  } catch (e) {
    console.error('Sheets append error:', e?.response?.data || e.message || e);
    return false;
  }
}

async function appendUserRow(user) {
  if (!user) return false;
  const ts = new Date().toISOString();
  const values = [
    ts,
    user._id?.toString() || '',
    user.name || '',
    user.phone || '',
    user.email || ''
  ];
  const range = `${USERS_SHEET_NAME}!A1`;
  return appendRow(range, values);
}

async function appendBookingRow(booking, user, body = {}) {
  if (!booking) return false;
  const ts = new Date().toISOString();
  const values = [
    ts,
    booking.bookingId || '',
    booking._id?.toString() || '',
    user?._id?.toString() || '',
    user?.name || '',
    user?.phone || '',
    user?.email || '',
    body.patientName || '',
    body.hospital || '',
    body.doctor || '',
    body.appointmentDate || '',
    body.appointmentTime || '',
    booking.status || '',
    body.totalAmount ?? '',
    // Attribution fields
    body.source || '',
    body.utm_source || '',
    body.utm_medium || '',
    body.utm_campaign || '',
    body.referrer || '',
    body.sessionId || ''
  ];
  const range = `${BOOKINGS_SHEET_NAME}!A1`;
  return appendRow(range, values);
}

module.exports = {
  isEnabled: SHEETS_ENABLED && !!SPREADSHEET_ID,
  appendUserRow,
  appendBookingRow,
  async appendVisitRow(visit = {}) {
    const ts = new Date().toISOString();
    const values = [
      ts,
      visit.sessionId || '',
      visit.source || '',
      visit.utm_source || '',
      visit.utm_medium || '',
      visit.utm_campaign || '',
      visit.referrer || '',
      visit.userAgent || '',
      visit.ip || ''
    ];
    const range = `${ANALYTICS_SHEET_NAME}!A1`;
    return appendRow(range, values);
  }
  , async appendSessionRow(session = {}) {
    const values = [
      new Date().toISOString(),
      session.sessionId || '',
      session.source || '',
      session.utm_source || '',
      session.utm_medium || '',
      session.utm_campaign || '',
      session.referrer || '',
      session.startedAt || '',
      session.endedAt || '',
      Array.isArray(session.pageviews) ? session.pageviews.length : 0
    ];
    const range = `${SESSIONS_SHEET_NAME}!A1`;
    return appendRow(range, values);
  }
  , async appendPageviewRows(session = {}) {
    if (!Array.isArray(session.pageviews) || session.pageviews.length === 0) return true;
    const rows = session.pageviews.map(pv => [
      session.sessionId || '',
      pv.path || '',
      Math.round((pv.durationMs || 0) / 1000),
      pv.maxScrollPercent || 0
    ]);
    try {
      const sheetsClient = await getSheetsClient();
      if (!sheetsClient) return false;
      await sheetsClient.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${PAGEVIEWS_SHEET_NAME}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: rows }
      });
      return true;
    } catch (e) {
      console.error('Sheets append (pageviews) error:', e?.response?.data || e.message || e);
      return false;
    }
  }
  , async appendEventRow(ev = {}) {
    const values = [
      new Date().toISOString(),
      ev.sessionId || '',
      ev.eventName || '',
      ev.path || '',
      ev.timestamp || '',
      JSON.stringify(ev.metadata || {}),
      ev.scrollPercent || 0,
      ev.timeSincePageLoadMs || 0
    ];
    const range = `${EVENTS_SHEET_NAME}!A1`;
    return appendRow(range, values);
  }
};


