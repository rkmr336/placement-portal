'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser } from '@/lib/utils';

export default function CompanyProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    description: '', website: '', location: '',
    industry: '', size: '', phone: '', founded: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [existingLogo, setExistingLogo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Consulting', 'E-commerce', 'Media', 'Government', 'Other'];
  const SIZES = ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'];

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/auth/login'); return; }
    if (u.role !== 'company') { router.push('/company/dashboard'); return; }
    setUser(u);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/company/profile');
      if (res.data.company) {
        const c = res.data.company;
        setProfile({
          description: c.description || '', website: c.website || '',
          location: c.location || '', industry: c.industry || '',
          size: c.size || '', phone: c.phone || '', founded: c.founded || '',
        });
        if (c.logo) setExistingLogo(c.logo);
      }
    } catch (e) { console.error(e); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([k, v]) => formData.append(k, v));
      if (logoFile) formData.append('logo', logoFile);
      await api.post('/company/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Company profile saved!');
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  };

  const logoSrc = logoPreview || (existingLogo ? `http://localhost:5000${existingLogo}` : '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-gray-900">Company Profile</h1>
          <p className="text-gray-500 mt-1">Complete your profile to attract the best candidates</p>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">✅ {success}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Logo Upload */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">🏢 Company Logo</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-indigo-200 overflow-hidden flex items-center justify-center bg-indigo-50">
                {logoSrc ? (
                  <img src={logoSrc} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{user?.name?.charAt(0) || '🏢'}</span>
                )}
              </div>
              <div>
                <label className="btn-primary cursor-pointer text-sm px-4 py-2 inline-block">
                  Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG — max 2MB</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg text-gray-800 mb-4">📋 Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Description *</label>
                <textarea name="description" value={profile.description} onChange={handleChange} rows={4}
                  placeholder="Tell students about your company, culture, and what makes you unique..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm resize-none" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
                  <select name="industry" value={profile.industry} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" required>
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <select name="size" value={profile.size} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm">
                    <option value="">Select Size</option>
                    {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input type="text" name="location" value={profile.location} onChange={handleChange}
                    placeholder="Mumbai, Delhi, Bangalore..." required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                  <input type="number" name="founded" value={profile.founded} onChange={handleChange}
                    placeholder="2010"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" name="website" value={profile.website} onChange={handleChange}
                    placeholder="https://yourcompany.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HR Phone</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 text-lg">
            {loading ? '⏳ Saving...' : '💾 Save Company Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
