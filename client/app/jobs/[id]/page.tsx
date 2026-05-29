'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser, formatSalary } from '@/lib/utils';

export default function JobDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [eligibilityError, setEligibilityError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const u = getUser();
    setUser(u);
    fetchJob();
    if (u?.role === 'student') fetchStudentProfile();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${params.id}`);
      setJob(res.data.job);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      setStudentProfile(res.data.student);
    } catch (e) { console.error(e); }
  };

  const checkEligibility = () => {
    if (!job?.eligibility) return true;
    const errors = [];

    if (job.eligibility.minCGPA && studentProfile?.cgpa) {
      if (parseFloat(studentProfile.cgpa) < job.eligibility.minCGPA) {
        errors.push(`Min CGPA required: ${job.eligibility.minCGPA} (Your CGPA: ${studentProfile.cgpa})`);
      }
    }
    if (job.eligibility.branch && studentProfile?.branch) {
      const eligible = job.eligibility.branch.toLowerCase().split(',').map((b: string) => b.trim());
      const match = eligible.some((b: string) => studentProfile.branch.toLowerCase().includes(b));
      if (!match) errors.push(`Branch not eligible (Required: ${job.eligibility.branch})`);
    }

    if (errors.length > 0) { setEligibilityError(errors.join(' | ')); return false; }
    return true;
  };

  const handleApplyClick = () => {
    if (!user) { router.push('/auth/login'); return; }
    setEligibilityError(''); setApplyError('');
    if (!checkEligibility()) return;
    if (!studentProfile?.resume) {
      setApplyError('Please upload your resume in Profile before applying');
      return;
    }
    setShowModal(true);
  };

  const handleApply = async () => {
    setApplying(true); setApplyError('');
    try {
      await api.post(`/applications/apply/${params.id}`, { coverLetter });
      setApplied(true);
      setShowModal(false);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4">❌</div>
        <h2 className="font-bold text-xl">Job not found</h2>
        <a href="/student/dashboard" className="btn-primary mt-4 inline-block">Browse Jobs</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1 mb-6">
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 flex-shrink-0">
                  {job.company?.name?.charAt(0)}
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-gray-900">{job.title}</h1>
                  <p className="text-gray-600 font-medium">{job.company?.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.location && <span className="text-sm bg-gray-50 px-3 py-1.5 rounded-xl text-gray-600">📍 {job.location}</span>}
                {job.salary && <span className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-xl font-medium">💰 {formatSalary(job.salary)}</span>}
                <span className="text-sm bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl">
                  📅 {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-3">Job Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-semibold text-lg mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((s: string, i: number) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply card */}
            {user?.role === 'student' && (
              <div className="card p-6 sticky top-20">
                {applied ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
                    ✅ Applied successfully!
                  </div>
                ) : (
                  <>
                    {eligibilityError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs mb-3">
                        ❌ {eligibilityError}
                      </div>
                    )}
                    {applyError && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl text-xs mb-3">
                        ⚠️ {applyError}
                        {!studentProfile?.resume && (
                          <a href="/student/profile" className="block mt-1 underline font-medium">Go to Profile →</a>
                        )}
                      </div>
                    )}
                    <button onClick={handleApplyClick} className="w-full btn-primary py-3.5 text-base">
                      Apply Now
                    </button>
                  </>
                )}
                <a href="/student/applications" className="block text-center text-sm text-indigo-500 hover:text-indigo-700 mt-3">
                  My Applications →
                </a>
              </div>
            )}

            {/* Eligibility */}
            {(job.eligibility?.minCGPA || job.eligibility?.branch) && (
              <div className="card p-6">
                <h3 className="font-display font-semibold text-gray-800 mb-3">📋 Eligibility</h3>
                {job.eligibility.minCGPA && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Min. CGPA</span>
                    <span className={`text-sm font-bold ${studentProfile?.cgpa && parseFloat(studentProfile.cgpa) >= job.eligibility.minCGPA ? 'text-green-600' : 'text-gray-800'}`}>
                      {job.eligibility.minCGPA}
                      {studentProfile?.cgpa && ` (Yours: ${studentProfile.cgpa})`}
                    </span>
                  </div>
                )}
                {job.eligibility.branch && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">Branch</span>
                    <span className="text-sm font-bold text-gray-800">{job.eligibility.branch}</span>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-500 mb-3">Login to apply</p>
                <a href="/auth/login" className="btn-primary inline-block w-full">Login to Apply</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal with Cover Letter */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-slide-up">
            <h2 className="font-display font-bold text-xl text-gray-900 mb-1">Apply for {job.title}</h2>
            <p className="text-gray-500 text-sm mb-5">at {job.company?.name}</p>

            {/* Resume check */}
            {studentProfile?.resume && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="text-sm font-medium text-green-800">Resume attached</p>
                  <p className="text-xs text-green-600">{studentProfile.resumeOriginalName || 'Your uploaded resume'}</p>
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cover Letter <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={5}
                placeholder={`Dear Hiring Manager,\n\nI am excited to apply for the ${job.title} position at ${job.company?.name}...\n\nThank you for your consideration.`}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{coverLetter.length} characters</p>
            </div>

            {applyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm mb-4">❌ {applyError}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="btn-primary flex-1 py-3">
                {applying ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
