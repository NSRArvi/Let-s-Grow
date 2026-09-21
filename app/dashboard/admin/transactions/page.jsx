"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  ArrowUpToLine,
  ArrowDownToLine
} from "lucide-react";

export default function AdminTransactionsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIn: 0, totalOut: 0, reserve: 0 });

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

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
      fetchTransactions();
    } catch (error) {
      console.error("Admin check failed:", error);
      router.push("/dashboard");
    }
  };

  const fetchTransactions = async () => {
    try {
      // Fetch all transactions
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
                    *,
                    profiles:user_id ( full_name, email )
                `,
        )
        .order("created_at", { ascending: false })
        .limit(500); // Limit to last 500 for performance

      if (error) throw error;
      setTransactions(data || []);

      // Calculate stats
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
      setStats({ totalIn, totalOut, reserve: totalIn - totalOut });

    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#94A3B8]">Loading master ledger...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  // Apply Filters
  const filteredTxs = transactions.filter((tx) => {
    const matchStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchType = filterType === "all" || tx.type === filterType;
    return matchStatus && matchType;
  });

  const renderStatus = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="flex items-center gap-1 text-[#047857] bg-[#ECFDF5] px-2 py-1 rounded-md text-xs font-bold border border-emerald-100 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-[#B91C1C] bg-[#FEF2F2] px-2 py-1 rounded-md text-xs font-bold border border-red-100 w-fit">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[#B45309] bg-[#FFFBEB] px-2 py-1 rounded-md text-xs font-bold border border-amber-100 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
          <FileText className="text-[#2563EB]" /> Master Ledger
        </h1>
        <p className="text-[#94A3B8] text-sm">
          A permanent record of every transaction on the platform.
        </p>
      </div>

      {/* Liquidity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-[#2563EB]/5">
                  <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-50 p-2 rounded-lg">
                          <Wallet className="w-5 h-5 text-[#2563EB]" />
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-wrap gap-4 items-center">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            Type
          </label>
          <select
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-md px-3 py-2 text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="cash_in">Cash In</option>
            <option value="withdraw">Withdraw</option>
            <option value="buy_package">Package Purchase</option>
            <option value="profit_return">Profit Return</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            Status
          </label>
          <select
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-md px-3 py-2 text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-[#475569] font-medium">
          Showing {filteredTxs.length} records
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <h2 className="text-lg font-bold text-[#0F172A]">Transaction History</h2>
          <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            {transactions.length} Total Entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-6 font-medium">Date & Time</th>
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Type & Method</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
              {filteredTxs.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#94A3B8]">
                    No transactions found matching criteria.
                  </td>
                </tr>
              )}
              {filteredTxs.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-4 px-6 text-[#475569]">
                    <div className="font-medium text-[#0F172A]">
                      {new Date(tx.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs mt-1 text-[#94A3B8]">
                      {new Date(tx.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0F172A]">
                      {tx.profiles?.full_name || "Unknown"}
                    </div>
                    <div className="text-xs text-[#475569]">
                      {tx.profiles?.email || "No email"}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="capitalize font-bold text-[#0F172A]">
                      {tx.type.replace("_", " ")}
                    </div>
                    {tx.method && (
                      <div className="text-xs text-[#475569] mt-1 capitalize border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 rounded-full w-fit">
                        via {tx.method}
                      </div>
                    )}
                    {tx.payment_tx_id && (
                      <div className="text-[10px] font-mono text-[#2563EB] mt-1 max-w-[120px] truncate">
                        ID: {tx.payment_tx_id}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`font-bold ${tx.type === "withdraw" || tx.type === "buy_package" ? "text-[#EF4444]" : "text-[#10B981]"}`}
                    >
                      {tx.type === "withdraw" || tx.type === "buy_package"
                        ? "-"
                        : "+"}
                      ${Number(tx.amount_usd).toLocaleString("en-US")}
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-1">
                      {Number(tx.amount_bdt).toLocaleString("en-US")} ৳
                    </div>
                  </td>
                  <td className="py-4 px-6">{renderStatus(tx.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
