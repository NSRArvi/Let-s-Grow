"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, Play, Shield, DollarSign, Users, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { value: '$2.5B+', label: 'Total Investment' },
    { value: '1M+', label: 'Active Investors' },
    { value: '89%', label: 'Success Rate' },
    { value: '24/7', label: 'AI Monitoring' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-tr from-[#F8FAFC] via-white to-[#F1F5F9] relative overflow-hidden flex items-center pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-float hidden lg:block">
          <div className="bg-white rounded-full p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E2E8F0]">
            <TrendingUp className="h-8 w-8 text-[#2563EB]" />
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-float delay-1000 hidden lg:block">
          <div className="bg-white rounded-full p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E2E8F0]">
            <Shield className="h-8 w-8 text-[#10B981]" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-100">
              <Star className="h-4 w-4 text-[#2563EB]" />
              <span className="text-[#2563EB] text-sm font-bold">#1 Digital Investment Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-[#0F172A]">
                Grow Your
                <br />
                <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
                  Digital Wealth
                </span>
              </h1>
              <p className="text-xl text-[#475569] max-w-xl leading-relaxed">
                Invest in the future with AI-powered insights, blockchain security, and real-time market analysis. Start building your portfolio today.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register"
                className="group bg-[#2563EB] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-200 shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center justify-center space-x-2"
              >
                <span>Start Investing</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group bg-white text-[#0F172A] px-8 py-4 rounded-xl font-bold border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm">
                <Play className="h-5 w-5 text-[#2563EB]" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981]">A+</div>
                <div className="text-sm font-medium text-[#475569]">Security Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2563EB]">$0</div>
                <div className="text-sm font-medium text-[#475569]">Minimum Investment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F59E0B]">24/7</div>
                <div className="text-sm font-medium text-[#475569]">AI Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats & Features */}
          <div className={`space-y-6 ${isVisible ? 'animate-fadeInUp delay-300' : 'opacity-0'}`}>
            {/* Dynamic Stats Card */}
            <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
                  {stats[currentStat].value}
                </div>
                <div className="text-[#0F172A] text-lg font-bold">
                  {stats[currentStat].label}
                </div>
                <div className="flex justify-center space-x-2">
                  {stats.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStat ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200">
                <div className="bg-blue-50 rounded-full p-3 w-fit mb-4">
                  <Zap className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="text-[#0F172A] font-bold mb-2">Instant Trading</h3>
                <p className="text-[#475569] text-sm font-medium">Execute trades in milliseconds with our advanced infrastructure</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200">
                <div className="bg-[#ECFDF5] rounded-full p-3 w-fit mb-4">
                  <Shield className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-[#0F172A] font-bold mb-2">Bank Security</h3>
                <p className="text-[#475569] text-sm font-medium">Military-grade encryption protects your investments</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200">
                <div className="bg-[#FFFBEB] rounded-full p-3 w-fit mb-4">
                  <DollarSign className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-[#0F172A] font-bold mb-2">Daily Returns</h3>
                <p className="text-[#475569] text-sm font-medium">Consistent profits with our AI-driven strategies</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200">
                <div className="bg-blue-50 rounded-full p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="text-[#0F172A] font-bold mb-2">Expert Support</h3>
                <p className="text-[#475569] text-sm font-medium">24/7 support from investment professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}