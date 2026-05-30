'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatSalary } from '@/lib/utils';

export default function JobCard({ job, showApply = true }: { job: any; showApply?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await api.post(`/applications/apply/${job._id}`, {});
      setApplied(true);
      setTimeout(() => router.push('/student/applications'), 1000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  return (
    <div
      className="card p-5 cursor-pointer group animate-fade-in"
      onClick={() => router.push(`/jobs/${job._id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
            {job.company?.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500">{job.company?.name}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{timeAgo(job.createdAt)}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-3">
        {job.location && (
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg font-medium">
            {formatSalary(job.salary)}
          </span>
        )}
        {job.eligibility?.minCGPA && (
          <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
            CGPA ≥ {job.eligibility.minCGPA}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* Skills */}
      {job.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skillsRequired.slice(0, 4).map((skill: string, idx: number) => (
            <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">+{job.skillsRequired.length - 4} more</span>
          )}
        </div>
      )}

      {/* Apply Button */}
      {showApply && (
        <button
          onClick={handleApply}
          disabled={loading || applied}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            applied
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
          } disabled:opacity-70`}
        >
          {applied ? '✓ Applied!' : loading ? 'Applying...' : 'Apply Now'}
        </button>
      )}
    </div>
  );
}
