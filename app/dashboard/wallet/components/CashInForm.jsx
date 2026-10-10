"use client";

import { ArrowUpToLine, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/app/components/context/LanguageContext";
import toast from "react-hot-toast";

const PaymentMethodBadge = ({ methodKey, name, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-2 rounded-xl transition-all border-2 flex flex-col items-center justify-center flex-1 h-16 ${
        selected
          ? "border-[#2563EB] bg-blue-50 scale-[1.02] ring-1 ring-[#2563EB]"
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
          className={`text-sm font-bold ${selected ? "text-[#2563EB]" : "text-[#0F172A]"}`}
        >
          {name}
        </span>
      </div>
    </button>
  );
};

export default function CashInForm({
  paymentMethods = [],
  selectedMethod,
  setSelectedMethod,
  cashIn,
  setCashIn,
  onSubmit,
  isSubmitting,
  exchangeRate = 120,
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Find currently active payment method object
  const currentMethodObj = paymentMethods.find(
    (m) => m.method_key === selectedMethod
  ) || paymentMethods[0];

  const calculateBDT = (usdAmount) => {
    if (!usdAmount || isNaN(usdAmount)) return 0;
    return Math.floor(Number(usdAmount) * exchangeRate).toLocaleString();
  };

  const handleCopyNumber = () => {
    if (currentMethodObj?.account_number) {
      navigator.clipboard.writeText(currentMethodObj.account_number);
      setCopied(true);
      toast.success("Account info copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-5 flex flex-col h-full"
    >
      <div className="flex items-center gap-3 text-[#2563EB] font-semibold text-lg border-b border-[#E2E8F0] pb-4">
        <ArrowUpToLine className="w-5 h-5" /> {t("walletPage.cashIn") || "Cash In"}
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <label className="text-sm text-[#0F172A] font-medium block">
          {t("walletPage.selectMethod") || "Select Method"}
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
                setCashIn((prev) => ({ ...prev, method: m.method_key }));
              }}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Instruction Box from Database */}
      <div className="text-sm text-[#475569] bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <p>
          Send your exact amount to{" "}
          <span className="block my-2">
            <span
              onClick={handleCopyNumber}
              className="inline-flex items-center gap-2 font-mono font-bold text-[#0F172A] text-lg bg-white px-3 py-1 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm"
              title="Click to copy"
            >
              {currentMethodObj?.account_number || "..."}
              <span className="text-xs font-normal text-[#2563EB] flex items-center gap-1 font-sans">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </span>
            </span>
            {currentMethodObj?.account_type && (
              <span className="text-xs font-semibold text-[#64748B] ml-2">
                ({currentMethodObj.account_type})
              </span>
            )}
          </span>
          via <span className="capitalize text-[#2563EB] font-bold">{currentMethodObj?.name || selectedMethod}</span> first.
          {currentMethodObj?.instructions && (
            <span className="block text-xs text-[#64748B] mt-1.5 italic">
              Note: {currentMethodObj.instructions}
            </span>
          )}
        </p>
      </div>

      {/* Amount input */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm text-[#0F172A] font-medium block">
              {t("walletPage.amountUSD") || "Amount (USD)"}
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
              max="2000"
              step="1"
              placeholder="20 - 2,000"
              className="w-full bg-white text-[#0F172A] p-3 pl-8 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
              value={cashIn.amount}
              onChange={(e) =>
                setCashIn({ ...cashIn, amount: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-[#0F172A] font-medium block">
            You Pay (BDT)
          </label>
          <div className="w-full bg-[#F8FAFC] text-[#2563EB] p-3 rounded-xl border border-[#E2E8F0] font-bold flex items-center justify-between">
            <span>{calculateBDT(cashIn.amount)}</span>
            <span className="text-xs text-[#94A3B8]">৳</span>
          </div>
        </div>
      </div>

      {/* TrxID input */}
      <div className="space-y-1.5 mt-auto pt-2">
        <label className="text-sm text-[#0F172A] font-medium block">
          {t("walletPage.transactionId") || "Transaction ID (TrxID)"}
        </label>
        <input
          type="text"
          placeholder="e.g. 9G3X2M8L"
          className="w-full bg-white text-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all font-mono"
          value={cashIn.trxId}
          onChange={(e) => setCashIn({ ...cashIn, trxId: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
      >
        {isSubmitting ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          t("walletPage.submitCashIn") || "Submit Cash In Request"
        )}
      </button>
    </form>
  );
}

