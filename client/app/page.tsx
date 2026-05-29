'use client';

import Link from 'next/link';
import styles from './home.module.css';

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'TCS', 'Infosys', 'Wipro', 'Zomato', 'Flipkart', 'Swiggy',
  'Razorpay', 'CRED', 'PhonePe', 'Meesho', 'Paytm', 'Ola',
];

const STATS = [
  { icon: '🎓', num: '500+', label: 'Students Placed' },
  { icon: '🏢', num: '100+', label: 'Partner Companies' },
  { icon: '📈', num: '95%', label: 'Placement Rate' },
];

const FEATURES = [
  { icon: '🔍', color: '#ede9ff', title: 'Smart Job Search', desc: 'Filter jobs by skills, location, salary, and eligibility. Find the perfect match instantly.' },
  { icon: '📄', color: '#fce7f3', title: 'Resume Builder', desc: 'Upload your CV and let AI analyze your profile for the best job recommendations.' },
  { icon: '🏢', color: '#ecfdf5', title: 'Top Companies', desc: 'Connect directly with recruiters from Google, Microsoft, Amazon and 100+ more.' },
  { icon: '📊', color: '#fff7ed', title: 'Application Tracker', desc: 'Track every application — Applied, Shortlisted, Selected, or Rejected in real-time.' },
  { icon: '🛡️', color: '#eff6ff', title: 'Eligibility Check', desc: 'Automatic CGPA and branch eligibility check before you apply — no surprises.' },
  { icon: '⚡', color: '#fefce8', title: 'Instant Notifications', desc: 'Get notified the moment your application status changes. Never miss an update.' },
];

export default function Home() {
  const ticker = [...COMPANIES, ...COMPANIES];

  return (
    <div className={styles.hw}>
      {/* Navbar */}
      <nav className={styles.hn}>
        <a href="/" className={styles.hl}>
          <div className={styles.hli}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className={styles.hlt}>PlaceHub</span>
        </a>
        <div className={styles.hnl}>
          <a href="/auth/login" className={styles.hbg}>Sign In</a>
          <a href="/auth/register" className={styles.hbc}>Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.hbadge}>
          <div className={styles.hbdot} />
          <span className={styles.hbtxt}>Placement Season 2026–27 is Live</span>
        </div>
        <h1 className={styles.htitle}>
          Land Your<br />
          <span className={styles.hgrad}>Dream Job</span><br />
          This Season
        </h1>
        <p className={styles.hsub}>
          Connect with top companies, track applications, and get placed — all in one powerful portal.
        </p>
        <div className={styles.hbtns}>
          <a href="/auth/register" className={styles.hbp}>Start for Free →</a>
          <a href="/auth/login" className={styles.hbs}>Sign In</a>
        </div>
      </div>

      {/* Ticker */}
      <div className={styles.tw}>
        <div className={styles.tt}>
          {ticker.map((name, i) => (
            <div key={i} className={styles.ti}>
              {i > 0 && <span className={styles.td} />}
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.sg}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.sc}>
            <div className={styles.si}>{s.icon}</div>
            <div className={styles.sn}>{s.num}</div>
            <div className={styles.sl}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className={styles.fs}>
        <h2 className={styles.ftitle}>Everything You Need to Get Placed</h2>
        <p className={styles.fsub}>From profile building to final offer — we have got you covered.</p>
        <div className={styles.fg}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.fc}>
              <div className={styles.fiw} style={{ background: f.color }}>{f.icon}</div>
              <div className={styles.fct}>{f.title}</div>
              <div className={styles.fcd}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cs}>
        <div className={styles.csb}>
          <div className={styles.cst}>Ready to Get Placed?</div>
          <div className={styles.css}>Join thousands of students who landed their dream jobs through PlaceHub.</div>
          <a href="/auth/register" className={styles.csbt}>Create Free Account →</a>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.hf}>
        © 2026 PlaceHub · Built by student, built for students
      </div>
    </div>
  );
}
