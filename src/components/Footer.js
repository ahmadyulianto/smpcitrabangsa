"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

// Inline SVG components for brand icons
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const FALLBACK_NAV_ITEMS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Visi & Misi", href: "#visi-misi" },
  { label: "Kegiatan Live", href: "#kegiatan" },
  { label: "Program Unggulan", href: "#program" },
  { label: "Hubungi Kami", href: "#kontak" }
];

export default function Footer() {
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
        console.error("Failed to load dynamic nav links inside footer:", err);
      }
    };
    fetchNav();

    // Listen for custom event indicating logo has been updated
    const handleLogoUpdate = () => {
      setLogoVersion(prev => prev + 1);
    };
    window.addEventListener("logo-updated", handleLogoUpdate);

    return () => {
      window.removeEventListener("logo-updated", handleLogoUpdate);
    };
  }, []);

  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-emerald-500/20">
                <img
                  src={`/logo.jpg?v=${logoVersion}`}
                  alt="SMP Citra Bangsa Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white">
                  SMP Citra Bangsa
                </span>
                <span className="font-body text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                  Trabas Enviropreneur
                </span>
              </div>
            </div>
            <p className="text-slate-400 font-body text-sm leading-relaxed max-w-sm">
              Mendidik generasi unggul, berkarakter mulia, peduli lingkungan hidup (Enviro), serta berwirausaha mandiri (Entrepreneur) berbasis teknologi digital.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <a
                id="footer-ig-link"
                href="https://www.instagram.com/smpcitrabangsa.bws/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500/30 transition-colors duration-300"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                id="footer-yt-link"
                href="https://www.youtube.com/@trabasbondowoso"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-colors duration-300"
                aria-label="YouTube Channel"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                id="footer-fb-link"
                href="https://www.facebook.com/smpcitrabangsa.bws"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500/30 transition-colors duration-300"
                aria-label="Facebook Page"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                id="footer-tiktok-link"
                href="https://www.tiktok.com/@smpcitrabangsa.bws"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-colors duration-300 font-bold"
                aria-label="TikTok Profile"
              >
                <span className="text-sm">🎵</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-display font-semibold text-white tracking-wide text-sm uppercase">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 font-body text-sm">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-400 hover:text-brand-green-light transition-colors duration-200">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#ppdb" className="text-slate-400 hover:text-brand-green-light transition-colors duration-200">
                  Pendaftaran PPDB
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-display font-semibold text-white tracking-wide text-sm uppercase">
              Hubungi Sekolah
            </h3>
            <ul className="space-y-3.5 font-body text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Jl. Diponegoro, RT 09/RW 02, Desa Poncogati, Kecamatan Curahdami, Kabupaten Bondowoso, Jawa Timur 68251
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>+62 823-3004-9100</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>info@smpcitrabangsa.sch.id</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between font-body text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SMP Citra Bangsa Bondowoso. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Yayasan Putra Bangsa Bondowoso</p>
        </div>
      </div>
    </footer>
  );
}
