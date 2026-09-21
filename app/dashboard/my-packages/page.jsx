"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { RefreshCw, Package, Clock, CheckCircle2, TrendingUp, CalendarDays } from "lucide-react";

export default function MyPackagesPage() {
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
                <p className="text-[#94A3B8]">Loading your portfolio...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-1 flex items-center gap-3">
                    <Package className="text-[#2563EB]" /> My Portfolio
                </h1>
                <p className="text-[#94A3B8] text-sm">Track your active investments and expected returns.</p>
            </div>

            {myPackages.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <Package className="w-16 h-16 text-[#E2E8F0] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#0F172A] mb-2">No Active Packages</h2>
                    <p className="text-[#94A3B8] max-w-md mx-auto">
                        You haven't purchased any investment packages yet. Visit the Packages page to start growing your wealth.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myPackages.map((item) => {
                        const pkg = item.packages;
                        const isCompleted = item.status === 'completed';
                        const returnDate = new Date(item.return_at);
                        const now = new Date();
                        const daysRemaining = Math.ceil((returnDate - now) / (1000 * 60 * 60 * 24));

                        return (
                            <div 
                                key={item.id} 
                                className={`rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col h-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 ${
                                    isCompleted ? "border-[#E2E8F0] opacity-80" : "border-[#E2E8F0]"
                                }`}
                            >
                                <div className="h-32 bg-[#F8FAFC] relative">
                                    {pkg?.image_url && (
                                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                                    
                                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                        <h3 className="font-bold text-[#0F172A] text-lg truncate drop-shadow-sm">{pkg?.name}</h3>
                                        {isCompleted ? (
                                            <span className="bg-[#ECFDF5] text-[#047857] px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> PAID
                                            </span>
                                        ) : (
                                            <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> ACTIVE
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 space-y-4 flex-1">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                            <p className="text-xs text-[#94A3B8] mb-1">Total Paid</p>
                                            <p className="font-bold text-[#0F172A] text-lg">${Number(item.total_paid).toLocaleString()}</p>
                                            <p className="text-[10px] text-[#94A3B8] mt-1">For {item.quantity} stocks</p>
                                        </div>
                                        <div className="bg-[#ECFDF5] p-3 rounded-xl border border-emerald-100">
                                            <p className="text-xs text-[#94A3B8] mb-1">Expected Return</p>
                                            <p className="font-bold text-[#10B981] text-lg flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" />
                                                ${Number(item.return_amount).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-[#10B981] mt-1">
                                                {(Number(pkg?.return_multiplier || 1) * 100).toFixed(0)}% ROI
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#94A3B8] flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4" /> Purchased
                                            </span>
                                            <span className="text-[#475569]">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#94A3B8] flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> Return Date
                                            </span>
                                            <span className="text-[#0F172A] font-medium">{new Date(item.return_at).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {!isCompleted && (
                                            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                                                {daysRemaining > 0 ? (
                                                    <div className="bg-blue-50 text-[#2563EB] p-3 rounded-xl text-center text-sm font-medium border border-blue-100">
                                                        Returns expected in <span className="font-bold">{daysRemaining} days</span>
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#FFFBEB] text-[#B45309] p-3 rounded-xl text-center text-sm font-bold border border-amber-100">
                                                        Return is due! Processing soon.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {isCompleted && (
                                            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                                                <div className="bg-[#ECFDF5] text-[#047857] p-3 rounded-xl text-center text-sm font-medium border border-emerald-100">
                                                    Returns have been added to your wallet!
                                                </div>
                                            </div>
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
