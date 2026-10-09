"use client";

import { useState, useEffect } from "react";
import { Package, TrendingUp, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";

export default function PackageMetrics({ refreshTrigger = 0 }) {
    const { supabase } = useAuth();
    const [stats, setStats] = useState({ 
        totalPackageSales: 0,
        totalPendingReturns: 0,
        totalPaidReturns: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (supabase) {
            fetchStats();
        }
    }, [supabase, refreshTrigger]);

    const fetchStats = async () => {
        try {
            const { data: pkgStats, error } = await supabase
                .from("user_packages")
                .select("total_paid, return_amount, status");
                
            if (error) throw error;
            
            let totalPackageSales = 0;
            let totalPendingReturns = 0;
            let totalPaidReturns = 0;
            
            if (pkgStats) {
                totalPackageSales = pkgStats.reduce((a, b) => a + Number(b.total_paid || 0), 0);
                totalPendingReturns = pkgStats
                    .filter(p => p.status === 'active')
                    .reduce((a, b) => a + Number(b.return_amount || 0), 0);
                totalPaidReturns = pkgStats
                    .filter(p => p.status === 'completed')
                    .reduce((a, b) => a + Number(b.return_amount || 0), 0);
            }

            setStats({ 
                totalPackageSales,
                totalPendingReturns,
                totalPaidReturns
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeInUp">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <p className="text-sm text-[#475569] font-medium">Total Package Sales</p>
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                    {isLoading ? "..." : `$${stats.totalPackageSales.toLocaleString('en-US')}`}
                </h2>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#FFFBEB] p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <p className="text-sm text-[#475569] font-medium">Pending Returns (Debt)</p>
                </div>
                <h2 className="text-3xl font-bold text-[#F59E0B]">
                    {isLoading ? "..." : `$${stats.totalPendingReturns.toLocaleString('en-US')}`}
                </h2>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#ECFDF5] p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <p className="text-sm text-[#475569] font-medium">Already Paid Returns</p>
                </div>
                <h2 className="text-3xl font-bold text-[#10B981]">
                    {isLoading ? "..." : `$${stats.totalPaidReturns.toLocaleString('en-US')}`}
                </h2>
            </div>
        </div>
    );
}
