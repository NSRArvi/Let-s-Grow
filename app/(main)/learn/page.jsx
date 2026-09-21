'use client'
import {
  HandCoins,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Banknote,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Users,
  DollarSign,
  ChevronDown,
  Star,
  BarChart3,
  Lock,
  Clock,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function LearnPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  const steps = [
    {
      icon: HandCoins,
      title: 'You Invest',
      desc: 'Choose a product package and invest the desired amount securely through our platform.',
      detail: 'Start with as little as $100 and watch your money work for you',
      color: 'bg-emerald-50 text-[#10B981]',
    },
    {
      icon: Banknote,
      title: 'We Deploy Capital',
      desc: 'We loan your funds to vetted entrepreneurs who buy, market, and sell actual products.',
      detail: 'Your investment fuels real businesses with proven track records',
      color: 'bg-blue-50 text-[#2563EB]',
    },
    {
      icon: TrendingUp,
      title: 'You Earn Returns',
      desc: 'After the selling cycle, profits are shared back with you—transparently and on time.',
      detail: 'Enjoy consistent returns with full transparency on every transaction',
      color: 'bg-amber-50 text-[#F59E0B]',
    },
  ]

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Bank-Level Security',
      desc: '256-bit encryption, multi-factor authentication, and regulatory compliance protect your investment.',
      stat: '99.9% Uptime',
      color: 'text-[#10B981]',
      bg: 'bg-emerald-50',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      desc: 'Track every penny with live dashboards, detailed reports, and performance metrics.',
      stat: '24/7 Monitoring',
      color: 'text-[#2563EB]',
      bg: 'bg-blue-50',
    },
    {
      icon: Trophy,
      title: 'Proven Results',
      desc: "Join thousands of investors who've already earned consistent returns with our platform.",
      stat: '12.5% Avg ROI',
      color: 'text-[#F59E0B]',
      bg: 'bg-amber-50',
    },
  ]

  const stats = [
    { icon: Users, label: 'Active Investors', value: '15,000+', color: 'text-[#2563EB]' },
    { icon: DollarSign, label: 'Capital Deployed', value: '$50M+', color: 'text-[#10B981]' },
    { icon: Target, label: 'Success Rate', value: '94%', color: 'text-[#F59E0B]' },
    { icon: Clock, label: 'Avg. Return Time', value: '15 Days', color: 'text-[#0F172A]' },
  ]

  const faqs = [
    {
      q: 'Is my investment really safe?',
      a: 'Absolutely. We use institutional-grade security, conduct thorough due diligence on all partners, and maintain comprehensive insurance coverage. Your funds are segregated and protected by multiple layers of security.',
    },
    {
      q: 'How quickly can I start earning?',
      a: "Most investors see their first returns within 30–60 days. Our streamlined process gets your money working immediately, and you'll receive detailed updates throughout the investment cycle.",
    },
    {
      q: 'What if I need my money back early?',
      a: 'We offer flexible withdrawal options. While investments perform best when held to maturity, we provide liquidity options and can facilitate early exits when needed.',
    },
    {
      q: 'How do you select business partners?',
      a: 'Our rigorous 47-point verification process includes financial audits, market validation, track record analysis, and ongoing performance monitoring. Only the top 3% of applicants are approved.',
    },
  ]

  return (
    <div className="bg-white text-[#0F172A] overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 lg:px-20 py-32 text-center overflow-hidden bg-[#F8FAFC]">
        <div className="relative z-10">
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full border border-blue-100 mb-8 backdrop-blur-sm">
            <Zap className="h-5 w-5 text-[#2563EB] mr-2" />
            <span className="text-[#2563EB] font-bold">Smart Investment Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Turn Your Money Into a{' '}
            <span className="block bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
              Profit Machine
            </span>
          </h1>

          <p className="text-[#475569] text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Join the revolution of smart investing. Fund real businesses, earn real returns,
            and watch your capital grow with complete transparency and security.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/auth/register" className="group px-8 py-4 bg-[#2563EB] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-900/10 hover:bg-[#1D4ED8] transition-all duration-300 transform hover:-translate-y-1">
              Start Investing Now
              <ArrowRight className="inline-block ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="px-8 py-4 border-2 border-[#E2E8F0] text-[#0F172A] rounded-xl font-bold text-lg hover:bg-[#F1F5F9] transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F8FAFC] rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-[#0F172A] mb-1">{stat.value}</div>
                <div className="text-[#94A3B8] text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#0F172A]">
              How It Works
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto font-medium">
              Three simple steps to start earning consistent returns on your investment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeStep === idx ? 'scale-105' : 'hover:-translate-y-1'
                }`}
                onMouseEnter={() => setActiveStep(idx)}
              >
                <div className={`relative bg-white p-8 rounded-2xl border ${activeStep === idx ? 'border-[#2563EB] shadow-lg shadow-blue-900/5' : 'border-[#E2E8F0] shadow-sm'} transition-all duration-300`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${step.color}`}>
                    <step.icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-[#0F172A]">{step.title}</h3>
                  <p className="text-[#475569] mb-4 leading-relaxed font-medium">{step.desc}</p>
                  <p className="text-[#2563EB] font-bold text-sm">{step.detail}</p>

                  {activeStep === idx && (
                    <div className="mt-4 flex items-center text-[#10B981] font-bold">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Active Step
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#0F172A]">
              Why Choose Let's Grow?
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto font-medium">
              We're not just another investment platform—we're your partner in building wealth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden bg-white p-8 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${benefit.bg}`}>
                      <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <span className={`text-sm font-bold ${benefit.color} ${benefit.bg} px-3 py-1 rounded-full`}>
                      {benefit.stat}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-[#0F172A]">{benefit.title}</h3>
                  <p className="text-[#475569] leading-relaxed font-medium">{benefit.desc}</p>
                </div>
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
              Got Questions?
            </h2>
            <p className="text-[#475569] text-lg font-medium">We've got answers. Here's what investors ask us most.</p>
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
                  <div className="px-6 pb-6 transition-all duration-300 ease-out">
                    <p className="text-[#475569] leading-relaxed font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#2563EB]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Star className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Start Growing?
            </h2>
            <p className="text-blue-100 text-lg mb-8 font-medium">
              Join thousands of smart investors who are already building wealth with Let's Grow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register" className="group px-12 py-4 bg-white text-[#2563EB] rounded-xl font-bold text-lg shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1">
              Start Investing Today
              <ArrowRight className="inline-block ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="px-12 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
              Schedule a Call
            </button>
          </div>

          <p className="text-blue-200 text-sm mt-8 font-medium">
            No hidden fees • Start with just $100 • Withdraw anytime
          </p>
        </div>
      </section>
    </div>
  )
}
