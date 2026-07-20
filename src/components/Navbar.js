"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";

const FALLBACK_NAV_ITEMS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Visi & Misi", href: "#visi-misi" },
  { label: "Kegiatan Live", href: "#kegiatan" },
  { label: "Program Unggulan", href: "#program" },
  { label: "Hubungi Kami", href: "#kontak" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navItems, setNavItems] = useState(FALLBACK_NAV_ITEMS);
  const [logoVersion, setLogoVersion] = useState(0);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch("/api/admin/get");
        const result = await res.json();
        if (result.success && result.content?.navItems) {
          setNavItems(result.content.navItems);
        }
      } catch (err) {
        console.error("Failed to load dynamic nav links:", err);
      }
    };
    fetchNav();

    // Listen for custom event indicating logo has been updated
    const handleLogoUpdate = () => {
      setLogoVersion(prev => prev + 1);
    };
    window.addEventListener("logo-updated", handleLogoUpdate);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("logo-updated", handleLogoUpdate);
    };
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60 shadow-lg"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Name */}
          <a href="#beranda" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-emerald-500/30 group-hover:border-brand-gold/60 transition-colors duration-300">
              <img
                src={`/logo.jpg?v=${logoVersion}`}
                alt="SMP Citra Bangsa Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight tracking-tight text-white group-hover:text-brand-gold transition-colors duration-300">
                SMP Citra Bangsa
              </span>
              <span className="font-body text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                Trabas Enviropreneur
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-body text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute left-0 right-0 bottom-[-4px] h-[2px] bg-gradient-to-r from-brand-green-light to-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </div>

          {/* PPDB Button */}
          <div className="hidden md:block">
            <a
              id="btn-ppdb-desktop"
              href="#ppdb"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display text-sm font-semibold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 group"
            >
              Info PPDB
              <ArrowUpRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-slate-950/95 border-b border-slate-800 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100 py-4 shadow-xl" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md font-body text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <a
              id="btn-ppdb-mobile"
              href="#ppdb"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-5 py-3 rounded-full font-display text-base font-semibold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold text-center"
            >
              Info PPDB
              <ArrowUpRight className="ml-1.5 w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
