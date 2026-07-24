"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RefreshCw, Award, BookOpen, Users, Leaf, 
  MapPin, CheckCircle, Send, Globe, MessageCircle, ExternalLink 
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import defaultFeeds from "../../data/social-cache.json";

// Default content fallback values
const DEFAULT_CONTENT = {
  hero: {
    badge: "🌱 Enviro-Entrepreneurship Digital School",
    title: "SMP Citra Bangsa Bondowoso",
    subtitle: "Mewujudkan generasi berkarakter Robbani, peduli kelestarian lingkungan hidup, dan berdaya saing global melalui jiwa kewirausahaan kreatif."
  },
  stats: [
    { label: "Siswa Aktif", value: 250 },
    { label: "Guru & Staf", value: 20 },
    { label: "Prestasi Siswa", value: 35 },
    { label: "Program Eco", value: 12 }
  ],
  visiMisi: {
    visi: "Terwujudnya Lembaga Pendidikan Islam yang Unggul untuk Melahirkan Generasi Robbani, Berkarakter Enviropreneur, dan Berdaya Saing Global.",
    misi: [
      "Menyelenggarakan pendidikan holistik berbasis karakter Robbani dan akhlak mulia.",
      "Membudayakan sikap ramah lingkungan hidup dan pelestarian alam (Enviro).",
      "Melatih keterampilan wirausaha yang kreatif, jujur, mandiri, dan inovatif (Preneur).",
      "Mengembangkan literasi dan teknologi digital guna mendukung daya saing global."
    ]
  },
  programs: [
    {
      title: "Eco-Environment (Enviro)",
      desc: "Pembelajaran aktif dalam menjaga ekosistem bumi. Praktek langsung meliputi pertanian hidroponik, pengolahan kompos dari limbah sekolah, serta manajemen daur ulang kreatif.",
      badge: "Eco-School"
    },
    {
      title: "Entrepreneurship (Preneur)",
      desc: "Membangun jiwa kepemimpinan dan kewirausahaan sejak dini. Melalui kegiatan Market Day, penyusunan business plan sederhana, dan pameran karya kreatif inovasi mandiri.",
      badge: "Wirausaha"
    },
    {
      title: "Pembelajaran Digital",
      desc: "Menghadapi era digital dengan kurikulum teknologi terintegrasi. Siswa dibekali keterampilan dasar pemrograman (coding), literasi digital, dan penggunaan platform CBT modern.",
      badge: "Digital Class"
    }
  ],
  facilities: [],
  extracurriculars: [],
  faq: [],
  portals: []
};

// Icons mapping for stats
const STATS_ICONS = [Users, BookOpen, Award, Leaf];
const STATS_COLORS = ["text-blue-400", "text-emerald-400", "text-brand-gold", "text-green-400"];

// Icons mapping for programs
const PROGRAM_ICONS = [Leaf, Award, Globe];
const PROGRAM_COLORS = [
  { bg: "from-emerald-500/20 to-teal-500/5", border: "border-emerald-500/30" },
  { bg: "from-amber-500/20 to-yellow-500/5", border: "border-amber-500/30" },
  { bg: "from-blue-500/20 to-indigo-500/5", border: "border-blue-500/30" }
];

const ICON_MAP = {
  Globe: Globe,
  Leaf: Leaf,
  Users: Users,
  BookOpen: BookOpen,
  Award: Award
};

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [feeds, setFeeds] = useState(defaultFeeds);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // URL or embed URL
  const [formStatus, setFormStatus] = useState({ submitted: false, message: "" });
  const [heroVersion, setHeroVersion] = useState(0);
  const [prestasiFilter, setPrestasiFilter] = useState("Semua");
  const [activeSocialTab, setActiveSocialTab] = useState("instagram");
  const [lastWaUrl, setLastWaUrl] = useState("");
  const [activeGalleryTab, setActiveGalleryTab] = useState("facilities");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  
  // Stats Animation Counter Trigger
  const [counters, setCounters] = useState({ students: 0, teachers: 0, awards: 0, ecos: 0 });

  const contact = content.contact || {
    address: "Jl. Diponegoro, RT 09/RW 02, Desa Poncogati, Kecamatan Curahdami, Kabupaten Bondowoso, Jawa Timur 68251",
    whatsapp: "6282330049100",
    whatsappText: "+62 823-3004-9100",
    mapsUrl: "https://maps.google.com/?q=SMP+Citra+Bangsa+Bondowoso+Curahdami"
  };

  useEffect(() => {
    // Load CMS data dynamically
    const fetchSchoolData = async () => {
      try {
        const res = await fetch("/api/admin/get");
        const result = await res.json();
        if (result.success) {
          if (result.content && Object.keys(result.content).length > 0) {
            setContent(result.content);
          }
          if (result.activities && result.activities.length > 0) {
            setFeeds(result.activities);
          }
        }
      } catch (err) {
        console.error("Failed to load school content database:", err);
      }
    };
    fetchSchoolData();

    // Listen for custom event indicating hero bg has been updated
    const handleHeroUpdate = () => {
      setHeroVersion(prev => prev + 1);
    };
    window.addEventListener("hero-updated", handleHeroUpdate);

    return () => {
      window.removeEventListener("hero-updated", handleHeroUpdate);
    };
  }, []);

  useEffect(() => {
    // Start counter increment animation based on content stats values
    const maxStudents = content.stats[0]?.value || 250;
    const maxTeachers = content.stats[1]?.value || 20;
    const maxAwards = content.stats[2]?.value || 35;
    const maxEcos = content.stats[3]?.value || 12;

    const interval = setInterval(() => {
      setCounters(prev => {
        const next = { ...prev };
        if (next.students < maxStudents) next.students += Math.ceil(maxStudents / 50);
        if (next.teachers < maxTeachers) next.teachers += 1;
        if (next.awards < maxAwards) next.awards += 1;
        if (next.ecos < maxEcos) next.ecos += 1;
        
        // Clamp values
        if (next.students >= maxStudents) next.students = maxStudents;
        if (next.teachers >= maxTeachers) next.teachers = maxTeachers;
        if (next.awards >= maxAwards) next.awards = maxAwards;
        if (next.ecos >= maxEcos) next.ecos = maxEcos;

        if (next.students === maxStudents && next.teachers === maxTeachers && next.awards === maxAwards && next.ecos === maxEcos) {
          clearInterval(interval);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [content]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/get");
      const result = await res.json();
      if (result.success && result.activities) {
        setFeeds(result.activities);
      }
    } catch (err) {
      console.error("Refresh feed error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handlePPDBSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const studentName = formData.get("studentName");
    const parentName = formData.get("parentName");
    const parentWhatsapp = formData.get("whatsapp");
    const originSchool = formData.get("originSchool");
    const notes = formData.get("notes") || "-";

    // Dynamic school WhatsApp number from admin/database
    const adminWA = contact.whatsapp || "6282330049100";

    // Format WhatsApp Message template
    const textMessage = `Halo PPDB SMP Citra Bangsa Bondowoso, saya ingin berkonsultasi mengenai pendaftaran calon siswa baru TP 2027/2028:

- *Nama Calon Siswa*: ${studentName}
- *Nama Orang Tua / Wali*: ${parentName}
- *Nomor WhatsApp*: ${parentWhatsapp}
- *Asal Sekolah*: ${originSchool}
- *Pertanyaan / Catatan*: ${notes}`;

    // Encode URL
    const waUrl = `https://api.whatsapp.com/send?phone=${adminWA}&text=${encodeURIComponent(textMessage)}`;

    // Show status overlay
    setFormStatus({
      submitted: true,
      message: `Formulir konsultasi atas nama ${studentName} telah berhasil diproses! Silakan kirim pesan WhatsApp otomatis yang terbuka untuk menghubungi Admin langsung.`
    });

    setLastWaUrl(waUrl);

    // Automatically open WhatsApp in new tab
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // Filtered feeds
  const filteredFeeds = filter === "all" ? feeds : feeds.filter(feed => feed.platform === filter);

  return (
    <>
      <Navbar />



      {/* Hero Section */}
      <section
        id="beranda"
        className="relative min-screen-hero min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={`/hero-bg.jpg?v=${heroVersion}`}
            alt="SMP Citra Bangsa Campus Background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950/70" />
        </div>

        {/* Floating Green Glow circles */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {content.hero.badge}
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-white">
              {content.hero.title.split(" ").slice(0, 3).join(" ")} <br className="hidden sm:inline" />
              <span className="gradient-text-green-gold">{content.hero.title.split(" ").slice(3).join(" ")}</span>
            </h1>
            <p className="max-w-2xl mx-auto font-body text-base sm:text-lg text-slate-300 leading-relaxed">
              {content.hero.subtitle}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              id="hero-ppdb-cta"
              href="#ppdb"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-display font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/50 hover:scale-[1.03] active:scale-95 border-t border-white/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Pendaftaran PPDB 2027/2028</span>
            </a>
            <button
              id="hero-video-cta"
              onClick={() => setActiveVideo(content.hero.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ")} // Video profile embed
              className="w-full sm:w-auto px-8 py-4 rounded-full font-display font-bold text-white bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 text-brand-gold fill-brand-gold" />
              <span>Tonton Video Profil</span>
            </button>
          </motion.div>

          {/* Company Profile Link under hero cta buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-2"
          >
            <span className="font-body text-xs text-slate-400">
              Mencari info tertulis?{" "}
              <a
                href="https://bit.ly/CompanyProfileTRABAS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold hover:text-emerald-400 font-semibold underline decoration-brand-gold/40 transition-colors duration-200"
              >
                Unduh Company Profile TRABAS (PDF)
              </a>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
          {content.stats.map((stat, idx) => {
            const Icon = STATS_ICONS[idx] || Users;
            const color = STATS_COLORS[idx] || "text-emerald-400";
            let val = counters.students + "+";
            if (idx === 1) val = counters.teachers + "+";
            if (idx === 2) val = counters.awards + "+";
            if (idx === 3) val = counters.ecos + "+";
            return (
              <div key={stat.label} className="text-center flex flex-col items-center justify-center p-4 first:pt-4 pt-8 md:pt-4">
                <Icon className={`w-8 h-8 mb-3 ${color}`} />
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {val}
                </span>
                <span className="font-body text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section id="visi-misi" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
            Fondasi Karakter Kami
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Visi & Misi Sekolah
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-green-light to-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Visi card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel glass-panel-hover rounded-3xl p-8 sm:p-10 flex flex-col justify-between border-l-4 border-l-emerald-500 glow-green"
          >
            <div className="space-y-6">
              <span className="font-display text-3xl font-extrabold text-emerald-400 block">VISI</span>
              <p className="font-body text-lg text-slate-100 font-medium leading-relaxed">
                &ldquo;{content.visiMisi.visi}&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Misi card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel glass-panel-hover rounded-3xl p-8 sm:p-10 flex flex-col justify-between border-l-4 border-l-brand-gold glow-gold"
          >
            <div className="space-y-6">
              <span className="font-display text-3xl font-extrabold text-brand-gold block">MISI</span>
              <ul className="space-y-4 font-body text-sm sm:text-base text-slate-300">
                {content.visiMisi.misi.map((m, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-brand-gold/40 flex items-center justify-center text-xs text-brand-gold shrink-0 mr-3 mt-0.5">{idx+1}</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Social Feed Section */}
      <section id="kegiatan" className="py-24 bg-slate-900/20 border-y border-slate-900/60 relative overflow-hidden">
        <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none animate-pulse-slow" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header block */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-900 pb-8 gap-6">
            <div className="space-y-4 text-left">
              <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
                Koneksi Sosial & Berita Terkini
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Live School Activities
              </h2>
              <p className="text-slate-400 font-body text-sm max-w-md">
                Pantau terus keseruan, prestasi, dan proyek lingkungan terbaru siswa kami secara langsung dari media sosial sekolah.
              </p>
            </div>

            {/* Tab Toggles for Instagram, YouTube and TikTok */}
            <div className="flex flex-wrap items-center justify-center bg-slate-950/80 p-1.5 rounded-full border border-slate-800/80 shadow-md gap-1">
              <button
                onClick={() => setActiveSocialTab("instagram")}
                className={`px-5 py-2 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 ${
                  activeSocialTab === "instagram"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>📸</span>
                <span>Instagram</span>
              </button>
              <button
                onClick={() => setActiveSocialTab("youtube")}
                className={`px-5 py-2 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 ${
                  activeSocialTab === "youtube"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>📺</span>
                <span>YouTube</span>
              </button>
              <button
                onClick={() => setActiveSocialTab("tiktok")}
                className={`px-5 py-2 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 ${
                  activeSocialTab === "tiktok"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🎵</span>
                <span>TikTok</span>
              </button>
            </div>
          </div>

          {/* Elfsight Widgets Container */}
          <div className="w-full bg-slate-950/30 border border-slate-900/60 p-4 sm:p-6 rounded-3xl shadow-xl min-h-[400px]">
            {/* Instagram Widget */}
            {activeSocialTab === "instagram" && (
              <div className="elfsight-app-187feef9-b76b-4fed-86c3-2a6e1f74ae9c" data-elfsight-app-lazy></div>
            )}

            {/* YouTube Widget */}
            {activeSocialTab === "youtube" && (
              <div className="elfsight-app-13d28b96-fbb0-42b6-8ed9-ade5d727369c" data-elfsight-app-lazy></div>
            )}

            {/* TikTok Widget */}
            {activeSocialTab === "tiktok" && (
              <div className="elfsight-app-869619bc-bbda-4b58-a98e-21fb6ef26307" data-elfsight-app-lazy></div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section id="program" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
            Unggul & Inovatif
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Program Unggulan TRABAS
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-green-light to-brand-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.programs.map((program, idx) => {
            const Icon = PROGRAM_ICONS[idx] || Award;
            const design = PROGRAM_COLORS[idx] || { bg: "from-slate-500/20 to-slate-500/5", border: "border-slate-500/30" };
            return (
              <motion.div
                key={program.title}
                whileHover={{ y: -6 }}
                className={`glass-panel border-t-2 ${design.border} bg-gradient-to-b ${design.bg} rounded-2xl p-8 flex flex-col justify-between`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-brand-green-light" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-950 text-[10px] font-bold text-slate-400 border border-slate-800 tracking-wider uppercase">
                      {program.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {program.title}
                  </h3>
                  <p className="font-body text-sm text-slate-400 leading-relaxed">
                    {program.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center text-xs text-brand-green-light font-semibold">
                  <span>Pelajari Kurikulum Program &rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* Facilities & Extracurriculars Gallery Section */}
      <section id="fasilitas" className="py-24 bg-slate-950/20 border-t border-slate-900/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-82 h-82 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-slate-900 pb-8 gap-6">
            <div className="space-y-4 text-left">
              <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
                Keunggulan & Keseruan Siswa
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Fasilitas & Ekstrakurikuler
              </h2>
              <p className="text-slate-400 font-body text-sm max-w-md">
                Menyediakan lingkungan belajar eksklusif berstandar tinggi serta wadah pengembangan minat bakat non-akademik siswa.
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex items-center bg-slate-950/80 p-1.5 rounded-full border border-slate-800/80 shadow-md">
              <button
                onClick={() => setActiveGalleryTab("facilities")}
                className={`px-5 py-2.5 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeGalleryTab === "facilities"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🏫 Fasilitas
              </button>
              <button
                onClick={() => setActiveGalleryTab("extracurriculars")}
                className={`px-5 py-2.5 rounded-full font-display text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeGalleryTab === "extracurriculars"
                    ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ✨ Ekskul
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeGalleryTab === "facilities" ? (
              <motion.div
                key="facilities"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {(content.facilities || []).map((fac, idx) => (
                  <motion.div
                    key={fac.title}
                    whileHover={{ y: -6 }}
                    className="glass-panel rounded-3xl overflow-hidden border-slate-900 flex flex-col group shadow-xl"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={fac.image}
                        alt={fac.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-slate-950/85 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 backdrop-blur-md uppercase tracking-wider">
                        {fac.badge}
                      </span>
                    </div>
                    <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-white text-base">
                          {fac.title}
                        </h3>
                        <p className="font-body text-xs text-slate-400 leading-relaxed">
                          {fac.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="extracurriculars"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {(content.extracurriculars || []).map((ekskul, idx) => {
                  const Icon = ICON_MAP[ekskul.icon] || Award;
                  return (
                    <motion.div
                      key={ekskul.title}
                      whileHover={{ y: -5 }}
                      className="glass-panel rounded-2xl p-6 border-slate-900 flex flex-col justify-between space-y-6 shadow-xl glow-green/10"
                    >
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${ekskul.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-slate-100 text-sm">
                          {ekskul.title}
                        </h3>
                        <p className="font-body text-xs text-slate-400 leading-relaxed">
                          {ekskul.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Student Achievements Section */}
      <section id="prestasi" className="py-24 bg-slate-950/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
              Prestasi Gemilang
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Prestasi Siswa TRABAS
            </h2>
            <p className="text-slate-400 font-body text-sm max-w-md mx-auto">
              Dokumentasi raihan medali dan penghargaan luar biasa siswa SMP Citra Bangsa sepanjang tahun 2024.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-green-light to-brand-gold mx-auto rounded-full" />
          </div>

          {/* Category Filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {["Semua", "Nasional", "Provinsi", "Kabupaten"].map((cat) => (
              <button
                key={cat}
                onClick={() => setPrestasiFilter(cat)}
                className={`px-5 py-2 rounded-full font-display text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  prestasiFilter === cat
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800/80"
                }`}
              >
                Tingkat {cat}
              </button>
            ))}
          </div>

          {/* Achievements list/grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(content.prestasi || [])
              .filter(p => prestasiFilter === "Semua" || p.kategori === prestasiFilter)
              .map((p, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel rounded-2xl p-6 border-slate-800/60 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full font-display text-[9px] font-bold tracking-wider uppercase text-white ${
                        p.kategori === "Nasional" ? "bg-red-600" :
                        p.kategori === "Provinsi" ? "bg-blue-600" : "bg-emerald-600"
                      }`}>
                        Tingkat {p.kategori}
                      </span>
                      <Award className="w-4 h-4 text-brand-gold" />
                    </div>
                    <h3 className="font-display font-bold text-white text-base leading-snug">
                      {p.nama}
                    </h3>
                    <p className="font-body text-xs text-slate-400">
                      {p.pemenang}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* PPDB Admissions Form Section */}
      <section id="ppdb" className="py-24 bg-slate-900/40 border-y border-slate-900 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none animate-pulse-slow" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 space-y-4">
            <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
              Penerimaan Peserta Didik Baru
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              PPDB Online TP 2027 / 2028
            </h2>
            <p className="text-slate-400 font-body text-sm max-w-md mx-auto">
              Segera daftarkan putra-putri Anda untuk bergabung bersama generasi Enviropreneur selanjutnya. Isi formulir konsultasi cepat di bawah ini.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border-slate-800/80">
            {formStatus.submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">Pendaftaran Berhasil dikirim!</h3>
                <p className="font-body text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {formStatus.message}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  {lastWaUrl && (
                    <a
                      href={lastWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full font-display text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 cursor-pointer border-t border-white/20"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Kirim via WhatsApp Manual</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setFormStatus({ submitted: false, message: "" });
                      setLastWaUrl("");
                    }}
                    className="px-6 py-3 rounded-full font-display text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                  >
                    Kirim Formulir Baru
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handlePPDBSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Student Name */}
                  <div className="space-y-2">
                    <label htmlFor="studentName" className="font-body text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Nama Lengkap Calon Siswa
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      required
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-body text-sm transition-colors duration-200"
                    />
                  </div>

                  {/* Parent Name */}
                  <div className="space-y-2">
                    <label htmlFor="parentName" className="font-body text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Nama Orang Tua / Wali
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      required
                      placeholder="Masukkan nama orang tua"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-body text-sm transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* WhatsApp Contact */}
                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="font-body text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      required
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-body text-sm transition-colors duration-200"
                    />
                  </div>

                  {/* Origin School */}
                  <div className="space-y-2">
                    <label htmlFor="originSchool" className="font-body text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Asal Sekolah (SD/MI)
                    </label>
                    <input
                      type="text"
                      id="originSchool"
                      name="originSchool"
                      required
                      placeholder="Contoh: SD Negeri 1 Poncogati"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-body text-sm transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="font-body text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Pesan Tambahan / Pertanyaan
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    placeholder="Tuliskan pertanyaan Anda mengenai pendaftaran, asrama, atau program beasiswa..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-body text-sm transition-colors duration-200 resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-ppdb-submit"
                  className="w-full py-4 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                >
                  <Send className="w-5 h-5 shrink-0" />
                  <span>Kirim Formulir Konsultasi PPDB</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ PPDB Section */}
          <div className="mt-20 max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="font-display text-brand-gold font-bold uppercase tracking-wider text-xs">
                Ada Pertanyaan?
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                Tanya Jawab PPDB & Pendaftaran
              </h3>
              <p className="text-slate-400 font-body text-xs max-w-sm mx-auto">
                Berikut informasi penting seputar proses administrasi, seleksi, dan beasiswa sekolah.
              </p>
            </div>

            <div className="space-y-4">
              {(content.faq || []).map((faq, idx) => (
                <div 
                  key={idx}
                  className="glass-panel border-slate-900 rounded-2xl overflow-hidden shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm sm:text-base text-slate-100 hover:text-white hover:bg-slate-900/30 transition-all duration-200 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-emerald-400 font-extrabold text-lg shrink-0 ml-4">
                      {openFaqIdx === idx ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaqIdx === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-1 font-body text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/30">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="kontak" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4 text-left">
              <span className="font-display text-emerald-400 font-bold uppercase tracking-wider text-xs">
                Hubungi Kami
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Lokasi Strategis & Lingkungan Hijau
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-green-light to-brand-gold rounded-full" />
            </div>

            <p className="font-body text-sm text-slate-400 leading-relaxed">
              SMP Citra Bangsa Bondowoso terletak di area Kecamatan Curahdami yang asri dan sejuk. Lingkungan ini sangat mendukung proses pembelajaran berbasis kelestarian alam dan kewirausahaan hijau.
            </p>

            <div className="glass-panel rounded-2xl p-6 border-slate-800/80 space-y-4 font-body text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {contact.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-brand-gold shrink-0" />
                <a
                  id="btn-whatsapp-chat"
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:underline font-semibold"
                >
                  Hubungi kami via WhatsApp: {contact.whatsappText}
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map Layout wrapper */}
          <div className="lg:col-span-7 h-96 w-full glass-panel border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl">
            {/* Visual Custom Map graphic representation */}
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-white text-base">SMP Citra Bangsa Bondowoso</h3>
                <p className="font-body text-xs text-slate-400 max-w-sm">
                  {contact.address}
                </p>
                <p className="font-body text-[10px] text-slate-500 mt-2">
                  Koordinat Geografis: 7.9189° S, 113.8011° E
                </p>
              </div>
              <a
                id="btn-google-maps"
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full font-display text-xs font-semibold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 shadow-md"
              >
                <span>Buka Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Video Modal Player Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          >
            {/* Click outside to close */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveVideo(null)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative z-10 flex flex-col"
            >
              <div className="w-full aspect-video">
                {activeVideo.startsWith("https://assets.mixkit.co") ? (
                  <video
                    src={activeVideo}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    src={activeVideo}
                    title="Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>
              
              <div className="bg-slate-900/60 p-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                <span className="text-slate-300 text-xs sm:text-sm">
                  Pelajari selengkapnya tentang visi perjuangan dan program kami melalui profil tertulis:
                </span>
                <a
                  href="https://bit.ly/CompanyProfileTRABAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-display text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 flex items-center space-x-1.5 shadow-md shrink-0 border-t border-white/10"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka Company Profile (PDF)</span>
                </a>
              </div>

              {/* Close button inside modal top right */}
              <button
                id="btn-close-modal"
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center z-20"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a
        id="btn-whatsapp-floating"
        href={`https://wa.me/${contact.whatsapp || "6282330049100"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-110 group border border-emerald-400/20 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing indicator */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping group-hover:animate-none pointer-events-none" />
        
        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 relative z-10 fill-slate-950" />
        
        {/* Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-950 text-white text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap border border-slate-800 shadow-xl transition-all duration-200 origin-right">
          Hubungi CS PPDB
        </span>
      </a>

      <Footer />
    </>
  );
}
