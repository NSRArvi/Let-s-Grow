"use client";
import React from 'react';
import { TrendingUp, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Shield, Award, Users } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t border-[#E2E8F0] relative overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-[#2563EB] rounded-xl p-2 shadow-lg shadow-blue-900/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Let's Grow
              </span>
            </div>
            <p className="text-[#475569] mb-8 max-w-md font-medium leading-relaxed">
              {t("footer.desc", "Empowering investors with AI-driven insights and blockchain technology. Build your digital wealth with confidence, transparency, and security.")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#F8FAFC] text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-all p-3 rounded-xl border border-[#E2E8F0]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-[#F8FAFC] text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-all p-3 rounded-xl border border-[#E2E8F0]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-[#F8FAFC] text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-all p-3 rounded-xl border border-[#E2E8F0]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-[#F8FAFC] text-[#475569] hover:text-[#2563EB] hover:bg-blue-50 transition-all p-3 rounded-xl border border-[#E2E8F0]">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#0F172A] font-bold mb-6 text-lg">{t("footer.platform", "Platform")}</h3>
            <ul className="space-y-4">
              <li><Link href="/invest" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.startInvesting", "Start Investing")}</Link></li>
              <li><Link href="/portfolio" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.viewPortfolio", "View Portfolio")}</Link></li>
              <li><Link href="/leaderboard" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.leaderboard", "Leaderboard")}</Link></li>
              <li><Link href="/learn" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.learnEarn", "Learn & Earn")}</Link></li>
              <li><Link href="/about" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.aboutUs", "About Us")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#0F172A] font-bold mb-6 text-lg">{t("footer.support", "Support")}</h3>
            <ul className="space-y-4">
              <li><Link href="/help" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.helpCenter", "Help Center")}</Link></li>
              <li><Link href="/contact" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.contactUs", "Contact Us")}</Link></li>
              <li><Link href="/faq" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.faq", "FAQ")}</Link></li>
              <li><Link href="/security" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.security", "Security")}</Link></li>
              <li><Link href="/terms" className="text-[#475569] hover:text-[#2563EB] transition-colors font-medium">{t("footer.terms", "Legal Terms")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-[#E2E8F0] pt-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <Shield className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-[#0F172A] font-bold">{t("footer.bankSecurity", "Bank-Level Security")}</h4>
                <p className="text-[#475569] text-sm font-medium mt-1">{t("footer.ssl", "256-bit SSL encryption")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-[#ECFDF5] rounded-2xl p-4 border border-emerald-100">
                <Award className="h-6 w-6 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-[#0F172A] font-bold">{t("footer.regulatedPlatform", "Regulated Platform")}</h4>
                <p className="text-[#475569] text-sm font-medium mt-1">{t("footer.licensed", "Licensed & Insured")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-[#FFFBEB] rounded-2xl p-4 border border-amber-100">
                <Users className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <h4 className="text-[#0F172A] font-bold">{t("footer.trustedInvestors", "1M+ Investors")}</h4>
                <p className="text-[#475569] text-sm font-medium mt-1">{t("footer.trustedWorldwide", "Trusted worldwide")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#E2E8F0] pt-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="h-5 w-5 text-[#2563EB]" />
              <span className="text-[#0F172A] font-bold">support@letsgrow.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="h-5 w-5 text-[#10B981]" />
              <span className="text-[#0F172A] font-bold">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="h-5 w-5 text-[#F59E0B]" />
              <span className="text-[#0F172A] font-bold">San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-[#94A3B8] text-sm mb-4 md:mb-0 text-center md:text-left font-medium">
            © {new Date().getFullYear()} Let's Grow. {t("footer.rights", "All rights reserved.")}
          </p>
          <div className="flex space-x-6 text-sm font-medium">
            <Link href="/privacy" className="text-[#94A3B8] hover:text-[#2563EB] transition-colors">
              {t("footer.terms", "Privacy Policy")}
            </Link>
            <Link href="/terms" className="text-[#94A3B8] hover:text-[#2563EB] transition-colors">
              {t("footer.terms", "Terms of Service")}
            </Link>
            <Link href="/cookies" className="text-[#94A3B8] hover:text-[#2563EB] transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}