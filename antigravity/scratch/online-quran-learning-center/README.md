# Online Quran Learning Center - Complete Full-Stack Website (Ready to Publish)

A production-grade, publication-ready full-stack website for **Online Quran Learning Center**. Features a luxury UI with subtle Islamic geometry, an interactive 3D luxury timezone watch, a real-time multi-currency converter, and an isolated secure backend.

---

## 🕌 Institute Official Information & Direct Integrations
* **Academy Name:** Online Quran Learning Center
* **Official Email:** [onlinelearningqurancenter@gmail.com](mailto:onlinelearningqurancenter@gmail.com)
* **Official WhatsApp:** `03702861584` / `+923702861584` ([Open WhatsApp Chat](https://wa.me/923702861584))
* **Official Instagram:** Online Quran Learning Center
* **Official Tuition Plans (30 min / 24/7 Availability):**
  * 3 Days / Week: **$40 / month** (12 classes)
  * 4 Days / Week: **$50 / month** (16 classes)
  * 5 Days / Week: **$60 / month** (20 classes — *Best Value*)
  * 6 Days / Week: **$75 / month** (24 classes — *Hifz Memorization*)

---

## 📁 Architecture

```
online-quran-learning-center/
├── frontend/                     # Modern UI / UX Presentation Layer
│   ├── index.html                # 6 Dedicated Sections: Home, About Us, Courses, Pricing, 3D Watch, Contact Us
│   ├── styles.css                # Bespoke animations, luxury typography, arabesque patterns
│   └── app.js                    # 3D canvas watch engine, currency converter, course enroll handler, API sync
├── backend/                      # Node.js / Express Decoupled Security Server
│   ├── server.js                 # Serves frontend, handles /api/contact, rate limits, honeypot
│   ├── package.json              # Express, Helmet, CORS, Express-Rate-Limit, Nodemailer
│   └── .env.example              # Server environment variable template
├── api/                          # Serverless Cloud Functions (Zero-Config Vercel / Netlify)
│   ├── contact.js                # Serverless POST /api/contact endpoint with bot honeypot
│   └── book-trial.js             # Serverless POST /api/book-trial endpoint
├── package.json                  # Root deployment package for 1-click cloud hosting
├── vercel.json                   # Zero-config deployment file for Vercel
├── render.yaml                   # 1-click cloud deployment file for Render.com
└── README.md
```

---

## 🛡️ Enterprise Security Isolation (Backend Priority)
All security controls are managed entirely on the **Backend**:
1. **Zero Client Secrets:** No passwords, SMTP credentials, or keys are present in the frontend.
2. **Rate Limiting:** Protects endpoints against DDoS attacks and form-spamming bots (10 requests per 15 minutes per IP address).
3. **HTTP Security Headers (`helmet` & `vercel.json`):** Blocks clickjacking (`X-Frame-Options: DENY`), MIME sniffing (`X-Content-Type-Options: nosniff`), and XSS.
4. **Honeypot Filter (`_hp_security_check`):** Invisible honeypot traps and silently neutralizes bot submissions without disturbing human users.
5. **Input Sanitization (`validator`):** Strips HTML tags, script injections, and enforces valid email/phone formats.
6. **Graceful Failover:** If the backend is ever temporarily offline, client inquiries seamlessly route directly to pre-formatted WhatsApp and mailto links so you never lose a student.

---

## 🚀 How to Publish for Free (Zero Cost)

### Option A: Publish in 2 Minutes on Vercel (Recommended - 100% Free)
1. Push this folder to your GitHub account (or upload the zip).
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and click **Deploy**.
   * *The included `vercel.json` and `/api` folder will automatically configure both the frontend website and the serverless secure backend!*
4. Your website will be live immediately with free HTTPS (e.g. `https://your-center.vercel.app`) or your custom domain.

### Option B: Publish on Render.com (100% Free)
1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your repository.
3. Render will detect the included `render.yaml` and root `package.json`, install dependencies, and start `npm start`.
4. Your full-stack website will be published with a live backend and frontend simultaneously.

---

## 💻 Local Testing

* **Direct Frontend View:** You can double-click `frontend/index.html` to open and review the design in any browser immediately.
* **Full-Stack Server:** Run `npm start` in the project root to start the unified server on `http://localhost:5000`.
