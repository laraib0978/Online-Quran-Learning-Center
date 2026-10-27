/**
 * Serverless Backend Endpoint for Vercel / Netlify
 * Route: /api/contact
 * Handles contact forms, input sanitization, spam honeypot check, and notification relay
 */

module.exports = async (req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, course, teacher_preference, timezone, message, _hp_security_check } = req.body || {};

    // 1. Bot Honeypot Protection
    if (_hp_security_check) {
      // Silent rejection of web bots
      return res.status(200).json({ success: true, message: 'Inquiry received.' });
    }

    // 2. Input Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone number are required.' });
    }

    // 3. Clean and sanitize data
    const safeData = {
      name: String(name).replace(/[<>]/g, '').trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).replace(/[<>]/g, '').trim(),
      course: String(course || 'Noorani Qaida / Quran Tajweed').replace(/[<>]/g, '').trim(),
      teacher_preference: String(teacher_preference || 'No Preference').replace(/[<>]/g, '').trim(),
      timezone: String(timezone || 'Global').replace(/[<>]/g, '').trim(),
      message: String(message || '').replace(/[<>]/g, '').trim(),
      date: new Date().toISOString()
    };

    console.log(`[SECURE INQUIRY RECEIVED]: ${safeData.name} (${safeData.email}) - Course: ${safeData.course} - Phone: ${safeData.phone}`);

    // If SMTP credentials exist in environment variables, dispatch email
    if (process.env.SMTP_PASS) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'onlinelearningqurancenter@gmail.com',
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Online Quran Center" <${process.env.SMTP_USER || 'onlinelearningqurancenter@gmail.com'}>`,
        to: process.env.RECEIVER_EMAIL || 'onlinelearningqurancenter@gmail.com',
        replyTo: safeData.email,
        subject: `[New Inquiry] ${safeData.name} - ${safeData.course}`,
        html: `
          <h3>New Quran Class Inquiry / 3-Day Free Trial</h3>
          <p><strong>Name:</strong> ${safeData.name}</p>
          <p><strong>Email:</strong> ${safeData.email}</p>
          <p><strong>WhatsApp / Phone:</strong> ${safeData.phone}</p>
          <p><strong>Course:</strong> ${safeData.course}</p>
          <p><strong>Teacher Preference:</strong> ${safeData.teacher_preference}</p>
          <p><strong>Timezone:</strong> ${safeData.timezone}</p>
          <p><strong>Message:</strong> ${safeData.message}</p>
        `
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Alhamdulillah! Your inquiry was securely received. Our admissions coordinator will contact your WhatsApp within 2 hours.'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: 'Secure transmission error. Please reach us on WhatsApp: 03702861584.' });
  }
};
