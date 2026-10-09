"use client";

import { useState, useEffect } from "react";
import { Wallet, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";

export default function LiquidityMetrics({ refreshTrigger = 0 }) {
    const { supabase } = useAuth();
    const [stats, setStats] = useState({ 
        totalIn: 0, 
        totalOut: 0, 
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
                .select("type, amount_usd")
                .eq("status", "verified")
                .in("type", ["cash_in", "withdraw"]);

            if (error) throw error;

            let totalIn = 0;
            let totalOut = 0;
            if (allVerified) {
                totalIn = allVerified.filter(t => t.type === 'cash_in').reduce((a, b) => a + Number(b.amount_usd || 0), 0);
                totalOut = allVerified.filter(t => t.type === 'withdraw').reduce((a, b) => a + Number(b.amount_usd || 0), 0);
            }

            setStats({ 
                totalIn, 
                totalOut, 
                reserve: totalIn - totalOut 
            });
        } catch (error) {
            console.error("Error fetching liquidity stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-[#F59E0B]/5">
                    <Wallet className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#FFFBEB] p-2 rounded-lg">
                            <Wallet className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <p className="text-sm text-[#475569] font-medium">Vault Reserve (Held in MFS)</p>
                    </div>
                    <h2 className="text-4xl font-bold text-[#0F172A]">
                        {isLoading ? "..." : `$${stats.reserve.toLocaleString('en-US')}`}
                    </h2>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#ECFDF5] p-2 rounded-lg">
                        <ArrowUpToLine className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <p className="text-sm text-[#475569] font-medium">Total Lifetime Cash In</p>
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                    {isLoading ? "..." : `$${stats.totalIn.toLocaleString('en-US')}`}
                </h2>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#FEF2F2] p-2 rounded-lg">
                        <ArrowDownToLine className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <p className="text-sm text-[#475569] font-medium">Total Lifetime Cash Out</p>
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                    {isLoading ? "..." : `$${stats.totalOut.toLocaleString('en-US')}`}
                </h2>
            </div>
        </div>
    );
}
