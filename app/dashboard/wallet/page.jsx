"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Send,
  Banknote,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/app/components/AuthProvider";
import toast from "react-hot-toast";

// Payment Method Logos
const PaymentMethodBadge = ({ method, selected, onClick }) => {
  const names = {
    bkash: "bKash",
    nagad: "Nagad",
    rocket: "Rocket",
    binance: "Binance",
  };

  return (
    <button
      type="button"
      onClick={() => onClick(method)}
      className={`relative p-2 rounded-xl transition-all border-2 flex flex-col items-center justify-center flex-1 h-16 ${
        selected
          ? "border-[#2563EB] bg-blue-50 scale-[1.02] ring-1 ring-[#2563EB]"
          : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
      }`}
    >
      <div className="w-full h-full flex items-center justify-center gap-2">
        <img
          src={`/${method}.png`}
          alt={names[method]}
          className="h-6 w-6 object-contain"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span
          className={`text-sm font-bold ${selected ? "text-[#2563EB]" : "text-[#0F172A]"}`}
        >
          {names[method]}
        </span>
      </div>
    </button>
  );
};

export default function WalletPage() {
  const { user, supabase } = useAuth();
  const [cashIn, setCashIn] = useState({
    method: "bkash",
    amount: "",
    trxId: "",
  });
  const [withdraw, setWithdraw] = useState({
    method: "bkash",
    number: "",
    amount: "",
  });

  // Live Data States
  const [exchangeRate, setExchangeRate] = useState(120);
  const [balance, setBalance] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await res.json();
      setExchangeRate(data.rates.BDT || 120);
    } catch (error) {
      console.error("Failed to fetch exchange rate, using fallback.", error);
      setExchangeRate(120);
    }
  };

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setBalance(profileData.wallet_balance || 0);
      }

      const { data: txs, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (txs) {
        setTransactions(txs);

        const invested = txs
          .filter((t) => t.type === "buy_package" && t.status === "verified")
          .reduce((acc, t) => acc + Number(t.amount_usd), 0);

        const withdrawn = txs
          .filter((t) => t.type === "withdraw" && t.status === "verified")
          .reduce((acc, t) => acc + Number(t.amount_usd), 0);

        setTotalInvested(invested);
        setTotalWithdrawn(withdrawn);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchWalletData();
    }
  }, [user?.id]);

  const handleCashIn = async (e) => {
    e.preventDefault();

    if (!cashIn.amount || cashIn.amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    const amountBdt = Math.floor(Number(cashIn.amount) * exchangeRate);

    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "cash_in",
        amount_usd: cashIn.amount,
        amount_bdt: amountBdt,
        method: cashIn.method,
        payment_tx_id: cashIn.trxId,
      });

      if (error) throw error;

      toast.success(
        "Cash in request submitted! Waiting for admin verification.",
      );
      setCashIn({ ...cashIn, amount: "", trxId: "" });
      fetchWalletData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit cash in request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdraw.amount || withdraw.amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (Number(withdraw.amount) > balance) {
      toast.error("Insufficient wallet balance.");
      return;
    }

    setIsSubmitting(true);
    const amountBdt = Math.floor(Number(withdraw.amount) * exchangeRate);

    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdraw",
        amount_usd: withdraw.amount,
        amount_bdt: amountBdt,
        method: withdraw.method,
        payment_tx_id: withdraw.number,
      });

      if (error) throw error;

      toast.success(
        "Withdraw request submitted! Waiting for admin verification.",
      );
      setWithdraw({ ...withdraw, amount: "", number: "" });
      fetchWalletData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit withdraw request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateBDT = (usdAmount) => {
    if (!usdAmount || isNaN(usdAmount)) return 0;
    return Math.floor(Number(usdAmount) * exchangeRate).toLocaleString();
  };

  const renderStatus = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857]">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C]">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] text-[#B45309]">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const formatType = (type, method) => {
    const typeMap = {
      cash_in: `Cash In via ${method}`,
      withdraw: `Withdraw to ${method}`,
      buy_package: `Package Investment`,
      package_return: `Package Return`,
      bonus: `Welcome Bonus`,
    };
    return typeMap[type] || type;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Wallet</h1>
        <p className="text-[#94A3B8] text-sm">
          Manage your funds. Live Rate: 1 USD = {Math.floor(exchangeRate)} BDT
        </p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
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
                Balance
              </p>
            </div>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
              ${balance.toLocaleString("en-US")}
            </h2>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex items-center justify-between sm:block">
          <div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
              </div>
              <p className="text-xs sm:text-sm text-[#475569] font-medium">Invested</p>
            </div>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
              ${totalInvested.toLocaleString("en-US")}
            </h2>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex items-center justify-between sm:block">
          <div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center shrink-0">
                <ArrowDownToLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B]" />
              </div>
              <p className="text-xs sm:text-sm text-[#475569] font-medium">
                Withdrawn
              </p>
            </div>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
              ${totalWithdrawn.toLocaleString("en-US")}
            </h2>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
        {/* Cash In Form */}
        <form
          onSubmit={handleCashIn}
          className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-5 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 text-[#2563EB] font-semibold text-lg border-b border-[#E2E8F0] pb-4">
            <ArrowUpToLine className="w-5 h-5" /> Cash In
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#0F172A] font-medium block">
              Select Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <PaymentMethodBadge
                method="bkash"
                selected={cashIn.method === "bkash"}
                onClick={(m) => setCashIn({ ...cashIn, method: m })}
              />
              <PaymentMethodBadge
                method="nagad"
                selected={cashIn.method === "nagad"}
                onClick={(m) => setCashIn({ ...cashIn, method: m })}
              />
              <PaymentMethodBadge
                method="rocket"
                selected={cashIn.method === "rocket"}
                onClick={(m) => setCashIn({ ...cashIn, method: m })}
              />
              <PaymentMethodBadge
                method="binance"
                selected={cashIn.method === "binance"}
                onClick={(m) => setCashIn({ ...cashIn, method: m })}
              />
            </div>
          </div>

          <div className="text-sm text-[#475569] bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <p>
              Send your exact amount to{" "}
              <strong className="text-[#0F172A] block my-1 text-lg">
                {cashIn.method === "bkash" && "01554915902 (Personal)"}
                {cashIn.method === "nagad" && "01712345678 (Personal)"}
                {cashIn.method === "rocket" && "01987654321 (Personal)"}
                {cashIn.method === "binance" && "TDvW... (TRC20 Wallet)"}
              </strong>{" "}
              via <span className="capitalize text-[#2563EB] font-bold">{cashIn.method}</span> first.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-[#0F172A] font-medium block">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
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

          <div className="space-y-1.5 mt-auto pt-2">
            <label className="text-sm text-[#0F172A] font-medium block">
              Transaction ID
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
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              "Submit Cash In Request"
            )}
          </button>
        </form>

        {/* Withdraw Form */}
        <form
          onSubmit={handleWithdraw}
          className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-5 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 text-[#F59E0B] font-semibold text-lg border-b border-[#E2E8F0] pb-4">
            <ArrowDownToLine className="w-5 h-5" /> Withdraw
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#0F172A] font-medium block">
              Receive Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <PaymentMethodBadge
                method="bkash"
                selected={withdraw.method === "bkash"}
                onClick={(m) => setWithdraw({ ...withdraw, method: m })}
              />
              <PaymentMethodBadge
                method="nagad"
                selected={withdraw.method === "nagad"}
                onClick={(m) => setWithdraw({ ...withdraw, method: m })}
              />
              <PaymentMethodBadge
                method="rocket"
                selected={withdraw.method === "rocket"}
                onClick={(m) => setWithdraw({ ...withdraw, method: m })}
              />
              <PaymentMethodBadge
                method="binance"
                selected={withdraw.method === "binance"}
                onClick={(m) => setWithdraw({ ...withdraw, method: m })}
              />
            </div>
          </div>

          <div className="text-sm text-[#475569] bg-[#FFFBEB] border border-amber-100 p-4 rounded-xl">
            <p>
              Funds will be sent to your selected account after admin
              verification.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-[#0F172A] font-medium block">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  max={balance}
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
                You Receive (BDT)
              </label>
              <div className="w-full bg-[#F8FAFC] text-[#F59E0B] p-3 rounded-xl border border-[#E2E8F0] font-bold flex items-center justify-between">
                <span>{calculateBDT(withdraw.amount)}</span>
                <span className="text-xs text-[#94A3B8]">৳</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 mt-auto pt-2">
            <label className="text-sm text-[#0F172A] font-medium block">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Where should we send it?"
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
            disabled={isSubmitting || balance <= 0 || !withdraw.amount}
            className="w-full bg-[#F59E0B] hover:bg-[#D97706] transition-colors text-white py-3.5 rounded-xl font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              "Submit Withdraw Request"
            )}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Transaction Ledger
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
                    No transactions found.
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
                      className={`font-bold ${tx.type === "withdraw" || tx.type === "buy_package" ? "text-[#EF4444]" : "text-[#10B981]"}`}
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
    </div>
  );
}
