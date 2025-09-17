const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const sheets = require('../utils/sheets');
const nodemailer = require('nodemailer');

const router = express.Router();

// Route-level CORS assist (mirror origin)
router.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// One-time visit event (no auth)
router.post('/visit', [
  body('sessionId').optional().trim(),
  body('source').optional().trim(),
  body('utm_source').optional().trim(),
  body('utm_medium').optional().trim(),
  body('utm_campaign').optional().trim(),
  body('referrer').optional().trim(),
  body('userAgent').optional().trim()
], validate, async (req, res) => {
  try {
    const visit = {
      ...req.body,
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || ''
    };

    // Append to Sheets
    try {
      const ok = await sheets.appendVisitRow(visit);
      if (!ok) console.error('Sheets append (visit) failed for sessionId:', visit.sessionId);
    } catch (e) {
      console.error('Sheets append (visit) exception:', e?.message || e);
    }

    // Send lightweight email notification
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      const toAddress = process.env.BOOKING_NOTIFY_TO || process.env.EMAIL_USER;
      const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
      const text = [
        `New visit detected`,
        `Session: ${visit.sessionId || ''}`,
        `Source: ${visit.source || ''}`,
        `UTM: ${visit.utm_source || ''} / ${visit.utm_medium || ''} / ${visit.utm_campaign || ''}`,
        `Referrer: ${visit.referrer || ''}`,
        `IP: ${visit.ip || ''}`,
        `UA: ${visit.userAgent || ''}`
      ].join('\n');
      await transporter.sendMail({ from: fromAddress, to: toAddress, subject: 'KinPin: New Visit', text });
    } catch (mailErr) {
      console.error('Visit email send error:', mailErr);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Visit event error:', error);
    res.status(500).json({ message: 'Failed to record visit' });
  }
});

module.exports = router;

// One-off event endpoint
router.post('/event', [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('eventName').notEmpty().withMessage('Event name is required'),
  body('timestamp').optional().trim(),
  body('path').optional().trim()
], validate, async (req, res) => {
  try {
    const ev = req.body;
    // Append to Sheets (Events)
    try { await sheets.appendEventRow(ev); } catch (e) { console.error('appendEventRow error', e?.message || e); }

    // Minimal email for critical events (optional): only for conversions
    try {
      if (['booking_submit_success'].includes(ev.eventName)) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: Number(process.env.EMAIL_PORT || 587),
          secure: false,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        const toAddress = process.env.BOOKING_NOTIFY_TO || process.env.EMAIL_USER;
        const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
        const text = `Conversion: ${ev.eventName}\nSession: ${ev.sessionId}\nPath: ${ev.path || ''}\nMetadata: ${JSON.stringify(ev.metadata || {})}`;
        await transporter.sendMail({ from: fromAddress, to: toAddress, subject: 'KinPin: Conversion Event', text });
      }
    } catch (e) {
      console.error('Event email error:', e?.message || e);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Event error:', error);
    res.status(500).json({ message: 'Failed to record event' });
  }
});
// Session summary endpoint
router.post('/session', [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('pageviews').isArray().withMessage('Pageviews array is required')
], validate, async (req, res) => {
  try {
    const session = req.body;

    try { await sheets.appendSessionRow(session); } catch (e) { console.error('appendSessionRow error', e?.message || e); }
    try { await sheets.appendPageviewRows(session); } catch (e) { console.error('appendPageviewRows error', e?.message || e); }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      const toAddress = process.env.BOOKING_NOTIFY_TO || process.env.EMAIL_USER;
      const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
      const totalSeconds = Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 1000) || 0;
      const pvLines = (session.pageviews || []).slice(0, 20).map((pv, idx) => `${idx+1}. ${pv.path} — ${Math.round((pv.durationMs||0)/1000)}s — ${pv.maxScrollPercent||0}%`).join('\n');
      const text = `KinPin: Session Summary\nSession: ${session.sessionId}\nSource: ${session.source || ''}\nUTM: ${session.utm_source || ''}/${session.utm_medium || ''}/${session.utm_campaign || ''}\nReferrer: ${session.referrer || ''}\nDuration: ${totalSeconds}s\nPageviews: ${(session.pageviews||[]).length}\n---\n${pvLines}`;
      await transporter.sendMail({ from: fromAddress, to: toAddress, subject: 'KinPin: Session Summary', text });
    } catch (e) {
      console.error('Session email send error:', e?.message || e);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Session event error:', error);
    res.status(500).json({ message: 'Failed to record session' });
  }
});


