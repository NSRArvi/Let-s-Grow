"use client";
import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

export default function LanguageSwitcher({ variant = "default", className = "" }) {
  const { language, setLanguage, languages, mounted } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  // Variant for Sidebar (compact or full width button list or clean select)
  if (variant === "sidebar") {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          aria-label="Change Language"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-[18px] h-[18px] text-[#2563EB]" />
            <span className="text-sm font-medium">{currentLang.nativeName}</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold bg-[#F1F5F9] px-2 py-0.5 rounded-full">
            <span>{currentLang.flag}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-[#2563EB] font-bold"
                      : "text-[#334155] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{item.flag}</span>
                    <span>{item.nativeName}</span>
                    <span className="text-[#94A3B8] font-normal">({item.label})</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Variant for Navbar (compact dropdown pill)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] bg-white/70 backdrop-blur-sm transition-all shadow-sm"
        aria-label="Change Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-[#94A3B8] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-slate-100">
            Language
          </div>
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-[#2563EB] font-bold"
                    : "text-[#334155] hover:bg-[#F8FAFC]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span>{item.nativeName}</span>
                  <span className="text-[#94A3B8] font-normal text-[11px]">({item.code.toUpperCase()})</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

