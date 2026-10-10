"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import en from "@/locales/en.json";
import bn from "@/locales/bn.json";
import hi from "@/locales/hi.json";

const translations = { en, bn, hi };

export const LANGUAGES = [
  { code: "en", label: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "bn", label: "Bangla", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
];

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  languages: LANGUAGES,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_language");
      if (saved && (saved === "en" || saved === "bn" || saved === "hi")) {
        setLanguageState(saved);
      }
    } catch (e) {
      // localStorage not available
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang) => {
    if (lang === "en" || lang === "bn" || lang === "hi") {
      setLanguageState(lang);
      try {
        localStorage.setItem("app_language", lang);
      } catch (e) {}
    }
  };

  const t = useMemo(() => {
    const currentDict = translations[language] || translations.en;
    const fallbackDict = translations.en;

    return (keyPath, fallbackText) => {
      if (!keyPath) return "";
      const keys = keyPath.split(".");

      // Try current language
      let value = currentDict;
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (value !== undefined && typeof value === "string") {
        return value;
      }

      // Fallback to English
      let fallbackValue = fallbackDict;
      for (const k of keys) {
        if (fallbackValue && typeof fallbackValue === "object" && k in fallbackValue) {
          fallbackValue = fallbackValue[k];
        } else {
          fallbackValue = undefined;
          break;
        }
      }

      if (fallbackValue !== undefined && typeof fallbackValue === "string") {
        return fallbackValue;
      }

      return fallbackText !== undefined ? fallbackText : keyPath;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

