"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useLanguage } from "@/app/components/context/LanguageContext";
import { RefreshCw, Package, Clock, CheckCircle2, TrendingUp, CalendarDays, ImageIcon } from "lucide-react";

export default function MyPackagesPage() {
    const { t } = useLanguage();
    const { user, supabase } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [myPackages, setMyPackages] = useState([]);

    useEffect(() => { if (user) { fetchMyPackages(); } }, [user]);

    const fetchMyPackages = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("user_packages")
                .select(`*, packages:package_id ( name, image_url, return_multiplier )`)
                .eq("user_id", user.id)
                .order("id", { ascending: false });
            if (error) throw error;
            setMyPackages(data || []);
        } catch (error) { console.error("Error fetching my packages:", error); }
        finally { setIsLoading(false); }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
                <p className="text-[#94A3B8]">{t("myPackagesPage.loading", "Loading your portfolio...")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-1 flex items-center gap-3">
                    {t("myPackagesPage.title", "My Packages")}
                </h1>
                <p className="text-[#94A3B8] text-sm">{t("myPackagesPage.subtitle", "Track your active investments and expected returns.")}</p>
            </div>

            {myPackages.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <Package className="w-16 h-16 text-[#E2E8F0] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#0F172A] mb-2">{t("myPackagesPage.noPackages", "No Active Packages")}</h2>
                    <p className="text-[#94A3B8] max-w-md mx-auto">
                        {t("myPackagesPage.noPackagesDesc", "You haven't purchased any investment packages yet. Visit the Marketplace to start growing your wealth.")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {myPackages.map((item) => {
                        const pkg = item.packages;
                        const isCompleted = item.status === 'completed';
                        const returnDate = new Date(item.return_at);
                        const now = new Date();
                        const daysRemaining = Math.ceil((returnDate - now) / (1000 * 60 * 60 * 24));

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl border border-[#E2E8F0] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-all duration-200 flex flex-row overflow-hidden ${isCompleted ? "opacity-75" : ""}`}
                            >
                                {/* Left: Square Image */}
                                <div className="w-28 sm:w-32 flex-shrink-0 bg-[#F8FAFC] relative">
                                    {pkg?.image_url ? (
                                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Right: Info */}
                                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between gap-2 min-w-0">
                                    {/* Top: name + status */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-[#0F172A] leading-tight truncate">
                                                {pkg?.name}
                                            </h3>
                                            <span className="text-[10px] text-[#94A3B8]">
                                                {item.quantity} {item.quantity > 1 ? t("myPackagesPage.stocks", "stocks") : t("myPackagesPage.stock", "stock")} · ${Number(item.total_paid).toLocaleString()}
                                            </span>
                                        </div>
                                        {isCompleted ? (
                                            <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0">
                                                <CheckCircle2 className="w-3 h-3" /> {t("myPackagesPage.paid", "PAID")}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0">
                                                <Clock className="w-3 h-3" /> {t("myPackagesPage.active", "ACTIVE")}
                                            </span>
                                        )}
                                    </div>

                                    {/* Bottom: stats row */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded-md text-[11px] font-bold">
                                            <TrendingUp className="w-3 h-3" />
                                            +${Number(item.return_amount).toLocaleString()}
                                        </span>
                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-md text-[11px] font-bold">
                                            <CalendarDays className="w-3 h-3" />
                                            {new Date(item.return_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        {!isCompleted && (
                                            <span className={`ml-auto text-[11px] font-bold ${daysRemaining > 0 ? 'text-[#2563EB]' : 'text-[#B45309]'}`}>
                                                {daysRemaining > 0 ? `${daysRemaining}${t("myPackagesPage.daysLeft", "d left")}` : t("myPackagesPage.due", "Due!")}
                                            </span>
                                        )}
                                        {isCompleted && (
                                            <span className="ml-auto text-[11px] font-bold text-[#047857]">
                                                {t("myPackagesPage.returned", "Returned ✓")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
