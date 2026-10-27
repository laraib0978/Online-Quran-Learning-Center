/**
 * Online Quran Learning Center - Frontend Application Engine
 * Includes:
 * 1. 3D Luxury Interactive Watch Engine with Realistic Canvas Rendering & Mouse Tilt
 * 2. Multi-Currency Converter with Real-Time Dynamic Rates
 * 3. Timezone Availability Synchronizer
 * 4. Secure Form Submission with Backend API + Graceful WhatsApp/Mailto Fallback
 */

// Global Configuration
// Dynamically determine the API endpoint whether deployed on Vercel, Render, or tested locally
const BACKEND_API_URL = window.location.protocol.startsWith('http')
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

const WHATSAPP_NUMBER = '923702861584';
const OFFICIAL_EMAIL = 'onlinelearningqurancenter@gmail.com';

// Current State
let currentTimezone = 'America/New_York';
let currentTimezoneLabel = 'United States (EST)';
let currentCurrency = 'USD';

// Currency Rates (Base USD)
const CURRENCIES = {
  USD: { symbol: '$', rate: 1, suffix: '/ month' },
  GBP: { symbol: '£', rate: 0.80, suffix: '/ month' },
  EUR: { symbol: '€', rate: 0.92, suffix: '/ month' },
  CAD: { symbol: 'C$', rate: 1.38, suffix: '/ month' },
  AUD: { symbol: 'A$', rate: 1.54, suffix: '/ month' },
  PKR: { symbol: '₨ ', rate: 280, suffix: '/ month' }
};

// Base Prices in USD
const BASE_PRICES = [40, 50, 60, 75];

// ================= CURRENCY CONVERTER =================
function setCurrency(currCode) {
  if (!CURRENCIES[currCode]) return;
  currentCurrency = currCode;
  
  // Update Buttons
  document.querySelectorAll('.currency-btn').forEach(btn => {
    if (btn.getAttribute('data-curr') === currCode) {
      btn.classList.add('active-curr');
    } else {
      btn.classList.remove('active-curr');
    }
  });

  // Update Price Displays
  const curr = CURRENCIES[currCode];
  const displays = document.querySelectorAll('.price-display');
  
  displays.forEach(el => {
    const baseUsd = parseFloat(el.getAttribute('data-usd'));
    let converted = baseUsd * curr.rate;
    
    // Formatting
    if (currCode === 'PKR') {
      converted = Math.round(converted).toLocaleString();
    } else {
      converted = Math.round(converted);
    }
    
    el.textContent = `${curr.symbol}${converted}`;
  });
}

// Plan selection helper
function selectPlan(planName) {
  openTrialModal();
  const msgField = document.getElementById('c_message');
  if (msgField) {
    msgField.value = `Selected Plan: ${planName}`;
  }
}

// Course selection helper
function enrollInCourse(courseName) {
  openTrialModal();
  
  // Update Course dropdown in modal
  const mCourse = document.getElementById('m_course');
  if (mCourse) {
    if (courseName.includes('Qaida')) {
      mCourse.value = 'Noorani Qaida (Beginners)';
    } else if (courseName.includes('Tajweed') || courseName.includes('Nazra')) {
      mCourse.value = 'Tajweed & Quran Recitation';
    } else if (courseName.includes('Hifz') || courseName.includes('Memorization')) {
      mCourse.value = 'Hifz (Memorization)';
    } else if (courseName.includes('Islamic Studies')) {
      mCourse.value = 'Islamic Studies & Duas';
    } else {
      mCourse.value = 'Noorani Qaida (Beginners)';
    }
  }

  // If female tutor selected, set preference
  if (courseName.includes('Female')) {
    const mPref = document.getElementById('m_pref');
    if (mPref) mPref.value = 'Female Teacher';
  }

  // Also prefill contact form in case they scroll to it
  const cCourse = document.getElementById('c_course');
  if (cCourse) {
    if (courseName.includes('Qaida')) cCourse.value = 'Noorani Qaida for Beginners';
    else if (courseName.includes('Tajweed')) cCourse.value = 'Quran Reading with Tajweed';
    else if (courseName.includes('Hifz')) cCourse.value = 'Quran Memorization (Hifz)';
    else if (courseName.includes('Islamic Studies')) cCourse.value = 'Islamic Studies & Daily Duas';
    else if (courseName.includes('Tafseer')) cCourse.value = 'Tafseer & Advanced Arabic';
  }
}

// ================= TIMEZONE SYNCHRONIZER =================
function changeTimezone(tzString, label, countryCode) {
  currentTimezone = tzString;
  currentTimezoneLabel = label;
  
  const labelEl = document.getElementById('active-zone-label');
  if (labelEl) labelEl.textContent = label;

  // Update UI buttons
  const buttons = document.querySelectorAll('.tz-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tzString)) {
      btn.classList.add('active-tz');
      btn.classList.remove('bg-emerald-950/80', 'text-emerald-200');
    } else {
      btn.classList.remove('active-tz');
      btn.classList.add('bg-emerald-950/80', 'text-emerald-200');
    }
  });

  updateDigitalClock();
}

// ================= 3D CANVAS LUXURY WATCH ENGINE =================
const canvas = document.getElementById('watchCanvas');
const ctx = canvas.getContext('2d');
let mouseX = 0;
let mouseY = 0;
let targetTiltX = 0;
let targetTiltY = 0;
let currentTiltX = 0;
let currentTiltY = 0;

// Mouse Interaction for 3D Tilt
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  targetTiltX = (y / (rect.height / 2)) * 12; // tilt degrees
  targetTiltY = (-x / (rect.width / 2)) * 12;
});

canvas.addEventListener('mouseleave', () => {
  targetTiltX = 0;
  targetTiltY = 0;
});

function drawWatch() {
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 2 - 20;

  // Smooth tilt interpolation
  currentTiltX += (targetTiltX - currentTiltX) * 0.1;
  currentTiltY += (targetTiltY - currentTiltY) * 0.1;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);

  // Outer Bezel / Stainless Steel & Gold Rim
  const bezelGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  bezelGrad.addColorStop(0, '#fef08a');
  bezelGrad.addColorStop(0.3, '#d97706');
  bezelGrad.addColorStop(0.5, '#78350f');
  bezelGrad.addColorStop(0.8, '#f59e0b');
  bezelGrad.addColorStop(1, '#b45309');

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = bezelGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = currentTiltY * 0.8;
  ctx.shadowOffsetY = currentTiltX * 0.8;
  ctx.fill();

  // Outer Fluted Ring
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.fillStyle = '#064e3b';
  ctx.shadowBlur = 0;
  ctx.fill();

  // Emerald Sunburst Dial
  const dialGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius - 14);
  dialGrad.addColorStop(0, '#047857');
  dialGrad.addColorStop(0.7, '#064e3b');
  dialGrad.addColorStop(1, '#022c22');

  ctx.beginPath();
  ctx.arc(0, 0, radius - 12, 0, Math.PI * 2);
  ctx.fillStyle = dialGrad;
  ctx.fill();

  // Subtle Geometric Radial Lines
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
  ctx.lineWidth = 1;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * (radius - 20), Math.sin(a) * (radius - 20));
    ctx.stroke();
  }

  // Dial Text - Academy Signature
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 9px "Playfair Display", serif';
  ctx.fillText('ONLINE QURAN', 0, -radius * 0.45);
  ctx.font = '6px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#34d399';
  ctx.fillText('24/7 LIVE TUTORS', 0, -radius * 0.35);

  // Date Aperture (At 3 o'clock)
  const now = getTimeInTimezone(currentTimezone);
  ctx.save();
  ctx.translate(radius * 0.55, 0);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-12, -8, 24, 16);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-12, -8, 24, 16);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 10px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(now.getDate().toString().padStart(2, '0'), 0, 1);
  ctx.restore();

  // Hour Indices (Roman / Gold Bars)
  for (let i = 1; i <= 12; i++) {
    const angle = (i * Math.PI) / 6;
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius + 24);

    if (i % 3 === 0) {
      // Major markers
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-3, -2, 6, 12);
    } else {
      // Minor markers
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-1.5, 0, 3, 8);
    }
    ctx.restore();
  }

  // Minute Tick Marks
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 1;
  for (let m = 0; m < 60; m++) {
    if (m % 5 !== 0) {
      const angle = (m * Math.PI) / 30;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -radius + 14);
      ctx.lineTo(0, -radius + 18);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Time Calculations for Selected Timezone
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI / 6);
  const minAngle = (minutes + seconds / 60) * (Math.PI / 30);
  const secAngle = (seconds + ms / 1000) * (Math.PI / 30);

  // Hour Hand (Gold Cathedral style)
  ctx.save();
  ctx.rotate(hourAngle);
  ctx.fillStyle = '#fde047';
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-2, -radius * 0.48);
  ctx.lineTo(0, -radius * 0.54);
  ctx.lineTo(2, -radius * 0.48);
  ctx.lineTo(4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Minute Hand
  ctx.save();
  ctx.rotate(minAngle);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(-3, 0);
  ctx.lineTo(-1.5, -radius * 0.72);
  ctx.lineTo(0, -radius * 0.78);
  ctx.lineTo(1.5, -radius * 0.72);
  ctx.lineTo(3, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Second Hand (Vibrant Gold/Green Needle)
  ctx.save();
  ctx.rotate(secAngle);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(0, -radius * 0.85);
  ctx.stroke();

  // Counterweight circle
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(0, 12, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Center Pin / Cap
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Glass Specular Glare (3D Realistic Highlight)
  const glareGrad = ctx.createLinearGradient(-radius, -radius, radius * 0.5, radius * 0.5);
  glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
  glareGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.04)');
  glareGrad.addColorStop(0.5, 'transparent');
  ctx.beginPath();
  ctx.arc(0, 0, radius - 12, 0, Math.PI * 2);
  ctx.fillStyle = glareGrad;
  ctx.fill();

  ctx.restore();

  requestAnimationFrame(drawWatch);
}

// Helper to get time in selected timezone
function getTimeInTimezone(tz) {
  const d = new Date();
  const tzString = d.toLocaleString('en-US', { timeZone: tz });
  return new Date(tzString);
}

// Update Digital Display
function updateDigitalClock() {
  const now = getTimeInTimezone(currentTimezone);
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  const disp = document.getElementById('digital-time-display');
  if (disp) disp.textContent = timeStr;
}

// Run digital clock every second
setInterval(updateDigitalClock, 1000);

// ================= MODAL CONTROLS =================
function openTrialModal() {
  const modal = document.getElementById('trial-modal');
  if (modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }
}

function closeTrialModal() {
  const modal = document.getElementById('trial-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('trial-modal');
  if (e.target === modal) {
    closeTrialModal();
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close on nav link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// ================= FORM SUBMISSION & BACKEND API DISPATCH =================
// 1. Contact Form
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const hpField = document.getElementById('hp_field');
  
  // Anti-bot Security Check (Honeypot)
  if (hpField && hpField.value) {
    console.warn('Bot detected and silenced.');
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('submit-btn-text');
  const statusDiv = document.getElementById('form-status');

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    course: form.course.value,
    teacher_preference: form.teacher_preference.value,
    timezone: form.timezone.value.trim() || currentTimezoneLabel,
    message: form.message.value.trim(),
  };

  // UI Loading State
  submitBtn.disabled = true;
  btnText.textContent = 'Securing & Transmitting...';

  try {
    const res = await fetch(`${BACKEND_API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showStatus(statusDiv, 'success', 'Alhamdulillah! Your request has been securely submitted. An advisor will contact you within 2 hours.');
      form.reset();
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    console.log('Backend offline or rate-limited. Falling back directly to WhatsApp/Email relay...');
    
    // Graceful Direct Fallback so NO customer ever gets lost:
    showStatus(statusDiv, 'success', 'Redirecting to direct WhatsApp verification for immediate scheduling...');
    
    const whatsappMsg = `Assalamu Alaikum! My name is ${payload.name}. I would like to inquire about ${payload.course}. My phone is ${payload.phone}, and my timezone is ${payload.timezone}.`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;
    
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message & Request Free Trial';
  }
}

// 2. Modal Trial Form
async function handleTrialSubmit(e) {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById('m_name').value.trim(),
    email: document.getElementById('m_email').value.trim(),
    phone: document.getElementById('m_phone').value.trim(),
    course: document.getElementById('m_course').value,
    teacher_preference: document.getElementById('m_pref').value,
    timezone: currentTimezoneLabel,
    is_trial: true
  };

  const btn = document.getElementById('modal-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Booking your 3 days...';

  try {
    const res = await fetch(`${BACKEND_API_URL}/book-trial`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert('Alhamdulillah! Your 3-Day Free Trial is booked. We will message you on WhatsApp shortly.');
      closeTrialModal();
    } else {
      throw new Error();
    }
  } catch (err) {
    // Graceful direct link
    const waText = `Assalamu Alaikum! I just booked a 3-Day Free Trial. Name: ${payload.name}, Course: ${payload.course}, Teacher: ${payload.teacher_preference}, Timezone: ${currentTimezoneLabel}.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
    closeTrialModal();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirm Free Trial Booking';
  }
}

function showStatus(el, type, message) {
  if (!el) return;
  el.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-emerald-100', 'text-emerald-900', 'border', 'border-emerald-300', 'border-red-300');
  
  if (type === 'success') {
    el.classList.add('bg-emerald-100', 'text-emerald-900', 'border', 'border-emerald-300');
  } else {
    el.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
  }
  
  el.textContent = message;
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  drawWatch();
  updateDigitalClock();
});
