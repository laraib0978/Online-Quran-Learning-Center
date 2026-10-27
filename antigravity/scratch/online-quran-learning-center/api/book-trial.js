/**
 * Serverless Backend Endpoint for Vercel / Netlify
 * Route: /api/book-trial
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, course, teacher_preference, timezone } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const safeData = {
      name: String(name).replace(/[<>]/g, '').trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).replace(/[<>]/g, '').trim(),
      course: String(course || '3-Day Free Trial').replace(/[<>]/g, '').trim(),
      teacher_preference: String(teacher_preference || 'No Preference').replace(/[<>]/g, '').trim(),
      timezone: String(timezone || 'Global').replace(/[<>]/g, '').trim()
    };

    console.log(`[TRIAL REGISTRATION]: ${safeData.name} - ${safeData.phone}`);

    return res.status(200).json({
      success: true,
      message: '3-Day Free Trial registration confirmed. We will message your WhatsApp shortly.'
    });

  } catch (error) {
    console.error('Trial API Error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing trial.' });
  }
};
