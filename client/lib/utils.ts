export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const statusColor = (status: string) => {
  switch (status) {
    case 'Applied': return 'bg-blue-100 text-blue-800';
    case 'Shortlisted': return 'bg-yellow-100 text-yellow-800';
    case 'Selected': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatSalary = (sal: number) => {
  if (!sal) return 'Not disclosed';
  if (sal >= 100000) return `₹${(sal / 100000).toFixed(1)} LPA`;
  return `₹${sal.toLocaleString()}`;
};
