'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser, statusColor, formatSalary } from '@/lib/utils';

export default function StudentApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(prev => prev.filter((app: any) => app._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  const statusCounts = {
    Applied: applications.filter(a => a.status === 'Applied').length,
    Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <p className="text-indigo-500 font-medium text-sm mb-1">My Applications</p>
          <h1 className="font-display font-bold text-3xl text-gray-900">Application Tracker</h1>
          <p className="text-gray-500 mt-1">Track all your job applications in one place</p>
        </div>

        {/* Status summary */}
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="card p-4 text-center">
                <p className="text-2xl font-display font-bold text-gray-900">{count}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(status)}`}>{status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Applications list */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display font-semibold text-lg text-gray-700 mb-2">No applications yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start applying to jobs to track them here</p>
            <a href="/student/dashboard" className="btn-primary inline-block">Browse Jobs</a>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <div key={app._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Company avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
                  {app.job?.title?.charAt(0) || 'J'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-gray-900 truncate">{app.job?.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    {app.job?.location && (
                      <span className="text-xs text-gray-500">{app.job.location}</span>
                    )}
                    {app.job?.salary && (
                      <span className="text-xs text-green-700">{formatSalary(app.job.salary)}</span>
                    )}
                    <span className="text-xs text-gray-400">
                      Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Status & action */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                  {app.status === 'Applied' && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:underline"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
