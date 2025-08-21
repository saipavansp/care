const axios = require('axios');
let twilioClient = null;

function toE164Indian(phone) {
  if (!phone) return phone;
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (phone.startsWith('+')) return phone; // assume already E.164
  return `+${digits}`;
}

class SmsProvider {
  constructor(options = {}) {
    this.provider = process.env.SMS_PROVIDER || 'twilio';
    this.options = options;
  }

  async sendSms(toPhone, message) {
    if (this.provider === 'msg91') {
      return this.sendViaMsg91(toPhone, message);
    }
    if (this.provider === 'twilio') {
      return this.sendViaTwilio(toPhone, message);
    }
    throw new Error(`Unsupported SMS provider: ${this.provider}`);
  }

  async sendViaMsg91(toPhone, message) {
    const apiKey = process.env.MSG91_API_KEY;
    const senderId = process.env.MSG91_SENDER_ID || 'KINPIN';
    const route = process.env.MSG91_ROUTE || '4';
    const templateId = process.env.MSG91_TEMPLATE_ID; // optional but recommended for DLT

    if (!apiKey) {
      throw new Error('MSG91_API_KEY is not configured');
    }

    const payload = {
      sender: senderId,
      route,
      country: '91',
      sms: [{
        message,
        to: [toPhone]
      }]
    };

    if (templateId) {
      payload.sms[0].template_id = templateId;
    }

    const url = process.env.MSG91_BASE_URL || 'https://api.msg91.com/api/v5/sms/bulk';

    const headers = {
      authkey: apiKey,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(url, payload, { headers, timeout: 15000 });
    return response.data;
  }

  async sendViaTwilio(toPhone, message) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM; // EITHER this
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; // OR this

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not configured');
    }
    if (!fromNumber && !messagingServiceSid) {
      throw new Error('Set TWILIO_FROM or TWILIO_MESSAGING_SERVICE_SID');
    }

    if (!twilioClient) {
      // Lazy require to avoid dependency if not used
      const twilio = require('twilio');
      twilioClient = twilio(accountSid, authToken);
    }

    const to = toE164Indian(toPhone);
    const params = {
      body: message,
      to,
    };
    if (messagingServiceSid) params.messagingServiceSid = messagingServiceSid;
    else params.from = fromNumber;

    const res = await twilioClient.messages.create(params);
    return { sid: res.sid, status: res.status };
  }
}

module.exports = new SmsProvider();


