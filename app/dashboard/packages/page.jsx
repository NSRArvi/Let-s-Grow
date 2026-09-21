"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShoppingCart, RefreshCw, Layers, TrendingUp, Calendar, X, AlertCircle, ImageIcon } from "lucide-react";

export default function PackagesPage() {
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
        if (user) { fetchData(); }
    }, [user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: pkgData, error: pkgError } = await supabase
                .from("packages")
                .select(`*, categories ( name )`)
                .order("created_at", { ascending: false });
            if (pkgError) throw pkgError;

            const { data: catData, error: catError } = await supabase.from("categories").select("*");
            if (catError) throw catError;

            const { data: profile, error: profError } = await supabase
                .from("profiles").select("wallet_balance").eq("id", user.id).single();
            if (profError) throw profError;

            setPackages(pkgData || []);
            setCategories(catData || []);
            setUserBalance(profile?.wallet_balance || 0);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load packages");
        } finally { setIsLoading(false); }
    };

    const handleOpenBuyModal = (pkg) => { setSelectedPackage(pkg); setBuyQuantity(1); };

    const handleConfirmBuy = async () => {
        if (!selectedPackage) return;
        setIsBuying(true);
        try {
            const { error } = await supabase.rpc('buy_package', {
                p_package_id: selectedPackage.id, p_quantity: buyQuantity
            });
            if (error) {
                if (error.message.includes("Insufficient wallet balance")) {
                    throw new Error("You do not have enough funds in your wallet. Please cash in first.");
                }
                throw error;
            }
            toast.success(`Successfully purchased ${buyQuantity}x ${selectedPackage.name}!`);
            setSelectedPackage(null);
            fetchData();
        } catch (error) {
            console.error("Error buying package:", error);
            toast.error(error.message || "Failed to buy package");
        } finally { setIsBuying(false); }
    };

    const filteredPackages = selectedCategory === "all" ? packages : packages.filter(p => p.category_id === selectedCategory);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
                <p className="text-[#94A3B8]">Loading investment packages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeInUp pb-10">
            {/* Header & Categories */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E2E8F0] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-1 flex items-center gap-3">
                        <Layers className="text-[#2563EB]" /> Investment Packages
                    </h1>
                    <p className="text-[#94A3B8] text-sm">Choose a package to grow your wealth over time.</p>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                            selectedCategory === "all" 
                                ? "bg-[#2563EB] text-white" 
                                : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#94A3B8]"
                        }`}
                    >
                        All Packages
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                                selectedCategory === cat.id 
                                    ? "bg-[#2563EB] text-white" 
                                    : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#94A3B8]"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-[#E2E8F0]">
                        <Layers className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">No packages found</h3>
                        <p className="text-[#94A3B8]">There are currently no packages available in this category.</p>
                    </div>
                ) : (
                    filteredPackages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 group flex flex-col h-full">
                            <div className="h-48 bg-[#F8FAFC] relative">
                                {pkg.image_url ? (
                                    <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-[#2563EB] text-white px-3 py-1 rounded-lg text-xs font-bold">
                                    {pkg.categories?.name}
                                </div>
                                {pkg.stocks === 0 && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                                        <span className="bg-[#EF4444] text-white px-6 py-2 rounded-lg font-bold text-lg">SOLD OUT</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-[#0F172A] mb-1">{pkg.name}</h3>
                                <p className="text-2xl font-extrabold text-[#0F172A] mb-5">
                                    ${Number(pkg.price).toLocaleString()}
                                </p>

                                <div className="space-y-2.5 mb-5 flex-1">
                                    <div className="flex items-center gap-3 text-[#475569] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                        <TrendingUp className="w-5 h-5 text-[#10B981]" />
                                        <div>
                                            <div className="text-xs text-[#94A3B8]">Expected Return</div>
                                            <div className="font-bold text-[#10B981]">
                                                {(Number(pkg.return_multiplier || 1) * 100).toFixed(0)}% ROI
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#475569] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                        <Calendar className="w-5 h-5 text-[#2563EB]" />
                                        <div>
                                            <div className="text-xs text-[#94A3B8]">Duration</div>
                                            <div className="font-bold text-[#0F172A]">{pkg.return_days} Days</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] mb-4">
                                    <div>
                                        <div className="text-xs text-[#94A3B8]">Available</div>
                                        <div className={`font-bold ${pkg.stocks === 0 ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{pkg.stocks} stocks</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-[#94A3B8]">Sold</div>
                                        <div className="font-bold text-[#475569]">{pkg.sale_count}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOpenBuyModal(pkg)}
                                    disabled={pkg.stocks === 0}
                                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                                        ${pkg.stocks === 0
                                            ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                                            : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                        }
                                    `}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {pkg.stocks === 0 ? 'Out of Stock' : 'Purchase Stocks'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Buy Modal */}
            {selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md overflow-hidden shadow-xl flex flex-col">
                        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-[#2563EB]" /> Complete Purchase
                            </h2>
                            <button onClick={() => !isBuying && setSelectedPackage(null)} disabled={isBuying} className="text-[#94A3B8] hover:text-[#0F172A] p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4">
                                {selectedPackage.image_url ? (
                                    <img src={selectedPackage.image_url} alt="Package" className="w-16 h-16 rounded-xl object-cover border border-[#E2E8F0]" />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] flex items-center justify-center border border-[#E2E8F0]">
                                        <ImageIcon className="w-6 h-6 text-[#94A3B8]" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-[#0F172A] text-lg">{selectedPackage.name}</h3>
                                    <p className="text-[#2563EB] font-bold">${Number(selectedPackage.price).toLocaleString()} <span className="text-sm text-[#94A3B8] font-normal">per stock</span></p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[#0F172A]">Select Quantity</label>
                                <div className="flex items-center justify-between bg-[#F8FAFC] rounded-xl p-2 border border-[#E2E8F0]">
                                    <button onClick={() => setBuyQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-bold hover:bg-[#F1F5F9] transition-colors flex items-center justify-center">-</button>
                                    <span className="text-xl font-extrabold text-[#0F172A]">{buyQuantity}</span>
                                    <button onClick={() => setBuyQuantity(q => Math.min(Math.min(5, selectedPackage.stocks), q + 1))} className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-bold hover:bg-[#F1F5F9] transition-colors flex items-center justify-center">+</button>
                                </div>
                                <p className="text-xs text-[#94A3B8] text-right">Max limit: {Math.min(5, selectedPackage.stocks)} stocks per order</p>
                            </div>

                            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#475569]">Total Cost</span>
                                    <span className="font-bold text-[#0F172A]">${(Number(selectedPackage.price) * buyQuantity).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pb-3 border-b border-[#E2E8F0]">
                                    <span className="text-[#475569]">Expected Return ({(Number(selectedPackage.return_multiplier || 1) * 100).toFixed(0)}%)</span>
                                    <span className="font-bold text-[#10B981]">+${(Number(selectedPackage.price) * buyQuantity * Number(selectedPackage.return_multiplier || 1)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#94A3B8]">Your Wallet Balance</span>
                                    <span className={`font-bold ${userBalance >= (selectedPackage.price * buyQuantity) ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                        ${Number(userBalance).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {userBalance < (selectedPackage.price * buyQuantity) && (
                                <div className="flex items-center gap-2 text-[#EF4444] bg-[#FEF2F2] p-3 rounded-xl border border-red-100 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>Insufficient wallet balance. Please add funds to your account first.</span>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelectedPackage(null)} disabled={isBuying} className="flex-1 py-3 rounded-xl font-semibold text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors">Cancel</button>
                                <button
                                    onClick={handleConfirmBuy}
                                    disabled={isBuying || userBalance < (selectedPackage.price * buyQuantity)}
                                    className="flex-[2] bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isBuying ? (<><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</>) : ('Confirm Purchase')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
