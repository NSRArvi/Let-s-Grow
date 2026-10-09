"use client";

import { useState, useEffect } from "react";
import { Users, Copy, Check, UserPlus, Calendar, Mail, TrendingUp, ShieldCheck, AlertCircle, Award } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import toast from "react-hot-toast";
import BonusMissionCard from "@/app/components/shared/BonusMissionCard";

export default function TeamPage() {
  const { user, supabase } = useAuth();
  const [referCode, setReferCode] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalTeamInvestment, setTotalTeamInvestment] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => { 
    if (user?.id) { 
      fetchTeamData(); 
    } 
  }, [user?.id, refreshTrigger]);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
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

      // Try secure RPC first (bypasses user_packages RLS safely for referred users)
      const { data: rpcMembers, error: rpcError } = await supabase.rpc("get_team_members_with_investment");

      if (!rpcError && rpcMembers) {
        let totalInv = 0;
        const formatted = rpcMembers.map((member) => {
          const userInvestment = Number(member.total_invested || 0);
          totalInv += userInvestment;
          const isVerified = !!member.is_verified;
          const isQualified = isVerified && userInvestment >= 40;

          return {
            id: member.id,
            name: member.full_name || "Unknown User",
            email: member.email || "No email",
            joinDate: new Date(member.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            isVerified,
            investment: `$${userInvestment.toFixed(2)}`,
            rawInvestment: userInvestment,
            isQualified,
          };
        });

        setTotalTeamInvestment(totalInv);
        setTeamMembers(formatted);
        setIsLoading(false);
        return;
      }

      // Fallback direct query
      const { data: teamData, error: teamError } = await supabase
        .from("profiles")
        .select("*")
        .eq("referred_by", myCode)
        .order("created_at", { ascending: false });

      if (teamError) throw teamError;

      const formattedTeam = (teamData || []).map((member) => {
        const isVerified = !!member.is_verified;
        return {
          id: member.id,
          name: member.full_name || "Unknown User", 
          email: member.email || "No email",
          joinDate: new Date(member.created_at).toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric", 
            year: "numeric" 
          }),
          isVerified,
          investment: "$0.00",
          rawInvestment: 0,
          isQualified: false,
        };
      });

      setTeamMembers(formattedTeam);
    } catch (err) { 
      console.error("Error fetching team data:", err); 
      toast.error("Failed to load team data."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const copyToClipboard = () => {
    if (referCode) {
      navigator.clipboard.writeText(referCode);
      setCopied(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp pb-10 mt-6 lg:mt-0">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">My Team & Rewards</h1>
        <p className="text-[#94A3B8]">Manage your network, track team activity, and claim referral bonuses.</p>
      </div>

      {/* Bonus Mission Milestone Card */}
      <BonusMissionCard 
        key={refreshTrigger} 
        onClaimed={() => {
          setRefreshTrigger(prev => prev + 1);
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        {/* Left Column: Info Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-7 h-7 text-[#2563EB]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Your Referral Code</h2>
              <p className="text-sm text-[#94A3B8] mb-5">Share this code with your members to count toward bonuses.</p>

              <div 
                className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex justify-between items-center group cursor-pointer hover:bg-blue-100/60 transition-colors"
                onClick={copyToClipboard}
              >
                <span className="text-[#2563EB] font-mono font-bold tracking-widest text-base">
                  {referCode || "Loading..."}
                </span>
                <span className="text-xs text-[#2563EB] font-semibold flex items-center gap-1">
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-auto">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 rounded-xl text-[#2563EB]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium">Total Team Members</p>
                  <h3 className="text-xl font-bold text-[#0F172A]">{teamMembers.length}</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-4">
                <div className="p-2.5 bg-[#ECFDF5] rounded-xl text-[#10B981]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium">Total Team Investment</p>
                  <h3 className="text-xl font-bold text-[#0F172A]">${totalTeamInvestment.toFixed(2)}</h3>
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center gap-4">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium">Bonus Qualified Members</p>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    {teamMembers.filter(m => m.isQualified).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Referred Accounts Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col h-[650px]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#2563EB]" /> Referred Accounts
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Members must be Verified with at least $40 invested to qualify for your bonus.
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#F8FAFC] z-10 border-b border-[#E2E8F0]">
                  <tr className="text-[#94A3B8] text-xs uppercase tracking-wider">
                    <th className="px-6 py-3.5 font-medium">User Info</th>
                    <th className="px-6 py-3.5 font-medium">Joined</th>
                    <th className="px-6 py-3.5 font-medium">Invested</th>
                    <th className="px-6 py-3.5 font-medium">KYC</th>
                    <th className="px-6 py-3.5 font-medium">Bonus Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-sm">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0F172A]">{member.name}</span>
                          <span className="text-xs text-[#94A3B8] flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" /> {member.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-[#475569] text-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" /> {member.joinDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#0F172A]">
                        {member.investment}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          member.isVerified
                            ? "bg-[#ECFDF5] text-[#047857]"
                            : "bg-[#FFFBEB] text-[#B45309]"
                        }`}>
                          {member.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {member.isQualified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                            <AlertCircle className="w-3 h-3 text-slate-400" />
                            {!member.isVerified 
                              ? "Needs KYC" 
                              : `Needs $${Math.max(0, 40 - member.rawInvestment).toFixed(0)} more`}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {teamMembers.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-[#94A3B8]">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-12 h-12 mb-3 text-[#E2E8F0]" />
                          <p className="font-medium text-[#0F172A]">No referred members yet</p>
                          <p className="text-xs text-[#94A3B8] mt-1 max-w-xs">
                            Share your referral code above to start growing your team and unlock your $20 starter bonus.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-[#2563EB]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin"></div>
                          <span className="text-xs text-slate-500 font-medium">Loading team & investment data...</span>
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

