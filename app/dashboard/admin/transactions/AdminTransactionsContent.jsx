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
  ArrowDownToLine,
} from "lucide-react";
import LiquidityMetrics from "@/app/components/shared/LiquidityMetrics";
import PackageMetrics from "@/app/components/shared/PackageMetrics";
import Pagination from "@/app/components/shared/Pagination";

export default function AdminTransactionsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (user) {
      checkAdminAndFetch();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
    }
  }, [currentPage, filterStatus, filterType, dateFrom, dateTo, isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterType, dateFrom, dateTo]);

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
    } catch (error) {
      console.error("Admin check failed:", error);
      router.push("/dashboard");
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("transactions")
        .select(`*, profiles:user_id ( full_name, email )`, { count: 'exact' });

      if (filterStatus !== "all") query = query.eq("status", filterStatus);
      if (filterType !== "all") query = query.eq("type", filterType);
      
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        query = query.gte("created_at", from.toISOString());
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        query = query.lte("created_at", to.toISOString());
      }

      const from = (currentPage - 1) * 15;
      const to = from + 14;

      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      setTransactions(data || []);
      setTotalRecords(count || 0);
      setTotalPages(Math.ceil((count || 0) / 15));

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

  if (!isAdmin) return null;

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

      <div className="space-y-6">
        <LiquidityMetrics />
        <PackageMetrics />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border jus border-[#E2E8F0] shadow-sm flex flex-wrap gap-4 items-center">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            Type
          </label>
          <select
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-md px-3 py-2 text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none block"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="cash_in">Cash In</option>
            <option value="withdraw">Withdraw</option>
            <option value="buy_package">Package Purchase</option>
            <option value="package_return">Profit Return</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            From
          </label>
          <input
            type="date"
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-md px-3 py-2 text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none block w-full"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            To
          </label>
          <input
            type="date"
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-md px-3 py-2 text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none block w-full"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
            Status
          </label>
          <select
            className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-md px-3 py-2 text-sm focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none block"
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
          Showing {transactions.length} of {totalRecords} records
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <h2 className="text-lg font-bold text-[#0F172A]">
            Transaction History
          </h2>
          <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            {totalRecords} Total Entries
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
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#94A3B8]">
                    No transactions found matching criteria.
                  </td>
                </tr>
              )}
              {transactions.map((tx) => (
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
                      className={`font-bold ${tx.type === "withdraw" || tx.type === "package_return" || tx.type === "profit_return" ? "text-[#EF4444]" : "text-[#10B981]"}`}
                    >
                      {tx.type === "withdraw" ||
                      tx.type === "package_return" ||
                      tx.type === "profit_return"
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
