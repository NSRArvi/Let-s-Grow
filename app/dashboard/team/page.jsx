"use client";

import { useState, useEffect } from "react";
import { Users, Copy, Check, UserPlus, Calendar, Mail, TrendingUp } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import toast from "react-hot-toast";

export default function TeamPage() {
  const { user, supabase } = useAuth();
  const [referCode, setReferCode] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTeamData();
    }
  }, [user?.id]);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch own referral code
      const { data: myProfile, error: profileError } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      const myCode = myProfile?.referral_code || "";
      setReferCode(myCode);

      if (!myCode) {
        setIsLoading(false);
        return;
      }

      // 2. Fetch referred users
      const { data: teamData, error: teamError } = await supabase
        .from("profiles")
        .select("*")
        .eq("referred_by", myCode)
        .order("created_at", { ascending: false });

      if (teamError) throw teamError;

      // Map DB fields to the format the table expects
      const formattedTeam = (teamData || []).map((member) => ({
        name: member.full_name || "Unknown User",
        email: member.email || "No email",
        joinDate: new Date(member.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: member.is_verified ? "Verified" : "Pending",
        investment: "$0", // Hardcoded until investment feature is built
      }));

      setTeamMembers(formattedTeam);
    } catch (err) {
      console.error("Error fetching team data:", err);
      toast.error("Failed to load team data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp pb-10 mt-6 lg:mt-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Team</h1>
        <p className="text-gray-400">Manage your referred accounts and track your network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-black/60 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm relative overflow-hidden flex flex-col gap-8">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Your Referral Code</h2>
              <p className="text-sm text-gray-400 mb-6">Share this code with your friends to earn rewards.</p>

              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 flex justify-between items-center group cursor-copy hover:bg-emerald-900/40 transition-colors"
                onClick={() => {
                  if (referCode) {
                    navigator.clipboard.writeText(referCode);
                    toast.success("Referral code copied!");
                  }
                }}
              >
                <span className="text-emerald-300 font-mono font-bold tracking-widest">{referCode || "Loading..."}</span>
                <span className="text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
              </div>
            </div>

            {/* Stats inside the same card */}
            <div className="relative z-10 grid grid-cols-1 gap-4 mt-auto">
              <div className="bg-black/40 p-4 rounded-lg border border-emerald-500/20 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Total Referrals</p>
                  <h3 className="text-xl font-bold text-white">{teamMembers.length}</h3>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg border border-emerald-500/20 flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Team Investment</p>
                  <h3 className="text-xl font-bold text-white">$0</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Referred Accounts Table */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-emerald-500/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Referred Accounts
              </h2>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-900 z-10 shadow-sm shadow-emerald-500/10">
                  <tr className="text-emerald-300 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">User Info</th>
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
                            member.status === "Verified"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {teamMembers.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-10 h-10 mb-2 opacity-50" />
                          No referred accounts yet. Share your code to build your team!
                        </div>
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-emerald-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
                          Loading team data...
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
