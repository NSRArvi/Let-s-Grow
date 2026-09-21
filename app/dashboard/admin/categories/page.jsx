"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FolderTree, Plus, Trash2, RefreshCw, Pencil, X } from "lucide-react";

export default function AdminCategoriesPage() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // Form state
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (user) {
            checkAdminAndFetch();
        }
    }, [user]);

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
            fetchCategories();
        } catch (error) {
            console.error("Admin check failed:", error);
            router.push("/dashboard");
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (!name || !slug) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingId) {
                const { error } = await supabase
                    .from("categories")
                    .update({
                        name,
                        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                    })
                    .eq("id", editingId);

                if (error) throw error;
                toast.success("Category updated successfully!");
            } else {
                const { error } = await supabase.from("categories").insert({
                    name,
                    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                });

                if (error) {
                    if (error.code === '23505') { // unique violation
                        throw new Error("Category slug already exists!");
                    }
                    throw error;
                }
                toast.success("Category created successfully!");
            }

            resetForm();
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(error.message || "Failed to save category");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
        setSlug(category.slug);
    };

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setSlug("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category? Packages using this category might break!")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("categories")
                .delete()
                .eq("id", id);

            if (error) {
                if (error.code === '23503') { // foreign key violation
                    throw new Error("Cannot delete category: It is currently being used by one or more packages.");
                }
                throw error;
            }

            toast.success("Category deleted!");
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error(error.message || "Failed to delete category");
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (!editingId) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
                <p className="text-[#94A3B8]">Loading categories...</p>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="space-y-8 animate-fadeInUp pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
                    <FolderTree className="text-[#2563EB]" /> Manage Categories
                </h1>
                <p className="text-[#94A3B8] text-sm">Create and organize product categories for the platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 rounded-xl border border-[#E2E8F0] space-y-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                        <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
                            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                {editingId ? (
                                    <><Pencil className="w-5 h-5 text-[#F59E0B]" /> Edit Category</>
                                ) : (
                                    <><Plus className="w-5 h-5 text-[#2563EB]" /> New Category</>
                                )}
                            </h2>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-[#0F172A] font-medium block">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cryptocurrency"
                                    className="w-full bg-white text-[#0F172A] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all"
                                    value={name}
                                    onChange={handleNameChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-[#0F172A] font-medium block">Slug (URL friendly)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. cryptocurrency"
                                    className="w-full bg-[#F8FAFC] text-[#475569] p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all font-mono text-sm"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                    required
                                />
                                <p className="text-xs text-[#94A3B8]">Used internally to filter packages.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-900/10 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                editingId ? "Update Category" : "Create Category"
                            )}
                        </button>
                    </form>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                        <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[#0F172A]">Active Categories</h2>
                            <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                {categories.length} Total
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
                                    <tr>
                                        <th className="py-4 px-6 font-medium">Name</th>
                                        <th className="py-4 px-6 font-medium">Slug</th>
                                        <th className="py-4 px-6 font-medium">Created At</th>
                                        <th className="py-4 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-[#94A3B8]">
                                                No categories found. Create one to get started!
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors">
                                                <td className="py-4 px-6 font-bold text-[#0F172A]">{cat.name}</td>
                                                <td className="py-4 px-6 font-mono text-xs text-[#2563EB]">{cat.slug}</td>
                                                <td className="py-4 px-6 text-[#475569]">
                                                    {new Date(cat.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        className="text-[#F59E0B] hover:text-[#D97706] p-2 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="text-[#EF4444] hover:text-[#DC2626] p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
