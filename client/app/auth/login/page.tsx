'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push(res.data.user.role === 'student' ? '/student/dashboard' : '/company/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Orbs */}
      <div className="orb" style={{ width: 400, height: 400, background: '#7c5cfc', top: -100, left: -100 }} />
      <div className="orb" style={{ width: 300, height: 300, background: '#fc5c7d', bottom: -50, right: -50 }} />

      <div className="animate-fadeup" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 5 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#7c5cfc,#fc5c7d)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Cabinet Grotesk'", fontWeight: 800, fontSize: 22, color: 'var(--text)', letterSpacing: '-0.04em' }}>PlaceHub</span>
          </a>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Welcome back! Sign in to continue</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {['student', 'company'].map(r => (
              <button key={r} type="button" onClick={() => setFormData(p => ({ ...p, role: r }))}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Cabinet Grotesk'", fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                  background: formData.role === r ? 'linear-gradient(135deg,#7c5cfc,#9b6dff)' : 'transparent',
                  color: formData.role === r ? 'white' : 'var(--muted)',
                }}>
                {r === 'student' ? '🎓 Student' : '🏢 Company'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(252,92,125,0.1)', border: '1px solid rgba(252,92,125,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#fc5c7d' }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required className="input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••" required className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8, fontSize: 15, padding: '14px' }}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            No account?{' '}
            <a href="/auth/register" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Create one free</a>
          </p>
        </div>
      </div>
    </div>
  );
}
