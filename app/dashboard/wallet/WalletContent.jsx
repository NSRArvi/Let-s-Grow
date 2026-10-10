"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useLanguage } from "@/app/components/context/LanguageContext";
import toast from "react-hot-toast";

// Separated components
import WalletBalances from "./components/WalletBalances";
import CashInForm from "./components/CashInForm";
import WithdrawForm from "./components/WithdrawForm";
import TransactionHistory from "./components/TransactionHistory";

// Fallback payment options in case DB is being initialized
const DEFAULT_PAYMENT_METHODS = [
  {
    method_key: "bkash",
    name: "bKash",
    type: "phone",
    account_number: "01554915902",
    account_type: "Personal",
    instructions: "Send Money to personal bKash number.",
    is_active: true,
  },
  {
    method_key: "nagad",
    name: "Nagad",
    type: "phone",
    account_number: "01712345678",
    account_type: "Personal",
    instructions: "Send Money to personal Nagad number.",
    is_active: true,
  },
  {
    method_key: "rocket",
    name: "Rocket",
    type: "phone",
    account_number: "01987654321",
    account_type: "Personal",
    instructions: "Send Money to personal Rocket number.",
    is_active: true,
  },
  {
    method_key: "binance",
    name: "Binance",
    type: "wallet_address",
    account_number: "TDvWxxxxxxxxxxxxxx",
    account_type: "TRC20 Wallet",
    instructions: "Send USDT (TRC20) to this address.",
    is_active: true,
  },
];

export default function WalletPage() {
  const { user, supabase } = useAuth();
  const { t } = useLanguage();

  const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENT_METHODS);
  const [selectedCashInMethod, setSelectedCashInMethod] = useState("bkash");
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState("bkash");

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

  // Fetch Payment Methods from Supabase
  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        // Table might not exist yet before running migration, use fallback silently
        console.warn("Could not fetch payment_methods, using defaults:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setPaymentMethods(data);
        setSelectedCashInMethod(data[0].method_key);
        setSelectedWithdrawMethod(data[0].method_key);
        setCashIn((prev) => ({ ...prev, method: data[0].method_key }));
        setWithdraw((prev) => ({ ...prev, method: data[0].method_key }));
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    }
  };

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
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchWalletData();
    }
  }, [user?.id]);

  const handleCashIn = async (e) => {
    e.preventDefault();

    const amountNum = Number(cashIn.amount);
    if (!amountNum || isNaN(amountNum)) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (amountNum < 20) {
      toast.error("Minimum cash in amount is $20.");
      return;
    }

    if (amountNum > 2000) {
      toast.error("Maximum cash in amount is $2,000.");
      return;
    }

    setIsSubmitting(true);
    const amountBdt = Math.floor(amountNum * exchangeRate);

    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "cash_in",
        amount_usd: cashIn.amount,
        amount_bdt: amountBdt,
        method: selectedCashInMethod,
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

    const withdrawAmount = Number(withdraw.amount);
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (withdrawAmount < 20) {
      toast.error("Minimum withdraw amount is $20.");
      return;
    }

    if (withdrawAmount > 2000) {
      toast.error("Maximum withdraw amount is $2,000 per request.");
      return;
    }

    if (withdrawAmount > balance) {
      toast.error("Insufficient wallet balance.");
      return;
    }

    setIsSubmitting(true);
    const feeUsd = Number((withdrawAmount * 0.02).toFixed(2));
    const netUsd = Number((withdrawAmount - feeUsd).toFixed(2));
    const amountBdt = Math.floor(netUsd * exchangeRate);

    try {
      // Note: Do NOT deduct client-side here. Supabase database trigger `on_transaction_insert`
      // already automatically deducts the withdrawal amount upon insert!
      // Deducting here caused 2x deduction ($40 deducted instead of $20).

      // 1. Insert transaction with fee and net amount (with graceful fallback if columns don't exist yet)
      const txPayload = {
        user_id: user.id,
        type: "withdraw",
        amount_usd: withdrawAmount,
        amount_bdt: amountBdt,
        fee_usd: feeUsd,
        net_amount_usd: netUsd,
        method: selectedWithdrawMethod,
        payment_tx_id: withdraw.number,
      };

      let { error: txError } = await supabase
        .from("transactions")
        .insert(txPayload);

      // If fee_usd/net_amount_usd column doesn't exist yet in Supabase, retry with standard payload
      if (txError && (txError.message?.includes("column") || txError.code === "PGRST204" || txError.code === "42703")) {
        console.warn("Retrying transaction insert without fee columns:", txError.message);
        const fallbackPayload = {
          user_id: user.id,
          type: "withdraw",
          amount_usd: withdrawAmount,
          amount_bdt: amountBdt,
          method: selectedWithdrawMethod,
          payment_tx_id: withdraw.number,
        };
        const { error: fallbackError } = await supabase
          .from("transactions")
          .insert(fallbackPayload);
        
        txError = fallbackError;
      }

      if (txError) {
        throw txError;
      }

      toast.success(
        `Withdrawal of $${withdrawAmount.toFixed(2)} requested! $${feeUsd.toFixed(2)} platform fee applied.`,
      );
      setWithdraw({ ...withdraw, amount: "", number: "" });
      fetchWalletData();
    } catch (error) {
      console.error("Withdrawal error details:", error);
      toast.error(error.message || "Failed to submit withdraw request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fadeInUp pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">
          {t("walletPage.title") || "Wallet"}
        </h1>
        <p className="text-[#94A3B8] text-sm">
          {t("walletPage.subtitle") || "Manage your funds. Live Rate: 1 USD ="} {Math.floor(exchangeRate)} BDT
        </p>
      </div>

      {/* 1. Balances Component */}
      <WalletBalances
        balance={balance}
        totalInvested={totalInvested}
        totalWithdrawn={totalWithdrawn}
      />

      {/* 2. Actions Grid (Cash In & Withdraw Form Components) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
        <CashInForm
          paymentMethods={paymentMethods}
          selectedMethod={selectedCashInMethod}
          setSelectedMethod={setSelectedCashInMethod}
          cashIn={cashIn}
          setCashIn={setCashIn}
          onSubmit={handleCashIn}
          isSubmitting={isSubmitting}
          exchangeRate={exchangeRate}
        />

        <WithdrawForm
          paymentMethods={paymentMethods}
          selectedMethod={selectedWithdrawMethod}
          setSelectedMethod={setSelectedWithdrawMethod}
          withdraw={withdraw}
          setWithdraw={setWithdraw}
          onSubmit={handleWithdraw}
          isSubmitting={isSubmitting}
          balance={balance}
          exchangeRate={exchangeRate}
        />
      </div>

      {/* 3. Transaction History Component */}
      <TransactionHistory
        transactions={transactions}
        isLoading={isLoading}
      />
    </div>
  );
}
