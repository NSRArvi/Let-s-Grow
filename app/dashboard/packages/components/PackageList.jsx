"use client";

import {
  TrendingUp,
  Calendar,
  Layers,
  ImageIcon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/app/components/context/LanguageContext";

export default function PackageList({
  packages = [],
  categories = [],
  selectedCategory = "all",
  onSelectCategory,
  onSelectPackage,
}) {
  const { t } = useLanguage();

  const filteredPackages =
    selectedCategory === "all"
      ? packages
      : packages.filter((p) => p.category_id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 w-full hide-scrollbar">
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
              : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-slate-50"
          }`}
        >
          {t("packagesPage.allPackages", "All Packages")} ({packages.length})
        </button>
        {categories.map((cat) => {
          const count = packages.filter((p) => p.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all capitalize ${
                selectedCategory === cat.id
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-slate-50"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
          <Layers className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">
            {t("packagesPage.noPackagesFound", "No packages found")}
          </h3>
          <p className="text-[#94A3B8] text-sm max-w-sm mx-auto">
            {t(
              "packagesPage.noPackagesDesc",
              "There are currently no packages available in this category.",
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => {
            const isSoldOut = pkg.stocks === 0;
            const returnPct = (Number(pkg.return_multiplier || 1) * 100).toFixed(0);
            const estProfit = (
              Number(pkg.price) * Number(pkg.return_multiplier || 1)
            ).toLocaleString();

            return (
              <div
                key={pkg.id}
                onClick={() => !isSoldOut && onSelectPackage(pkg)}
                className={`group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isSoldOut
                    ? "opacity-60 cursor-not-allowed bg-slate-50/50"
                    : "cursor-pointer hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-300 hover:-translate-y-1"
                }`}
              >
                {/* Top: Image & Badges */}
                <div className="relative h-44 w-full bg-[#F8FAFC] overflow-hidden">
                  {pkg.image_url ? (
                    <img
                      src={pkg.image_url}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] bg-gradient-to-br from-slate-50 to-blue-50/50">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Verified Package</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Category Chip */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-[#2563EB] shadow-sm uppercase tracking-wide">
                      {pkg.categories?.name || "Standard"}
                    </span>
                  </div>

                  {/* Stock Pill */}
                  <div className="absolute top-3 right-3">
                    {isSoldOut ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
                        {t("packagesPage.soldOut", "SOLD OUT")}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/70 backdrop-blur-md text-white shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {pkg.stocks} {t("packagesPage.left", "left")}
                      </span>
                    )}
                  </div>

                  {/* Price overlay at bottom of photo */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <div>
                      <span className="text-[11px] font-medium text-slate-200 block uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-2xl font-black tracking-tight drop-shadow-sm">
                        ${Number(pkg.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-200 block">
                        Est. Profit
                      </span>
                      <span className="text-sm font-bold text-emerald-300">
                        +${estProfit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Audited Yield Contract
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                        Net Profit
                      </span>
                      <div className="inline-flex items-center gap-1 text-emerald-600 font-extrabold text-sm">
                        <TrendingUp className="w-4 h-4" />
                        +{returnPct}%
                      </div>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                        Duration
                      </span>
                      <div className="inline-flex items-center gap-1 text-[#2563EB] font-extrabold text-sm justify-end">
                        <Calendar className="w-4 h-4" />
                        {pkg.return_days} Days
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-1 flex items-center justify-between border-t border-[#F1F5F9]">
                    <span className="text-xs text-[#64748B] font-medium group-hover:text-[#0F172A] transition-colors flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Instant Activation
                    </span>
                    <button
                      type="button"
                      disabled={isSoldOut}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSoldOut
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/20"
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : "Invest Now"}
                      {!isSoldOut && (
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

