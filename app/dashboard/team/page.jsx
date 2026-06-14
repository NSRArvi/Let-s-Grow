"use client";

import { useState } from "react";
import { Users, Copy, Check, UserPlus, Calendar, Mail, TrendingUp } from "lucide-react";

export default function TeamPage() {
  const referCode = "LGX-REF-9X8K2M";
  const [copied, setCopied] = useState(false);

  // Mock data for referred accounts
  const teamMembers = [
    {
      id: "LGX-0042",
      name: "Alex Johnson",
      email: "alex.j@example.com",
      joinDate: "Jan 12, 2024",
      status: "Active",
      investment: "$1,200",
    },
    {
      id: "LGX-0089",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      joinDate: "Feb 05, 2024",
      status: "Active",
      investment: "$3,500",
    },
    {
      id: "LGX-0123",
      name: "Michael Brown",
      email: "m.brown@example.com",
      joinDate: "Feb 28, 2024",
      status: "Pending",
      investment: "$0",
    },
    {
      id: "LGX-0156",
      name: "Emily Davis",
      email: "emily.d@example.com",
      joinDate: "Mar 10, 2024",
      status: "Active",
      investment: "$800",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeInUp px-4 lg:px-8 max-w-6xl mx-auto pb-10 mt-6 lg:mt-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Team</h1>
        <p className="text-gray-400">Manage your referred accounts and track your network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Code Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-900/40 to-black/60 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm relative overflow-hidden h-full flex flex-col justify-center text-center">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Your Referral Code</h2>
              <p className="text-sm text-gray-400 mb-6">Share this code with your friends to earn rewards.</p>

              <div className="flex items-center justify-between bg-black/50 border border-emerald-500/30 rounded-lg p-2 pl-4">
                <span className="text-emerald-400 font-mono font-bold tracking-wider">{referCode}</span>
                <button
                  onClick={handleCopy}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-md transition-colors flex items-center justify-center w-10 h-10"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                </button>
              </div>
              {copied && <p className="text-emerald-400 text-xs mt-2 font-medium">Copied to clipboard!</p>}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-black/40 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Referrals</p>
                <h3 className="text-3xl font-bold text-white">{teamMembers.length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-black/40 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Team Investment</p>
                <h3 className="text-3xl font-bold text-white">$5,500</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referred Accounts Table */}
      <div className="bg-black/40 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Referred Accounts
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-900/20 text-emerald-300 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">User Info</th>
                <th className="px-6 py-4 font-medium">Account ID</th>
                <th className="px-6 py-4 font-medium">Join Date</th>
                <th className="px-6 py-4 font-medium">Investment</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-sm text-gray-300">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-emerald-500/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{member.name}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400">{member.id}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {member.joinDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{member.investment}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        member.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
              {teamMembers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No referred accounts yet. Share your code to build your team!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
