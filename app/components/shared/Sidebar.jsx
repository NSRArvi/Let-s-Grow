"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Wallet,
  Gift,
  PackageCheck,
  Menu,
  X,
  User,
  Users,
  Package2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/packages", label: "Buy Packages", icon: Package },
  { href: "/dashboard/my-packages", label: "My Packages", icon: PackageCheck },
  { href: "/dashboard/subscription", label: "Subscription", icon: Package2 },
  { href: "/dashboard/offers", label: "Upcoming Offers", icon: Gift },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const SidebarContent = () => (
    <div className="w-64 min-h-screen bg-gray-900 border-r border-emerald-500/10 shadow-lg p-6">
      {/* Logo */}
      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-10">
        Let’s Grow
      </p>

      {/* Navigation */}
      <nav className="space-y-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)} // Only affects mobile
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all group
              ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow"
                  : "text-white hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/10"
              }`}
            >
              <Icon
                className={`w-4 h-4 mr-3 ${
                  isActive
                    ? "text-emerald-300"
                    : "text-emerald-500 group-hover:text-emerald-300"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-10 pt-6 border-t border-emerald-500/10">
        <Link
          href="/"
          onClick={() => setIsOpen(false)} // Close mobile menu on click
          className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all group text-red-300 hover:bg-red-500/10 hover:text-white"
        >
          <X className="w-4 h-4 mr-3 text-red-400 group-hover:text-white" />
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="flex justify-between items-center md:hidden bg-gray-900 px-4 py-2.5 z-50 sticky top-0">
        <button onClick={() => setIsOpen(true)} className="text-white p-2">
          <Menu size={24} />
        </button>
        <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
          Let’s Grow
        </p>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen z-30">
        {SidebarContent()}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50">{SidebarContent()}</aside>
          {/* Close Button inside drawer */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 text-white p-2"
          >
            <X size={24} />
          </button>
        </>
      )}

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
