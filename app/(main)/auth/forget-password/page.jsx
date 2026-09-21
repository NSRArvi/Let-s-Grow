'use client'
import { useState, useEffect } from 'react'
import { Mail, ShieldCheck, Lock, Clock, RefreshCw } from 'lucide-react'

export default function ForgetPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [timer, setTimer] = useState(180) // 3 minutes

  const handleNext = () => {
    if (step === 1) {
      // TODO: Add API check for email
      setStep(2)
      setTimer(180) // Start timer again
    } else if (step === 2) {
      // TODO: Add OTP verification logic
      setStep(3)
    } else if (step === 3) {
      if (password === confirmPassword) {
        // TODO: Add password reset API
        alert('Password successfully reset!')
      } else {
        alert('Passwords do not match.')
      }
    }
  }

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-4">
          <div className="mb-4">
            {step === 1 && <Mail className="h-10 w-10 text-[#2563EB] mx-auto" />}
            {step === 2 && <ShieldCheck className="h-10 w-10 text-[#10B981] mx-auto" />}
            {step === 3 && <Lock className="h-10 w-10 text-[#2563EB] mx-auto" />}
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">
            {step === 1 && 'Find Your Account'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Reset Password'}
          </h2>
          <p className="text-[#475569] mt-1 font-medium">
            {step === 1 && 'Enter your registered email to reset your password.'}
            {step === 2 && 'We’ve sent a code to your email. Enter it below.'}
            {step === 3 && 'Set a new secure password for your account.'}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">OTP Code</label>
              <input
                type="text"
                maxLength={6}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none text-center font-mono tracking-widest text-lg"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="text-sm text-[#475569] flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#F59E0B]" />
                <span>Resend in: {formatTimer()}</span>
              </div>
              <button
                disabled={timer > 0}
                className={`flex items-center gap-1 ${
                  timer > 0 ? 'text-[#94A3B8]' : 'text-[#2563EB] hover:text-[#1D4ED8]'
                } font-medium transition-colors`}
              >
                <RefreshCw className="h-4 w-4" />
                Resend
              </button>
            </div>
          </>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
                placeholder="New secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200 text-[#0F172A] placeholder-[#94A3B8] outline-none"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Next / Submit Button */}
        <button
          onClick={handleNext}
          className="w-full bg-[#2563EB] text-white font-bold py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
        >
          {step === 1 && 'Search Account'}
          {step === 2 && 'Verify OTP'}
          {step === 3 && 'Reset Password'}
        </button>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-6 rounded-full transition-all ${
                step >= s ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
