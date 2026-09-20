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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div> */}

      <div className="max-w-xl w-full space-y-8 relative z-10 py-16 lg:py-24">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-4 shadow-2xl shadow-emerald-500/25">
              <TrendingUp className="h-10 w-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">
            Let's Grow
          </h1>
          <p className="text-gray-300 text-lg font-medium">Digital Investment Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-emerald-500/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Access your investment portfolio</p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-emerald-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-500 backdrop-blur-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-500 pr-12 backdrop-blur-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-emerald-400 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-emerald-400 transition-colors" />
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
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-600 rounded bg-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forget-password" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full text-white bg-gradient-to-r from-emerald-600 to-green-600 py-3 px-4 rounded-lg font-bold hover:from-emerald-500 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Accessing Portfolio...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              New to investing?{' '}
              <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/20">
            <Shield className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Security</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/20">
            <DollarSign className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Gurranted</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Growing</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Powered by blockchain technology • Regulated & Insured
          </p>
        </div>
      </div>
    </div>
  );
}