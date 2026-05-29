'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser, formatSalary } from '@/lib/utils';

export default function StudentDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    if (u.role !== 'student') { router.push('/company/dashboard'); return; }
    setUser(u);
    api.get('/jobs/all').then(r => { setJobs(r.data.jobs); setFiltered(r.data.jobs); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = jobs;
    if (search) r = r.filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.name?.toLowerCase().includes(search.toLowerCase()) || j.skillsRequired?.some((s: string) => s.toLowerCase().includes(search.toLowerCase())));
    if (location) r = r.filter(j => j.location?.toLowerCase().includes(location.toLowerCase()));
    setFiltered(r);
  }, [search, location, jobs]);

  const timeAgo = (d: string) => { const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`; };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div className="animate-fadeup" style={{ marginBottom: 32 }}>
          <p style={{ color: '#7c5cfc', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Student Dashboard</p>
          <h1 style={{ fontFamily: "'Cabinet Grotesk'", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>
            Hey {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>{filtered.length} jobs available for you</p>
        </div>

        {/* Search */}
        <div className="animate-fadeup-2" style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, companies, skills..."
              className="input" style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ position: 'relative', minWidth: 180 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📍</span>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location..."
              className="input" style={{ paddingLeft: 40 }} />
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card" style={{ padding: 24, opacity: 0.5 }}>
                <div style={{ height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 12, width: '60%' }} />
                <div style={{ height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 6, width: '80%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Cabinet Grotesk'", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No jobs found</h3>
            <p style={{ color: 'var(--muted)' }}>Try different search terms</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {filtered.map((job: any) => (
              <div key={job._id} className="card" style={{ padding: 24, cursor: 'pointer' }} onClick={() => router.push(`/jobs/${job._id}`)}>
                {/* Company */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(124,92,252,0.3), rgba(252,92,125,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cabinet Grotesk'", fontWeight: 900, fontSize: 18, color: '#a78bfa' }}>
                      {job.company?.name?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Cabinet Grotesk'", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{job.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{job.company?.name}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 8 }}>{timeAgo(job.createdAt)}</span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {job.location && <span style={{ fontSize: 11, color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 20 }}>📍 {job.location}</span>}
                  {job.salary && <span style={{ fontSize: 11, color: '#43e97b', background: 'rgba(67,233,123,0.1)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>💰 {formatSalary(job.salary)}</span>}
                  {job.eligibility?.minCGPA && <span style={{ fontSize: 11, color: '#a78bfa', background: 'rgba(124,92,252,0.1)', padding: '4px 10px', borderRadius: 20 }}>CGPA {job.eligibility.minCGPA}+</span>}
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>

                {/* Skills */}
                {job.skillsRequired?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {job.skillsRequired.slice(0, 4).map((s: string, i: number) => (
                      <span key={i} style={{ fontSize: 11, color: '#a78bfa', background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.15)', padding: '3px 10px', borderRadius: 20 }}>{s}</span>
                    ))}
                    {job.skillsRequired.length > 4 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>+{job.skillsRequired.length - 4}</span>}
                  </div>
                )}

                <button onClick={e => { e.stopPropagation(); router.push(`/jobs/${job._id}`); }}
                  className="btn-primary" style={{ width: '100%', fontSize: 13, padding: '10px' }}>
                  View & Apply →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
