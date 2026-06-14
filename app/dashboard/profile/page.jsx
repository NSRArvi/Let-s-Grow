"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 8900",
    dob: "1990-05-15",
    sex: "Male",
    profilePhoto: null,
    docType: "Passport",
    docNumber: "AB1234567",
    docFiles: ["passport_front.jpg"],
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserData(formData);
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

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
              disabled={isLoading}
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
          <div className="bg-black/40 p-6 rounded-xl border border-emerald-500/20 shadow-md backdrop-blur-sm flex flex-col items-center text-center">
            <div className="relative group mb-4">
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
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-emerald-500 p-2.5 rounded-full cursor-pointer hover:bg-emerald-400 transition-colors shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{userData.name}</h2>
            <p className="text-emerald-400 text-sm font-medium mb-4">
              Verified Member
            </p>

            <div className="w-full pt-4 border-t border-emerald-500/10 space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm truncate">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{userData.phone}</span>
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

              {/* Phone (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData.phone}
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
                    <option value="Social Security Number">
                      Social Security Number
                    </option>
                  </select>
                </div>

                {/* Doc Number */}
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">
                    Identity Document Number
                  </label>
                  <input
                    type="text"
                    name="docNumber"
                    value={isEditing ? formData.docNumber : userData.docNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. Passport or NID Number"
                    className={`w-full px-4 py-2.5 rounded-lg text-white transition-colors ${
                      isEditing
                        ? "bg-gray-900/80 border border-emerald-500/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        : "bg-gray-900/50 border border-gray-800"
                    }`}
                  />
                </div>

                {/* Doc Files */}
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-3">
                    Identity Documents
                  </label>
                  {isEditing ? (
                    <div className="border-2 border-dashed border-emerald-500/30 rounded-xl p-8 text-center bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
                      <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-gray-300 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or PDF (max. 5MB)
                      </p>
                      <input type="file" className="hidden" multiple />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {userData.docFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 px-4 py-3 rounded-lg"
                        >
                          <FileText className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-gray-300">{file}</span>
                        </div>
                      ))}
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
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
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
