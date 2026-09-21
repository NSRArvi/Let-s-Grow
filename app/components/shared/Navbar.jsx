"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, Menu, X, User, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/learn", label: "Learn" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-[#2563EB] rounded-xl p-2 shadow-lg shadow-blue-900/20 group-hover:bg-[#1D4ED8] transition-colors">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>
              Let's Grow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 bg-white/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#E2E8F0] shadow-sm">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`${
                  pathname === href 
                    ? "text-[#2563EB] font-bold" 
                    : "text-[#475569] font-medium hover:text-[#0F172A]"
                } transition-colors text-sm`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-[#475569] hover:text-[#2563EB] transition-colors p-2 rounded-xl hover:bg-blue-50 relative">
              <Bell className="h-5 w-5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse border-2 border-white"></div>
            </button>
            <Link
              href="/dashboard"
              className="text-[#475569] hover:text-[#2563EB] transition-colors p-2 rounded-xl hover:bg-blue-50"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/register"
              className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-200 shadow-lg shadow-blue-900/10 text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#0F172A] hover:text-[#2563EB] transition-colors p-2 rounded-xl bg-white shadow-sm border border-[#E2E8F0]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] shadow-xl absolute w-full left-0 top-full">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={()=> setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl ${
                  pathname === href 
                    ? "bg-blue-50 text-[#2563EB] font-bold" 
                    : "text-[#475569] hover:bg-[#F8FAFC] font-medium"
                } transition-colors`}
              >
                {label}
              </Link>
            ))}

            <hr className="border-[#E2E8F0] my-6" />
            
            <div className="flex flex-col gap-3 px-2">
              <Link
                href="/dashboard"
                onClick={()=> setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#F8FAFC] text-[#0F172A] px-4 py-3 rounded-xl font-bold border border-[#E2E8F0]"
              >
                <User className="h-5 w-5" />
                Go to Dashboard
              </Link>
              <Link
                href="/auth/register"
                onClick={()=> setIsMenuOpen(false)}
                className="flex items-center justify-center bg-[#2563EB] text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/10"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}