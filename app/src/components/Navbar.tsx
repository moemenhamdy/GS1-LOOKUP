"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "الرئيسية", icon: "search" },
  { href: "/browse", label: "التصفح", icon: "category" },
  { href: "/about", label: "عن الموقع", icon: "info" },
  { href: "/links", label: "روابط مهمة", icon: "link" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-lg shadow-primary-600/5"
          : "bg-white/0 dark:bg-slate-900/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <span className="material-icons-round text-white text-lg">
                qr_code_2
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400 leading-tight">
                أكواد GS1
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                المنظومة الضريبية المصرية
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="material-icons-round text-[18px]">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}

            {/* External invoice link */}
            <a
              href="https://invoicing.eta.gov.eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200"
            >
              <span className="material-icons-round text-[18px]">receipt_long</span>
              الفاتورة الإلكترونية
              <span className="material-icons-round text-[14px]">open_in_new</span>
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="تغيير الوضع"
            >
              <span className="material-icons-round text-slate-600 dark:text-slate-300 text-xl">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="تغيير الوضع"
            >
              <span className="material-icons-round text-slate-600 dark:text-slate-300">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="القائمة"
            >
              <span className="material-icons-round text-slate-600 dark:text-slate-300">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="material-icons-round text-[20px]">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
            <a
              href="https://invoicing.eta.gov.eg/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
            >
              <span className="material-icons-round text-[20px]">receipt_long</span>
              الفاتورة الإلكترونية
              <span className="material-icons-round text-[14px] mr-auto">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
