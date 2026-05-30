'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser } from '@/lib/utils';

export default function PostJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    skillsRequired: '',
    minCGPA: '',
    branch: '',
    jobType: 'Full-time',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    if (u.role !== 'company') { router.push('/company/dashboard'); return; }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/jobs/create', {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary: parseFloat(formData.salary) || undefined,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
        eligibility: {
          minCGPA: parseFloat(formData.minCGPA) || undefined,
          branch: formData.branch || undefined,
        },
      });
      router.push('/company/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <a href="/company/dashboard" className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
          <h1 className="font-display font-bold text-3xl text-gray-900">Post a New Job</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to attract the right candidates</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6 space-y-5">
            <h2 className="font-display font-semibold text-lg text-gray-800">Job Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Software Development Engineer"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Bangalore / Remote"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Salary (₹)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="700000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Skills</label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="React, Node.js, Python, SQL (comma separated)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
              />
              {formData.skillsRequired && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.skillsRequired.split(',').filter(s => s.trim()).map((s, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Eligibility */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg text-gray-800">Eligibility Criteria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum CGPA</label>
                <input
                  type="number"
                  name="minCGPA"
                  value={formData.minCGPA}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="e.g. 7.0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Eligible Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="CSE, IT, ECE (or leave blank for all)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.title && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Preview</p>
              <h3 className="font-semibold text-gray-900">{formData.title}</h3>
              {(formData.location || formData.salary) && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {formData.location}{formData.location && formData.salary && ' · '}
                  {formData.salary && `₹${parseInt(formData.salary).toLocaleString()}/yr`}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <a href="/company/dashboard" className="btn-secondary flex-1 text-center">Cancel</a>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? 'Posting...' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
