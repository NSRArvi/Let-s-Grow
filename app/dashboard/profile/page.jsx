"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthProvider";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  Upload,
  FileText,
  CreditCard,
  X,
  Camera,
  CheckCircle,
  Calendar,
  Trash2,
  Eye,
} from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const COUNTRIES = [
  { code: "BD", name: "Bangladesh" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { user, supabase } = useAuth();

  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "",
    phone: "",
    country: "BD",
    dob: "",
    sex: "Male",
    profilePhoto: null,
    docType: "Passport",
    docFiles: [],
    isVerified: false,
    joinedAt: null,
  });

  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Fallback for old users created before the database trigger existed
          const fallbackData = {
            name: user.user_metadata?.full_name || "New User",
            email: user.email,
            phone: "",
            country: "BD",
            dob: "",
            sex: "Male",
            profilePhoto: null,
            docType: "Passport",
            docFiles: [],
            isVerified: false,
            joinedAt: user.created_at,
          };
          setUserData(fallbackData);
          if (!isEditing) setFormData(fallbackData);
          return;
        }
        throw error;
      }

      const newUserData = {
        name: data.full_name || "New User",
        email: data.email || user.email,
        phone: data.phone || "",
        country: data.country || "BD",
        dob: data.dob || "",
        sex: data.gender || "Male",
        profilePhoto: null,
        docType: "Passport",
        docFiles: data.identity_documents || [],
        isVerified: data.is_verified || false,
        joinedAt: data.created_at || user.created_at,
      };

      setUserData(newUserData);
      // Only overwrite the form if they aren't actively editing it
      setFormData((prev) => (isEditing ? prev : newUserData));
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.docFiles.length + files.length > 2) {
      toast.error("You can only upload a maximum of 2 documents.");
      return;
    }

    setIsUploading(true);

    try {
      const newFileUrls = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from("identity_documents")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("identity_documents").getPublicUrl(fileName);

        newFileUrls.push(publicUrl);
      }

      setFormData((prev) => ({
        ...prev,
        docFiles: [...prev.docFiles, ...newFileUrls],
      }));

      toast.success(
        "File uploaded successfully! Don't forget to save changes.",
      );
    } catch (err) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      docFiles: prev.docFiles.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.dob ||
      !formData.country
    ) {
      toast.error("Please fill out your Name, Phone, DOB, and Country.");
      return;
    }

    if (formData.docFiles.length === 0) {
      toast.error("Please upload at least one identity document.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.sex,
        country: formData.country,
        identity_documents: formData.docFiles,
      });

      if (error) throw error;

      setUserData(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  const formattedDate = userData.joinedAt
    ? new Date(userData.joinedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Loading...";

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="space-y-8 animate-fadeInUp px-4 lg:px-8 max-w-5xl mx-auto pb-10 mt-6 lg:mt-0">
      {/* Header */}
      <div className="flex justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-lg shadow-emerald-500/20"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-lg shadow-gray-500/20"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || isUploading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/40 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden">
            {userData.isVerified && (
              <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-500/50">
                <CheckCircle className="w-3 h-3" />
                Verified
              </div>
            )}

            <div className="relative group mb-4 mt-6">
              <div className="w-32 h-32 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-emerald-400" />
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {userData.name}
            </h2>

            <div className="w-full pt-4 border-t border-emerald-500/10 space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span className="text-sm truncate">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">
                  {userData.phone || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">Joined {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Form */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? formData.name : userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                    isEditing
                      ? "bg-gray-900/80 border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      : "bg-gray-900/50 border border-gray-800"
                  }`}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={isEditing ? formData.country : userData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                    isEditing
                      ? "bg-gray-900/80 border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      : "bg-gray-900/50 border border-gray-800"
                  }`}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">
                  Phone Number
                </label>
                <div
                  className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                    isEditing
                      ? "bg-gray-900/80 border border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500"
                      : "bg-gray-900/50 border border-gray-800 opacity-70"
                  }`}
                >
                  <PhoneInput
                    international
                    defaultCountry="BD"
                    value={isEditing ? formData.phone : userData.phone}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, phone: val }))
                    }
                    disabled={!isEditing}
                    className="flex gap-2 items-center w-full"
                    numberInputProps={{
                      className:
                        "bg-transparent border-none text-white focus:outline-none w-full outline-none",
                    }}
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={isEditing ? formData.dob : userData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  max={maxDateString}
                  className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                    isEditing
                      ? "bg-gray-900/80 border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      : "bg-gray-900/50 border border-gray-800"
                  }`}
                />
              </div>

              {/* Sex */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-1">
                  Gender
                </label>
                <select
                  name="sex"
                  value={isEditing ? formData.sex : userData.sex}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                    isEditing
                      ? "bg-gray-900/80 border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      : "bg-gray-900/50 border border-gray-800"
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-emerald-500/10">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Identity Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doc Type */}
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">
                    Document Type
                  </label>
                  <select
                    name="docType"
                    value={isEditing ? formData.docType : userData.docType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                      isEditing
                        ? "bg-gray-900/80 border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        : "bg-gray-900/50 border border-gray-800"
                    }`}
                  >
                    <option value="Passport">Passport</option>
                    <option value="NID">NID</option>
                    <option value="Driver License">Driver's License</option>
                  </select>
                </div>

                {/* Doc Files */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-emerald-300 mb-3">
                    Identity Documents (Max 2)
                  </label>

                  {isEditing ? (
                    <div className="space-y-4">
                      {formData.docFiles.length < 2 && (
                        <div className="relative border-2 border-dashed border-emerald-500/30 rounded-xl p-8 text-center bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <p className="text-sm text-emerald-400">
                                Uploading...
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                              <p className="text-sm text-gray-300 mb-1">
                                Click to upload ({2 - formData.docFiles.length}{" "}
                                remaining)
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG or PDF (max. 5MB)
                              </p>
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*,application/pdf"
                                onChange={handleFileUpload}
                                multiple
                              />
                            </>
                          )}
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-4">
                        {formData.docFiles.map((url, idx) => {
                          const isPdf = url.toLowerCase().includes(".pdf");
                          return (
                            <div
                              key={idx}
                              className="relative group border border-emerald-500/30 rounded-xl overflow-hidden w-full h-40 bg-gray-900/80 flex items-center justify-center shadow-lg"
                            >
                              {isPdf ? (
                                <FileText className="w-10 h-10 text-emerald-400" />
                              ) : (
                                <img
                                  src={url}
                                  alt={`Document ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500 hover:text-white transition-colors"
                                  title="View Document"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveFile(idx);
                                  }}
                                  className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
                          <div
                            key={idx}
                            className="relative group border border-gray-700 rounded-xl overflow-hidden w-full h-40 bg-gray-900/50 flex items-center justify-center hover:border-emerald-500/50 transition-colors"
                          >
                            {isPdf ? (
                              <FileText className="w-10 h-10 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                            ) : (
                              <img
                                src={url}
                                alt={`Document ${idx + 1}`}
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                              />
                            )}
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
                                <Eye className="w-5 h-5" />
                              </div>
                            </a>
                          </div>
                        );
                      })}
                      {userData.docFiles.length === 0 && (
                        <p className="text-sm text-gray-500">
                          No documents uploaded yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-emerald-500/10 flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  disabled={isLoading || isUploading}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || isUploading}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
