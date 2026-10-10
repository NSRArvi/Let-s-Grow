"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, TrendingUp, Shield, DollarSign, Zap, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import toast from 'react-hot-toast';
import { useLanguage } from '@/app/components/context/LanguageContext';

export default function Page() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { register, supabase } = useAuth();
  const router = useRouter();
  const [referCode, setReferCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Password validation
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const isValidReferralFormat = (code) => {
    if (!code) return true; // It's optional
    return /^LGX-REF-[A-Z0-9]{6}$/i.test(code.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (referCode && !isValidReferralFormat(referCode)) {
      toast.error('Invalid referral code format. It should look like LGX-REF-XXXXXX');
      return;
    }
    
    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all requirements');
      return;
    }
    
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);

    if (referCode) {
      const { data: codeExists, error: rpcError } = await supabase.rpc('check_referral_code_exists', { code_to_check: referCode.trim().toUpperCase() });
      if (rpcError || !codeExists) {
        setIsLoading(false);
        toast.error("This referral code does not exist.");
        return;
      }
    }
    
    try {
      const data = await register(email, password, { 
        full_name: name, 
        refer_code: referCode ? referCode.trim().toUpperCase() : null 
      });
      
      if (data?.user?.identities?.length === 0) {
        toast.error('This email is already registered. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        toast.success('Registration successful! Redirecting to dashboard...');
        router.push('/dashboard/profile');
      } else {
        toast.success('Registration successful! Please check your email to verify your account.');
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
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
          <p className="text-[#475569] text-lg font-medium">{t('auth.tagline', 'Join the Future of Investing')}</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-[#E2E8F0]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">{t('auth.createAccount', 'Create Account')}</h2>
            <p className="text-[#94A3B8]">{t('auth.startJourney', 'Start your investment journey today')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                {t('auth.fullName', 'Full Name')}
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
                  placeholder={t('auth.enterFullName', 'Enter your full name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                {t('auth.emailAddress', 'Email Address')}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
                  placeholder={t('auth.enterEmail', 'Enter your email address')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Refer Code Input */}
            <div>
              <label htmlFor="referCode" className="block text-sm font-medium text-[#0F172A] mb-2">
                {t('auth.referralCode', 'Referral Code (Optional)')}
              </label>
              <div className="relative">
                <input
                  id="referCode"
                  type="text"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
                  placeholder={t('auth.enterReferral', 'Enter referral code')}
                  value={referCode}
                  onChange={(e) => setReferCode(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">
                {t('auth.password', 'Password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] pr-12 outline-none"
                  placeholder={t('auth.enterPassword', 'Create a strong password')}
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
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    {passwordRequirements.length ? (
                      <CheckCircle className="h-3 w-3 text-[#10B981] mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-[#EF4444] mr-1" />
                    )}
                    <span className={passwordRequirements.length ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                      {t('auth.atLeast8Chars', 'At least 8 characters')}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordRequirements.uppercase ? (
                      <CheckCircle className="h-3 w-3 text-[#10B981] mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-[#EF4444] mr-1" />
                    )}
                    <span className={passwordRequirements.uppercase ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                      {t('auth.oneUppercase', 'One uppercase letter')}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordRequirements.number ? (
                      <CheckCircle className="h-3 w-3 text-[#10B981] mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-[#EF4444] mr-1" />
                    )}
                    <span className={passwordRequirements.number ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                      {t('auth.oneNumber', 'One number')}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordRequirements.special ? (
                      <CheckCircle className="h-3 w-3 text-[#10B981] mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-[#EF4444] mr-1" />
                    )}
                    <span className={passwordRequirements.special ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                      {t('auth.oneSpecialChar', 'One special character')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A] mb-2">
                {t('auth.confirmPassword', 'Confirm Password')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] pr-12 outline-none"
                  placeholder={t('auth.reEnterPassword', 'Confirm your password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-[#94A3B8] hover:text-[#2563EB] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#94A3B8] hover:text-[#2563EB] transition-colors" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2">
                  <div className="flex items-center text-xs">
                    {passwordsMatch ? (
                      <CheckCircle className="h-3 w-3 text-[#10B981] mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-[#EF4444] mr-1" />
                    )}
                    <span className={passwordsMatch ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                      {passwordsMatch ? t('auth.passwordsMatch', 'Passwords match') : t('auth.passwordsDoNotMatch', 'Passwords do not match')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#E2E8F0] rounded bg-white"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#475569]">
                {t('auth.agreeTerms', 'I agree to the')}{' '}
                <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                  {t('auth.termsOfService', 'Terms of Service')}
                </a>{' '}
                {t('auth.and', 'and')}{' '}
                <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                  {t('auth.privacyPolicy', 'Privacy Policy')}
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch || !agreedToTerms}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t('auth.creatingAccount', 'Creating Account...')}
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  {t('auth.createAccount', 'Create Account')}
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-[#475569]">
              {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
              <Link href="/auth/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors">
                {t('auth.signInHere', 'Sign in here')}
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <Shield className="h-6 w-6 text-[#2563EB] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm font-medium">{t('auth.security', 'Security')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <DollarSign className="h-6 w-6 text-[#10B981] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm font-medium">{t('auth.guaranteed', 'Guaranteed')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
            <TrendingUp className="h-6 w-6 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-[#0F172A] text-sm font-medium">{t('auth.growing', 'Growing')}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[#94A3B8] text-sm font-medium">
            {t('auth.investorsCountBadge', 'Join 50,000+ investors • Regulated & Insured')}
          </p>
        </div>
      </div>
    </div>
  );
}