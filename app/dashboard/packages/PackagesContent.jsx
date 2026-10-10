"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useLanguage } from "@/app/components/context/LanguageContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RefreshCw, Wallet, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import PackageList from "./components/PackageList";
import BuyPackageModal from "./components/BuyPackageModal";

export default function PackagesPage() {
  const { t } = useLanguage();
  const { user, supabase } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userBalance, setUserBalance] = useState(0);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: pkgData, error: pkgError } = await supabase
        .from("packages")
        .select(`*, categories ( name )`)
        .order("created_at", { ascending: false });
      if (pkgError) throw pkgError;

      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*");
      if (catError) throw catError;

      const { data: profile, error: profError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();
      if (profError) throw profError;

      setPackages(pkgData || []);
      setCategories(catData || []);
      setUserBalance(profile?.wallet_balance || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBuyModal = (pkg) => {
    setSelectedPackage(pkg);
    setBuyQuantity(1);
  };

  const handleCloseBuyModal = () => {
    if (!isBuying) {
      setSelectedPackage(null);
      setBuyQuantity(1);
    }
  };

  const handleConfirmBuy = async () => {
    if (!selectedPackage) return;
    setIsBuying(true);
    try {
      const { error } = await supabase.rpc("buy_package", {
        p_package_id: selectedPackage.id,
        p_quantity: buyQuantity,
      });

      if (error) {
        if (error.message.includes("Insufficient wallet balance")) {
          throw new Error(
            "You do not have enough funds in your wallet. Please cash in first.",
          );
        }
        throw error;
      }

      toast.success(
        `Successfully invested in ${buyQuantity}x ${selectedPackage.name}!`,
      );
      setSelectedPackage(null);
      fetchData();
    } catch (error) {
      console.error("Error buying package:", error);
      toast.error(error.message || "Failed to buy package");
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
        <p className="text-[#94A3B8] font-medium text-sm">
          {t("packagesPage.loading", "Loading investment opportunities...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp pb-12">
      {/* Top Header & Live Balance Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] mb-1 tracking-tight">
            {t("packagesPage.title", "Investment Marketplace")}
          </h1>
          <p className="text-[#64748B] text-sm">
            {t(
              "packagesPage.subtitle",
              "Click on any package card to inspect yields and activate investments.",
            )}
          </p>
        </div>

        {/* Live Wallet Balance Indicator */}
        <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 rounded-2xl w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                Available Balance
              </span>
              <span className="text-base font-black text-[#0F172A]">
                ${Number(userBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/wallet"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-white border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors shadow-2xs"
          >
            Deposit <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Modular Package List Component */}
      <PackageList
        packages={packages}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectPackage={handleOpenBuyModal}
      />

      {/* Modular Buy Package Modal Component */}
      <BuyPackageModal
        packageItem={selectedPackage}
        onClose={handleCloseBuyModal}
        onConfirmBuy={handleConfirmBuy}
        isBuying={isBuying}
        userBalance={userBalance}
        buyQuantity={buyQuantity}
        setBuyQuantity={setBuyQuantity}
      />
    </div>
  );
}
