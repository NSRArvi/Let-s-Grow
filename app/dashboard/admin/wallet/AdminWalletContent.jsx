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
} from "lucide-react";
import LiquidityMetrics from "@/app/components/shared/LiquidityMetrics";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Pagination from "@/app/components/shared/Pagination";

export default function AdminWalletPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("cash_in");
  const [processingId, setProcessingId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [confirmModalData, setConfirmModalData] = useState({
    isOpen: false,
    id: null,
    newStatus: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pendingCashInCount, setPendingCashInCount] = useState(0);
  const [pendingWithdrawCount, setPendingWithdrawCount] = useState(0);

  useEffect(() => {
    if (user) {
      checkAdminAndFetch();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [currentPage, activeTab, refreshTrigger, isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch pending counts
      const [{ count: cashInCount }, { count: withdrawCount }] = await Promise.all([
        supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "cash_in").eq("status", "pending"),
        supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "withdraw").eq("status", "pending"),
      ]);
      setPendingCashInCount(cashInCount || 0);
      setPendingWithdrawCount(withdrawCount || 0);

      const from = (currentPage - 1) * 15;
      const to = from + 14;

      // 2. Fetch paginated transactions for activeTab
      const { data: txs, count, error: txError } = await supabase
        .from("transactions")
        .select(`*, profiles:user_id ( full_name, email )`, { count: "exact" })
        .eq("type", activeTab)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (txError) throw txError;

      // Sort to ensure pending is always at the top, then by date
      const sortedTxs = (txs || []).sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0; // fallback to created_at descending from DB
      });

      setTransactions(sortedTxs);
      setTotalRecords(count || 0);
      setTotalPages(Math.ceil((count || 0) / 15));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load vault data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessClick = (id, newStatus) => {
    setConfirmModalData({ isOpen: true, id, newStatus });
  };

  const executeUpdateStatus = async () => {
    const { id, newStatus } = confirmModalData;
    if (!id || !newStatus) return;

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Transaction ${newStatus} successfully!`);

      // Update local state so it stays in the list but becomes muted
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
      );

      // Recalculate stats immediately if it was verified
      if (newStatus === "verified") {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update transaction");
    } finally {
      setProcessingId(null);
      setConfirmModalData({ isOpen: false, id: null, newStatus: null });
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

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
            <Wallet className="text-[#F59E0B]" /> Admin Vault
          </h1>
        </div>
      </div>

      <LiquidityMetrics refreshTrigger={refreshTrigger} />

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
          {pendingCashInCount > 0 && (
            <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded-full text-xs animate-pulse">
              {pendingCashInCount} Pending
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
          {pendingWithdrawCount > 0 && (
            <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded-full text-xs animate-pulse">
              {pendingWithdrawCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
          <h2 className="text-lg font-bold text-[#0F172A]">Recent Requests</h2>
          <span className="bg-[#FFFBEB] text-[#B45309] px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
            {totalRecords} Total Entries
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
                <th className="py-4 px-6 font-medium text-right">
                  Actions / Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-[#94A3B8]">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 mb-3 text-[#E2E8F0]" />
                      <p className="text-lg">No history found.</p>
                    </div>
                  </td>
                </tr>
              )}
              {transactions.map((tx) => {
                const isPending = tx.status === "pending";

                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors ${isPending ? "bg-[#FFFBEB] hover:bg-amber-50/50" : "opacity-70 hover:opacity-100 bg-white hover:bg-[#F8FAFC]"}`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0F172A]">
                        {tx.profiles?.full_name || "Unknown"}
                      </div>
                      <div className="text-xs text-[#475569]">
                        {tx.profiles?.email || "No email"}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] mt-1">
                        {new Date(tx.created_at).toLocaleString("en-US")}
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
                      <div className="font-bold text-[#0F172A]">
                        ${Number(tx.amount_usd).toLocaleString("en-US")}
                      </div>
                      <div className="text-xs text-[#2563EB] font-bold">
                        {Number(tx.amount_bdt).toLocaleString("en-US")} ৳
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isPending ? (
                        <div className="space-x-2 flex justify-end">
                          <button
                            onClick={() =>
                              handleProcessClick(tx.id, "verified")
                            }
                            disabled={processingId === tx.id}
                            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                          >
                            {processingId === tx.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() =>
                              handleProcessClick(tx.id, "rejected")
                            }
                            disabled={processingId === tx.id}
                            className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                          >
                            {processingId === tx.id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          {tx.status === "verified" ? (
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
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <ConfirmModal
        isOpen={confirmModalData.isOpen}
        onClose={() => setConfirmModalData({ isOpen: false, id: null, newStatus: null })}
        onConfirm={executeUpdateStatus}
        title={confirmModalData.newStatus === "verified" ? "Approve Transaction" : "Reject Transaction"}
        message={
          confirmModalData.newStatus === "verified"
            ? "Are you sure you want to approve this transaction? The user's balance will be updated."
            : "Are you sure you want to reject this transaction? The user will be notified."
        }
        confirmText={confirmModalData.newStatus === "verified" ? "Yes, Approve" : "Yes, Reject"}
        isLoading={processingId !== null}
      />
    </div>
  );
}
