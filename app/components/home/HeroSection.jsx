"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ArrowRight,
  Play,
  Shield,
  Star,
  CheckCircle2,
  DollarSign,
  Activity,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const packagesPreview = [
    { name: "Alpha Yield", rate: "+18.4%", period: "15 Days", price: "$50", returnVal: "$59.20", color: "from-blue-600 to-indigo-600" },
    { name: "Genesis Vault", rate: "+34.2%", period: "30 Days", price: "$120", returnVal: "$161.04", color: "from-emerald-500 to-teal-600" },
    { name: "Titan Growth", rate: "+65.0%", period: "60 Days", price: "$250", returnVal: "$412.50", color: "from-violet-600 to-purple-700" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % packagesPreview.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[88vh] bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F5F9] overflow-hidden flex items-center pt-16 sm:pt-20 pb-12 sm:pb-16">
      {/* Background Glows & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#0F172A 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        ></div>
        <div className="absolute -top-32 left-1/4 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-blue-400/15 rounded-full blur-[90px] sm:blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-emerald-400/15 rounded-full blur-[100px] sm:blur-[130px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Buttons (7 cols on lg) */}
          <div
            className={`lg:col-span-7 space-y-6 sm:space-y-8 transition-all duration-700 text-center lg:text-left py-16 lg:py-0 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >

            {/* Catchy, Punchy Headline without subtitle */}
            <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-[#0F172A] leading-[1.12] sm:leading-[1.1]">
              {t("home.heroTitlePrefix", "Invest Smart. Earn Daily.")}{" "}
              <span className="bg-gradient-to-r from-[#2563EB] via-indigo-600 to-[#10B981] bg-clip-text text-transparent block mt-1">
                {t("home.heroTitleHighlight", "Withdraw Instantly.")}
              </span>
            </h1>

            {/* CTAs */}
            <div className="flex gap-2 sm:gap-4 justify-center lg:justify-start pt-1">
              <Link
                href="/auth/register"
                className="group bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2.5 active:scale-95"
              >
                <p> <span className="hidden sm:inline">{t("home.heroBonusBtn", "Get Started with")} </span>{t("home.heroBonusText", "$20 Bonus")}</p>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/packages"
                className="group bg-white hover:bg-slate-50 text-[#0F172A] px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base border border-[#E2E8F0] shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <Play className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
                <p>{t("home.browsePackages", "Browse Packages")}</p>
              </Link>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-5 border-t border-[#E2E8F0] grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  $20<span className="text-[#2563EB] font-bold">+</span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#64748B] font-medium">{t("home.starterBonus", "Starter Bonus")}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10B981] tracking-tight">
                  {t("home.upTo", "Up to 65%")}
                </div>
                <div className="text-[11px] sm:text-xs text-[#64748B] font-medium">{t("home.fixedReturns", "Fixed Returns")}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2563EB] tracking-tight">
                  Instant
                </div>
                <div className="text-[11px] sm:text-xs text-[#64748B] font-medium">{t("home.instantPayouts", "Direct Payouts")}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile-Friendly Animated Showcase (5 cols on lg) */}
          <div
            className={`lg:col-span-5 relative transition-all duration-1000 delay-200 mt-4 lg:mt-0 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 to-emerald-500/15 rounded-3xl blur-2xl transform scale-95 pointer-events-none"></div>

            {/* Floating Top Badge (Responsive positioning) */}
            <div className="hidden sm:flex absolute -top-4 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)] items-center gap-2.5 animate-bounce">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <div>
                <p className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">
                  {t("home.payoutVolume", "24h Payout Volume")}
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-[#0F172A]">$148,920.00</p>
              </div>
            </div>

            {/* Floating Bottom Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -left-2 sm:-left-4 z-20 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)] items-center gap-2.5 animate-bounce">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <Shield className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">
                  {t("home.verifiedSecurity", "Verified Security")}
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-[#10B981] flex items-center gap-1">
                  {t("home.regulated", "Regulated")} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </p>
              </div>
            </div>

            {/* Main Showcase Card */}
            <div className="relative bg-white/95 backdrop-blur-xl border border-[#E2E8F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-xs sm:text-sm">Investment Terminal</h3>
                    <p className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span> Live Market Feed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-lg text-[11px] font-semibold text-[#475569]">
                  <Award className="w-3 h-3 text-amber-500" /> Tier 1
                </div>
              </div>

              {/* Package Selector Tab Buttons */}
              <div className="grid grid-cols-3 gap-1.5 my-3.5 sm:my-4 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
                {packagesPreview.map((pkg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                      activeTab === idx
                        ? "bg-white text-[#2563EB] shadow-sm border border-[#E2E8F0]"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    {pkg.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Active Package Hero Card */}
              <div
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br ${packagesPreview[activeTab].color} shadow-md transition-all duration-500`}
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-white/80 font-medium tracking-wide uppercase">
                      {t("home.cycle", "Plan")}: {packagesPreview[activeTab].period}
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold">{packagesPreview[activeTab].name}</h4>
                  </div>
                  <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-extrabold">
                    {packagesPreview[activeTab].rate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 sm:pt-3 border-t border-white/20">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-white/70 block">{t("home.minDeposit", "Investment")}</span>
                    <span className="text-base sm:text-lg font-bold">{packagesPreview[activeTab].price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] sm:text-[11px] text-white/70 block">{t("home.estReturn", "Estimated Return")}</span>
                    <span className="text-base sm:text-lg font-bold text-amber-200">
                      {packagesPreview[activeTab].returnVal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Realtime Live Chart Preview SVG */}
              <div className="mt-3.5 sm:mt-4 p-3 sm:p-4 bg-[#F8FAFC] rounded-xl sm:rounded-2xl border border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-1.5 text-[11px] sm:text-xs">
                  <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /> Growth Projection
                  </span>
                  <span className="text-[#10B981] font-extrabold">+38.5% Avg.</span>
                </div>

                {/* Animated Wave Graph */}
                <div className="w-full h-12 sm:h-14 relative flex items-end">
                  <svg
                    viewBox="0 0 300 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="gradientCurve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 55 Q 50 40 100 48 T 200 25 T 300 12 L 300 70 L 0 70 Z"
                      fill="url(#gradientCurve)"
                    />
                    <path
                      d="M 0 55 Q 50 40 100 48 T 200 25 T 300 12"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="12" r="4" fill="#10B981" />
                    <circle cx="300" cy="12" r="7" stroke="#10B981" strokeWidth="1.5" opacity="0.4" />
                  </svg>
                </div>
              </div>

              {/* Supported Gateways Strip */}
              <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-[#94A3B8] border-t border-[#F1F5F9]">
                <span>Gateways:</span>
                <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                  <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded text-[10px] border border-pink-100">
                    bKash
                  </span>
                  <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[10px] border border-orange-100">
                    Nagad
                  </span>
                  <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] border border-purple-100">
                    Rocket
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] border border-amber-100">
                    Binance
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}