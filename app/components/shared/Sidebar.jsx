"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Wallet,
  PackageCheck,
  Menu,
  X,
  User,
  Users,
  ShieldCheck,
  FolderTree,
  Boxes,
  LogOut,
  RefreshCw,
  Clock,
  LayoutDashboard,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useTheme } from "../ThemeProvider";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";

const navItems = [
  { href: "/dashboard", key: "nav.dashboard", fallback: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/packages", key: "nav.market", fallback: "Market", icon: Package },
  { href: "/dashboard/profile", key: "nav.profile", fallback: "Profile", icon: User },
  { href: "/dashboard/wallet", key: "nav.wallet", fallback: "Wallet", icon: Wallet },
  { href: "/dashboard/my-packages", key: "nav.packages", fallback: "Packages", icon: PackageCheck },
  { href: "/dashboard/team", key: "nav.team", fallback: "Team", icon: Users },
];

const adminNavItems = [
  { href: "/dashboard", key: "nav.overview", fallback: "Overview", icon: BarChart3 },
  { href: "/dashboard/admin/users", key: "nav.users", fallback: "Users", icon: Users },
  {
    href: "/dashboard/admin/categories",
    key: "nav.categories",
    fallback: "Categories",
    icon: FolderTree,
  },
  { href: "/dashboard/admin/packages", key: "nav.adminPackages", fallback: "Packages", icon: Boxes },
  { href: "/dashboard/admin/wallet", key: "nav.vault", fallback: "Vault", icon: ShieldCheck },
  { href: "/dashboard/admin/returns", key: "nav.returns", fallback: "Returns", icon: RefreshCw },
  {
    href: "/dashboard/admin/transactions",
    key: "nav.transactions",
    fallback: "Transactions",
    icon: Clock,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout, user, supabase } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setIsAdmin(!!data?.is_admin));
    }
  }, [user]);

  const SidebarContent = () => (
    <div className="w-64 min-h-screen bg-white border-r border-[#E2E8F0] p-6 flex flex-col">
      {/* Logo */}
      <p className="text-xl font-bold text-[#2563EB] mb-10 tracking-tight">
        Let's Grow
      </p>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {(isAdmin ? adminNavItems : navItems).map(
          ({ href, key, fallback, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${
                isActive
                  ? isAdmin
                    ? "bg-amber-50 text-[#B45309]"
                    : "bg-blue-50 text-[#2563EB]"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] mr-3 ${
                    isActive
                      ? isAdmin
                        ? "text-[#B45309]"
                        : "text-[#2563EB]"
                      : "text-[#94A3B8]"
                  }`}
                />
                {t(key, fallback)}
              </Link>
            );
          },
        )}
      </nav>

      {/* Language Switcher, Theme Toggle & Logout */}
      <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
        <LanguageSwitcher variant="sidebar" />

        {mounted && (
          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] group"
          >
            <span className="flex items-center">
              {theme === "dark" ? (
                <Moon className="w-[18px] h-[18px] mr-3 text-indigo-400 transition-colors" />
              ) : (
                <Sun className="w-[18px] h-[18px] mr-3 text-amber-500 transition-colors" />
              )}
              <span>{theme === "dark" ? t("common.darkMode", "Dark Mode") : t("common.lightMode", "Light Mode")}</span>
            </span>

            {/* Toggle Switch */}
            <div
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                theme === "dark" ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        )}

        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="flex w-full items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-[#EF4444] hover:bg-[#FEF2F2]"
        >
          <LogOut className="w-[18px] h-[18px] mr-3" />
          {t("common.logout", "Logout")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="flex justify-between items-center md:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 z-50 sticky top-0">
        <button onClick={() => setIsOpen(true)} className="text-[#0F172A] p-1">
          <Menu size={22} />
        </button>
        <p className="text-lg font-bold text-[#2563EB]">Let's Grow</p>
        <div className="w-8"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen z-30">
        {SidebarContent()}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 shadow-xl">
            {SidebarContent()}
          </aside>
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-4 left-[17rem] z-50 text-[#475569] bg-white rounded-full p-1.5 shadow-md border border-[#E2E8F0]"
          >
            <X size={18} />
          </button>
        </>
      )}
    </>
  );
}
