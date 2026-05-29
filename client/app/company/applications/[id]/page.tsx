'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser, statusColor } from '@/lib/utils';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Selected', 'Rejected'];

export default function CompanyApplications({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [jobRes, appRes] = await Promise.all([
        api.get(`/jobs/${params.id}`),
        api.get(`/jobs/${params.id}/applications`),
      ]);
      setJobTitle(jobRes.data.job?.title || 'Job');
      setApplications(appRes.data.applications || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (appId: string, status: string) => {
    setUpdating(appId);
    try {
      await api.put(`/applications/status/${appId}`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      if (selectedApp?._id === appId) setSelectedApp((p: any) => ({ ...p, status }));
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setUpdating(null); }
  };

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);
  const counts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: applications.filter(a => a.status === s).length }), {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <a href="/company/dashboard" className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1 mb-6">← Back</a>

        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-gray-900">{jobTitle}</h1>
          <p className="text-gray-500 mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''} received</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === 'All' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            All ({applications.length})
          </button>
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="card p-6 animate-pulse h-20" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 card">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="font-semibold text-gray-700">No {filter === 'All' ? '' : filter} applications</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app: any) => (
              <div key={app._id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl flex-shrink-0">
                    {app.student?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{app.student?.name}</h3>
                    <p className="text-sm text-gray-500">{app.student?.email}</p>
                    <div className="flex gap-3 mt-1">
                      {app.resumeAtApply && (
                        <a href={`http://localhost:5000${app.resumeAtApply}`} target="_blank" rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline">📋 View Resume</a>
                      )}
                      {app.coverLetter && (
                        <button onClick={() => setSelectedApp(app)}
                          className="text-xs text-purple-600 hover:underline">📝 Read Cover Letter</button>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(app.status)}`}>{app.status}</span>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.filter(s => s !== app.status).map(s => (
                      <button key={s} onClick={() => updateStatus(app._id, s)} disabled={updating === app._id}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition disabled:opacity-50 ${
                          s === 'Selected' ? 'bg-green-50 text-green-700 border-green-200' :
                          s === 'Shortlisted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          s === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {updating === app._id ? '...' : s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cover Letter Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display font-bold text-xl">Cover Letter</h2>
                <p className="text-gray-500 text-sm">{selectedApp.student?.name}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto mb-4">
              {selectedApp.coverLetter || 'No cover letter provided'}
            </div>
            {selectedApp.resumeAtApply && (
              <a href={`http://localhost:5000${selectedApp.resumeAtApply}`} target="_blank" rel="noreferrer"
                className="block text-center text-sm text-indigo-600 hover:underline mb-4">📋 View Resume →</a>
            )}
            <div className="flex gap-2">
              {STATUS_OPTIONS.filter(s => s !== selectedApp.status).map(s => (
                <button key={s} onClick={() => updateStatus(selectedApp._id, s)} disabled={updating === selectedApp._id}
                  className={`flex-1 text-xs py-2 rounded-lg font-medium border ${
                    s === 'Selected' ? 'bg-green-50 text-green-700 border-green-200' :
                    s === 'Shortlisted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    s === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
