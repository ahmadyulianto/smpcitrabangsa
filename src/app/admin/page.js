"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Lock, Save, Plus, Trash2, LogOut, CheckCircle, 
  AlertCircle, FileText, BarChart2, Share2, Award, 
  Menu, Image as ImageIcon, Upload, Link, Eye
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type, text }

  // Admin Data states
  const [content, setContent] = useState(null);
  const [activities, setActivities] = useState([]);

  // File Upload states
  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [logoVersion, setLogoVersion] = useState(0);
  const [heroVersion, setHeroVersion] = useState(0);

  // New Navigation Item form state
  const [newNavItem, setNewNavItem] = useState({ label: "", href: "" });

  // New Program form state
  const [newProgram, setNewProgram] = useState({ title: "", desc: "", badge: "" });

  // New Activity form state
  const [newActivity, setNewActivity] = useState({
    platform: "instagram",
    title: "",
    url: "",
    thumbnail: "",
    videoUrl: "",
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: 0,
    shares: 0,
    views: "",
    description: ""
  });

  useEffect(() => {
    // Check if password already stored in sessionStorage
    const storedAuth = sessionStorage.getItem("adminAuth");
    if (storedAuth === "trabas123") {
      setIsLoggedIn(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/get");
      const result = await res.json();
      if (result.success) {
        setContent(result.content);
        setActivities(result.activities);
      } else {
        showStatus("error", "Gagal memuat data dari server: " + result.error);
      }
    } catch (err) {
      showStatus("error", "Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "trabas123") {
      sessionStorage.setItem("adminAuth", "trabas123");
      setIsLoggedIn(true);
      loadData();
    } else {
      alert("Password Admin Salah! Petunjuk: Password adalah 'trabas123'");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsLoggedIn(false);
    setContent(null);
    setActivities([]);
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "trabas123",
          type: "content",
          data: content
        })
      });
      const result = await res.json();
      if (result.success) {
        showStatus("success", "Perubahan konten & navigasi berhasil disimpan ke server!");
      } else {
        showStatus("error", result.error);
      }
    } catch (err) {
      showStatus("error", "Koneksi gagal: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveActivities = async (updatedActivities) => {
    setSaving(true);
    const targetData = updatedActivities || activities;
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "trabas123",
          type: "activities",
          data: targetData
        })
      });
      const result = await res.json();
      if (result.success) {
        showStatus("success", "Daftar kegiatan sosial media berhasil diperbarui!");
        if (updatedActivities) setActivities(updatedActivities);
      } else {
        showStatus("error", result.error);
      }
    } catch (err) {
      showStatus("error", "Koneksi gagal: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Image Upload helper
  const handleImageUpload = async (type) => {
    const file = type === "logo" ? logoFile : heroFile;
    if (!file) {
      alert("Silakan pilih file terlebih dahulu!");
      return;
    }

    const setUploading = type === "logo" ? setUploadingLogo : setUploadingHero;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("password", "trabas123");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        showStatus("success", result.message);
        if (type === "logo") {
          setLogoFile(null);
          setLogoVersion(prev => prev + 1);
          window.dispatchEvent(new CustomEvent("logo-updated"));
        } else {
          setHeroFile(null);
          setHeroVersion(prev => prev + 1);
          window.dispatchEvent(new CustomEvent("hero-updated"));
        }
      } else {
        showStatus("error", result.error);
      }
    } catch (err) {
      showStatus("error", "Koneksi upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Content edits helpers
  const updateHeroField = (field, val) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: val }
    }));
  };

  const updateStatValue = (idx, val) => {
    const newStats = [...content.stats];
    newStats[idx].value = parseInt(val) || 0;
    setContent(prev => ({ ...prev, stats: newStats }));
  };

  const updateStatLabel = (idx, val) => {
    const newStats = [...content.stats];
    newStats[idx].label = val;
    setContent(prev => ({ ...prev, stats: newStats }));
  };

  const updateVisi = (val) => {
    setContent(prev => ({
      ...prev,
      visiMisi: { ...prev.visiMisi, visi: val }
    }));
  };

  const updateMisi = (idx, val) => {
    const newMisi = [...content.visiMisi.misi];
    newMisi[idx] = val;
    setContent(prev => ({
      ...prev,
      visiMisi: { ...prev.visiMisi, misi: newMisi }
    }));
  };

  const updateProgramField = (idx, field, val) => {
    const newPrograms = [...content.programs];
    newPrograms[idx][field] = val;
    setContent(prev => ({ ...prev, programs: newPrograms }));
  };

  const handleAddProgram = (e) => {
    e.preventDefault();
    if (!newProgram.title || !newProgram.desc) return;
    const updated = [...content.programs, newProgram];
    setContent(prev => ({ ...prev, programs: updated }));
    setNewProgram({ title: "", desc: "", badge: "" });
    showStatus("success", `Program baru "${newProgram.title}" berhasil ditambahkan! Klik "Simpan Perubahan" untuk menyimpan secara permanen.`);
  };

  const handleDeleteProgram = (idx) => {
    if (confirm("Apakah Anda yakin ingin menghapus program unggulan ini?")) {
      const updated = content.programs.filter((_, i) => i !== idx);
      setContent(prev => ({ ...prev, programs: updated }));
      showStatus("success", "Program telah dihapus! Klik 'Simpan Perubahan' untuk menerapkan.");
    }
  };

  // Dynamic Navigation Link helpers
  const handleAddNavItem = (e) => {
    e.preventDefault();
    if (!newNavItem.label || !newNavItem.href) return;
    
    // Ensure anchor links format or absolute path
    let href = newNavItem.href;
    if (!href.startsWith("#") && !href.startsWith("http") && !href.startsWith("/")) {
      href = `#${href}`;
    }

    const updated = [...(content.navItems || []), { label: newNavItem.label, href }];
    setContent(prev => ({ ...prev, navItems: updated }));
    setNewNavItem({ label: "", href: "" });
    showStatus("success", `Menambahkan menu baru: "${newNavItem.label}". Klik "Simpan Perubahan" untuk menyimpan permanen.`);
  };

  const handleDeleteNavItem = (idx) => {
    const updated = content.navItems.filter((_, i) => i !== idx);
    setContent(prev => ({ ...prev, navItems: updated }));
    showStatus("success", `Menu telah dihapus. Klik "Simpan Perubahan" untuk menyimpan permanen.`);
  };

  // Activities helpers
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.thumbnail) {
      alert("Judul dan URL Gambar Mini wajib diisi!");
      return;
    }

    const item = {
      ...newActivity,
      id: `${newActivity.platform.substring(0,2)}-${Date.now()}`,
      date: new Date(newActivity.date).toISOString(),
      likes: parseInt(newActivity.likes) || 0,
      comments: parseInt(newActivity.comments) || 0,
      shares: parseInt(newActivity.shares) || 0
    };

    const updated = [item, ...activities];
    saveActivities(updated);

    // Reset Form
    setNewActivity({
      platform: "instagram",
      title: "",
      url: "",
      thumbnail: "",
      videoUrl: "",
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      shares: 0,
      views: "",
      description: ""
    });
  };

  const handleDeleteActivity = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      const updated = activities.filter(act => act.id !== id);
      saveActivities(updated);
    }
  };

  // ----------------------------------------
  // RENDER LOGIN SCREEN
  // ----------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-body">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[120px]" />
        
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full border-slate-800 shadow-2xl relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto border border-emerald-500/30">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display font-extrabold text-xl text-white">CMS Admin Panel</h1>
            <p className="text-slate-400 text-xs">SMP Citra Bangsa Bondowoso</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="pass" className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Kata Sandi Admin
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  id="pass"
                  placeholder="Masukkan kata sandi"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm transition-colors duration-200"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">Petunjuk: Sandi bawaan adalah &ldquo;trabas123&rdquo;</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 shadow-md text-sm cursor-pointer"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // RENDER LOADING SCREEN
  // ----------------------------------------
  if (loading || !content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm mt-4 font-body font-semibold">Memuat Data Sekolah...</span>
      </div>
    );
  }

  // ----------------------------------------
  // RENDER DASHBOARD CMS
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-body relative overflow-x-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Admin Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 border-b border-slate-900 shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-500/30">
              <img src={`/logo.jpg?v=${logoVersion}`} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base leading-tight text-white">Dashboard Admin</h1>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">SMP Citra Bangsa Bws</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200"
            >
              Lihat Website Live &rarr;
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-red-950/30 hover:border-red-900/60 hover:text-red-400 transition-all duration-300 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="glass-panel rounded-2xl p-4 border-slate-900 space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                activeTab === "general" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Identitas & Visi Misi</span>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                activeTab === "media" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Logo & Gambar Utama</span>
            </button>
            <button
              onClick={() => setActiveTab("navLinks")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                activeTab === "navLinks" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <Menu className="w-4 h-4 shrink-0" />
              <span>Menu Navigasi</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                activeTab === "stats" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <BarChart2 className="w-4 h-4 shrink-0" />
              <span>Statistik Sekolah</span>
            </button>
            <button
              onClick={() => setActiveTab("programs")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                activeTab === "programs" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Program Unggulan</span>
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                activeTab === "activities" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>Kegiatan Sosmed</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 px-4">
            Tekan &ldquo;Simpan Perubahan&rdquo; setelah mengedit untuk menerapkan hasilnya secara permanen.
          </div>
        </aside>

        {/* CMS Editor Workspace */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: IDENTITAS & VISI MISI */}
          {activeTab === "general" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-8 shadow-lg">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="font-display font-bold text-lg text-white">Identitas & Visi Misi</h2>
                <p className="text-slate-400 text-xs">Ubah tulisan besar, slogan, dan poin misi di beranda utama.</p>
              </div>

              {/* Hero Settings */}
              <div className="space-y-5">
                <h3 className="font-display font-semibold text-sm text-emerald-400 uppercase tracking-wider">A. Hero Header (Halaman Depan)</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Badge Pembuka</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) => updateHeroField("badge", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Judul Utama (Title)</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => updateHeroField("title", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kalimat Deskripsi (Sub-Title)</label>
                  <textarea
                    value={content.hero.subtitle}
                    onChange={(e) => updateHeroField("subtitle", e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Link Video Profil Youtube (Embed URL)</label>
                  <input
                    type="url"
                    value={content.hero.videoUrl || ""}
                    onChange={(e) => updateHeroField("videoUrl", e.target.value)}
                    placeholder="Contoh: https://www.youtube.com/embed/dQw4w9WgXcQ"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                  <p className="text-[10px] text-slate-500 italic">Pastikan menggunakan format link embed YouTube (mengandung bagian &ldquo;/embed/&rdquo;).</p>
                </div>
              </div>

              {/* Visi Misi Settings */}
              <div className="space-y-5 pt-4 border-t border-slate-900/60">
                <h3 className="font-display font-semibold text-sm text-emerald-400 uppercase tracking-wider">B. Visi & Misi Sekolah</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visi Utama</label>
                  <textarea
                    value={content.visiMisi.visi}
                    onChange={(e) => updateVisi(e.target.value)}
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Butir-Butir Misi</label>
                  {content.visiMisi.misi.map((m, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-brand-gold shrink-0">{idx+1}</span>
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => updateMisi(idx, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save trigger */}
              <div className="pt-4 border-t border-slate-900/60 flex justify-end">
                <button
                  onClick={saveContent}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-display font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 text-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA UPLOADS (LOGO & CAMPUS HERO BACKGROUND) */}
          {activeTab === "media" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-8 shadow-lg">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="font-display font-bold text-lg text-white">Logo & Gambar Utama</h2>
                <p className="text-slate-400 text-xs">Unggah file logo atau gambar latar belakang hero baru langsung ke server.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload Section */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">1. Logo Sekolah (Rasio 1:1)</span>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-slate-800">
                      <img 
                        src={`/logo.jpg?v=${logoVersion}`} 
                        alt="Logo Sekolah" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Pilih File (.jpg/.png)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files[0])}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-slate-200 hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleImageUpload("logo")}
                    disabled={uploadingLogo || !logoFile}
                    className="w-full py-2.5 rounded-xl font-display text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingLogo ? "Mengunggah..." : "Unggah Logo Baru"}</span>
                  </button>
                </div>

                {/* Hero Background Upload Section */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">2. Latar Belakang Hero (Rasio 16:9)</span>
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img 
                        src={`/hero-bg.jpg?v=${heroVersion}`} 
                        alt="Hero Background" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Pilih File (.jpg/.png)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setHeroFile(e.target.files[0])}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-slate-200 hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleImageUpload("hero")}
                    disabled={uploadingHero || !heroFile}
                    className="w-full py-2.5 rounded-xl font-display text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHero ? "Mengunggah..." : "Unggah Background Baru"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC NAVIGATION LINK MANAGER (INLINE EDITOR) */}
          {activeTab === "navLinks" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-6 shadow-lg">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="font-display font-bold text-lg text-white">Menu Navigasi</h2>
                <p className="text-slate-400 text-xs">Ubah nama menu, sesuaikan link/anchor tujuan, atau tambah menu baru secara langsung di tabel bawah.</p>
              </div>

              {/* Tabel Edit Menu Inline */}
              <div className="space-y-4">
                {(content.navItems || []).map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center p-4 rounded-xl bg-slate-950/60 border border-slate-900 gap-4">
                    {/* Urutan */}
                    <span className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-400 shrink-0 font-bold">
                      {idx + 1}
                    </span>

                    {/* Edit Label */}
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Nama Menu</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...content.navItems];
                          updated[idx].label = e.target.value;
                          setContent(prev => ({ ...prev, navItems: updated }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                        placeholder="Nama Menu"
                      />
                    </div>

                    {/* Edit Link/Href */}
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Tujuan Link / Anchor</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const updated = [...content.navItems];
                          updated[idx].href = e.target.value;
                          setContent(prev => ({ ...prev, navItems: updated }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                        placeholder="Tujuan (misal: #program)"
                      />
                    </div>

                    {/* Tombol Hapus */}
                    <div className="sm:self-end">
                      <button
                        onClick={() => handleDeleteNavItem(idx)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-red-950/40 hover:border-red-900/60 text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer w-full sm:w-auto flex items-center justify-center"
                        aria-label="Delete menu link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Form Tambah Inline */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/20 gap-4 mt-6">
                  <span className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-brand-gold shrink-0 font-bold">
                    +
                  </span>

                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Nama Menu Baru</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama menu (cth: Galeri)"
                      value={newNavItem.label}
                      onChange={(e) => setNewNavItem(prev => ({ ...prev, label: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Tujuan Link Baru</label>
                    <input
                      type="text"
                      placeholder="Tujuan (cth: #kegiatan)"
                      value={newNavItem.href}
                      onChange={(e) => setNewNavItem(prev => ({ ...prev, href: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div className="sm:self-end">
                    <button
                      onClick={handleAddNavItem}
                      disabled={!newNavItem.label || !newNavItem.href}
                      className="py-2.5 px-6 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 text-xs cursor-pointer w-full sm:w-auto flex items-center justify-center space-x-1 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Save trigger */}
              <div className="pt-4 border-t border-slate-900/60 flex justify-end">
                <button
                  onClick={saveContent}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-display font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 text-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SCHOOL STATS */}
          {activeTab === "stats" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-8 shadow-lg">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="font-display font-bold text-lg text-white">Statistik Sekolah</h2>
                <p className="text-slate-400 text-xs">Ubah data statistik sekolah yang tampil melayang di beranda depan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.stats.map((st, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900 space-y-4">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Data Ke-{idx+1}</span>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Label Keterangan</label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => updateStatLabel(idx, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Nilai Angka (Value)</label>
                      <input
                        type="number"
                        value={st.value}
                        onChange={(e) => updateStatValue(idx, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Save trigger */}
              <div className="pt-4 border-t border-slate-900/60 flex justify-end">
                <button
                  onClick={saveContent}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-display font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 text-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: FEATURED PROGRAMS */}
          {activeTab === "programs" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-8 shadow-lg">
              <div className="border-b border-slate-900 pb-4">
                <h2 className="font-display font-bold text-lg text-white">Program Unggulan Sekolah</h2>
                <p className="text-slate-400 text-xs">Ubah judul, badge program, dan isi deskripsi program utama di website. Anda juga bisa menambahkan program baru.</p>
              </div>

              {/* Form Tambah Program Baru */}
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-4">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Tambah Program Baru</span>
                <form onSubmit={handleAddProgram} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Nama Program</label>
                      <input
                        type="text"
                        placeholder="Contoh: Heutagogy Learning"
                        value={newProgram.title}
                        onChange={(e) => setNewProgram(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Badge Program</label>
                      <input
                        type="text"
                        placeholder="Contoh: Personalisasi"
                        value={newProgram.badge}
                        onChange={(e) => setNewProgram(prev => ({ ...prev, badge: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Penjelasan Lengkap</label>
                    <textarea
                      placeholder="Masukkan deskripsi program secara lengkap di sini..."
                      value={newProgram.desc}
                      onChange={(e) => setNewProgram(prev => ({ ...prev, desc: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-display font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambahkan ke Daftar</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Daftar Program */}
              <div className="space-y-8">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Daftar Program Aktif ({content.programs.length})</span>
                {content.programs.map((prog, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-900 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Program {idx+1}: {prog.title}</span>
                      <button
                        onClick={() => handleDeleteProgram(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Nama Program</label>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={(e) => updateProgramField(idx, "title", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Badge Program</label>
                        <input
                          type="text"
                          value={prog.badge}
                          onChange={(e) => updateProgramField(idx, "badge", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Penjelasan Lengkap</label>
                      <textarea
                        value={prog.desc}
                        onChange={(e) => updateProgramField(idx, "desc", e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Save trigger */}
              <div className="pt-4 border-t border-slate-900/60 flex justify-end">
                <button
                  onClick={saveContent}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-display font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors duration-200 text-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: LIVE ACTIVITIES FEED */}
          {activeTab === "activities" && (
            <div className="space-y-6">
              
              {/* Form Tambah Kegiatan */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-6 shadow-lg">
                <div className="border-b border-slate-900 pb-4">
                  <h2 className="font-display font-bold text-lg text-white">Tambah Kegiatan Baru</h2>
                  <p className="text-slate-400 text-xs">Tambahkan dokumentasi postingan kegiatan langsung ke feed homepage.</p>
                </div>

                <form onSubmit={handleAddActivity} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Media</label>
                      <select
                        value={newActivity.platform}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, platform: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                      </select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Judul / Kegiatan</label>
                      <input
                        type="text"
                        placeholder="Contoh: PPDB 2026 Gelombang I Dibuka"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Link Postingan Asli (URL)</label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/p/..."
                        value={newActivity.url}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gambar Sampul (Thumbnail)</label>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">Bisa Upload File / Pakai Link</span>
                      </div>
                      
                      {/* Input URL */}
                      <input
                        type="text"
                        placeholder="Contoh: https://images.unsplash.com/... atau unggah file"
                        value={newActivity.thumbnail}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, thumbnail: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                        required
                      />

                      {/* File Upload Selector */}
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="activity-file-picker"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            
                            // Upload immediately to server
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("type", "activity");
                            formData.append("password", "trabas123");

                            try {
                              showStatus("success", "Mengunggah gambar berita...");
                              const res = await fetch("/api/admin/upload", {
                                method: "POST",
                                body: formData
                              });
                              const result = await res.json();
                              if (result.success && result.url) {
                                // Set the thumbnail link to the uploaded file URL!
                                setNewActivity(prev => ({ ...prev, thumbnail: result.url }));
                                showStatus("success", "Gambar berita berhasil diunggah!");
                              } else {
                                showStatus("error", result.error || "Gagal mengunggah gambar");
                              }
                            } catch (err) {
                              showStatus("error", "Gagal mengunggah: " + err.message);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="activity-file-picker"
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors duration-200"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih & Unggah File Gambar Baru</span>
                        </label>
                        {newActivity.thumbnail.startsWith("/activities/") && (
                          <span className="text-[10px] text-emerald-400 font-semibold">✓ File terunggah</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Link File Video (Bila Ada)</label>
                      <input
                        type="text"
                        placeholder="Contoh: https://youtube.com/embed/..."
                        value={newActivity.videoUrl}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, videoUrl: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tanggal</label>
                      <input
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suka (Likes)</label>
                      <input
                        type="number"
                        value={newActivity.likes}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, likes: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Keterangan / Caption Postingan</label>
                    <textarea
                      placeholder="Tuliskan keterangan lengkap kegiatan..."
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-display font-bold text-slate-950 bg-gradient-to-r from-brand-green-light to-brand-gold hover:from-brand-gold hover:to-brand-green-light transition-all duration-300 shadow-md text-sm cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Tambahkan ke Website</span>
                  </button>
                </form>
              </div>

              {/* List Kegiatan Yang Ada */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border-slate-900 space-y-6 shadow-lg">
                <div>
                  <h2 className="font-display font-bold text-base text-white">Daftar Kegiatan Saat Ini ({activities.length})</h2>
                  <p className="text-slate-400 text-xs">Klik tombol hapus untuk membuang postingan dari website.</p>
                </div>

                <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 gap-4">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                          <img src={act.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full text-white tracking-wide uppercase mr-1.5 ${
                            act.platform === "instagram" ? "bg-pink-600" :
                            act.platform === "youtube" ? "bg-red-600" :
                            act.platform === "tiktok" ? "bg-black border border-slate-800" : "bg-blue-600"
                          }`}>
                            {act.platform}
                          </span>
                          <h4 className="font-display font-bold text-sm text-slate-100 truncate mt-1">{act.title}</h4>
                          <p className="text-[10px] text-slate-500 font-body mt-0.5 truncate">{act.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-red-950/40 hover:border-red-900/60 text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer"
                        aria-label="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>
      </main>

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-5 py-3.5 rounded-2xl border shadow-2xl ${
          statusMessage.type === "success" 
            ? "bg-emerald-950/90 border-emerald-800 text-emerald-300"
            : "bg-red-950/90 border-red-800 text-red-300"
        }`}>
          {statusMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-body text-xs font-semibold">{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
