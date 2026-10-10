"use client";

import { useState, useEffect } from "react";
import { Gift, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import { useLanguage } from "@/app/components/context/LanguageContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function BonusMissionCard({ onClaimed, compact = false }) {
  const { t } = useLanguage();
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [missionData, setMissionData] = useState({
    claimed: false,
    claimedAt: null,
    myInvested: 0,
    requiredMyInvest: 40,
    verifiedMembersCount: 0,
    requiredVerifiedMembers: 2,
    invested40MembersCount: 0,
    requiredInvestedMembers: 2,
    totalReferralsCount: 0,
  });

  useEffect(() => {
    if (user?.id) {
      loadMissionProgress();
    }
  }, [user?.id]);

  const loadMissionProgress = async () => {
    try {
      setLoading(true);

      // Try secure RPC first
      const { data: rpcData, error: rpcError } = await supabase.rpc("get_bonus_mission_progress");

      if (!rpcError && rpcData) {
        if (rpcData.is_admin) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        setMissionData({
          claimed: !!rpcData.claimed,
          claimedAt: rpcData.claimed_at,
          myInvested: Number(rpcData.my_invested || 0),
          requiredMyInvest: Number(rpcData.required_my_invest || 40),
          verifiedMembersCount: Number(rpcData.verified_count || 0),
          requiredVerifiedMembers: Number(rpcData.required_verified || 2),
          invested40MembersCount: Number(rpcData.invested40_count || 0),
          requiredInvestedMembers: Number(rpcData.required_invested40 || 2),
          totalReferralsCount: Number(rpcData.total_referrals || 0),
        });
        setLoading(false);
        return;
      }

      // Fallback if RPC is not created yet
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, welcome_bonus_claimed, welcome_bonus_claimed_at, is_admin")
        .eq("id", user.id)
        .single();

      if (profile?.is_admin) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      const { data: myPackages } = await supabase
        .from("user_packages")
        .select("total_paid")
        .eq("user_id", user.id);

      const myTotalInvested = (myPackages || []).reduce(
        (sum, p) => sum + Number(p.total_paid || 0),
        0
      );

      setMissionData((prev) => ({
        ...prev,
        claimed: !!profile?.welcome_bonus_claimed,
        claimedAt: profile?.welcome_bonus_claimed_at,
        myInvested: myTotalInvested,
      }));
    } catch (err) {
      console.error("Error loading mission progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setClaiming(true);
      const { data, error } = await supabase.rpc("claim_welcome_bonus");

      if (error) throw error;

      if (data?.success) {
        toast.success(data.message || "$20 Bonus claimed successfully! 🎁");
        setMissionData((prev) => ({ ...prev, claimed: true }));
        if (onClaimed) onClaimed();
      } else {
        toast.error(data?.message || "Criteria not met yet.");
      }
    } catch (err) {
      console.error("Error claiming bonus:", err);
      toast.error(err.message || "Failed to claim bonus");
    } finally {
      setClaiming(false);
    }
  };

  if (isAdmin) {
    return null;
  }

  const isStep1Complete = missionData.myInvested >= missionData.requiredMyInvest;
  const isStep2Complete = missionData.verifiedMembersCount >= missionData.requiredVerifiedMembers;
  const isStep3Complete = missionData.invested40MembersCount >= missionData.requiredInvestedMembers;
  const isAllComplete = isStep1Complete && isStep2Complete && isStep3Complete;

  const completedStepsCount = (isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0) + (isStep3Complete ? 1 : 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="h-4 w-72 bg-slate-100 rounded"></div>
      </div>
    );
  }

  // Already claimed state
  if (missionData.claimed) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A] text-base">{t("bonusMission.claimedBanner", "Welcome Bonus Claimed (+$20.00)")}</span>
              <span className="bg-emerald-500/20 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                {t("bonusMission.claimed", "+$20.00 Claimed")}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("bonusMission.claimedDesc", "Your $20.00 starter bonus was credited to your main wallet balance.")}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/wallet"
          className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
        >
          {t("bonusMission.checkWallet", "Check Wallet")} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Compact layout (Dashboard Overview)
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white rounded-2xl p-6 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Gift className="w-5 h-5 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{t("bonusMission.unlockTitle", "Unlock $20 Welcome Bonus")}</h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                    {t("bonusMission.rewardBadge", "Reward $20")}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{t("bonusMission.unlockSubtitle", "Complete the 3 qualification steps to claim your $20 starter reward.")}</p>
              </div>
            </div>

            <Link
              href="/dashboard/team"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t("bonusMission.manageTeam", "Manage Team")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> {t("bonusMission.step1Label", "Step 1: Your Invest")}
                </span>
                <span className={`font-bold ${isStep1Complete ? "text-emerald-400" : "text-amber-400"}`}>
                  ${missionData.myInvested}/${missionData.requiredMyInvest}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isStep1Complete ? "bg-emerald-400" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(100, (missionData.myInvested / missionData.requiredMyInvest) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> {t("bonusMission.step2Label", "Step 2: 2 Verified Users")}
                </span>
                <span className={`font-bold ${isStep2Complete ? "text-emerald-400" : "text-amber-400"}`}>
                  {missionData.verifiedMembersCount}/{missionData.requiredVerifiedMembers}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isStep2Complete ? "bg-emerald-400" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min(100, (missionData.verifiedMembersCount / missionData.requiredVerifiedMembers) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-purple-400" /> {t("bonusMission.step3Label", "Step 3: Members $40 Invest")}
                </span>
                <span className={`font-bold ${isStep3Complete ? "text-emerald-400" : "text-amber-400"}`}>
                  {missionData.invested40MembersCount}/{missionData.requiredInvestedMembers}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isStep3Complete ? "bg-emerald-400" : "bg-purple-500"}`}
                  style={{ width: `${Math.min(100, (missionData.invested40MembersCount / missionData.requiredInvestedMembers) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {t("bonusMission.ruleNote", "2 verified team members must each invest ≥$40 in packages.")}
            </span>

            {isAllComplete ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 animate-bounce hover:animate-none"
              >
                <Sparkles className="w-4 h-4" />
                {claiming ? t("bonusMission.claiming", "Claiming $20...") : t("bonusMission.claimBtn", "Claim $20 Welcome Bonus")}
              </button>
            ) : (
              <Link
                href="/dashboard/team"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/10 font-semibold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                {t("bonusMission.manageTeam", "Manage Team")} ({completedStepsCount}/3 {t("bonusMission.stepsCompleted", "Steps Completed")}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full 3-Step Detailed card (/dashboard/team)
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-xl shrink-0">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t("bonusMission.unlockTitle", "New Member Starter Bonus")}</h2>
                <span className="bg-amber-400/20 text-amber-200 border border-amber-300/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {t("bonusMission.rewardBadge", "Reward: $20.00 USD")}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                {t("bonusMission.unlockSubtitle", "Complete your personal investment and help 2 referred members verify and invest $40 each to claim your $20 reward.")}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            {isAllComplete ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                {claiming ? t("bonusMission.claiming", "Claiming $20...") : t("bonusMission.claimBtn", "Claim $20.00 to Wallet")}
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>{completedStepsCount}/3 {t("bonusMission.stepsCompleted", "steps completed")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Step Checklist Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F8FAFC]">
        {/* Step 1 */}
        <div className={`p-4 rounded-xl border transition-all ${
          isStep1Complete 
            ? "bg-[#ECFDF5] border-emerald-200" 
            : "bg-white border-[#E2E8F0]"
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isStep1Complete ? "bg-emerald-500 text-white" : "bg-blue-50 text-blue-600"
              }`}>
                {isStep1Complete ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{t("bonusMission.step1Label", "Step 1: Your Investment")}</h4>
                <p className="text-xs text-[#64748B]">Invest ≥ $40</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isStep1Complete ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
            }`}>
              ${missionData.myInvested} / ${missionData.requiredMyInvest}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-500 ${isStep1Complete ? "bg-emerald-500" : "bg-blue-600"}`}
              style={{ width: `${Math.min(100, (missionData.myInvested / missionData.requiredMyInvest) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`p-4 rounded-xl border transition-all ${
          isStep2Complete 
            ? "bg-[#ECFDF5] border-emerald-200" 
            : "bg-white border-[#E2E8F0]"
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isStep2Complete ? "bg-emerald-500 text-white" : "bg-indigo-50 text-indigo-600"
              }`}>
                {isStep2Complete ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{t("bonusMission.step2Label", "Step 2: 2 Verified Members")}</h4>
                <p className="text-xs text-[#64748B]">2 team members with KYC verified</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isStep2Complete ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
            }`}>
              {missionData.verifiedMembersCount} / {missionData.requiredVerifiedMembers}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-500 ${isStep2Complete ? "bg-emerald-500" : "bg-indigo-600"}`}
              style={{ width: `${Math.min(100, (missionData.verifiedMembersCount / missionData.requiredVerifiedMembers) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`p-4 rounded-xl border transition-all ${
          isStep3Complete 
            ? "bg-[#ECFDF5] border-emerald-200" 
            : "bg-white border-[#E2E8F0]"
        }`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isStep3Complete ? "bg-emerald-500 text-white" : "bg-purple-50 text-purple-600"
              }`}>
                {isStep3Complete ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{t("bonusMission.step3Label", "Step 3: Members $40 Invest")}</h4>
                <p className="text-xs text-[#64748B]">{t("bonusMission.ruleNote", "2 verified members invest ≥ $40")}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isStep3Complete ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
            }`}>
              {missionData.invested40MembersCount} / {missionData.requiredInvestedMembers}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-500 ${isStep3Complete ? "bg-emerald-500" : "bg-purple-600"}`}
              style={{ width: `${Math.min(100, (missionData.invested40MembersCount / missionData.requiredInvestedMembers) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
