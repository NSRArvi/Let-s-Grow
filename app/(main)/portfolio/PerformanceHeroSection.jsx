'use client';

import {
  TrendingUp,
  BarChart3,
  Activity,
  ShieldCheck,
  HandCoins,
  DollarSign,
} from 'lucide-react';

export default function PerformanceHeroSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden relative pt-16">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-36 mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-100 w-max">
            <BarChart3 className="h-4 w-4 text-[#2563EB]" />
            <span className="text-[#2563EB] text-sm font-bold">Live Growth Insights</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight tracking-tight">
            Performance Backed by <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
              Real Business Results
            </span>
          </h1>

          <p className="text-[#475569] text-lg max-w-xl leading-relaxed font-medium">
            At Let's Grow, your investment isn't locked — it's working in the real market. Watch ROI build over time,
            powered by data, smart lending, and successful product resale cycles.
          </p>

          <div className="pt-4">
            <button className="bg-[#2563EB] px-6 py-3 rounded-xl text-white font-bold hover:bg-[#1D4ED8] transition-all duration-200 shadow-lg shadow-blue-900/10">
              See Investment Stats
            </button>
          </div>
        </div>

        {/* Right Stats Cards */}
        <div className="relative w-full grid sm:grid-cols-2 gap-8 animate-fadeInUp delay-300">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all">
            <div className="bg-[#ECFDF5] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
               <TrendingUp className="h-8 w-8 text-[#10B981]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">+8.6% ROI</div>
            <p className="text-[#94A3B8] text-sm mt-1 font-medium">Average Monthly Return</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all animate-fadeInUp delay-1000">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-[#2563EB]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">$9.3M+</div>
            <p className="text-[#94A3B8] text-sm mt-1 font-medium">Withdrawals Processed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all animate-fadeInUp delay-2000">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-[#2563EB]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">Secure Returns</div>
            <p className="text-[#94A3B8] text-sm mt-1 font-medium">Your capital is protected</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all animate-fadeInUp delay-3000">
            <div className="bg-[#FFFBEB] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <HandCoins className="h-8 w-8 text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">$12M+</div>
            <p className="text-[#94A3B8] text-sm mt-1 font-medium">Funded to Business</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.7s ease-out forwards; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .delay-3000 { animation-delay: 3s; }
      `}</style>
    </section>
  );
}
