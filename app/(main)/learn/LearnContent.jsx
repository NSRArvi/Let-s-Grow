'use client'
import {
  HandCoins,
  TrendingUp,
  ShieldCheck,
  Banknote,
  ArrowRight,
  CheckCircle,
  Target,
  Users,
  DollarSign,
  ChevronDown,
  Star,
  BarChart3,
  Clock,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../components/context/LanguageContext'

export default function LearnContent() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  const steps = [
    {
      icon: HandCoins,
      title: t('learn.step1Title', 'You Invest'),
      desc: t('learn.step1Desc', 'Choose a product package and invest the desired amount securely through our platform.'),
      detail: t('learn.step1Detail', 'Start with as little as $100 and watch your money work for you'),
      color: 'bg-emerald-50 text-[#10B981]',
    },
    {
      icon: Banknote,
      title: t('learn.step2Title', 'We Deploy Capital'),
      desc: t('learn.step2Desc', 'We loan your funds to vetted entrepreneurs who buy, market, and sell actual products.'),
      detail: t('learn.step2Detail', 'Your investment fuels real businesses with proven track records'),
      color: 'bg-blue-50 text-[#2563EB]',
    },
    {
      icon: TrendingUp,
      title: t('learn.step3Title', 'You Earn Returns'),
      desc: t('learn.step3Desc', 'After the selling cycle, profits are shared back with you—transparently and on time.'),
      detail: t('learn.step3Detail', 'Enjoy consistent returns with full transparency on every transaction'),
      color: 'bg-amber-50 text-[#F59E0B]',
    },
  ]

  const benefits = [
    {
      icon: ShieldCheck,
      title: t('learn.securityTitle', 'Bank-Level Security'),
      desc: t('learn.securityDesc', '256-bit encryption, multi-factor authentication, and regulatory compliance protect your investment.'),
      stat: '99.9% Uptime',
      color: 'text-[#10B981]',
      bg: 'bg-emerald-50',
    },
    {
      icon: BarChart3,
      title: t('learn.analyticsTitle', 'Real-Time Analytics'),
      desc: t('learn.analyticsDesc', 'Track every penny with live dashboards, detailed reports, and performance metrics.'),
      stat: '24/7 Tracking',
      color: 'text-[#2563EB]',
      bg: 'bg-blue-50',
    },
    {
      icon: Trophy,
      title: t('learn.provenResultsTitle', 'Proven Results'),
      desc: t('learn.provenResultsDesc', "Join thousands of investors who've already earned consistent returns with our platform."),
      stat: '94% Success',
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-50',
    },
  ]

  const stats = [
    { icon: Users, label: t('learn.activeInvestors', 'Active Investors'), value: '50K+', color: 'text-[#2563EB]' },
    { icon: DollarSign, label: t('learn.capitalDeployed', 'Capital Deployed'), value: '$50M+', color: 'text-[#10B981]' },
    { icon: Target, label: t('learn.successRate', 'Success Rate'), value: '94%', color: 'text-[#F59E0B]' },
    { icon: Clock, label: t('learn.avgReturnTime', 'Avg. Return Time'), value: '15 Days', color: 'text-[#0F172A]' },
  ]

  const faqs = [
    {
      q: t('learn.faq1Q', 'Is my investment really safe?'),
      a: t('learn.faq1A', 'Absolutely. We use institutional-grade security, conduct thorough due diligence on all partners, and maintain comprehensive insurance coverage. Your funds are segregated and protected by multiple layers of security.'),
    },
    {
      q: t('learn.faq2Q', 'How quickly can I start earning?'),
      a: t('learn.faq2A', "Most investors see their first returns within 30–60 days. Our streamlined process gets your money working immediately, and you'll receive detailed updates throughout the investment cycle."),
    },
    {
      q: t('learn.faq3Q', 'What if I need my money back early?'),
      a: t('learn.faq3A', 'We offer flexible withdrawal options. While investments perform best when held to maturity, we provide liquidity options and can facilitate early exits when needed.'),
    },
    {
      q: t('learn.faq4Q', 'How do you select business partners?'),
      a: t('learn.faq4A', 'Our rigorous 47-point verification process includes financial audits, market validation, track record analysis, and ongoing performance monitoring. Only the top 3% of applicants are approved.'),
    },
  ]

  return (
    <div className="bg-white text-[#0F172A] overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 lg:px-20 py-32 text-center overflow-hidden bg-[#F8FAFC]">
        <div className="relative z-10">

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            {t('learn.heroTitlePrefix', 'Turn Your Money Into a')}{' '}
            <span className="block bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
              {t('learn.heroTitleHighlight', 'Profit Machine')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#475569] max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('learn.heroSubtitle', 'Join the revolution of smart investing. Fund real businesses, earn real returns, and watch your capital grow with complete transparency and security.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/auth/register" className="w-full sm:w-auto px-10 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              {t('learn.startInvestingNow', 'Start Investing Now')}
            </Link>
            <button className="w-full sm:w-auto px-10 py-4 border-2 border-[#E2E8F0] text-[#0F172A] hover:bg-white hover:border-[#2563EB] rounded-xl font-bold text-lg transition-all duration-300">
              {t('learn.watchDemo', 'Watch Demo')}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20 pt-16 border-t border-[#E2E8F0]">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-1">{stat.value}</div>
                <div className="text-sm text-[#475569] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Process */}
      <section className="py-28 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0F172A]">
              {t('learn.howItWorksTitle', 'How It Works')}
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto font-medium">
              {t('learn.howItWorksSubtitle', 'Three simple steps to start earning consistent returns on your investment')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {steps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 relative ${
                  activeStep === idx
                    ? 'border-[#2563EB] bg-blue-50/20 shadow-xl scale-105'
                    : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl ${step.color}`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="text-4xl font-black text-[#94A3B8]">0{idx + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">{step.title}</h3>
                <p className="text-[#475569] mb-4 leading-relaxed">{step.desc}</p>
                <div className="pt-4 border-t border-[#E2E8F0] text-sm text-[#475569] font-medium">
                  {step.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Active Step Deep Dive */}
          <div className="bg-[#F8FAFC] rounded-3xl p-8 md:p-12 border border-[#E2E8F0]">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="text-[#2563EB] font-bold text-sm uppercase tracking-wider">
                  {t('learn.activeStep', 'Active Step')} 0{activeStep + 1}
                </span>
                <h3 className="text-3xl font-bold mt-2 mb-4 text-[#0F172A]">
                  {steps[activeStep].title}
                </h3>
                <p className="text-[#475569] text-lg mb-6 leading-relaxed">
                  {steps[activeStep].desc}
                </p>
                <div className="flex items-center gap-4 text-sm font-semibold text-[#0F172A]">
                  <CheckCircle className="h-5 w-5 text-[#10B981]" />
                  <span>{steps[activeStep].detail}</span>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Link href="/auth/register" className="inline-flex items-center px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold transition-all duration-300">
                  {t('learn.startInvestingNow', 'Start Investing Now')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0F172A]">
              {t('learn.whyChooseTitle', "Why Choose Let's Grow?")}
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto font-medium">
              {t('learn.whyChooseSubtitle', "We're not just another investment platform—we're your partner in building wealth")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`p-4 rounded-xl ${benefit.bg} w-fit mb-6`}>
                  <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  {benefit.stat}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">{benefit.title}</h3>
                <p className="text-[#475569] leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#0F172A]">
              {t('learn.faqTitle', 'Got Questions?')}
            </h2>
            <p className="text-[#475569] text-lg font-medium">{t('learn.faqSubtitle', "We've got answers. Here's what investors ask us most.")}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all duration-300 overflow-hidden shadow-sm"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F8FAFC] transition-all duration-300"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-bold text-lg text-[#0F172A] pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-6 w-6 text-[#94A3B8] transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180 text-[#2563EB]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-[#475569] leading-relaxed border-t border-[#E2E8F0] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 md:px-12 lg:px-20 bg-[#2563EB] text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-sm font-semibold">{t('home.trustedInvestors', 'Join 50,000+ Smart Investors')}</span>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {t('learn.ctaTitle', 'Ready to Start Growing?')}
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('learn.ctaSubtitle', "Join thousands of smart investors who are already building wealth with Let's Grow.")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register" className="group px-12 py-4 bg-white text-[#2563EB] rounded-xl font-bold text-lg shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1">
              {t('learn.ctaBtn', 'Start Investing Today')}
              <ArrowRight className="inline-block ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/dashboard/packages" className="px-12 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
              {t('home.browsePackages', 'Browse Packages')}
            </Link>
          </div>

          <p className="text-blue-200 text-sm mt-8 font-medium">
            {t('learn.ctaFootnote', 'No hidden fees • Start with just $100 • Withdraw anytime')}
          </p>
        </div>
      </section>
    </div>
  )
}

