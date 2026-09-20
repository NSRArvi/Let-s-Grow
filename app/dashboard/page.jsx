"use client";

import { useEffect, useState } from "react";
import {
  PackageCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Clock,
  Calendar,
  Crown
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // ✅ ADD THIS
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2"; // ✅ ADD Doughnut

export default function DashboardPage() {
  const [dateTime, setDateTime] = useState(new Date());
  const topInvestors = [
    { id: 'LGX-0021', amount: 12500 },
    { id: 'LGX-0345', amount: 9800 },
    { id: 'LGX-0769', amount: 8200 },
  ]

  const totalRevenue = topInvestors.reduce((sum, investor) => sum + investor.amount, 0)
  // Register chart components
  ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


  // Sample monthly data
  const monthlyInvestmentData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Monthly Investment ($)",
        data: [200, 400, 350, 500, 750, 680, 720, 600, 500, 650, 700, 800],
        backgroundColor: "rgba(16, 185, 129, 0.6)", // emerald-500
        borderRadius: 6,
      },
    ],
  };

  const monthlyInvestmentOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "rgba(45, 212, 191, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#ccc",
        },
        grid: {
          display: false,
        },
      },
    },
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Current Balance",
      value: "$880",
      icon: <Wallet className="text-emerald-400 w-5 h-5" />,
    },
    {
      label: "Total Invested",
      value: "$2,350",
      icon: <ArrowUpRight className="text-green-400 w-5 h-5" />,
    },
    {
      label: "Withdrawn",
      value: "$1,470",
      icon: <ArrowDownRight className="text-red-400 w-5 h-5" />,
    },
    {
      label: "Active Packages",
      value: "5",
      icon: <PackageCheck className="text-yellow-400 w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-10 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <div className="text-sm text-gray-300 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-400" />
            {dateTime.toLocaleTimeString()}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-emerald-400" />
            {dateTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-black/40 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm"
          >
            <div className="mb-3">{item.icon}</div>
            <div className="text-xl font-semibold text-white">{item.value}</div>
            <div className="text-sm text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Account Info + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Account Info + Chart */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {/* Account Info */}
          <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4 h-full">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                <User className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-center space-y-1">
                <div className="text-white font-medium text-lg">#LGX-29013</div>
                <div className="text-sm text-gray-400">Joined: Jan 10, 2024</div>
                <div className="text-sm text-green-400">Status: Verified ✅</div>
              </div>
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20 hidden 2xl:block">
            <div className="flex justify-center items-center">
              <Doughnut
                data={{
                  labels: ["Crypto", "Assets", "Farming", "Electronics"],
                  datasets: [
                    {
                      data: [38, 28, 19, 15],
                      backgroundColor: [
                        "rgba(16, 185, 129, 0.6)", // emerald
                        "rgba(251, 191, 36, 0.6)", // yellow
                        "rgba(34, 197, 94, 0.6)",  // green
                        "rgba(99, 102, 241, 0.6)", // indigo
                      ],
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#ccc",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Top Investors */}
        <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20">
          <h2 className="text-xl font-bold text-white mb-4">Top Investors</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            {topInvestors.map((investor, index) => (
              <li key={investor.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 bg-emerald-600/20 text-white rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                    {index === 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1 rounded-full shadow">
                        🥇
                      </span>
                    )}
                    {index === 1 && (
                      <span className="absolute -top-1 -right-1 bg-gray-300 text-black text-[10px] font-bold px-1 rounded-full shadow">
                        🥈
                      </span>
                    )}
                    {index === 2 && (
                      <span className="absolute -top-1 -right-1 bg-orange-300 text-black text-[10px] font-bold px-1 rounded-full shadow">
                        🥉
                      </span>
                    )}
                  </div>
                  <span className={index === 0 ? "text-white font-semibold" : ""}>
                    #{index + 1} • {investor.id}
                  </span>
                </div>

                <span className={index === 0 ? "text-emerald-400 font-bold" : "text-emerald-400 font-semibold"}>
                  ${investor.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          {/* Total Revenue */}
          <div className="mt-5 pt-4 border-t border-emerald-500/10 flex justify-between items-center text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              Total Revenue
            </span>
            <span className="text-white font-semibold">${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Monthly Investment Chart */}
      <div className="bg-black/30 p-6 rounded-xl border border-emerald-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Monthly Investment Overview</h2>
        <Bar data={monthlyInvestmentData} options={monthlyInvestmentOptions} />
      </div>

      {/* Custom Animations */}
      <style jsx>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  `}</style>
    </div>

  );
}
