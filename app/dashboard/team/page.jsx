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

  useEffect(() => { if (user?.id) { fetchTeamData(); } }, [user?.id]);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      const { data: myProfile, error: profileError } = await supabase
        .from("profiles").select("referral_code").eq("id", user.id).single();
      if (profileError) throw profileError;
      const myCode = myProfile?.referral_code || "";
      setReferCode(myCode);
      if (!myCode) { setIsLoading(false); return; }

      const { data: teamData, error: teamError } = await supabase
        .from("profiles").select("*").eq("referred_by", myCode).order("created_at", { ascending: false });
      if (teamError) throw teamError;

      const formattedTeam = (teamData || []).map((member) => ({
        name: member.full_name || "Unknown User", email: member.email || "No email",
        joinDate: new Date(member.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: member.is_verified ? "Verified" : "Pending", investment: "$0",
      }));
      setTeamMembers(formattedTeam);
    } catch (err) { console.error("Error fetching team data:", err); toast.error("Failed to load team data."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-8 animate-fadeInUp pb-10 mt-6 lg:mt-0">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">My Team</h1>
        <p className="text-[#94A3B8]">Manage your referred accounts and track your network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-7 h-7 text-[#2563EB]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Your Referral Code</h2>
              <p className="text-sm text-[#94A3B8] mb-5">Share this code with your friends to earn rewards.</p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex justify-between items-center group cursor-copy hover:bg-blue-100/50 transition-colors"
                onClick={() => { if (referCode) { navigator.clipboard.writeText(referCode); toast.success("Referral code copied!"); } }}
              >
                <span className="text-[#2563EB] font-mono font-bold tracking-widest">{referCode || "Loading..."}</span>
                <span className="text-xs text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-auto">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 rounded-xl text-[#2563EB]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium">Total Referrals</p>
                  <h3 className="text-xl font-bold text-[#0F172A]">{teamMembers.length}</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-4">
                <div className="p-2.5 bg-[#ECFDF5] rounded-xl text-[#10B981]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium">Team Investment</p>
                  <h3 className="text-xl font-bold text-[#0F172A]">$0</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Referred Accounts Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
              <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2563EB]" /> Referred Accounts
              </h2>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#F8FAFC] z-10 border-b border-[#E2E8F0]">
                  <tr className="text-[#94A3B8] text-xs uppercase tracking-wider">
                    <th className="px-6 py-3.5 font-medium">User Info</th>
                    <th className="px-6 py-3.5 font-medium">Join Date</th>
                    <th className="px-6 py-3.5 font-medium">Investment</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-sm">
                  {teamMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0F172A]">{member.name}</span>
                          <span className="text-xs text-[#94A3B8] flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" /> {member.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-[#475569]">
                          <Calendar className="w-4 h-4 text-[#94A3B8]" /> {member.joinDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#0F172A]">{member.investment}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === "Verified"
                            ? "bg-[#ECFDF5] text-[#047857]"
                            : "bg-[#FFFBEB] text-[#B45309]"
                        }`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {teamMembers.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-[#94A3B8]">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-10 h-10 mb-2 text-[#E2E8F0]" />
                          No referred accounts yet. Share your code to build your team!
                        </div>
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-[#2563EB]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin"></div>
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
    </div>
  );
}
