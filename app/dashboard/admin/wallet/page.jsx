"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    Wallet, 
    ArrowUpToLine, 
    ArrowDownToLine,
    Package,
    TrendingUp,
    Zap
} from "lucide-react";

export default function AdminWalletPage() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState("cash_in");
    const [processingId, setProcessingId] = useState(null);
    const [isProcessingReturns, setIsProcessingReturns] = useState(false);
    
    const [stats, setStats] = useState({ 
        totalIn: 0, 
        totalOut: 0, 
        reserve: 0,
        totalPackageSales: 0,
        totalPendingReturns: 0
    });

    useEffect(() => {
        if (user) {
            checkAdminAndFetch();
        }
    }, [user]);

    const checkAdminAndFetch = async () => {
        setIsLoading(true);
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single();

            if (!profile?.is_admin) {
                toast.error("Unauthorized access.");
                router.push("/dashboard");
                return;
            }

            setIsAdmin(true);
            await fetchDashboardData();
        } catch (error) {
            console.error("Admin check failed:", error);
            router.push("/dashboard");
        }
    };

    const fetchDashboardData = async () => {
        try {
            // 1. Fetch recent transactions for the tables
            const { data: txs, error: txError } = await supabase
                .from("transactions")
                .select(`*, profiles:user_id ( full_name, email )`)
                .in("type", ["cash_in", "withdraw"])
                .order("created_at", { ascending: false })
                .limit(100);

            if (txError) throw txError;
            
            // Sort to ensure pending is always at the top, then by date
            const sortedTxs = (txs || []).sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return 0; // fallback to created_at descending from DB
            });
            
            setTransactions(sortedTxs);

            // 2. Fetch all verified amounts to calculate platform liquidity
            const { data: allVerified } = await supabase
                .from("transactions")
                .select("type, amount_usd")
                .eq("status", "verified")
                .in("type", ["cash_in", "withdraw"]);

            let totalIn = 0;
            let totalOut = 0;
            if (allVerified) {
                totalIn = allVerified.filter(t => t.type === 'cash_in').reduce((a, b) => a + Number(b.amount_usd), 0);
                totalOut = allVerified.filter(t => t.type === 'withdraw').reduce((a, b) => a + Number(b.amount_usd), 0);
            }

            // 3. Fetch Package Stats
            const { data: pkgStats } = await supabase
                .from("user_packages")
                .select("total_paid, return_amount, status");
                
            let totalPackageSales = 0;
            let totalPendingReturns = 0;
            
            if (pkgStats) {
                totalPackageSales = pkgStats.reduce((a, b) => a + Number(b.total_paid), 0);
                totalPendingReturns = pkgStats
                    .filter(p => p.status === 'active')
                    .reduce((a, b) => a + Number(b.return_amount), 0);
            }

            setStats({ 
                totalIn, 
                totalOut, 
                reserve: totalIn - totalOut,
                totalPackageSales,
                totalPendingReturns
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load vault data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setProcessingId(id);
        try {
            const { error } = await supabase
                .from("transactions")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            toast.success(`Transaction ${newStatus} successfully!`);
            
            // Update local state so it stays in the list but becomes muted
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            
            // Recalculate stats immediately if it was verified
            if (newStatus === 'verified') {
                const tx = transactions.find(t => t.id === id);
                if (tx) {
                    setStats(prev => {
                        const inAdd = tx.type === 'cash_in' ? Number(tx.amount_usd) : 0;
                        const outAdd = tx.type === 'withdraw' ? Number(tx.amount_usd) : 0;
                        return {
                            ...prev,
                            totalIn: prev.totalIn + inAdd,
                            totalOut: prev.totalOut + outAdd,
                            reserve: prev.reserve + inAdd - outAdd
                        };
                    });
                }
            }
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update transaction");
        } finally {
            setProcessingId(null);
        }
    };

    const handleProcessReturns = async () => {
        if (!window.confirm("Are you sure you want to process all due returns right now? This will send funds to users' wallets.")) return;
        
        setIsProcessingReturns(true);
        try {
            const { data: count, error } = await supabase.rpc('process_due_returns');
            if (error) throw error;
            
            toast.success(`Successfully processed ${count} due returns!`);
            fetchDashboardData();
        } catch (error) {
            console.error("Error processing returns:", error);
            toast.error("Failed to process returns");
        } finally {
            setIsProcessingReturns(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-[#F59E0B] animate-spin mb-4" />
                <p className="text-[#94A3B8]">Loading vault...</p>
            </div>
        );
    }

    if (!isAdmin) return null;

    const filteredTransactions = transactions.filter(t => t.type === activeTab);
    const pendingCount = transactions.filter(t => t.type === activeTab && t.status === "pending").length;

    return (
        <div className="space-y-8 animate-fadeInUp pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
                        <Wallet className="text-[#F59E0B]" /> Admin Vault
                    </h1>
                </div>
                
                <button
                    onClick={handleProcessReturns}
                    disabled={isProcessingReturns}
                    className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {isProcessingReturns ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    Process Due Returns
                </button>
            </div>

            {/* Liquidity Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <h2 className="text-4xl font-bold text-[#0F172A]">${stats.reserve.toLocaleString('en-US')}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#ECFDF5] p-2 rounded-lg">
                            <ArrowUpToLine className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <p className="text-sm text-[#475569] font-medium">Total Lifetime Cash In</p>
                    </div>
                    <h2 className="text-3xl font-bold text-[#0F172A]">${stats.totalIn.toLocaleString('en-US')}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#FEF2F2] p-2 rounded-lg">
                            <ArrowDownToLine className="w-5 h-5 text-[#EF4444]" />
                        </div>
                        <p className="text-sm text-[#475569] font-medium">Total Lifetime Cash Out</p>
                    </div>
                    <h2 className="text-3xl font-bold text-[#0F172A]">${stats.totalOut.toLocaleString('en-US')}</h2>
                </div>
            </div>

            {/* Package & Returns Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <p className="text-sm text-[#475569] font-medium">Total Package Sales</p>
                    </div>
                    <h2 className="text-3xl font-bold text-[#0F172A]">${stats.totalPackageSales.toLocaleString('en-US')}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#FFFBEB] p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <p className="text-sm text-[#475569] font-medium">Pending Returns (Debt)</p>
                    </div>
                    <h2 className="text-3xl font-bold text-[#F59E0B]">${stats.totalPendingReturns.toLocaleString('en-US')}</h2>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#E2E8F0] pb-4 pt-4">
                <button
                    onClick={() => setActiveTab("cash_in")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                        activeTab === "cash_in" 
                            ? "bg-[#F59E0B] text-white shadow-lg shadow-amber-900/10" 
                            : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                    }`}
                >
                    <ArrowUpToLine className="w-5 h-5" /> 
                    Cash Ins
                    {pendingCount > 0 && (
                        <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded-full text-xs animate-pulse">
                            {pendingCount} Pending
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("withdraw")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                        activeTab === "withdraw" 
                            ? "bg-[#F59E0B] text-white shadow-lg shadow-amber-900/10" 
                            : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                    }`}
                >
                    <ArrowDownToLine className="w-5 h-5" /> 
                    Withdraws
                    {pendingCount > 0 && (
                        <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded-full text-xs animate-pulse">
                            {pendingCount} Pending
                        </span>
                    )}
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                    <h2 className="text-lg font-bold text-[#0F172A]">Recent Requests</h2>
                    <span className="bg-[#FFFBEB] text-[#B45309] px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                        {transactions.length} Total Entries
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
                            <tr>
                                <th className="py-4 px-6 font-medium">User Info</th>
                                <th className="py-4 px-6 font-medium">Method</th>
                                <th className="py-4 px-6 font-medium">
                                    {activeTab === "cash_in" ? "Trx ID" : "Account Number"}
                                </th>
                                <th className="py-4 px-6 font-medium">Amount Requested</th>
                                <th className="py-4 px-6 font-medium text-right">Actions / Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center text-[#94A3B8]">
                                        <div className="flex flex-col items-center justify-center">
                                            <CheckCircle2 className="w-12 h-12 mb-3 text-[#E2E8F0]" />
                                            <p className="text-lg">No history found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {filteredTransactions.map((tx) => {
                                const isPending = tx.status === 'pending';
                                
                                return (
                                <tr key={tx.id} className={`transition-colors ${isPending ? 'bg-[#FFFBEB] hover:bg-amber-50/50' : 'opacity-70 hover:opacity-100 bg-white hover:bg-[#F8FAFC]'}`}>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-[#0F172A]">{tx.profiles?.full_name || "Unknown"}</div>
                                        <div className="text-xs text-[#475569]">{tx.profiles?.email || "No email"}</div>
                                        <div className="text-[10px] text-[#94A3B8] mt-1">
                                            {new Date(tx.created_at).toLocaleString('en-US')}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="capitalize font-bold px-3 py-1 bg-[#F8FAFC] text-[#0F172A] rounded-full border border-[#E2E8F0]">
                                            {tx.method}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-[#2563EB]">
                                        {tx.payment_tx_id}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-[#0F172A]">${Number(tx.amount_usd).toLocaleString('en-US')}</div>
                                        <div className="text-xs text-[#2563EB] font-bold">{Number(tx.amount_bdt).toLocaleString('en-US')} ৳</div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        {isPending ? (
                                            <div className="space-x-2 flex justify-end">
                                                <button
                                                    onClick={() => handleUpdateStatus(tx.id, "verified")}
                                                    disabled={processingId === tx.id}
                                                    className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === tx.id ? "..." : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(tx.id, "rejected")}
                                                    disabled={processingId === tx.id}
                                                    className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === tx.id ? "..." : "Reject"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end">
                                                {tx.status === 'verified' ? (
                                                    <span className="flex items-center gap-1 text-[#047857] bg-[#ECFDF5] px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                                                        <CheckCircle2 className="w-4 h-4" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[#B91C1C] bg-[#FEF2F2] px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100">
                                                        <XCircle className="w-4 h-4" /> Rejected
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
