"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Wallet,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/components/context/LanguageContext";

export default function BuyPackageModal({
  packageItem,
  onClose,
  onConfirmBuy,
  isBuying,
  userBalance = 0,
  buyQuantity = 1,
  setBuyQuantity,
}) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (packageItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [packageItem]);

  if (!packageItem || !mounted) return null;

  const pricePerUnit = Number(packageItem.price) || 0;
  const totalCost = pricePerUnit * buyQuantity;
  const returnMultiplier = Number(packageItem.return_multiplier || 1);
  const profitPercentage = (returnMultiplier * 100).toFixed(0);
  const expectedProfit = totalCost * returnMultiplier;
  const maxAllowedQuantity = Math.min(5, Number(packageItem.stocks) || 1);
  const hasSufficientBalance = userBalance >= totalCost;
  const shortfall = totalCost - userBalance;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBuying) onClose();
      }}
    >
      <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col my-auto transform transition-all duration-300">
        {/* Header with image banner */}
        <div className="relative bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] text-white p-6 pb-8 overflow-hidden">
          {/* Subtle geometric circles decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/20 rounded-full blur-xl" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isBuying}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/15 hover:bg-white/25 rounded-full p-2 transition-colors disabled:opacity-50"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top category & audit status */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider text-white">
              {packageItem.categories?.name || "Premium Plan"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-100 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified Contract
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mb-1">
            {packageItem.name}
          </h2>
          <p className="text-xs text-blue-100/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Automatic return calculation & daily ledger accrual
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-white -mt-3 rounded-t-3xl relative">
          {/* Investment Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-center border-r border-[#E2E8F0] pr-2">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Unit Price
              </span>
              <span className="text-lg font-black text-[#0F172A]">
                ${pricePerUnit.toLocaleString()}
              </span>
            </div>
            <div className="text-center border-r border-[#E2E8F0] px-2">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Net Profit
              </span>
              <span className="text-lg font-black text-emerald-600 inline-flex items-center gap-0.5">
                <TrendingUp className="w-4 h-4" />
                +{profitPercentage}%
              </span>
            </div>
            <div className="text-center pl-2">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Lock Period
              </span>
              <span className="text-lg font-black text-[#2563EB] inline-flex items-center gap-0.5">
                <Calendar className="w-4 h-4" />
                {packageItem.return_days}d
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-[#0F172A]">
                {t("packagesPage.selectQuantity", "Quantity (Stocks)")}
              </label>
              <span className="text-xs text-[#64748B] font-medium">
                {packageItem.stocks} units remaining
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl p-2 border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setBuyQuantity((q) => Math.max(1, q - 1))}
                disabled={isBuying || buyQuantity <= 1}
                className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-2xl font-black text-[#0F172A] block leading-none">
                  {buyQuantity}
                </span>
                <span className="text-[10px] font-semibold text-[#64748B]">
                  {buyQuantity === 1 ? "unit" : "units"}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setBuyQuantity((q) => Math.min(maxAllowedQuantity, q + 1))
                }
                disabled={isBuying || buyQuantity >= maxAllowedQuantity}
                className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8] text-right">
              Max order limit: 5 units per transaction
            </p>
          </div>

          {/* Payout & Cost Breakdown Card */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-2.5 text-sm">
            <div className="flex justify-between items-center text-[#475569]">
              <span>Subtotal ({buyQuantity}x units)</span>
              <span className="font-bold text-[#0F172A]">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-[#475569]">
              <span className="font-semibold">Estimated Capital Profit (+{profitPercentage}%)</span>
              <span className="font-extrabold text-emerald-600 text-base">
                +${expectedProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Wallet balance comparison */}
            <div className="pt-2 border-t border-dashed border-[#CBD5E1] flex justify-between items-center text-xs">
              <span className="text-[#64748B] flex items-center gap-1.5 font-medium">
                <Wallet className="w-3.5 h-3.5 text-[#2563EB]" />
                Available Wallet Balance:
              </span>
              <span
                className={`font-black ${
                  hasSufficientBalance ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                ${Number(userBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Insufficient Funds Warning & Cash-In CTA */}
          {!hasSufficientBalance && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2 text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <div className="leading-tight">
                  <span className="font-bold block">Insufficient balance</span>
                  You need an additional{" "}
                  <strong>
                    ${shortfall.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>{" "}
                  to complete this purchase.
                </div>
              </div>
              <Link
                href="/dashboard/wallet"
                className="inline-flex items-center gap-1.5 text-[#2563EB] hover:text-[#1D4ED8] font-bold text-xs underline decoration-blue-300 underline-offset-2 ml-6"
              >
                Go to Wallet to Cash In <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBuying}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors disabled:opacity-50"
            >
              {t("packagesPage.cancel", "Cancel")}
            </button>
            <button
              type="button"
              onClick={onConfirmBuy}
              disabled={isBuying || !hasSufficientBalance}
              className="flex-[2] bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.99]"
            >
              {isBuying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t("packagesPage.processing", "Authorizing Purchase...")}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Confirm & Invest ${totalCost.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

