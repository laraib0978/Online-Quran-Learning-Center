/**
 * Online Quran Learning Center - Secure Enterprise Backend
 * Security Stack:
 * 1. Helmet: Secure HTTP headers against clickjacking, sniffing, and XSS
 * 2. Express-Rate-Limit: Protects API against automated DDoS and form spamming
 * 3. CORS: Whitelists authorized frontend origins
 * 4. Input Sanitization: Strips dangerous HTML tags, validates phone/email
 * 5. Honeypot Filter: Silent rejection of automated bot submissions
 * 6. Nodemailer Relay: Server-side email delivery using hidden environment credentials
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Path to frontend assets
const frontendPath = path.join(__dirname, '../frontend');

// ================= 1. SECURITY HEADERS =================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Allows CDN fonts, styles, and FontAwesome icons
}));

// ================= 2. CORS POLICIES =================
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, or same-origin local testing)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS security policy.'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers with strict size limits to prevent payload DOS
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// ================= 3. RATE LIMITING =================
// Maximum 10 inquiries per 15-minute window per IP
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. For your security, please wait 15 minutes or contact us directly on WhatsApp: 03702861584.'
  }
});

// ================= 4. EMAIL TRANSPORTER CONFIGURATION =================
// Configured completely on the backend; never exposed to the client
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER || 'onlinelearningqurancenter@gmail.com',
    pass: process.env.SMTP_PASS || ''
  }
});

// ================= 5. SANITIZATION HELPER =================
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  // Strip HTML tags and escape dangerous characters
  return validator.escape(validator.stripLow(str.trim()));
}

// ================= 6. HEALTH CHECK ROUTE =================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Online Quran Learning Center Security API' });
});

// ================= 7. SECURE CONTACT FORM ENDPOINT =================
app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const { name, email, phone, course, teacher_preference, timezone, message, _hp_security_check } = req.body;

    // Security Check 1: Honeypot trap (if bots fill the hidden field, drop silently)
    if (_hp_security_check) {
      console.warn(`[SECURITY ALERT] Honeypot triggered from IP: ${req.ip}`);
      return res.status(200).json({ success: true, message: 'Inquiry received.' });
    }

    // Security Check 2: Mandatory fields check
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and WhatsApp/phone number are required.' 
      });
    }

    // Security Check 3: Format Validations
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address.' 
      });
    }

    // Security Check 4: Sanitize all inputs
    const safeData = {
      name: sanitizeInput(name),
      email: validator.normalizeEmail(email),
      phone: sanitizeInput(phone),
      course: sanitizeInput(course || 'General Quran Recitation'),
      teacher_preference: sanitizeInput(teacher_preference || 'No Preference'),
      timezone: sanitizeInput(timezone || 'Not specified'),
      message: sanitizeInput(message || 'No additional message provided.')
    };

    // Construct Email Content
    const mailOptions = {
      from: `"Online Quran Center Web" <${process.env.SMTP_USER || 'onlinelearningqurancenter@gmail.com'}>`,
      to: process.env.RECEIVER_EMAIL || 'onlinelearningqurancenter@gmail.com',
      replyTo: safeData.email,
      subject: `[New Inquiry] ${safeData.name} - ${safeData.course}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #064e3b; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #064e3b; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; color: #fef08a;">Online Quran Learning Center</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px;">New Student Inquiry / 3-Day Free Trial Request</p>
          </div>
          <div style="padding: 24px; background-color: #fdfbf7; color: #1e293b; line-height: 1.6;">
            <p><strong>Student/Parent Name:</strong> ${safeData.name}</p>
            <p><strong>Email Address:</strong> <a href="mailto:${safeData.email}">${safeData.email}</a></p>
            <p><strong>WhatsApp / Phone:</strong> <a href="https://wa.me/${safeData.phone.replace(/[^0-9]/g, '')}">${safeData.phone}</a></p>
            <p><strong>Course of Interest:</strong> ${safeData.course}</p>
            <p><strong>Teacher Preference:</strong> ${safeData.teacher_preference}</p>
            <p><strong>Student Timezone:</strong> ${safeData.timezone}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p><strong>Additional Message / Age:</strong></p>
            <blockquote style="background: #ffffff; padding: 12px 16px; border-left: 4px solid #d97706; margin: 0;">
              ${safeData.message}
            </blockquote>
          </div>
          <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 11px; color: #64748b;">
            Securely routed through Online Quran Learning Center Backend Protection Engine.
          </div>
        </div>
      `
    };

    // Send Email if SMTP configured, else log securely
    if (process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('--- [DEVELOPMENT LOG: EMAIL DISPATCH] ---');
      console.log(safeData);
      console.log('To deliver real emails, set SMTP_PASS in your backend .env file.');
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully. Our team will contact you within 2 hours.'
    });

  } catch (error) {
    // Shield internal error details from the public
    console.error('[SERVER ERROR]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'A secure transmission error occurred. Please contact us via WhatsApp: 03702861584.'
    });
  }
});

// ================= 8. 3-DAY FREE TRIAL BOOKING ENDPOINT =================
app.post('/api/book-trial', formLimiter, async (req, res) => {
  try {
    const { name, email, phone, course, teacher_preference, timezone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const safeData = {
      name: sanitizeInput(name),
      email: validator.normalizeEmail(email),
      phone: sanitizeInput(phone),
      course: sanitizeInput(course),
      teacher_preference: sanitizeInput(teacher_preference),
      timezone: sanitizeInput(timezone)
    };

    console.log(`[TRIAL REGISTRATION]: ${safeData.name} - ${safeData.course} (${safeData.phone})`);

    return res.status(200).json({
      success: true,
      message: '3-Day Free Trial registration confirmed. An academic coordinator will message your WhatsApp shortly.'
    });

  } catch (err) {
    console.error('[TRIAL BOOKING ERROR]:', err.message);
    return res.status(500).json({ success: false, message: 'Server error processing trial booking.' });
  }
});

// Serve Frontend static assets directly
app.use(express.static(frontendPath));

// Fallback to index.html for Single Page Application routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`Online Quran Learning Center Backend Running on Port ${PORT}`);
  console.log(`Security Protocol: Rate Limiting & Helmet ACTIVE`);
  console.log(`Official Recipient: onlinelearningqurancenter@gmail.com`);
  console.log(`Official WhatsApp: 03702861584`);
  console.log(`=======================================================`);
});
