"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

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
        .select("total_paid, status")
        .eq("user_id", user.id);

      let totalInvested = 0;
      let activeCount = 0;
      if (myPkgs) {
        totalInvested = myPkgs.reduce(
          (sum, p) => sum + Number(p.total_paid),
          0,
        );
        activeCount = myPkgs.filter((p) => p.status === "active").length;
      }

      const { data: myTxs } = await supabase
        .from("transactions")
        .select("amount_usd")
        .eq("user_id", user.id)
        .eq("type", "withdraw")
        .eq("status", "verified");

      let totalWithdrawn = 0;
      if (myTxs) {
        totalWithdrawn = myTxs.reduce(
          (sum, tx) => sum + Number(tx.amount_usd),
          0,
        );
      }

      setStats({
        balance: profData?.wallet_balance || 0,
        totalInvested,
        totalWithdrawn,
        activePackagesCount: activeCount,
      });

      // Top Investors (Global)
      const { data: allPkgs } = await supabase
        .from("user_packages")
        .select("user_id, total_paid, created_at, packages:package_id(category_id, categories(name)), profiles:user_id(full_name)");

      if (allPkgs) {
        const investorMap = {};
        const monthly = Array(12).fill(0);
        const catMap = {};

        allPkgs.forEach((p) => {
          // Top Investors logic
          if (!investorMap[p.user_id]) {
            investorMap[p.user_id] = {
              id: p.user_id.split("-")[0].toUpperCase(),
              name: p.profiles?.full_name || "Anonymous",
              amount: 0,
            };
          }
          investorMap[p.user_id].amount += Number(p.total_paid);

          // Monthly Data logic (Current year)
          if (p.created_at) {
              const date = new Date(p.created_at);
              if (date.getFullYear() === new Date().getFullYear()) {
                  monthly[date.getMonth()] += Number(p.total_paid);
              }
          }

          // Category Data logic
          if (p.packages?.categories?.name) {
              const catName = p.packages.categories.name;
              catMap[catName] = (catMap[catName] || 0) + Number(p.total_paid);
          }
        });

        const sorted = Object.values(investorMap)
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3);

        setTopInvestors(sorted);
        setMonthlyData(monthly);
        
        setCategoryData({
            labels: Object.keys(catMap),
            data: Object.values(catMap)
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = topInvestors.reduce(
    (sum, investor) => sum + investor.amount,
    0,
  );

  const monthlyInvestmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
    "#2563EB", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316"
  ];

  const statCards = [
    {
      label: "Current Balance",
      value: `$${Number(stats.balance).toLocaleString("en-US")}`,
      icon: <Wallet className="w-5 h-5 text-[#2563EB]" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "Total Invested",
      value: `$${Number(stats.totalInvested).toLocaleString("en-US")}`,
      icon: <ArrowUpRight className="w-5 h-5 text-[#10B981]" />,
      iconBg: "bg-[#ECFDF5]",
    },
    {
      label: "Withdrawn",
      value: `$${Number(stats.totalWithdrawn).toLocaleString("en-US")}`,
      icon: <ArrowDownRight className="w-5 h-5 text-[#EF4444]" />,
      iconBg: "bg-[#FEF2F2]",
    },
    {
      label: "Active Packages",
      value: stats.activePackagesCount,
      icon: <PackageCheck className="w-5 h-5 text-[#F59E0B]" />,
      iconBg: "bg-[#FFFBEB]",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#94A3B8]">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#0F172A]">Overview</h1>
        <div className="text-sm text-[#475569] flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            {dateTime.toLocaleTimeString()}
          </span>
          <span className="w-px h-4 bg-[#E2E8F0]"></span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563EB]" />
            {dateTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5"
          >
            <div className={`mb-3 w-10 h-10 flex items-center justify-center rounded-xl ${item.iconBg}`}>
              {item.icon}
            </div>
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight">{item.value}</div>
            <div className="text-sm text-[#94A3B8] mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Account Info + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Account Info + Chart */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col items-center justify-center gap-4 h-full">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-[#2563EB]" />
                )}
              </div>
              <div className="text-center space-y-2">
                <div className="text-[#0F172A] font-bold text-xl">
                  {profile?.full_name || "Welcome!"}
                </div>
                <div className="text-sm text-[#94A3B8] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#E2E8F0]">
                  Joined:{" "}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "N/A"}
                </div>
                {profile?.is_verified ? (
                  <div className="text-sm text-[#10B981] font-medium flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified
                  </div>
                ) : (
                  <div className="text-sm text-[#F59E0B] font-medium">
                    Unverified
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hidden 2xl:block">
            <div className="flex justify-center items-center h-full">
              {categoryData.labels.length > 0 ? (
                <Doughnut
                  data={{
                    labels: categoryData.labels,
                    datasets: [
                      {
                        data: categoryData.data,
                        backgroundColor: doughnutColors.slice(0, categoryData.labels.length),
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
                        labels: { color: "#475569", padding: 16 },
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-[#94A3B8] text-sm">No investment category data yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Top Investors */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#F59E0B]" /> Top Investors
          </h2>

          {topInvestors.length === 0 ? (
            <div className="text-center py-10 text-[#94A3B8]">
              No investment data yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {topInvestors.map((investor, index) => (
                <li
                  key={investor.id}
                  className="flex justify-between items-center bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center border border-blue-100">
                      <User className="w-5 h-5" />
                      {index === 0 && (
                        <span className="absolute -top-1 -right-1 text-[10px] font-bold">🥇</span>
                      )}
                      {index === 1 && (
                        <span className="absolute -top-1 -right-1 text-[10px] font-bold">🥈</span>
                      )}
                      {index === 2 && (
                        <span className="absolute -top-1 -right-1 text-[10px] font-bold">🥉</span>
                      )}
                    </div>
                    <div>
                      <div className={index === 0 ? "text-[#0F172A] font-bold" : "text-[#0F172A] font-semibold"}>
                        {investor.name}
                      </div>
                      <div className="text-xs text-[#94A3B8]">#{investor.id}</div>
                    </div>
                  </div>

                  <span className="text-[#10B981] font-bold">
                    ${investor.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {topInvestors.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-[#475569]">
                <Crown className="w-4 h-4 text-[#F59E0B]" />
                Top 3 Revenue
              </span>
              <span className="text-[#0F172A] font-bold text-lg">
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Investment Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] hidden md:block">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          Monthly Investment Overview (Current Year)
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
