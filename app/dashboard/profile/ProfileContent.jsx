"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useLanguage } from "@/app/components/context/LanguageContext";
import toast from "react-hot-toast";
import {
  User, Mail, Phone, Edit2, Save, Upload, FileText, CreditCard, X, Camera,
  CheckCircle, Calendar, Trash2, Eye,
} from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const COUNTRIES = [
  { code: "BD", name: "Bangladesh" }, { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" }, { code: "IN", name: "India" },
  { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user, supabase } = useAuth();
  const { t } = useLanguage();

  const [userData, setUserData] = useState({
    name: "Loading...", email: "", phone: "", country: "BD", dob: "", sex: "Male",
    profilePhoto: null, docType: "Passport", docFiles: [], isVerified: false,
    joinedAt: "", referralCode: "", referredBy: "",
  });
  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => { if (user?.id) { fetchProfile(); } }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) {
        if (error.code === "PGRST116") {
          const fallbackData = { name: user.user_metadata?.full_name || "New User", email: user.email, phone: "", country: "BD", dob: "", sex: "Male", profilePhoto: null, docType: "Passport", docFiles: [], isVerified: false, joinedAt: user.created_at };
          setUserData(fallbackData);
          if (!isEditing) setFormData(fallbackData);
          return;
        }
        throw error;
      }
      const newUserData = {
        name: data.full_name || "New User", email: data.email || user.email, phone: data.phone || "",
        country: data.country || "BD", dob: data.dob || "", sex: data.gender || "Male", profilePhoto: null,
        docType: "Passport", docFiles: data.identity_documents || [], isVerified: data.is_verified || false,
        joinedAt: data.created_at || user.created_at, referralCode: data.referral_code || "", referredBy: data.referred_by || "",
      };
      setUserData(newUserData);
      setFormData((prev) => (isEditing ? prev : newUserData));
    } catch (err) { console.error("Error fetching profile:", err); toast.error("Failed to load profile data."); }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (formData.docFiles.length + files.length > 2) { toast.error("You can only upload a maximum of 2 documents."); return; }
    setIsUploading(true);
    try {
      const newFileUrls = [];
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("identity_documents").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("identity_documents").getPublicUrl(fileName);
        newFileUrls.push(publicUrl);
      }
      setFormData((prev) => ({ ...prev, docFiles: [...prev.docFiles, ...newFileUrls] }));
      toast.success("File uploaded successfully! Don't forget to save changes.");
    } catch (err) { toast.error(err.message || "Failed to upload file"); }
    finally { setIsUploading(false); }
  };

  const handleRemoveFile = (indexToRemove) => { setFormData((prev) => ({ ...prev, docFiles: prev.docFiles.filter((_, idx) => idx !== indexToRemove) })); };
  const isValidReferralFormat = (code) => { if (!code) return true; return /^LGX-REF-[A-Z0-9]{6}$/i.test(code.trim()); };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.dob || !formData.country) { toast.error("Please fill out your Name, Phone, DOB, and Country."); return; }
    if (formData.docFiles.length === 0) { toast.error("Please upload at least one identity document."); return; }
    if (formData.referredBy && !isValidReferralFormat(formData.referredBy)) { toast.error("Invalid referral code format. It should look like LGX-REF-XXXXXX"); return; }
    if (formData.referredBy && formData.referredBy.toUpperCase() === userData.referralCode) { toast.error("You cannot use your own referral code."); return; }
    setIsLoading(true);
    if (formData.referredBy) {
      const { data: codeExists, error: rpcError } = await supabase.rpc('check_referral_code_exists', { code_to_check: formData.referredBy.toUpperCase() });
      if (rpcError || !codeExists) { setIsLoading(false); toast.error("This referral code does not exist."); return; }
    }
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id, email: user.email, full_name: formData.name, phone: formData.phone,
        dob: formData.dob, gender: formData.sex, country: formData.country,
        identity_documents: formData.docFiles,
        referred_by: userData.referredBy ? userData.referredBy : (formData.referredBy ? formData.referredBy.toUpperCase() : null),
      });
      if (error) throw error;
      setUserData(formData); setIsEditing(false); toast.success("Profile updated successfully");
    } catch (error) { toast.error(error.message || "Failed to update profile"); }
    finally { setIsLoading(false); }
  };

  const handleCancel = () => { setFormData({ ...userData }); setIsEditing(false); };
  const formattedDate = userData.joinedAt ? new Date(userData.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Loading...";
  const maxDate = new Date(); maxDate.setFullYear(maxDate.getFullYear() - 16);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const inputClass = (editing) => `w-full px-4 py-2.5 rounded-xl text-[#0F172A] transition-colors ${
    editing ? "bg-white border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:outline-none" : "bg-[#F8FAFC] border border-[#E2E8F0]"
  }`;

  return (
    <div className="space-y-8 animate-fadeInUp pb-10 mt-6 lg:mt-0">
      {/* Header */}
      <div className="flex justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">{t("profilePage.title") || "Profile"}</h1>
        <p className="text-[#94A3B8] text-sm">
          {t("profilePage.subtitle") || "Manage your personal details and identity verification."}
        </p>
        </div>
        {!isEditing ? (
          userData.isVerified ? (
            <div className="bg-[#ECFDF5] text-[#047857] px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {t("profilePage.verified") || "Verified"} {t("profilePage.title") || "Profile"}
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm">
              <Edit2 className="w-4 h-4" /> {t("profilePage.editProfile") || "Edit"}
            </button>
          )
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] px-4 py-2 rounded-xl transition-colors font-medium text-sm">
              <X className="w-4 h-4" /> {t("profilePage.cancel") || "Cancel"}
            </button>
            <button onClick={handleSave} disabled={isLoading || isUploading} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm disabled:opacity-50">
              <Save className="w-4 h-4" /> {t("profilePage.save") || "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)] flex flex-col items-center text-center relative overflow-hidden">
            {userData.isVerified && (
              <div className="absolute top-4 right-4 bg-[#ECFDF5] text-[#047857] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-100">
                <CheckCircle className="w-3 h-3" /> {t("profilePage.verified") || "Verified"}
              </div>
            )}
            <div className="relative group mb-4 mt-6">
              <div className="w-28 h-28 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center overflow-hidden">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-[#2563EB]" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">{userData.name}</h2>

            <div className="w-full pt-4 border-t border-[#E2E8F0] space-y-3 text-left">
              <div className="flex items-center gap-3 text-[#475569]">
                <Mail className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm truncate">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#475569]">
                <Phone className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm">{userData.phone || (t("profilePage.notProvided") || "Not provided")}</span>
              </div>
              <div className="flex items-center gap-3 text-[#475569]">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span className="text-sm">{t("profilePage.joined") || "Joined"} {formattedDate}</span>
              </div>
            </div>

            {userData.referralCode && (
              <div className="w-full pt-6 mt-4 border-t border-[#E2E8F0]">
                <p className="text-xs text-[#94A3B8] mb-2 font-medium uppercase tracking-wider text-left">{t("profilePage.yourReferralCode") || "Your Referral Code"}</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex justify-between items-center group cursor-copy hover:bg-blue-100/50 transition-colors"
                  onClick={() => { navigator.clipboard.writeText(userData.referralCode); toast.success(t("profilePage.copied") || "Referral code copied!"); }}
                >
                   <span className="text-[#2563EB] font-mono font-bold tracking-widest">{userData.referralCode}</span>
                   <span className="text-xs text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">{t("profilePage.copy") || "Copy"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Info Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#2563EB]" /> {t("profilePage.personalInfo") || "Personal Information"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{t("profilePage.fullName") || "Full Name"}</label>
                <input type="text" name="name" value={isEditing ? formData.name : userData.name} onChange={handleInputChange} disabled={!isEditing} className={inputClass(isEditing)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5 flex items-center justify-between">
                  <span>{t("profilePage.referredBy") || "Referred By"}</span>
                  {userData.referredBy && <span className="text-xs text-[#94A3B8]">{t("profilePage.locked") || "Locked"}</span>}
                </label>
                <input type="text" name="referredBy" value={isEditing ? formData.referredBy : userData.referredBy} onChange={handleInputChange} disabled={!isEditing || !!userData.referredBy} placeholder={userData.referredBy ? "" : "Optional referral code"}
                  className={`${inputClass(!isEditing || !!userData.referredBy)} ${(!isEditing || !!userData.referredBy) ? "opacity-70 cursor-not-allowed" : "uppercase"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{t("profilePage.country") || "Country"}</label>
                <select name="country" value={isEditing ? formData.country : userData.country} onChange={handleInputChange} disabled={!isEditing} className={inputClass(isEditing)}>
                  {COUNTRIES.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{t("profilePage.phone") || "Phone Number"}</label>
                <div className={`w-full px-4 py-2.5 rounded-xl transition-colors ${isEditing ? "bg-white border border-[#E2E8F0] focus-within:ring-2 focus-within:ring-[#2563EB]" : "bg-[#F8FAFC] border border-[#E2E8F0] opacity-70"}`}>
                  <PhoneInput international defaultCountry="BD" value={isEditing ? formData.phone : userData.phone}
                    onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))} disabled={!isEditing}
                    className="flex gap-2 items-center w-full"
                    numberInputProps={{ className: "bg-transparent border-none text-[#0F172A] focus:outline-none w-full outline-none" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{t("profilePage.dob") || "Date of Birth"}</label>
                <input type="date" name="dob" value={isEditing ? formData.dob : userData.dob} onChange={handleInputChange} disabled={!isEditing} max={maxDateString} className={inputClass(isEditing)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{t("profilePage.gender") || "Gender"}</label>
                <select name="sex" value={isEditing ? formData.sex : userData.sex} onChange={handleInputChange} disabled={!isEditing} className={inputClass(isEditing)}>
                  <option value="Male">{t("profilePage.male") || "Male"}</option>
                  <option value="Female">{t("profilePage.female") || "Female"}</option>
                  <option value="Other">{t("profilePage.other") || "Other"}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">{t("profilePage.emailAddress") || "Email Address"}</label>
                <input type="email" value={userData.email} disabled className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#94A3B8] cursor-not-allowed" />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2563EB]" /> {t("profilePage.identityVerification") || "Identity Verification"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{t("profilePage.documentType") || "Document Type"}</label>
                  <select name="docType" value={isEditing ? formData.docType : userData.docType} onChange={handleInputChange} disabled={!isEditing} className={inputClass(isEditing)}>
                    <option value="Passport">{t("profilePage.passport") || "Passport"}</option>
                    <option value="NID">{t("profilePage.nid") || "NID"}</option>
                    <option value="Driver License">{t("profilePage.driverLicense") || "Driver's License"}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#0F172A] mb-3">{t("profilePage.identityDocuments") || "Identity Documents (Max 2)"}</label>
                  {isEditing ? (
                    <div className="space-y-4">
                      {formData.docFiles.length < 2 && (
                        <div className="relative border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 text-center bg-[#F8FAFC] hover:bg-blue-50/50 hover:border-[#2563EB]/30 transition-colors cursor-pointer group">
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-3"></div>
                              <p className="text-sm text-[#2563EB]">{t("profilePage.uploading") || "Uploading..."}</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-[#2563EB] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                              <p className="text-sm text-[#475569] mb-1">{t("profilePage.clickToUpload") || "Click to upload"} ({2 - formData.docFiles.length} {t("profilePage.remaining") || "remaining"})</p>
                              <p className="text-xs text-[#94A3B8]">{t("profilePage.uploadFormats") || "PNG, JPG or PDF (max. 5MB)"}</p>
                              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,application/pdf" onChange={handleFileUpload} multiple />
                            </>
                          )}
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {formData.docFiles.map((url, idx) => {
                          const isPdf = url.toLowerCase().includes(".pdf");
                          return (
                            <div key={idx} className="relative group border border-[#E2E8F0] rounded-xl overflow-hidden w-full h-40 bg-[#F8FAFC] flex items-center justify-center">
                              {isPdf ? <FileText className="w-10 h-10 text-[#2563EB]" /> : <img src={url} alt={`Document ${idx + 1}`} className="w-full h-full object-cover" />}
                              <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <a href={url} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-[#2563EB] rounded-full hover:bg-[#2563EB] hover:text-white transition-colors" title="View"><Eye className="w-4 h-4" /></a>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFile(idx); }} className="p-2 bg-[#FEF2F2] text-[#EF4444] rounded-full hover:bg-[#EF4444] hover:text-white transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {userData.docFiles.map((url, idx) => {
                        const isPdf = url.toLowerCase().includes(".pdf");
                        return (
                          <div key={idx} className="relative group border border-[#E2E8F0] rounded-xl overflow-hidden w-full h-40 bg-[#F8FAFC] flex items-center justify-center hover:border-[#2563EB]/30 transition-colors">
                            {isPdf ? <FileText className="w-10 h-10 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" /> : <img src={url} alt={`Document ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                            <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-blue-50 text-[#2563EB] p-2 rounded-full"><Eye className="w-5 h-5" /></div>
                            </a>
                          </div>
                        );
                      })}
                      {userData.docFiles.length === 0 && <p className="text-sm text-[#94A3B8]">{t("profilePage.noDocuments") || "No documents uploaded yet."}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
                <button onClick={handleCancel} disabled={isLoading || isUploading} className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" /> {t("profilePage.cancel") || "Cancel"}
                </button>
                <button onClick={handleSave} disabled={isLoading || isUploading} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />} {t("profilePage.saveChanges") || "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
