"use client";

import { Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/app/components/context/LanguageContext";

export default function TransactionHistory({ transactions = [], isLoading = false }) {
  const { t } = useLanguage();

  const renderStatus = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857]">
            <CheckCircle2 className="w-3 h-3" /> {t("walletPage.verified") || "Verified"}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C]">
            <XCircle className="w-3 h-3" /> {t("walletPage.rejected") || "Rejected"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#B45309]">
            <Clock className="w-3 h-3" /> {t("walletPage.pending") || "Pending"}
          </span>
        );
    }
  };

  const formatType = (type, method) => {
    const typeMap = {
      cash_in: `Cash In via ${method || ""}`,
      withdraw: `Withdraw to ${method || ""}`,
      buy_package: `Package Investment`,
      package_return: `Package Return`,
      bonus: `Welcome Bonus`,
    };
    return typeMap[type] || type;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#0F172A]">
          {t("walletPage.transactionHistory") || "Transaction History"}
        </h2>
        {isLoading && (
          <RefreshCw className="w-4 h-4 text-[#2563EB] animate-spin" />
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase tracking-wider text-[#94A3B8] bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              <th scope="col" className="py-3.5 px-6 font-medium">
                Type
              </th>
              <th scope="col" className="py-3.5 px-6 font-medium">
                Amount
              </th>
              <th scope="col" className="py-3.5 px-6 font-medium">
                Status
              </th>
              <th scope="col" className="py-3.5 px-6 font-medium">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {transactions.length === 0 && !isLoading && (
              <tr>
                <td colSpan="4" className="py-12 text-center text-[#94A3B8]">
                  {t("walletPage.noTransactions") || "No transactions yet."}
                </td>
              </tr>
            )}
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-[#0F172A] capitalize">
                    {formatType(tx.type, tx.method)}
                  </div>
                  {tx.payment_tx_id && (
                    <div className="text-xs text-[#94A3B8] mt-1 font-mono">
                      ID: {tx.payment_tx_id}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div
                    className={`font-bold ${
                      tx.type === "withdraw" || tx.type === "buy_package"
                        ? "text-[#EF4444]"
                        : "text-[#10B981]"
                    }`}
                  >
                    {tx.type === "withdraw" || tx.type === "buy_package"
                      ? "-"
                      : "+"}{" "}
                    ${Number(tx.amount_usd).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-1">
                    {Number(tx.amount_bdt).toLocaleString()} ৳
                  </div>
                </td>
                <td className="py-4 px-6">{renderStatus(tx.status)}</td>
                <td className="py-4 px-6 text-[#475569]">
                  {new Date(tx.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <div className="text-xs text-[#94A3B8] mt-1">
                    {new Date(tx.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

