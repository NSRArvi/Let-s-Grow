"use client";

import { Wallet, Banknote, ArrowDownToLine } from "lucide-react";
import { useLanguage } from "@/app/components/context/LanguageContext";

export default function WalletBalances({ balance = 0, totalInvested = 0, totalWithdrawn = 0 }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
      {/* Current Balance */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] relative overflow-hidden flex items-center justify-between sm:block">
        <div className="absolute -right-4 -top-4 text-[#2563EB]/5 hidden sm:block pointer-events-none">
          <Wallet className="w-24 lg:w-28 h-24 lg:h-28" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2563EB]" />
            </div>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">
              {t("walletPage.balance") || "Balance"}
            </p>
          </div>
          <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
            ${Number(balance).toLocaleString("en-US")}
          </h2>
        </div>
      </div>

      {/* Invested */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex items-center justify-between sm:block">
        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
            </div>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">
              {t("walletPage.invested") || "Invested"}
            </p>
          </div>
          <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
            ${Number(totalInvested).toLocaleString("en-US")}
          </h2>
        </div>
      </div>

      {/* Withdrawn */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex items-center justify-between sm:block">
        <div>
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center shrink-0">
              <ArrowDownToLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B]" />
            </div>
            <p className="text-xs sm:text-sm text-[#475569] font-medium">
              {t("walletPage.withdrawn") || "Withdrawn"}
            </p>
          </div>
          <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
            ${Number(totalWithdrawn).toLocaleString("en-US")}
          </h2>
        </div>
      </div>
    </div>
  );
}

