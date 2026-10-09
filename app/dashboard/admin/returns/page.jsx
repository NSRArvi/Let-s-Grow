"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RefreshCw, Users, Zap, CheckSquare } from "lucide-react";
import PackageMetrics from "@/app/components/shared/PackageMetrics";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Pagination from "@/app/components/shared/Pagination";

export default function AdminReturnsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dueReturns, setDueReturns] = useState([]);
  const [paidReturns, setPaidReturns] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("due");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);

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
    } catch (error) {
      console.error("Admin check failed:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReturnsData();
    }
  }, [currentPage, activeTab, refreshTrigger, isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [activeTab]);

  const fetchReturnsData = async () => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();

      // Fetch counts for tabs
      const [dueResponse, paidResponse] = await Promise.all([
        supabase.from("user_packages").select("*", { count: "exact", head: true }).eq("status", "active").lte("return_at", now),
        supabase.from("user_packages").select("*", { count: "exact", head: true }).eq("status", "completed"),
      ]);
      setDueCount(dueResponse.count || 0);
      setPaidCount(paidResponse.count || 0);

      const from = (currentPage - 1) * 15;
      const to = from + 14;

      let query = supabase
        .from("user_packages")
        .select(`id, user_id, quantity, total_paid, return_amount, return_at, status, profiles:user_id ( full_name, email ), packages:package_id ( name )`, { count: 'exact' });

      if (activeTab === "due") {
        query = query.eq("status", "active").lte("return_at", now).order("return_at", { ascending: true });
      } else {
        query = query.eq("status", "completed").order("return_at", { ascending: false });
      }

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;

      if (activeTab === "due") {
        setDueReturns(data || []);
      } else {
        setPaidReturns(data || []);
      }

      setTotalRecords(count || 0);
      setTotalPages(Math.ceil((count || 0) / 15));
      // setSelectedIds([]); // Do not reset selection on page change if you want them to persist, or keep it if needed. Actually we did reset on activeTab change.
    } catch (error) {
      console.error("Error fetching returns:", error);
      toast.error("Failed to load returns data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(dueReturns.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleProcessClick = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one return to process.");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const executeProcessSelected = async () => {
    setIsProcessing(true);
    try {
      const { data: count, error } = await supabase.rpc(
        "process_selected_returns",
        {
          p_ids: selectedIds,
        },
      );

      if (error) {
        console.warn("RPC failed, falling back to JS loop...");
        const packagesToProcess = dueReturns.filter(p => selectedIds.includes(p.id));
        let processed = 0;
        
        for (const pkg of packagesToProcess) {
          // 1. Mark package as completed
          const { error: pkgError } = await supabase
            .from('user_packages')
            .update({ status: 'completed' })
            .eq('id', pkg.id);
            
          if (pkgError) throw pkgError;
          
          // 2. Fetch current balance
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('wallet_balance')
            .eq('id', pkg.user_id)
            .single();
            
          if (profileError) throw profileError;
          
          // 3. Update balance
          const newBalance = (profileData.wallet_balance || 0) + Number(pkg.return_amount);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', pkg.user_id);
            
          if (updateError) throw updateError;
          processed++;
        }
        
        toast.success(`Successfully processed ${processed} returns (Fallback)!`);
      } else {
        toast.success(
          `Successfully processed ${count || selectedIds.length} returns!`,
        );
      }

      fetchReturnsData();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error processing returns:", error);
      toast.error(
        "Failed to process returns.",
      );
    } finally {
      setIsProcessing(false);
      setIsConfirmModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#94A3B8]">Loading returns data...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
            <RefreshCw className="text-[#2563EB]" /> Manage Returns
          </h1>
          <p className="text-[#94A3B8] text-sm">
            Process matured packages and pay out users.
          </p>
        </div>
        <button
          onClick={handleProcessClick}
          disabled={isProcessing || selectedIds.length === 0}
          className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
          Process Selected ({selectedIds.length})
        </button>
      </div>

      <PackageMetrics refreshTrigger={refreshTrigger} />

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#E2E8F0] pb-4">
        <button
          onClick={() => setActiveTab("due")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "due"
              ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/10"
              : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          Due Returns
          {dueCount > 0 && (
            <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded-full text-xs animate-pulse">
              {dueCount} Pending
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "paid"
              ? "bg-[#10B981] text-white shadow-lg shadow-emerald-900/10"
              : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
          }`}
        >
          <Users className="w-5 h-5" />
          Already Paid
          <span className="bg-[#E2E8F0] text-[#475569] px-2 py-0.5 rounded-full text-xs">
            {paidCount}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            {activeTab === "due" ? (
              <>
                <CheckSquare className="w-5 h-5 text-[#475569]" /> Due Returns
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-[#475569]" /> Paid Returns
              </>
            )}
          </h2>
          <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            {totalRecords} Total Entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
              <tr>
                {activeTab === "due" && (
                  <th className="py-4 px-6 font-medium w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]"
                      checked={
                        selectedIds.length === dueReturns.length &&
                        dueReturns.length > 0
                      }
                      onChange={handleSelectAll}
                      disabled={dueReturns.length === 0}
                    />
                  </th>
                )}
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Package Info</th>
                <th className="py-4 px-6 font-medium">
                  {activeTab === "due" ? "Amount to Pay" : "Amount Paid"}
                </th>
                <th className="py-4 px-6 font-medium">
                  {activeTab === "due" ? "Due Date" : "Paid Date"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
              {activeTab === "due" ? (
                dueReturns.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-[#94A3B8]"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <CheckSquare className="w-10 h-10 mb-3 text-[#E2E8F0]" />
                        <p>No returns are currently due.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dueReturns.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => handleSelectOne(item.id)}
                    >
                      <td
                        className="py-4 px-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#0F172A]">
                          {item.profiles?.full_name || "Unknown"}
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          {item.profiles?.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#475569]">
                          {item.packages?.name || "Unknown Package"}
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          Paid: $
                          {Number(item.total_paid).toLocaleString("en-US")}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#10B981]">
                          ${Number(item.return_amount).toLocaleString("en-US")}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-[#EF4444] font-medium">
                          {new Date(item.return_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          {new Date(item.return_at).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : paidReturns.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-[#94A3B8]">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-10 h-10 mb-3 text-[#E2E8F0]" />
                      <p>No returns have been paid yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paidReturns.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0F172A]">
                        {item.profiles?.full_name || "Unknown"}
                      </div>
                      <div className="text-xs text-[#94A3B8]">
                        {item.profiles?.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#475569]">
                        {item.packages?.name || "Unknown Package"}
                      </div>
                      <div className="text-xs text-[#94A3B8]">
                        Paid: ${Number(item.total_paid).toLocaleString("en-US")}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#10B981]">
                        ${Number(item.return_amount).toLocaleString("en-US")}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[#94A3B8] font-medium">
                        {new Date(item.return_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeProcessSelected}
        title="Process Returns"
        message={`Are you sure you want to process ${selectedIds.length} selected returns? This action will immediately send funds to the users' balances and cannot be undone.`}
        confirmText="Process Now"
        isLoading={isProcessing}
      />
    </div>
  );
}
