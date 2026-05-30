'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser, formatSalary } from '@/lib/utils';

export default function CompanyDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    if (u.role !== 'company') { router.push('/student/dashboard'); return; }
    setUser(u);
    api.get('/jobs/all').then(r => {
      const mine = r.data.jobs.filter((j: any) => j.company?._id === u.id || j.company?.id === u.id);
      setJobs(mine);
    }).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    setDeleting(id);
    try { await api.delete(`/jobs/${id}`); setJobs(p => p.filter(j => j._id !== id)); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div className="animate-fadeup" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: '#7c5cfc', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Company Dashboard</p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk'", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>{user?.name} 🏢</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage your job postings and applications</p>
          </div>
          <a href="/company/post-job" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            ＋ Post New Job
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fadeup-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Active Jobs', value: jobs.length, color: '#7c5cfc', icon: '💼' },
            { label: 'Total Applications', value: jobs.reduce((a, j) => a + (j.applicationCount || 0), 0), color: '#fc5c7d', icon: '📋' },
            { label: 'Account Status', value: 'Active ✓', color: '#43e97b', icon: '✅' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Cabinet Grotesk'", fontSize: 32, fontWeight: 900, color: s.color, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Jobs */}
        <h2 style={{ fontFamily: "'Cabinet Grotesk'", fontSize: 22, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>Your Job Postings</h2>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2].map(i => <div key={i} className="card" style={{ padding: 24, height: 100, opacity: 0.4 }} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
            <h3 style={{ fontFamily: "'Cabinet Grotesk'", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>No jobs posted yet</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Post your first job to start receiving applications</p>
            <a href="/company/post-job" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Post Your First Job</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {jobs.map((job: any) => (
              <div key={job._id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(124,92,252,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cabinet Grotesk'", fontWeight: 900, fontSize: 20, color: '#a78bfa' }}>
                      {job.title?.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Cabinet Grotesk'", fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{job.title}</h3>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {job.location && <span style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {job.location}</span>}
                        {job.salary && <span style={{ fontSize: 12, color: '#43e97b', fontWeight: 600 }}>💰 {formatSalary(job.salary)}</span>}
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>📅 {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <a href={`/company/applications/${job._id}`}
                      style={{ fontSize: 13, color: '#a78bfa', background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)', padding: '8px 16px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>
                      View Applications
                    </a>
                    <button onClick={() => handleDelete(job._id)} disabled={deleting === job._id}
                      style={{ fontSize: 13, color: '#fc5c7d', background: 'rgba(252,92,125,0.1)', border: '1px solid rgba(252,92,125,0.2)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
                      {deleting === job._id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
