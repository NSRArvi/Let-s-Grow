"use client";

import { ArrowDownToLine, RefreshCw } from "lucide-react";
import { useLanguage } from "@/app/components/context/LanguageContext";

const PaymentMethodBadge = ({ methodKey, name, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-2 rounded-xl transition-all border-2 flex flex-col items-center justify-center flex-1 h-16 ${
        selected
          ? "border-[#F59E0B] bg-amber-50 scale-[1.02] ring-1 ring-[#F59E0B]"
          : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
      }`}
    >
      <div className="w-full h-full flex items-center justify-center gap-2">
        <img
          src={`/${methodKey}.png`}
          alt={name}
          className="h-6 w-6 object-contain"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span
          className={`text-sm font-bold ${selected ? "text-[#F59E0B]" : "text-[#0F172A]"}`}
        >
          {name}
        </span>
      </div>
    </button>
  );
};

export default function WithdrawForm({
  paymentMethods = [],
  selectedMethod,
  setSelectedMethod,
  withdraw,
  setWithdraw,
  onSubmit,
  isSubmitting,
  balance = 0,
  exchangeRate = 120,
}) {
  const { t } = useLanguage();

  const currentMethodObj = paymentMethods.find(
    (m) => m.method_key === selectedMethod
  ) || paymentMethods[0];

  const calculateBDT = (usdAmount) => {
    if (!usdAmount || isNaN(usdAmount)) return 0;
    return Math.floor(Number(usdAmount) * exchangeRate).toLocaleString();
  };

  const getAccountPlaceholder = () => {
    if (currentMethodObj?.type === "wallet_address" || selectedMethod === "binance") {
      return "Enter your Binance UID";
    }
    return "Enter your mobile wallet number (e.g. 017xxxxxxxx)";
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-5 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 text-[#F59E0B] font-semibold text-lg border-b border-[#E2E8F0] pb-4">
        <ArrowDownToLine className="w-5 h-5" /> {t("walletPage.withdrawFunds") || "Withdraw"}
      </div>

      {/* Select Receive Method */}
      <div className="space-y-2">
        <label className="text-sm text-[#0F172A] font-medium block">
          {t("walletPage.selectMethod") || "Receive Method"}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {paymentMethods.map((m) => (
            <PaymentMethodBadge
              key={m.method_key}
              methodKey={m.method_key}
              name={m.name}
              selected={selectedMethod === m.method_key}
              onClick={() => {
                setSelectedMethod(m.method_key);
                setWithdraw((prev) => ({ ...prev, method: m.method_key }));
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-sm text-[#475569] bg-[#FFFBEB] border border-amber-100 p-4 rounded-xl">
        <p>
          Funds will be sent to your selected{" "}
          <strong className="text-[#0F172A] capitalize">
            {currentMethodObj?.name || selectedMethod}
          </strong>{" "}
          account after admin verification.
        </p>
      </div>

      {/* Amount input & Fee Breakdown */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm text-[#0F172A] font-medium block">
                {t("walletPage.amountUSD") || "Withdraw Amount (USD)"}
              </label>
              <span className="text-[11px] text-[#2563EB] font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                $20 - $2,000
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                $
              </span>
              <input
                type="number"
                min="20"
                step="1"
                max="2000"
                placeholder="20 - 2,000"
                className="w-full bg-white text-[#0F172A] p-3 pl-8 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none transition-all"
                value={withdraw.amount}
                onChange={(e) =>
                  setWithdraw({ ...withdraw, amount: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-[#0F172A] font-medium block">
              Net Payout (BDT)
            </label>
            <div className="w-full bg-[#F8FAFC] text-[#F59E0B] p-3 rounded-xl border border-[#E2E8F0] font-bold flex items-center justify-between">
              <span>{calculateBDT(Number(withdraw.amount || 0) * 0.98)}</span>
              <span className="text-xs text-[#94A3B8]">৳</span>
            </div>
          </div>
        </div>

        {/* 2% Fee Notice Box */}
        {Number(withdraw.amount) > 0 && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex justify-between text-[#64748B]">
              <span>Deduction from Account:</span>
              <span className="font-bold text-[#0F172A]">${Number(withdraw.amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>Platform Processing Fee (2%):</span>
              <span className="font-bold text-[#EF4444]">-${(Number(withdraw.amount) * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#0F172A] font-bold border-t border-[#E2E8F0] pt-1.5">
              <span>Net Payout to You:</span>
              <span className="text-[#10B981]">${(Number(withdraw.amount) * 0.98).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Account number / address input */}
      <div className="space-y-1.5 mt-auto pt-2">
        <label className="text-sm text-[#0F172A] font-medium block">
          {t("walletPage.walletNumber") || "Account / Wallet Number"}
        </label>
        <input
          type="text"
          placeholder={getAccountPlaceholder()}
          className="w-full bg-white text-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] outline-none transition-all font-mono"
          value={withdraw.number}
          onChange={(e) =>
            setWithdraw({ ...withdraw, number: e.target.value })
          }
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || Number(balance) < 20 || !withdraw.amount || Number(withdraw.amount) < 20 || Number(withdraw.amount) > Number(balance)}
        className="w-full bg-[#F59E0B] hover:bg-[#D97706] transition-colors text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
      >
        {isSubmitting ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          t("walletPage.requestWithdrawal") || "Submit Withdraw Request"
        )}
      </button>
    </form>
  );
}

