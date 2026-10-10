"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useLanguage } from "@/app/components/context/LanguageContext";
import Link from "next/link";
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  CalendarDays,
  ImageIcon,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";

export default function MyPackagesPage() {
  const { t } = useLanguage();
  const { user, supabase } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myPackages, setMyPackages] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'completed'

  useEffect(() => {
    if (user) {
      fetchMyPackages();
    }
  }, [user]);

  const fetchMyPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_packages")
        .select(
          `*, packages:package_id ( id, name, image_url, return_multiplier, return_days, price, categories ( name ) )`
        )
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) throw error;
      setMyPackages(data || []);
    } catch (error) {
      console.error("Error fetching my packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered packages
  const filteredPackages = myPackages.filter((item) => {
    if (filter === "active") return item.status !== "completed";
    if (filter === "completed") return item.status === "completed";
    return true;
  });

  // Calculate portfolio totals
  const totalInvested = myPackages.reduce(
    (sum, p) => sum + Number(p.total_paid || 0),
    0
  );
  const totalExpectedReturn = myPackages.reduce(
    (sum, p) => sum + Number(p.return_amount || 0),
    0
  );
  const activeCount = myPackages.filter((p) => p.status !== "completed").length;
  const completedCount = myPackages.filter((p) => p.status === "completed").length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#94A3B8] font-medium text-sm">
          {t("myPackagesPage.loading", "Loading your investment portfolio...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp pb-12">
      {/* Top Header & Portfolio Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] mb-1 tracking-tight flex items-center gap-3">
            {t("myPackagesPage.title", "My Investments")}
          </h1>
          <p className="text-[#64748B] text-sm">
            {t(
              "myPackagesPage.subtitle",
              "Track your active yield contracts, countdown timelines, and maturity payouts."
            )}
          </p>
        </div>

        <Link
          href="/dashboard/packages"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-bold text-xs transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Explore Marketplace <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Portfolio Quick Metrics Bar */}
      {myPackages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Total Capital Invested
            </span>
            <span className="text-xl font-black text-[#0F172A] mt-1 block">
              ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Total Expected Profit
            </span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">
              +${totalExpectedReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Active Contracts
            </span>
            <span className="text-xl font-black text-[#2563EB] mt-1 block">
              {activeCount} {activeCount === 1 ? "Package" : "Packages"}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Matured & Paid Out
            </span>
            <span className="text-xl font-black text-[#059669] mt-1 block">
              {completedCount} Completed
            </span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          All ({myPackages.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "active"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          Active Contracts ({activeCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "completed"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center shadow-xs">
          <Package className="w-16 h-16 text-[#CBD5E1] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">
            {filter === "all"
              ? t("myPackagesPage.noPackages", "No Active Packages")
              : `No ${filter} packages`}
          </h2>
          <p className="text-[#64748B] text-sm max-w-md mx-auto mb-6">
            {t(
              "myPackagesPage.noPackagesDesc",
              "You haven't purchased any investment packages yet. Visit the Marketplace to start growing your wealth."
            )}
          </p>
          <Link
            href="/dashboard/packages"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all"
          >
            Browse Marketplace <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((item) => {
            const pkg = item.packages;
            const isCompleted = item.status === "completed";
            const returnDate = new Date(item.return_at);
            const purchaseDate = item.created_at ? new Date(item.created_at) : null;
            const now = new Date();
            const totalDurationMs = returnDate - (purchaseDate || new Date(returnDate.getTime() - (pkg?.return_days || 1) * 86400000));
            const elapsedMs = Math.max(0, now - (purchaseDate || new Date(returnDate.getTime() - (pkg?.return_days || 1) * 86400000)));
            const progressPercent = isCompleted ? 100 : Math.min(100, Math.max(0, Math.round((elapsedMs / (totalDurationMs || 1)) * 100)));
            const daysRemaining = Math.ceil(
              (returnDate - now) / (1000 * 60 * 60 * 24)
            );
            const returnMultiplier = Number(pkg?.return_multiplier || 0);
            const profitPct = (returnMultiplier * 100).toFixed(0);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between ${
                  isCompleted ? "opacity-90" : ""
                }`}
              >
                {/* Top Banner with Image and Badges */}
                <div className="relative h-44 w-full bg-[#F8FAFC] overflow-hidden">
                  {pkg?.image_url ? (
                    <img
                      src={pkg.image_url}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] bg-gradient-to-br from-slate-50 to-blue-50/50">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Verified Package</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                  {/* Top Left: Category */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#2563EB] shadow-sm uppercase tracking-wide">
                      {pkg?.categories?.name || "Contract"}
                    </span>
                  </div>

                  {/* Top Right: Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t("myPackagesPage.paid", "PAID OUT")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-blue-600/90 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t("myPackagesPage.active", "ACTIVE YIELD")}
                      </span>
                    )}
                  </div>

                  {/* Bottom of Photo: Package Title & Quantity */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-black leading-tight drop-shadow-sm truncate">
                      {pkg?.name}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-slate-200 mt-1">
                      <span>
                        Purchased:{" "}
                        <strong className="text-white font-bold">
                          {item.quantity}{" "}
                          {item.quantity > 1
                            ? t("myPackagesPage.stocks", "units")
                            : t("myPackagesPage.stock", "unit")}
                        </strong>
                      </span>
                      <span className="font-semibold text-emerald-300">
                        {profitPct}% Yield
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body with Detailed Investment Breakdown */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Financial Metrics Ledger */}
                  <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                        Capital Invested
                      </span>
                      <span className="text-base font-black text-[#0F172A] mt-0.5 block">
                        ${Number(item.total_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                        Estimated Profit
                      </span>
                      <span className="text-base font-black text-emerald-600 mt-0.5 block">
                        +${Number(item.return_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Return Date & Timeline Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#64748B] font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                        Maturity Date:
                      </span>
                      <span className="font-bold text-[#0F172A]">
                        {returnDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#64748B] font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Remaining Time:
                      </span>
                      <span
                        className={`font-black ${
                          isCompleted
                            ? "text-[#059669]"
                            : daysRemaining > 0
                            ? "text-[#2563EB]"
                            : "text-[#DC2626]"
                        }`}
                      >
                        {isCompleted
                          ? "Contract Completed"
                          : daysRemaining > 0
                          ? `${daysRemaining} days remaining`
                          : "Due for Payout!"}
                      </span>
                    </div>

                    {/* Timeline Progress Bar */}
                    <div className="pt-1">
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isCompleted
                              ? "bg-emerald-500"
                              : "bg-gradient-to-r from-blue-500 to-indigo-600"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium mt-1">
                        <span>Started</span>
                        <span>{progressPercent}% Complete</span>
                        <span>Payout</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Contract Verification Footer */}
                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Smart Contract #{item.id}
                    </span>
                    <span
                      className={`font-bold text-[11px] ${
                        isCompleted ? "text-emerald-600" : "text-[#2563EB]"
                      }`}
                    >
                      {isCompleted ? "Transferred to Wallet" : "Daily Accrual Active"}
                    </span>
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
