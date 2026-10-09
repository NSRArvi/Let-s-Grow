'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-full border-3 border-[#2563EB] border-t-transparent animate-spin"></div>
        <span className="text-[#94A3B8] text-sm font-medium tracking-wide">
          Loading...
        </span>
      </div>
    );
  }

  // If user is not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If user is authenticated, render children
  return children;
}
