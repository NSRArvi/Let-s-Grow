"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/app/components/AuthProvider";
import {
  PackageCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Clock,
  Calendar,
  Crown,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Copy,
  ShieldCheck,
} from "lucide-react";
import BonusMissionCard from "@/app/components/shared/BonusMissionCard";
import { useLanguage } from "@/app/components/context/LanguageContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, supabase } = useAuth();
  const [dateTime, setDateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic state
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    balance: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    activePackagesCount: 0,
  });
  const [topInvestors, setTopInvestors] = useState([]);
  const [upcomingPackage, setUpcomingPackage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
  const [categoryData, setCategoryData] = useState({ labels: [], data: [] });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: profData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profData);

      const { data: myPkgs } = await supabase
        .from("user_packages")
        .select(
          "total_paid, return_amount, return_at, created_at, status, packages:package_id(id, name, return_days, return_multiplier, category_id, categories(name))"
        )
        .eq("user_id", user.id);

      let totalInvested = 0;
      let activeCount = 0;
      let nextMaturing = null;

      if (myPkgs) {
        totalInvested = myPkgs.reduce(
          (sum, p) => sum + Number(p.total_paid || 0),
          0
        );
        const activeList = myPkgs.filter((p) => p.status === "active");
        activeCount = activeList.length;

        if (activeList.length > 0) {
          // Find earliest active package return
          activeList.sort((a, b) => new Date(a.return_at) - new Date(b.return_at));
          nextMaturing = activeList[0];
        }
      }

      setUpcomingPackage(nextMaturing);

      const { data: myTxs } = await supabase
        .from("transactions")
        .select("amount_usd")
        .eq("user_id", user.id)
        .eq("type", "withdraw")
        .eq("status", "verified");

      let totalWithdrawn = 0;
      if (myTxs) {
        totalWithdrawn = myTxs.reduce(
          (sum, tx) => sum + Number(tx.amount_usd || 0),
          0
        );
      }

      setStats({
        balance: profData?.wallet_balance || 0,
        totalInvested,
        totalWithdrawn,
        activePackagesCount: activeCount,
      });

      // If user is Admin, load platform-wide top investors and system analytics
      if (profData?.is_admin) {
        try {
          const { data: topData, error: topError } = await supabase.rpc(
            "get_top_investors",
            { limit_count: 5 }
          );
          if (!topError && topData && topData.length > 0) {
            setTopInvestors(topData);
          }
        } catch (err) {
          console.error("Error loading top investors:", err);
        }

        const { data: allPkgs } = await supabase
          .from("user_packages")
          .select(
            "user_id, total_paid, created_at, packages:package_id(category_id, categories(name)), profiles:user_id(full_name)"
          );

        if (allPkgs) {
          const investorMap = {};
          const monthly = Array(12).fill(0);
          const catMap = {};

          allPkgs.forEach((p) => {
            if (!investorMap[p.user_id]) {
              investorMap[p.user_id] = {
                id: p.user_id.split("-")[0].toUpperCase(),
                name: p.profiles?.full_name || "Anonymous",
                amount: 0,
              };
            }
            investorMap[p.user_id].amount += Number(p.total_paid);

            if (p.created_at) {
              const date = new Date(p.created_at);
              if (date.getFullYear() === new Date().getFullYear()) {
                monthly[date.getMonth()] += Number(p.total_paid);
              }
            }

            if (p.packages?.categories?.name) {
              const catName = p.packages.categories.name;
              catMap[catName] = (catMap[catName] || 0) + Number(p.total_paid);
            }
          });

          setTopInvestors((prev) => {
            if (prev && prev.length > 0) return prev;
            return Object.values(investorMap)
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5);
          });

          setMonthlyData(monthly);
          setCategoryData({
            labels: Object.keys(catMap),
            data: Object.values(catMap),
          });
        }
      } else {
        // Regular user: private view, strictly no global top investors
        setTopInvestors([]);

        // Populate personal monthly investment analytics & category breakdown
        if (myPkgs) {
          const monthly = Array(12).fill(0);
          const catMap = {};

          myPkgs.forEach((p) => {
            if (p.created_at) {
              const date = new Date(p.created_at);
              if (date.getFullYear() === new Date().getFullYear()) {
                monthly[date.getMonth()] += Number(p.total_paid || 0);
              }
            }

            if (p.packages?.categories?.name) {
              const catName = p.packages.categories.name;
              catMap[catName] = (catMap[catName] || 0) + Number(p.total_paid || 0);
            }
          });

          setMonthlyData(monthly);
          setCategoryData({
            labels: Object.keys(catMap),
            data: Object.values(catMap),
          });
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReferral = () => {
    if (!profile?.referral_code) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopiedCode(true);
    toast.success(t("dashboard.referralCopied", "Referral code copied!"));
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getPayoutInfo = (pkg) => {
    if (!pkg || !pkg.return_at) return null;
    const returnDate = new Date(pkg.return_at);
    const now = new Date();
    const isDue = returnDate <= now;
    const diffMs = returnDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    let countdownText = "";
    if (isDue) {
      countdownText = t("dashboard.payoutReady", "Ready for Settlement");
    } else if (diffDays > 1) {
      countdownText = `${diffDays} ${t("dashboard.daysRemaining", "days remaining")}`;
    } else {
      countdownText = `${Math.max(1, diffHours)} ${t("dashboard.hoursRemaining", "hours remaining")}`;
    }

    const createdAt = new Date(pkg.created_at || now);
    const totalDuration = returnDate - createdAt;
    const elapsed = Math.max(0, now - createdAt);
    const progressPercent =
      totalDuration > 0
        ? Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)))
        : 100;

    return {
      isDue,
      countdownText,
      returnDateStr: returnDate.toLocaleDateString(),
      progressPercent: isDue ? 100 : progressPercent,
    };
  };

  const totalRevenue = topInvestors.reduce(
    (sum, investor) => sum + investor.amount,
    0,
  );

  const monthlyInvestmentData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Investment ($)",
        data: monthlyData,
        backgroundColor: "#2563EB",
        borderRadius: 6,
      },
    ],
  };

  const monthlyInvestmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#94A3B8" },
        grid: { color: "#F1F5F9" },
      },
      x: { ticks: { color: "#94A3B8" }, grid: { display: false } },
    },
  };

  const doughnutColors = [
    "#2563EB",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#F97316",
  ];

  const statCards = [
    {
      label: t("dashboard.currentBalance", "Current Balance"),
      value: `$${Number(stats.balance).toLocaleString("en-US")}`,
      icon: <Wallet className="w-5 h-5 text-[#2563EB]" />,
      iconBg: "bg-blue-50",
    },
    {
      label: t("dashboard.totalInvested", "Total Invested"),
      value: `$${Number(stats.totalInvested).toLocaleString("en-US")}`,
      icon: <ArrowUpRight className="w-5 h-5 text-[#10B981]" />,
      iconBg: "bg-[#ECFDF5]",
    },
    {
      label: t("dashboard.withdrawn", "Withdrawn"),
      value: `$${Number(stats.totalWithdrawn).toLocaleString("en-US")}`,
      icon: <ArrowDownRight className="w-5 h-5 text-[#EF4444]" />,
      iconBg: "bg-[#FEF2F2]",
    },
    {
      label: t("dashboard.activePackages", "Active Packages"),
      value: stats.activePackagesCount,
      icon: <PackageCheck className="w-5 h-5 text-[#F59E0B]" />,
      iconBg: "bg-[#FFFBEB]",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#94A3B8]">{t("dashboard.loadingDashboard", "Loading your dashboard...")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      {/* Header with Integrated Account Info */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#2563EB] dark:text-blue-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                {t("dashboard.welcome", "Welcome back")}, {profile?.full_name || "User"}!
              </h1>
              {profile?.is_verified ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t("dashboard.verified", "Verified")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {t("dashboard.unverified", "Unverified")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8] mt-1 flex-wrap">
              <span>
                {t("dashboard.joined", "Joined")}:{" "}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="font-mono text-[#64748B] dark:text-slate-400">
                ID: #{profile?.id ? profile.id.split("-")[0].toUpperCase() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Clock / Calendar */}
        <div className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 flex items-center gap-3 bg-[#F8FAFC] dark:bg-slate-950/40 px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 shrink-0 self-start lg:self-center">
          <span className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            {dateTime.toLocaleTimeString()}
          </span>
          <span className="w-px h-4 bg-[#E2E8F0] dark:bg-slate-800"></span>
          <span className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            {dateTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Bonus Mission Widget (Compact) */}
      <BonusMissionCard compact={true} onClaimed={fetchDashboardData} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5"
          >
            <div
              className={`mb-3 w-10 h-10 flex items-center justify-center rounded-xl ${item.iconBg}`}
            >
              {item.icon}
            </div>
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {item.value}
            </div>
            <div className="text-sm text-[#94A3B8] mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Allocation + Leaderboard / Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Portfolio Allocation Doughnut Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A] dark:text-white leading-tight">
                    {profile?.is_admin
                      ? t("dashboard.platformAllocation", "Platform Investment Allocation")
                      : t("dashboard.portfolioAllocation", "Portfolio Category Allocation")}
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    {profile?.is_admin
                      ? t("dashboard.platformAllocationDesc", "Distribution of capital across active product categories.")
                      : t("dashboard.portfolioAllocationDesc", "Distribution of your invested funds across categories.")}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 flex items-center justify-center my-2">
              {categoryData.labels.length > 0 ? (
                <Doughnut
                  data={{
                    labels: categoryData.labels,
                    datasets: [
                      {
                        data: categoryData.data,
                        backgroundColor: doughnutColors.slice(
                          0,
                          categoryData.labels.length
                        ),
                        borderColor: "#FFFFFF",
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: "#94A3B8",
                          padding: 16,
                          font: { size: 12 },
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const val = context.raw || 0;
                            return ` $${Number(val).toLocaleString()}`;
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-12 text-[#94A3B8] text-sm flex flex-col items-center gap-2">
                  <PackageCheck className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  <span>{t("dashboard.noInvestmentCategory", "No investment category data yet.")}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center text-xs text-[#64748B] dark:text-slate-400">
            <span>{categoryData.labels.length} {t("dashboard.categoriesActive", "active categories")}</span>
            <Link
              href="/dashboard/packages"
              className="text-[#2563EB] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              {t("dashboard.exploreMore", "Explore Categories")} <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Side: Admin Top Investors OR User Growth & Next Payout Radar */}
        {profile?.is_admin ? (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] dark:text-white leading-tight">
                      {t("dashboard.adminTopInvestors", "Top Platform Investors")}
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      {t("dashboard.adminTopInvestorsDesc", "Live ranking of top capital providers across the platform.")}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/admin/users"
                  className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  {t("dashboard.manageUsers", "Manage Users")} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Admin Metrics Pills */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#F8FAFC] dark:bg-slate-950/40 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-xs text-[#94A3B8] font-medium">{t("dashboard.topVolume", "Top 5 Volume")}</div>
                  <div className="text-base font-bold text-[#0F172A] dark:text-white mt-0.5">${totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-[#F8FAFC] dark:bg-slate-950/40 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
                  <div className="text-xs text-[#94A3B8] font-medium">{t("dashboard.avgTicket", "Avg Ticket")}</div>
                  <div className="text-base font-bold text-[#10B981] mt-0.5">
                    ${topInvestors.length ? Math.round(totalRevenue / topInvestors.length).toLocaleString() : 0}
                  </div>
                </div>
              </div>

              {topInvestors.length === 0 ? (
                <div className="text-center py-8 text-[#94A3B8]">
                  {t("dashboard.noInvestmentData", "No investment data yet.")}
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {topInvestors.map((investor, index) => {
                    const isDiamond = Number(investor.amount) >= 1000;
                    const isPlatinum = Number(investor.amount) >= 500 && Number(investor.amount) < 1000;
                    return (
                      <li
                        key={investor.id || index}
                        className="flex justify-between items-center bg-[#F8FAFC] dark:bg-slate-950/40 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shrink-0 font-bold text-xs">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#0F172A] dark:text-white font-semibold text-sm">
                                {investor.name}
                              </span>
                              {isDiamond ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                                  💎 Diamond
                                </span>
                              ) : isPlatinum ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                                  🏆 Platinum
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                                  🌟 Gold
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#94A3B8]">
                              #{investor.id}
                            </div>
                          </div>
                        </div>

                        <span className="text-[#10B981] font-bold text-sm">
                          ${Number(investor.amount).toLocaleString()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {t("dashboard.adminPrivilege", "Restricted Admin Intelligence")}
              </span>
              <Link
                href="/dashboard/admin/returns"
                className="text-[#2563EB] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {t("dashboard.viewReturns", "Review Returns")} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] dark:text-white leading-tight">
                      {t("dashboard.nextPayoutRadar", "My Growth & Next Payout Radar")}
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      {t("dashboard.radarSubtitle", "Real-time tracking of upcoming package returns & bonuses.")}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/my-packages"
                  className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  {t("dashboard.myPackages", "My Packages")} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {upcomingPackage ? (
                (() => {
                  const info = getPayoutInfo(upcomingPackage);
                  return (
                    <div className="bg-gradient-to-br from-emerald-50/60 via-teal-50/20 to-transparent dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-transparent border border-emerald-500/20 rounded-2xl p-4 mb-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            {t("dashboard.nextUpcomingPayout", "Next Upcoming Payout")}
                          </span>
                          <h3 className="text-base font-bold text-[#0F172A] dark:text-white mt-0.5">
                            {upcomingPackage.packages?.name || t("dashboard.activePackage", "Active Package")}
                          </h3>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            info.isDue
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse"
                              : "bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 border-blue-200 dark:border-blue-800/40"
                          }`}
                        >
                          {info.countdownText}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 my-2">
                        <span className="text-2xl font-extrabold text-[#10B981]">
                          +${Number(upcomingPackage.return_amount || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-xs text-[#64748B] dark:text-slate-400">
                          {t("dashboard.expectedMaturity", "expected on")} {info.returnDateStr}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-[#64748B] dark:text-slate-400 mb-1 font-medium">
                          <span>{t("dashboard.cycleProgress", "Maturity Cycle Progress")}</span>
                          <span className="font-bold text-[#0F172A] dark:text-white">{info.progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${info.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-[#F8FAFC] dark:bg-slate-950/40 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-4 mb-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 mx-auto flex items-center justify-center mb-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                    {t("dashboard.noActivePackages", "Start Earning Daily Yield")}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {t(
                      "dashboard.noActivePackagesDesc",
                      "Activate an investment package now to start receiving guaranteed maturity payouts."
                    )}
                  </p>
                  <Link
                    href="/dashboard/packages"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {t("dashboard.explorePackages", "Explore Packages")} <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Quick Referral Share & Booster */}
              <div className="bg-[#F8FAFC] dark:bg-slate-950/40 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    {t("dashboard.referralBooster", "Invite & Earn 7% Direct Commission")}
                  </span>
                  <Link
                    href="/dashboard/team"
                    className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline"
                  >
                    {t("dashboard.viewTeam", "View Team")}
                  </Link>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 mb-2">
                  {t("dashboard.shareCodeDesc", "Share your personal invitation code with friends:")}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg px-3 py-1.5 font-mono font-bold text-xs text-[#0F172A] dark:text-white tracking-wider truncate">
                    {profile?.referral_code || "..."}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? t("dashboard.copied", "Copied") : t("dashboard.copy", "Copy")}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-2">
              <Link
                href="/dashboard/wallet"
                className="flex-1 text-center text-xs font-semibold text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white bg-[#F8FAFC] dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 py-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 transition-colors"
              >
                {t("dashboard.deposit", "Deposit")}
              </Link>
              <Link
                href="/dashboard/packages"
                className="flex-1 text-center text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 py-2 rounded-lg transition-colors"
              >
                {t("dashboard.investNow", "Invest Now")}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Investment Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hidden md:block">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          {t("dashboard.monthlyInvestmentOverview", "Monthly Investment Overview (Current Year)")}
        </h2>
        <div className="h-64">
          <Bar
            data={monthlyInvestmentData}
            options={monthlyInvestmentOptions}
          />
        </div>
      </div>
    </div>
  );
}
