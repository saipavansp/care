const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  subject: { type: String, required: true, index: true }, // phone or email
  purpose: { type: String, enum: ['register', 'password_reset'], required: true },
  channel: { type: String, enum: ['sms', 'email'], required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  consumed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL from value
}, {
  timestamps: true
});

module.exports = mongoose.model('Otp', otpSchema);


