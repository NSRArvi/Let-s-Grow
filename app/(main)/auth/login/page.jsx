"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp, Shield, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/components/AuthProvider';
import toast from 'react-hot-toast';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Redirection is handled in the AuthProvider
    } catch (err) {
      if (err.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password.');
      } else {
        toast.error(err.message || 'Failed to sign in');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-xl w-full space-y-8 relative z-10 py-16 lg:py-24">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#2563EB] rounded-full p-4 shadow-[0_8px_16px_rgba(37,99,235,0.2)]">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">
            Let's Grow
          </h1>
          <p className="text-[#475569] text-lg font-medium">Digital Investment Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Welcome Back</h2>
            <p className="text-[#94A3B8]">Access your investment portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <div className="h-2 w-2 bg-[#2563EB] rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] pr-12 outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#94A3B8] hover:text-[#2563EB] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#94A3B8] hover:text-[#2563EB] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#E2E8F0] rounded bg-white"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#475569]">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forget-password" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-[#2563EB] hover:bg-[#1D4ED8] py-3.5 px-4 rounded-xl font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Accessing Portfolio...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-[#475569]">
              New to investing?{' '}
              <Link href="/auth/register" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <Shield className="h-6 w-6 text-[#2563EB] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm font-medium">Security</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <DollarSign className="h-6 w-6 text-[#10B981] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm font-medium">Guaranteed</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <TrendingUp className="h-6 w-6 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm font-medium">Growing</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[#94A3B8] text-sm font-medium">
            Powered by blockchain technology • Regulated & Insured
          </p>
        </div>
      </div>
    </div>
  );
}