"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Shield, Phone, CreditCard, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPaymentMethodsManager({ supabase }) {
  const [methods, setMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const [formData, setFormData] = useState({
    method_key: "",
    name: "",
    type: "phone",
    account_number: "",
    account_type: "Personal",
    instructions: "",
    is_active: true,
  });

  const fetchMethods = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setMethods(data || []);
    } catch (err) {
      console.error("Error fetching payment methods in admin:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supabase) {
      fetchMethods();
    }
  }, [supabase]);

  const handleStartEdit = (method) => {
    setIsAddingNew(false);
    setEditingId(method.id);
    setFormData({
      method_key: method.method_key,
      name: method.name,
      type: method.type || "phone",
      account_number: method.account_number,
      account_type: method.account_type || "Personal",
      instructions: method.instructions || "",
      is_active: method.is_active,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({
      method_key: "",
      name: "",
      type: "phone",
      account_number: "",
      account_type: "Personal",
      instructions: "",
      is_active: true,
    });
  };

  const handleSave = async (id) => {
    if (!formData.name || !formData.account_number) {
      toast.error("Method name and account number/UID are required.");
      return;
    }

    setSavingId(id || "new");
    try {
      if (id) {
        // Update existing
        const { error } = await supabase
          .from("payment_methods")
          .update({
            name: formData.name,
            type: formData.type,
            account_number: formData.account_number,
            account_type: formData.account_type,
            instructions: formData.instructions,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Payment method updated!");
      } else {
        // Insert new
        const key =
          formData.method_key.trim().toLowerCase().replace(/\s+/g, "_") ||
          formData.name.trim().toLowerCase().replace(/\s+/g, "_");

        const { error } = await supabase.from("payment_methods").insert({
          method_key: key,
          name: formData.name,
          type: formData.type,
          account_number: formData.account_number,
          account_type: formData.account_type,
          instructions: formData.instructions,
          is_active: formData.is_active,
          display_order: methods.length + 1,
        });

        if (error) throw error;
        toast.success("New payment method added!");
      }

      handleCancelEdit();
      fetchMethods();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save payment method.");
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleStatus = async (method) => {
    try {
      const { error } = await supabase
        .from("payment_methods")
        .update({ is_active: !method.is_active })
        .eq("id", method.id);

      if (error) throw error;
      toast.success(
        `Method ${!method.is_active ? "Activated" : "Deactivated"}!`
      );
      fetchMethods();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Payment method removed.");
      fetchMethods();
    } catch (err) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex flex-wrap justify-between items-center gap-4 bg-[#F8FAFC]">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#2563EB]" /> Platform Payment Options
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure system deposit accounts, numbers, and wallet addresses for user cash ins.
          </p>
        </div>
        {!isAddingNew && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsAddingNew(true);
              setFormData({
                method_key: "",
                name: "",
                type: "phone",
                account_number: "",
                account_type: "Personal",
                instructions: "",
                is_active: true,
              });
            }}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Payment Option
          </button>
        )}
      </div>

      {/* Add New Form */}
      {isAddingNew && (
        <div className="p-6 bg-blue-50/40 border-b border-blue-100">
          <h3 className="font-bold text-sm text-[#0F172A] mb-4">
            Add New Payment Option
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. bKash, Binance USDT"
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#2563EB]"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Account Number / UID / Wallet Address
              </label>
              <input
                type="text"
                placeholder="e.g. 01554915902 or TRC20 Address"
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] font-mono"
                value={formData.account_number}
                onChange={(e) =>
                  setFormData({ ...formData, account_number: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Account Type Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Personal, Merchant, TRC20"
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#2563EB]"
                value={formData.account_type}
                onChange={(e) =>
                  setFormData({ ...formData, account_type: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                User Instructions / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Send money as personal payment only."
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#2563EB]"
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => handleSave(null)}
                disabled={savingId === "new"}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#64748B] py-2 px-3 rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Methods Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase tracking-wider text-[#475569] bg-white border-b border-[#E2E8F0]">
            <tr>
              <th className="py-4 px-6 font-medium">Method</th>
              <th className="py-4 px-6 font-medium">Account Number / UID</th>
              <th className="py-4 px-6 font-medium">Account Type</th>
              <th className="py-4 px-6 font-medium">Instructions</th>
              <th className="py-4 px-6 font-medium text-center">Status</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {methods.length === 0 && !isLoading && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[#94A3B8]">
                  No custom payment options found in database. Using defaults.
                </td>
              </tr>
            )}
            {methods.map((method) => {
              const isEditing = editingId === method.id;

              return (
                <tr key={method.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-sm font-bold w-full"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <img
                          src={`/${method.method_key}.png`}
                          alt=""
                          className="w-5 h-5 object-contain"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <span className="font-bold text-[#0F172A]">
                          {method.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-sm font-mono font-bold w-full"
                        value={formData.account_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            account_number: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <span className="font-mono font-bold text-[#0F172A] bg-[#F1F5F9] px-2.5 py-1 rounded-md text-xs">
                        {method.account_number}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs w-full"
                        value={formData.account_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            account_type: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <span className="text-[#64748B] text-xs font-semibold">
                        {method.account_type || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input
                        type="text"
                        className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs w-full"
                        value={formData.instructions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructions: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <span className="text-xs text-[#94A3B8]">
                        {method.instructions || "-"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleStatus(method)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        method.is_active
                          ? "bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]"
                          : "bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2]"
                      }`}
                    >
                      {method.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleSave(method.id)}
                          disabled={savingId === method.id}
                          className="bg-[#2563EB] text-white p-1.5 rounded-lg hover:bg-[#1D4ED8]"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-[#E2E8F0] text-[#475569] p-1.5 rounded-lg hover:bg-[#CBD5E1]"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(method)}
                          className="text-[#64748B] hover:text-[#2563EB] p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(method.id)}
                          className="text-[#64748B] hover:text-[#EF4444] p-1.5 hover:bg-[#FEF2F2] rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

