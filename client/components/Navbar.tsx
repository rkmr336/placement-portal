'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout, getUser } from '@/lib/utils';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true;
    setDark(isDark);
    applyTheme(isDark);
  }, [pathname]);

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg', '#04030a');
      root.style.setProperty('--surface', '#0d0b1a');
      root.style.setProperty('--surface2', '#131024');
      root.style.setProperty('--border', 'rgba(255,255,255,0.07)');
      root.style.setProperty('--text', '#f0eeff');
      root.style.setProperty('--muted', 'rgba(240,238,255,0.45)');
      root.style.setProperty('--brand', '#7c5cfc');
      document.body.style.background = '#04030a';
      document.body.style.color = '#f0eeff';
    } else {
      root.style.setProperty('--bg', '#f5f4ff');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface2', '#f0eeff');
      root.style.setProperty('--border', 'rgba(0,0,0,0.08)');
      root.style.setProperty('--text', '#1a1035');
      root.style.setProperty('--muted', 'rgba(26,16,53,0.5)');
      root.style.setProperty('--brand', '#6d42f5');
      document.body.style.background = '#f5f4ff';
      document.body.style.color = '#1a1035';
    }
  };

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    applyTheme(newDark);
  };

  const handleLogout = () => { logout(); setUser(null); router.push('/'); };
  const isActive = (href: string) => pathname === href;

  if (pathname === '/') return null;

  const linkStyle = (href: string): React.CSSProperties => ({
    fontSize: 14, fontWeight: 500, textDecoration: 'none', padding: '6px 14px', borderRadius: 10, transition: 'all 0.2s',
    color: isActive(href) ? 'white' : 'var(--muted)',
    background: isActive(href) ? 'rgba(124,92,252,0.2)' : 'transparent',
  });

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 64, background: dark ? 'rgba(4,3,10,0.85)' : 'rgba(245,244,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>

      {/* Logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7c5cfc,#fc5c7d)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span style={{ fontFamily: "'Cabinet Grotesk'", fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.04em' }}>PlaceHub</span>
      </a>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {user?.role === 'student' && (
          <>
            <a href="/student/dashboard" style={linkStyle('/student/dashboard')}>Browse Jobs</a>
            <a href="/student/applications" style={linkStyle('/student/applications')}>Applications</a>
            <a href="/student/profile" style={linkStyle('/student/profile')}>Profile</a>
          </>
        )}
        {user?.role === 'company' && (
          <>
            <a href="/company/dashboard" style={linkStyle('/company/dashboard')}>Dashboard</a>
            <a href="/company/post-job" style={linkStyle('/company/post-job')}>Post Job</a>
            <a href="/company/profile" style={linkStyle('/company/profile')}>Company Profile</a>
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Dark/Light Toggle */}
        <button onClick={toggleTheme} title={dark ? 'Switch to Light' : 'Switch to Dark'}
          style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--border)', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all 0.2s' }}>
          {dark ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c5cfc,#fc5c7d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cabinet Grotesk'", fontWeight: 800, fontSize: 14, color: 'white' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{user.name}</span>
            </div>
            <button onClick={handleLogout}
              style={{ fontSize: 13, color: '#fc5c7d', background: 'rgba(252,92,125,0.1)', border: '1px solid rgba(252,92,125,0.2)', padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/auth/login" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>Login</a>
            <a href="/auth/register" className="btn-primary" style={{ fontSize: 13, padding: '8px 18px', textDecoration: 'none', display: 'inline-block' }}>Register</a>
          </>
        )}
      </div>
    </nav>
  );
}
