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

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/packages", label: "Market", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/my-packages", label: "Packages", icon: PackageCheck },
  { href: "/dashboard/team", label: "Team", icon: Users },
  // { href: "/dashboard/subscription", label: "Subscription", icon: Package2 },
  // { href: "/dashboard/offers", label: "Upcoming Offers", icon: Gift },
];

const adminNavItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  {
    href: "/dashboard/admin/categories",
    label: "Categories",
    icon: FolderTree,
  },
  { href: "/dashboard/admin/packages", label: "Packages", icon: Boxes },
  { href: "/dashboard/admin/wallet", label: "Vault", icon: ShieldCheck },
  { href: "/dashboard/admin/returns", label: "Returns", icon: RefreshCw },
  {
    href: "/dashboard/admin/transactions",
    label: "Transactions",
    icon: Clock,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout, user, supabase } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

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
          ({ href, label, icon: Icon }) => {
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
                {label}
              </Link>
            );
          },
        )}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            <span className="flex items-center">
              {theme === "dark" ? (
                <Moon className="w-[18px] h-[18px] mr-3 text-indigo-400" />
              ) : (
                <Sun className="w-[18px] h-[18px] mr-3 text-amber-500" />
              )}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
              {theme === "dark" ? "On" : "Off"}
            </span>
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
          Logout
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
