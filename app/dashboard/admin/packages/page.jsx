"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Boxes, Plus, Trash2, RefreshCw, Upload, Image as ImageIcon, X, Pencil, Users, Zap, Package, TrendingUp } from "lucide-react";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Pagination from "@/app/components/shared/Pagination";
import PackageMetrics from "@/app/components/shared/PackageMetrics";

export default function AdminPackagesPage() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const fileInputRef = useRef(null);
    
    // Trigger to refresh metrics when packages are added/edited
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState({
        isOpen: false,
        id: null,
        imageUrl: null
    });

    // Buyers Modal State
    const [selectedPackageForBuyers, setSelectedPackageForBuyers] = useState(null);
    const [buyersData, setBuyersData] = useState([]);
    const [isLoadingBuyers, setIsLoadingBuyers] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        category_id: "",
        name: "",
        price: "",
        stocks: "",
        available_until: "",
        return_multiplier: "1.0",
        return_days: "0"
    });

    useEffect(() => {
        if (user) {
            checkAdminAndFetch();
        }
    }, [user]);

    useEffect(() => {
        if (isAdmin) {
            fetchPackages();
        }
    }, [currentPage, isAdmin]);

    const checkAdminAndFetch = async () => {
        setIsLoading(true);
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single();

            if (!profile?.is_admin) {
                toast.error("Unauthorized access.");
                router.push("/dashboard");
                return;
            }

            setIsAdmin(true);
            await fetchCategories();
        } catch (error) {
            console.error("Admin check failed:", error);
            router.push("/dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase.from("categories").select("*");
        if (!error && data) {
            setCategories(data);
            if (data.length > 0 && !editingId) {
                setFormData(prev => ({ ...prev, category_id: data[0].id }));
            }
        }
    };

    const fetchPackages = async () => {
        try {
            const from = (currentPage - 1) * 15;
            const to = from + 14;

            const { data, count, error } = await supabase
                .from("packages")
                .select(`
                    *,
                    categories ( name )
                `, { count: 'exact' })
                .order("created_at", { ascending: false })
                .range(from, to);

            if (error) throw error;
            setPackages(data || []);
            setTotalRecords(count || 0);
            setTotalPages(Math.ceil((count || 0) / 15));
        } catch (error) {
            console.error("Error fetching packages:", error);
            toast.error("Failed to load packages");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('package-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw new Error('Error uploading image: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
            .from('package-images')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    };

    const handleEdit = (pkg) => {
        setEditingId(pkg.id);
        setFormData({
            category_id: pkg.category_id,
            name: pkg.name,
            price: pkg.price.toString(),
            stocks: pkg.stocks.toString(),
            available_until: pkg.available_until ? new Date(pkg.available_until).toISOString().split('T')[0] : "",
            return_multiplier: pkg.return_multiplier ? pkg.return_multiplier.toString() : "1.0",
            return_days: pkg.return_days ? pkg.return_days.toString() : "0"
        });
        setImagePreview(pkg.image_url || "");
        setExistingImageUrl(pkg.image_url || "");
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.category_id || !formData.name || !formData.price || !formData.stocks) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = existingImageUrl;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const payload = {
                category_id: formData.category_id,
                name: formData.name,
                price: Number(formData.price),
                stocks: Number(formData.stocks),
                available_until: formData.available_until || null,
                return_multiplier: Number(formData.return_multiplier),
                return_days: Number(formData.return_days),
                image_url: imageUrl
            };

            if (editingId) {
                const { error } = await supabase.from("packages").update(payload).eq("id", editingId);
                if (error) throw error;
                toast.success("Package updated successfully!");
            } else {
                const { error } = await supabase.from("packages").insert(payload);
                if (error) throw error;
                toast.success("Package created successfully!");
            }

            setIsModalOpen(false);
            resetForm();
            fetchPackages();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error saving package:", error);
            toast.error(error.message || "Failed to save package");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id, imageUrl) => {
        setConfirmModalData({ isOpen: true, id, imageUrl });
    };

    const executeDelete = async () => {
        const { id, imageUrl } = confirmModalData;
        if (!id) return;

        setIsDeleting(true);
        try {
            if (imageUrl) {
                const fileName = imageUrl.split('/').pop();
                await supabase.storage.from('package-images').remove([fileName]);
            }

            const { error } = await supabase
                .from("packages")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast.success("Package deleted!");
            fetchPackages();
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting package:", error);
            toast.error(error.message || "Failed to delete package");
        } finally {
            setIsDeleting(false);
            setConfirmModalData({ isOpen: false, id: null, imageUrl: null });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            category_id: categories.length > 0 ? categories[0].id : "",
            name: "",
            price: "",
            stocks: "",
            available_until: "",
            return_multiplier: "1.0",
            return_days: "0"
        });
        setImageFile(null);
        setImagePreview("");
        setExistingImageUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openBuyersModal = async (pkg) => {
        setSelectedPackageForBuyers(pkg);
        setIsLoadingBuyers(true);
        try {
            const { data, error } = await supabase
                .from("user_packages")
                .select(`
                    id, quantity, total_paid, return_amount, return_at, status,
                    profiles:user_id ( full_name, email )
                `)
                .eq("package_id", pkg.id)
                .order("id", { ascending: false });
                
            if (error) throw error;
            setBuyersData(data || []);
        } catch (err) {
            console.error("Error fetching buyers:", err);
            toast.error("Failed to load buyers.");
        } finally {
            setIsLoadingBuyers(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
                <p className="text-[#94A3B8]">Loading packages...</p>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <>
        <div className="space-y-8 animate-fadeInUp pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
                        <Boxes className="text-[#2563EB]" /> Manage Packages
                    </h1>
                    <p className="text-[#94A3B8] text-sm">Create investment packages and track buyers.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-900/10 flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Add Package
                    </button>
                </div>
            </div>

            <PackageMetrics refreshTrigger={refreshTrigger} />

            {/* Packages List */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#0F172A]">Active Packages</h2>
                    <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        {totalRecords} Total
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
                            <tr>
                                <th className="py-4 px-6 font-medium">Package</th>
                                <th className="py-4 px-6 font-medium">Category</th>
                                <th className="py-4 px-6 font-medium">Price/Return</th>
                                <th className="py-4 px-6 font-medium">Stock / Sales</th>
                                <th className="py-4 px-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
                            {packages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#94A3B8]">
                                        No packages found. Click "Add Package" to create one.
                                    </td>
                                </tr>
                            ) : (
                                packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-[#F8FAFC] transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {pkg.image_url ? (
                                                    <img src={pkg.image_url} alt={pkg.name} className="w-10 h-10 rounded-lg object-cover border border-[#E2E8F0] bg-[#F8FAFC]" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8]">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-[#0F172A]">{pkg.name}</div>
                                                    <div className="text-xs text-[#94A3B8] truncate max-w-[200px]">
                                                        {pkg.available_until ? `Avail till ${new Date(pkg.available_until).toLocaleDateString()}` : 'No limit'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded-md text-xs border border-[#E2E8F0]">
                                                {pkg.categories?.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-[#10B981]">${Number(pkg.price).toLocaleString()}</div>
                                            <div className="text-xs text-[#F59E0B]">
                                                {(Number(pkg.return_multiplier || 1) * 100).toFixed(0)}% in {pkg.return_days} days
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <div className="text-xs text-[#94A3B8]">Remaining</div>
                                                    <div className={`font-bold ${pkg.stocks === 0 ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{pkg.stocks}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[#94A3B8]">Sold</div>
                                                    <div className="font-bold text-[#0F172A]">{pkg.sale_count}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openBuyersModal(pkg)}
                                                    className="text-[#2563EB] hover:text-[#1D4ED8] p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Buyers"
                                                >
                                                    <Users className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(pkg)}
                                                    className="text-[#F59E0B] hover:text-[#D97706] p-2 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Edit Package"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(pkg.id, pkg.image_url)}
                                                    className="text-[#EF4444] hover:text-[#DC2626] p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Package"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                {editingId ? (
                                    <><Pencil className="w-5 h-5 text-[#F59E0B]" /> Edit Package</>
                                ) : (
                                    <><Plus className="w-5 h-5 text-[#2563EB]" /> Create New Package</>
                                )}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A] p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {categories.length === 0 && (
                                <div className="bg-[#FEF2F2] border border-red-100 text-[#B91C1C] p-4 rounded-lg text-sm">
                                    You must create at least one Category first before adding packages.
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Basic Info</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Package Name *</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Category *</label>
                                            <select
                                                className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                required
                                            >
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Stock */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Pricing & Inventory</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Price (USD) *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full bg-white text-[#0F172A] p-3 pl-8 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Total Stocks *</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                value={formData.stocks}
                                                onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule & Returns */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Schedule & Returns</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Available Until</label>
                                            <input
                                                type="date"
                                                className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                value={formData.available_until}
                                                onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Return Multiplier</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                value={formData.return_multiplier}
                                                onChange={(e) => setFormData({ ...formData, return_multiplier: e.target.value })}
                                                placeholder="e.g. 1.7"
                                            />
                                            <p className="text-xs text-[#94A3B8]">e.g. 1.7 for 170% return</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-[#0F172A] font-medium block">Return In (Days)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                                value={formData.return_days}
                                                onChange={(e) => setFormData({ ...formData, return_days: e.target.value })}
                                                placeholder="e.g. 16"
                                            />
                                            <p className="text-xs text-[#94A3B8]">Days until return</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Media</h3>
                                    <div className="flex items-center gap-6">
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-32 h-32 rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#2563EB] bg-[#F8FAFC] flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group"
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="w-6 h-6 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-8 h-8 text-[#94A3B8] mb-2" />
                                                    <span className="text-xs text-[#94A3B8] font-medium">Upload Image</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-[#475569] mb-2">Upload a square image for the package card. Supported formats: JPG, PNG, WEBP. Max size: 2MB.</p>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleImageChange} 
                                                accept="image/*" 
                                                className="hidden" 
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Choose File
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[#E2E8F0] flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-lg font-bold text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || categories.length === 0}
                                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/10 disabled:opacity-50 flex items-center gap-2 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        editingId ? "Update Package" : "Create Package"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Buyer Details Modal */}
            {selectedPackageForBuyers && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#2563EB]" /> Buyers List
                                </h2>
                                <p className="text-sm text-[#475569] mt-1">Package: <span className="font-bold text-[#0F172A]">{selectedPackageForBuyers.name}</span></p>
                            </div>
                            <button onClick={() => setSelectedPackageForBuyers(null)} className="text-[#94A3B8] hover:text-[#0F172A] p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
                            {isLoadingBuyers ? (
                                <div className="flex justify-center py-10">
                                    <RefreshCw className="w-6 h-6 text-[#2563EB] animate-spin" />
                                </div>
                            ) : buyersData.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
                                    <Users className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                                    <p className="text-[#475569]">No buyers found for this package yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
                                            <tr>
                                                <th className="py-4 px-6 font-medium">Buyer</th>
                                                <th className="py-4 px-6 font-medium text-center">Qty</th>
                                                <th className="py-4 px-6 font-medium">Total Paid</th>
                                                <th className="py-4 px-6 font-medium">Expected Return</th>
                                                <th className="py-4 px-6 font-medium">Return Date</th>
                                                <th className="py-4 px-6 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
                                            {buyersData.map(b => (
                                                <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="font-bold text-[#0F172A]">{b.profiles?.full_name || 'Unknown'}</div>
                                                        <div className="text-xs text-[#94A3B8]">{b.profiles?.email}</div>
                                                    </td>
                                                    <td className="py-4 px-6 text-center font-bold text-[#0F172A] bg-[#F8FAFC]">
                                                        {b.quantity}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-[#0F172A]">
                                                        ${Number(b.total_paid).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-6 font-bold text-[#10B981]">
                                                        ${Number(b.return_amount).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-6 text-[#475569]">
                                                        {new Date(b.return_at).toLocaleDateString()}
                                                        <div className="text-xs text-[#94A3B8]">
                                                            {new Date(b.return_at).toLocaleTimeString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {b.status === 'completed' ? (
                                                            <span className="bg-[#ECFDF5] text-[#047857] px-2 py-1 rounded text-xs font-bold border border-emerald-100">PAID</span>
                                                        ) : (
                                                            <span className="bg-blue-50 text-[#2563EB] px-2 py-1 rounded text-xs font-bold border border-blue-100">ACTIVE</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
