"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Users, RefreshCw, ShieldCheck, User, Eye, X, CheckCircle, XCircle } from "lucide-react";

export default function AdminUsersPage() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            checkAdminAndFetch();
        }
    }, [user]);

    const checkAdminAndFetch = async () => {
        setIsLoading(true);
        try {
            // Check if admin
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
            fetchUsers();
        } catch (error) {
            console.error("Admin check failed:", error);
            router.push("/dashboard");
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setUsersList(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users list");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyUpdate = async (userId, newStatus) => {
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ is_verified: newStatus })
                .eq("id", userId);

            if (error) throw error;

            toast.success(newStatus ? "User marked as verified" : "User verification revoked");
            
            // Update local state
            setUsersList(prev => prev.map(u => u.id === userId ? { ...u, is_verified: newStatus } : u));
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => ({ ...prev, is_verified: newStatus }));
            }
        } catch (error) {
            console.error("Error updating verification:", error);
            toast.error(error.message || "Failed to update verification status");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mb-4" />
                <p className="text-[#94A3B8]">Loading user database...</p>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="space-y-8 animate-fadeInUp pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
                    <Users className="text-[#2563EB]" /> Platform Users
                </h1>
                <p className="text-[#94A3B8] text-sm">View and manage all registered users.</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                    <h2 className="text-lg font-bold text-[#0F172A]">Registered Users</h2>
                    <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        {usersList.length} Total Users
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
                            <tr>
                                <th className="py-4 px-6 font-medium">User</th>
                                <th className="py-4 px-6 font-medium">Role</th>
                                <th className="py-4 px-6 font-medium">Refer Code</th>
                                <th className="py-4 px-6 font-medium">Wallet Balance</th>
                                <th className="py-4 px-6 font-medium">Joined</th>
                                <th className="py-4 px-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
                            {usersList.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {usersList.map((usr) => (
                                <tr key={usr.id} className="hover:bg-[#F8FAFC] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-[#0F172A] flex items-center gap-2">
                                            {usr.is_admin ? <ShieldCheck className="w-4 h-4 text-[#F59E0B]" /> : <User className="w-4 h-4 text-[#94A3B8]" />}
                                            {usr.full_name || "Unknown"}
                                            {usr.is_verified && <CheckCircle className="w-4 h-4 text-[#10B981]" title="Verified" />}
                                        </div>
                                        <div className="text-xs text-[#475569]">{usr.email || "No email"}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {usr.is_admin ? (
                                            <span className="text-xs font-bold text-[#F59E0B] bg-[#FFFBEB] px-2 py-1 rounded-md border border-[#FEF3C7]">ADMIN</span>
                                        ) : (
                                            <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-md border border-[#E2E8F0]">USER</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 font-mono text-[#2563EB]">
                                        {usr.refer_code || "-"}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-[#10B981]">
                                            ${Number(usr.wallet_balance || 0).toLocaleString('en-US')}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-[#475569]">
                                        {new Date(usr.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => setSelectedUser(usr)}
                                            className="text-[#2563EB] hover:text-[#1D4ED8] p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                <User className="w-5 h-5 text-[#2563EB]" /> User Details
                            </h2>
                            <button onClick={() => setSelectedUser(null)} className="text-[#94A3B8] hover:text-[#0F172A] p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Verification Banner */}
                            <div className={`p-4 rounded-lg flex items-center justify-between border ${
                                selectedUser.is_verified 
                                    ? 'bg-[#ECFDF5] border-emerald-100' 
                                    : 'bg-[#FEF2F2] border-red-100'
                            }`}>
                                <div className="flex items-center gap-3">
                                    {selectedUser.is_verified ? (
                                        <CheckCircle className="w-6 h-6 text-[#10B981]" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-[#EF4444]" />
                                    )}
                                    <div>
                                        <h3 className={`font-bold ${selectedUser.is_verified ? 'text-[#047857]' : 'text-[#B91C1C]'}`}>
                                            {selectedUser.is_verified ? 'Verified User' : 'Unverified User'}
                                        </h3>
                                        <p className="text-xs text-[#475569]">
                                            {selectedUser.is_verified 
                                                ? 'This user has been verified and their profile is locked.' 
                                                : 'This user is pending verification.'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleVerifyUpdate(selectedUser.id, !selectedUser.is_verified)}
                                    disabled={isUpdating}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
                                        selectedUser.is_verified
                                            ? 'bg-white text-[#EF4444] hover:bg-red-50 border border-red-200'
                                            : 'bg-white text-[#10B981] hover:bg-emerald-50 border border-emerald-200'
                                    }`}
                                >
                                    {isUpdating && <RefreshCw className="w-4 h-4 animate-spin" />}
                                    {selectedUser.is_verified ? 'Revoke Verification' : 'Verify User'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Basic Info</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Full Name</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.full_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Email</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Phone</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Country</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.country || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Date of Birth</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.dob || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Gender</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.gender || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Joined</p>
                                            <p className="text-[#0F172A] font-medium">
                                                {new Date(selectedUser.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Account Info</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Wallet Balance</p>
                                            <p className="text-[#10B981] font-bold text-lg">
                                                ${Number(selectedUser.wallet_balance || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Role</p>
                                            <p className="text-[#0F172A] font-medium">{selectedUser.is_admin ? 'Admin' : 'User'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Referral Code</p>
                                            <p className="text-[#2563EB] font-mono font-medium">{selectedUser.referral_code || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#94A3B8]">Referred By</p>
                                            <p className="text-[#475569] font-mono text-sm">{selectedUser.referred_by || 'None'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">Identity Documents</h3>
                                {!selectedUser.identity_documents || selectedUser.identity_documents.length === 0 ? (
                                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 text-center text-[#94A3B8] text-sm">
                                        No identity documents uploaded yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedUser.identity_documents.map((url, idx) => (
                                            <a 
                                                key={idx} 
                                                href={url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block rounded-xl overflow-hidden border border-[#E2E8F0] hover:border-[#2563EB] transition-colors h-48 group relative bg-[#F8FAFC]"
                                            >
                                                {url.toLowerCase().includes('.pdf') ? (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-[#475569] font-bold">PDF Document</span>
                                                    </div>
                                                ) : (
                                                    <img src={url} alt={`Doc ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                )}
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="bg-white text-[#2563EB] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                        View Full Size
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
