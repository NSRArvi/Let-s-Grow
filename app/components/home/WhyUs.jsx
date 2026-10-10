"use client";
import React from 'react';
import { TrendingUp, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function WhyUs() {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-white relative overflow-hidden border-t border-[#E2E8F0]">
            {/* Background blur circles */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-50 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-50 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-6xl font-bold text-[#0F172A] mb-6">
                        {t("home.whyTitle", "Built for Consistent, Data-Driven Growth")}
                    </h2>
                    <p className="text-xl text-[#475569] max-w-2xl mx-auto font-medium">
                        {t("home.whySubtitle", "Investing shouldn't be a gamble. We help you grow wealth with intelligent, transparent strategies backed by real data — not hype.")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-[#2563EB]" />
                            </div>
                            <h4 className="text-lg font-bold text-[#0F172A]">
                                {t("home.compoundingReturns", "Compounding Returns")}
                            </h4>
                        </div>
                        <p className="text-[#475569] font-medium">
                            {t("home.compoundingDesc", "Our investors see up to +98% monthly ROI — thanks to data-backed decisions and precision execution.")}
                        </p>
                    </div>

                    <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-[#ECFDF5] p-2 rounded-lg">
                                <Star className="h-6 w-6 text-[#10B981]" />
                            </div>
                            <h4 className="text-lg font-bold text-[#0F172A]">
                                {t("home.aiInsights", "AI-Powered Insights")}
                            </h4>
                        </div>
                        <p className="text-[#475569] font-medium">
                            {t("home.aiInsightsDesc", "Our proprietary AI identifies trends before they break out — giving you an edge in every trade.")}
                        </p>
                    </div>

                    <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Users className="h-6 w-6 text-[#2563EB]" />
                            </div>
                            <h4 className="text-lg font-bold text-[#0F172A]">
                                {t("home.eliteCommunity", "Elite Trading Community")}
                            </h4>
                        </div>
                        <p className="text-[#475569] font-medium">
                            {t("home.eliteCommunityDesc", "You'll trade alongside the top 1% of global investors — visible on our real-time leaderboard.")}
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/auth/register"
                        className="inline-block bg-[#2563EB] text-white px-8 py-4 rounded-xl font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:bg-[#1D4ED8] transition-all duration-200"
                    >
                        {t("home.joinRevolution", "Join the Growth Revolution")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
