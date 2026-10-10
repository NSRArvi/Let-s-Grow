"use client";

import { useState, useEffect } from "react";
import { Wallet, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";

export default function LiquidityMetrics({ refreshTrigger = 0 }) {
    const { supabase } = useAuth();
    const [stats, setStats] = useState({ 
        totalIn: 0, 
        totalOut: 0, 
        totalFees: 0,
        reserve: 0 
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (supabase) {
            fetchStats();
        }
    }, [supabase, refreshTrigger]);

    const fetchStats = async () => {
        try {
            const { data: allVerified, error } = await supabase
                .from("transactions")
                .select("type, amount_usd, fee_usd, net_amount_usd")
                .eq("status", "verified")
                .in("type", ["cash_in", "withdraw"]);

            if (error) throw error;

            let totalIn = 0;
            let totalOut = 0;
            let totalFees = 0;
            if (allVerified) {
                totalIn = allVerified.filter(t => t.type === 'cash_in').reduce((a, b) => a + Number(b.amount_usd || 0), 0);
                
                // For withdraws, total sent out is net_amount_usd (or amount_usd * 0.98 fallback)
                totalOut = allVerified.filter(t => t.type === 'withdraw').reduce((a, b) => {
                    const net = b.net_amount_usd !== null && b.net_amount_usd !== undefined
                        ? Number(b.net_amount_usd)
                        : (b.fee_usd ? Number(b.amount_usd) - Number(b.fee_usd) : Number(b.amount_usd || 0) * 0.98);
                    return a + net;
                }, 0);

                // Total platform 2% fees retained by vault
                totalFees = allVerified.filter(t => t.type === 'withdraw').reduce((a, b) => {
                    const fee = b.fee_usd !== null && b.fee_usd !== undefined
                        ? Number(b.fee_usd)
                        : Number(b.amount_usd || 0) * 0.02;
                    return a + fee;
                }, 0);
            }

            setStats({ 
                totalIn, 
                totalOut, 
                totalFees,
                reserve: totalIn - totalOut 
            });
        } catch (error) {
            console.error("Error fetching liquidity stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 animate-fadeInUp">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-[#F59E0B]/5">
                    <Wallet className="w-28 h-28" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#FFFBEB] p-2 rounded-lg">
                            <Wallet className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <p className="text-xs text-[#475569] font-medium">Vault Reserve (Held in MFS)</p>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
                        {isLoading ? "..." : `$${stats.reserve.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </h2>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-[#ECFDF5] p-2 rounded-lg">
                        <ArrowUpToLine className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <p className="text-xs text-[#475569] font-medium">Total Lifetime Cash In</p>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
                    {isLoading ? "..." : `$${stats.totalIn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h2>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-[#FEF2F2] p-2 rounded-lg">
                        <ArrowDownToLine className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <p className="text-xs text-[#475569] font-medium">Total Cash Out (Net)</p>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">
                    {isLoading ? "..." : `$${stats.totalOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h2>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] bg-gradient-to-br from-white to-blue-50/30">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Wallet className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <p className="text-xs text-[#475569] font-medium">Platform Fees (2%)</p>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#2563EB]">
                    {isLoading ? "..." : `+$${stats.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h2>
            </div>
        </div>
    );
}
