const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const sheets = require('../utils/sheets');

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


