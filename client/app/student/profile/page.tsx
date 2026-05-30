'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser } from '@/lib/utils';

export default function StudentProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    phone: '', branch: '', cgpa: '', skills: '',
    college: '', passoutYear: '', degree: '',
    about: '', linkedin: '', github: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResume, setExistingResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    setUser(u);
    fetchProfile();
  }, []);

  useEffect(() => {
    const fields = [profile.phone, profile.branch, profile.cgpa, profile.college, profile.passoutYear, profile.degree, profile.skills];
    const filled = fields.filter(f => f && String(f).trim() !== '').length;
    setCompletion(Math.round((filled / fields.length) * 100));
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      if (res.data.student) {
        const s = res.data.student;
        setProfile({
          phone: s.phone || '', branch: s.branch || '',
          cgpa: s.cgpa || '', skills: Array.isArray(s.skills) ? s.skills.join(', ') : '',
          college: s.college || '', passoutYear: s.passoutYear || '',
          degree: s.degree || '', about: s.about || '',
          linkedin: s.linkedin || '', github: s.github || '',
        });
        if (s.resume) setExistingResume(s.resume);
      }
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([k, v]) => formData.append(k, v));
      if (resumeFile) formData.append('resume', resumeFile);

      await api.post('/student/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Profile saved successfully!');
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Complete your profile to get better job matches</p>
        </div>

        {/* Completion bar */}
        <div className="card p-5 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-indigo-600">{completion}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completion}%`, background: completion === 100 ? '#16a34a' : '#4f46e5' }} />
          </div>
          {completion < 100 && (
            <p className="text-xs text-gray-400 mt-2">
              {completion < 50 ? '⚠️ Incomplete profile reduces job matches' : '✨ Almost there! Fill remaining fields'}
            </p>
          )}
          {completion === 100 && <p className="text-xs text-green-600 mt-2">✅ Profile complete!</p>}
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">✅ {success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Academic */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">🎓 Academic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'College / University *', name: 'college', placeholder: 'IIT Delhi' },
                { label: 'Degree *', name: 'degree', placeholder: 'B.Tech, MCA, MBA...' },
                { label: 'Branch *', name: 'branch', placeholder: 'Computer Science' },
                { label: 'Passout Year *', name: 'passoutYear', placeholder: '2025', type: 'number' },
                { label: 'CGPA *', name: 'cgpa', placeholder: '8.5', type: 'number' },
                { label: 'Phone *', name: 'phone', placeholder: '+91 9876543210', type: 'tel' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type || 'text'} name={f.name} value={(profile as any)[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">💡 Skills *</h2>
            <input type="text" name="skills" value={profile.skills} onChange={handleChange}
              placeholder="React, Node.js, Python, SQL, Java (comma separated)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
            {profile.skills && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.skills.split(',').filter(s => s.trim()).map((s, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">{s.trim()}</span>
                ))}
              </div>
            )}
          </div>

          {/* Resume Upload */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-2">📄 Resume / CV</h2>
            <p className="text-sm text-gray-500 mb-4">Upload your latest resume (PDF only, max 5MB)</p>

            {existingResume && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                  <a href={`http://localhost:5000${existingResume}`} target="_blank" rel="noreferrer"
                    className="text-xs text-green-600 hover:underline">View current resume →</a>
                </div>
              </div>
            )}

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
              <div className="text-center">
                <span className="text-3xl mb-2 block">📁</span>
                <p className="text-sm text-indigo-600 font-medium">
                  {resumeFile ? resumeFile.name : 'Click to upload PDF resume'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
              </div>
              <input type="file" accept=".pdf" className="hidden"
                onChange={e => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* About & Links */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">🔗 About & Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                <textarea name="about" value={profile.about} onChange={handleChange} rows={3}
                  placeholder="Tell companies about yourself..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm resize-none" />
              </div>
              {[
                { label: 'LinkedIn Profile', name: 'linkedin', placeholder: 'https://linkedin.com/in/yourname' },
                { label: 'GitHub Profile', name: 'github', placeholder: 'https://github.com/yourname' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type="url" name={f.name} value={(profile as any)[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 text-lg">
            {loading ? '⏳ Saving...' : '💾 Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
