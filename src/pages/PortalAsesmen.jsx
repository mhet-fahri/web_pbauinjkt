import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  FileText, 
  Search, 
  ExternalLink, 
  Eye, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Layers, 
  HelpCircle,
  X,
  ShieldCheck,
  Building2,
  Sparkles,
  Copy,
  Check,
  FileSpreadsheet,
  ChevronDown,
  ChevronsUpDown,
  FileCheck2,
  Maximize2,
  FileCode,
  Tv,
  FolderOpen
} from 'lucide-react';
import { getAkreditasiItems, getLedConfig, getDkpsConfig, getRingkasanConfig } from '../services/akreditasiService';
import { getGoogleDrivePreviewUrl, getGoogleDriveDownloadUrl, isYouTubeUrl, isDriveFolderUrl } from '../utils/driveUtils';
import SEO from '../components/SEO';
import logoUin from '../assets/logo-uin.png';

const PortalAsesmen = () => {
  const [items, setItems] = useState([]);
  const [ringkasanConfig, setRingkasanConfig] = useState(null);
  const [ledConfig, setLedConfig] = useState(null);
  const [dkpsConfig, setDkpsConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKriteria, setSelectedKriteria] = useState('ALL');
  const [expandedItems, setExpandedItems] = useState({});
  const [activeDocTab, setActiveDocTab] = useState('ringkasan'); // 'ringkasan' | 'led' | 'dkps'

  // Preview Modal
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: '',
    rawUrl: '',
    title: '',
    downloadUrl: ''
  });
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [fetchedItems, fetchedRingkasan, fetchedLed, fetchedDkps] = await Promise.all([
          getAkreditasiItems(),
          getRingkasanConfig(),
          getLedConfig(),
          getDkpsConfig()
        ]);
        setItems(fetchedItems);
        setRingkasanConfig(fetchedRingkasan);
        setLedConfig(fetchedLed);
        setDkpsConfig(fetchedDkps);
      } catch (e) {
        console.error('Error fetching akreditasi portal data:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Filter Kriteria Unik
  const kriteriaList = Array.from(new Set(items.map(i => i.kriteria))).filter(Boolean);

  // Filter Data
  const filteredItems = items.filter(item => {
    const matchKriteria = selectedKriteria === 'ALL' || item.kriteria === selectedKriteria;
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      item.elemen.toLowerCase().includes(term) ||
      item.no.toString().includes(term) ||
      item.indikator.some(ind => ind.toLowerCase().includes(term)) ||
      (item.bukti && item.bukti.some(b => b.nama.toLowerCase().includes(term)));
    return matchKriteria && matchSearch;
  });

  // Buka Pratinjau Dokumen
  const openPreview = (title, rawUrl) => {
    if (!rawUrl) return;
    const preview = getGoogleDrivePreviewUrl(rawUrl);
    const download = getGoogleDriveDownloadUrl(rawUrl);
    setCopiedLink(false);
    setPreviewModal({
      isOpen: true,
      url: preview,
      rawUrl: rawUrl,
      title,
      downloadUrl: download
    });
  };

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      url: '',
      rawUrl: '',
      title: '',
      downloadUrl: ''
    });
    setCopiedLink(false);
  };

  const handleCopyLink = async () => {
    const linkToCopy = previewModal.rawUrl || previewModal.url;
    if (!linkToCopy) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(linkToCopy);
      } else {
        // Fallback untuk browser/koneksi tanpa izin async clipboard
        const textArea = document.createElement('textarea');
        textArea.value = linkToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
      // Fallback prompt jika tetap gagal
      window.prompt('Salin link di bawah ini:', linkToCopy);
    }
  };

  // Toggle buka/tutup per butir
  const toggleItem = (no) => {
    setExpandedItems(prev => ({
      ...prev,
      [no]: !prev[no]
    }));
  };

  // Buka semua / Tutup semua
  const toggleAllItems = (expand) => {
    const newState = {};
    filteredItems.forEach(item => {
      newState[item.no] = expand;
    });
    setExpandedItems(newState);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24">
      <SEO 
        title="Portal Asesmen Lapangan Akreditasi - PBA UIN Jakarta" 
        description="Portal Bukti 9 Kriteria, Ringkasan Eksekutif, Laporan Evaluasi Diri (LED), dan Dokumen Kinerja (DKPS) Program Studi Pendidikan Bahasa Arab FITK UIN Syarif Hidayatullah Jakarta."
        url="/portal-asesmen"
        image="https://pbafitkuinjkt.id/banner-portal-asesmen.jpg"
      />

      {/* Header Khusus Portal Asesmen (Clean & Professional) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 p-1.5 flex items-center justify-center shadow-md border border-slate-200/80 dark:border-slate-700/60 shrink-0">
              <img src={logoUin} alt="Logo UIN Jakarta" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  PORTAL ASESMEN LAPANGAN
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  • LAMDIK
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Pendidikan Bahasa Arab (S1) - UIN Syarif Hidayatullah Jakarta
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              ← Ke Website Utama
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ============================================================== */}
        {/* HERO SECTION 1: EXECUTIVE DOCUMENT CENTER (INTERACTIVE VIEWER) */}
        {/* ============================================================== */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header & Tabs Navigation */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 border border-white/15 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles size={12} className="text-amber-300" /> Executive Document Center
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Dokumen Induk Akreditasi Program Studi
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Pratinjau interaktif langsung di layar untuk Ringkasan Eksekutif, Laporan Evaluasi Diri (LED), dan Dokumen Kinerja (DKPS).
                </p>
              </div>

              {/* Action Buttons for Active Document */}
              {(() => {
                const currentDoc = 
                  activeDocTab === 'ringkasan' ? { ...ringkasanConfig, isExcel: false } :
                  activeDocTab === 'led' ? { ...ledConfig, isExcel: false } :
                  { ...dkpsConfig, isExcel: true };
                const currentUrl = currentDoc?.isExcel ? currentDoc?.excelUrl : currentDoc?.pdfUrl;

                return currentUrl ? (
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => openPreview(currentDoc?.title || 'Pratinjau Dokumen', currentUrl)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-xs shadow-md transition-all hover:scale-105"
                    >
                      <Maximize2 size={14} />
                      Buka Layar Penuh
                    </button>
                    <a
                      href={getGoogleDriveDownloadUrl(currentUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
                    >
                      <Download size={14} />
                      {currentDoc?.isExcel ? 'Unduh Excel' : 'Unduh File'}
                    </a>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Segmented Document Tabs */}
            <div className="relative z-10 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tab 1: Ringkasan Eksekutif */}
              <button
                onClick={() => setActiveDocTab('ringkasan')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                  activeDocTab === 'ringkasan'
                    ? 'bg-gradient-to-br from-amber-500/25 to-orange-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeDocTab === 'ringkasan' ? 'bg-amber-500 text-white shadow-md' : 'bg-white/10 text-slate-400'
                }`}>
                  <FileCheck2 size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                      01. Executive Summary
                    </span>
                    {ringkasanConfig?.pdfUrl && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white truncate">
                    {ringkasanConfig?.title || 'Ringkasan Eksekutif LED'}
                  </h4>
                  <p className="text-[11px] text-slate-300/80 truncate">
                    Ikhtisar capaian utama prodi
                  </p>
                </div>
              </button>

              {/* Tab 2: Laporan Evaluasi Diri (LED) */}
              <button
                onClick={() => setActiveDocTab('led')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                  activeDocTab === 'led'
                    ? 'bg-gradient-to-br from-blue-500/25 to-indigo-500/10 border-blue-400/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeDocTab === 'led' ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-slate-400'
                }`}>
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                      02. Dokumen Kualitatif
                    </span>
                    {ledConfig?.pdfUrl && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white truncate">
                    {ledConfig?.title || 'Laporan Evaluasi Diri (LED)'}
                  </h4>
                  <p className="text-[11px] text-slate-300/80 truncate">
                    Analisis 9 Kriteria Lengkap
                  </p>
                </div>
              </button>

              {/* Tab 3: Dokumen Kinerja (DKPS) */}
              <button
                onClick={() => setActiveDocTab('dkps')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                  activeDocTab === 'dkps'
                    ? 'bg-gradient-to-br from-emerald-500/25 to-teal-500/10 border-emerald-400/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeDocTab === 'dkps' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-slate-400'
                }`}>
                  <FileSpreadsheet size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      03. Dokumen Kuantitatif
                    </span>
                    {dkpsConfig?.excelUrl && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white truncate">
                    {dkpsConfig?.title || 'DKPS (Excel Spreadsheet)'}
                  </h4>
                  <p className="text-[11px] text-slate-300/80 truncate">
                    {dkpsConfig?.fileName ? `File: ${dkpsConfig.fileName}` : 'Tabel data dengan rumus baku'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Document Viewer Stage (Pratinjau Langsung di Halaman) */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
            {(() => {
              const activeDoc = 
                activeDocTab === 'ringkasan' ? { ...ringkasanConfig, isExcel: false } :
                activeDocTab === 'led' ? { ...ledConfig, isExcel: false } :
                { ...dkpsConfig, isExcel: true };

              const activeUrl = activeDoc?.isExcel ? activeDoc?.excelUrl : activeDoc?.pdfUrl;
              const previewEmbedUrl = activeUrl ? getGoogleDrivePreviewUrl(activeUrl) : '';

              if (!activeUrl) {
                return (
                  <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <FileText size={26} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">
                      Dokumen Belum Ditautkan
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Tautan dokumen {activeDoc?.title} sedang disiapkan oleh tim akreditasi. Anda dapat mengunggah atau menautkannya melalui Dashboard Admin.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {/* Viewer Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">
                        {activeDoc?.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {activeDoc?.isExcel ? 'Spreadsheet Viewer' : 'PDF Document Viewer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPreview(activeDoc?.title || 'Dokumen', activeUrl)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      >
                        <Maximize2 size={13} />
                        Layar Penuh
                      </button>
                      <a
                        href={activeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                      >
                        <ExternalLink size={13} />
                        Buka di Tab Baru
                      </a>
                    </div>
                  </div>

                  {/* High Performance Embedded Preview Container */}
                  <div className="w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner relative group">
                    <iframe
                      key={previewEmbedUrl}
                      src={previewEmbedUrl}
                      title={activeDoc?.title || "Document Live Preview"}
                      className="w-full h-full border-0"
                      allow="autoplay"
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ============================================================== */}
        {/* FILTER & PENCARIAN INSTRUMEN                                   */}
        {/* ============================================================== */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Box Instan */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pencarian instan bukti asesmen (ketik: RPS, SPMI, Visi, Kurikulum, Dosen, Sarpras)..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400 shrink-0" />
              <select
                value={selectedKriteria}
                onChange={(e) => setSelectedKriteria(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Kriteria (1 s.d. 9)</option>
                {kriteriaList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Tabs Kriteria 1-9 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedKriteria('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedKriteria === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Semua Elemen ({items.length})
            </button>
            {kriteriaList.map((k, idx) => {
              const count = items.filter(i => i.kriteria === k).length;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedKriteria(k)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedKriteria === k
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title={k}
                >
                  Kriteria {idx + 1} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* DAFTAR BUTIR & BUKTI AKREDITASI                                */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Menampilkan {filteredItems.length} Elemen Penilaian
              </h3>
              {searchTerm && (
                <span className="text-xs text-blue-600 font-bold">
                  • Filter: "{searchTerm}"
                </span>
              )}
            </div>

            {/* Tombol Buka Semua / Tutup Semua Accordion */}
            {filteredItems.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAllItems(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ChevronsUpDown size={14} />
                  Buka Semua
                </button>
                <button
                  onClick={() => toggleAllItems(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition"
                >
                  Tutup Semua
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400 font-bold animate-pulse">
              Memuat data dokumen asesmen...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <HelpCircle size={44} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Tidak ada elemen yang cocok
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Silakan ubah kata kunci pencarian atau pilih kriteria lainnya.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasBukti = item.bukti && item.bukti.length > 0;
              // Default: jika belum ada di state, terbuka jika sedang dalam pencarian, tertutup jika normal
              const isExpanded = expandedItems[item.no] !== undefined 
                ? expandedItems[item.no] 
                : Boolean(searchTerm);

              return (
                <m.div
                  key={item.no}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Header Butir yang Bisa Diklik untuk Buka/Tutup (Accordion Trigger) */}
                  <div
                    onClick={() => toggleItem(item.no)}
                    className="p-6 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-xs">
                          Elemen No. {item.no}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {item.kriteria}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white pt-0.5 leading-snug">
                        {item.elemen}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-1">
                      {hasBukti ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800/40">
                          <CheckCircle2 size={14} /> {item.bukti.length} Dokumen Bukti
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold text-xs">
                          Menunggu Berkas
                        </span>
                      )}

                      {/* Ikon Panah Buka / Tutup */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Konten yang Bisa Dibuka Turun & Ditutup Naik */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="border-t border-slate-100 dark:border-slate-800 px-6 pb-6 pt-5 space-y-4 overflow-hidden"
                      >
                        {/* Rincian Indikator */}
                        {item.indikator && item.indikator.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 border border-slate-100 dark:border-slate-800/50">
                            <div className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                              Deskripsi Indikator Asesmen:
                            </div>
                            {item.indikator.map((ind, i) => (
                              <div key={i} className="leading-relaxed">
                                {ind}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tombol-tombol Link Bukti (Mode Multi-bukti Google Drive Preview) */}
                        <div className="pt-1">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText size={14} className="text-blue-500" /> Dokumen Bukti Pendukung:
                          </div>

                          {hasBukti ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {item.bukti.map((b, idx) => (
                                <div
                                  key={b.id || idx}
                                  className="flex flex-col justify-between p-3.5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/70 border border-blue-100 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600 transition group"
                                >
                                  <div className="flex items-start gap-2.5 mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                      <FileText size={16} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-black text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                                        {b.nama || `Bukti ${idx + 1}`}
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        Google Drive Link
                                      </span>
                                    </div>
                                  </div>

                                  {/* Tombol Pratinjau Dokumen */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/40">
                                    <button
                                      onClick={() => openPreview(b.nama || `Bukti Elemen ${item.no}`, b.url)}
                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                                    >
                                      <Eye size={13} />
                                      Lihat Bukti
                                    </button>
                                    <a
                                      href={b.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition"
                                      title="Buka di Google Drive Tab Baru"
                                    >
                                      <ExternalLink size={13} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 italic">
                              Belum ada dokumen bukti yang ditautkan untuk butir ini.
                            </div>
                          )}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              );
            })
          )}
        </section>
      </main>

      {/* ============================================================== */}
      {/* MODAL PRATINJAU DOKUMEN GOOGLE DRIVE                           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {previewModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Header Modal */}
              <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isYouTubeUrl(previewModal.rawUrl)
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-600'
                      : isDriveFolderUrl(previewModal.rawUrl)
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'
                  }`}>
                    {isYouTubeUrl(previewModal.rawUrl) ? (
                      <Tv size={18} />
                    ) : isDriveFolderUrl(previewModal.rawUrl) ? (
                      <FolderOpen size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                      {previewModal.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                      {isYouTubeUrl(previewModal.rawUrl) 
                        ? 'Pratinjau Video YouTube' 
                        : isDriveFolderUrl(previewModal.rawUrl)
                        ? 'Folder Berkas Google Drive'
                        : 'Pratinjau Dokumen Asesmen Akreditasi'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Tombol Salin Tautan (Copy Link) */}
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      copiedLink
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                    title="Salin tautan dokumen bukti"
                  >
                    {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>

                  {previewModal.downloadUrl && (
                    <a
                      href={previewModal.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
                    >
                      <Download size={14} />
                      Unduh
                    </a>
                  )}
                  <a
                    href={previewModal.rawUrl || previewModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                  >
                    <ExternalLink size={14} />
                    Tab Baru
                  </a>
                  <button
                    onClick={closePreview}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Iframe Preview Google Drive / YouTube */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
                <iframe
                  src={previewModal.url}
                  title={previewModal.title || "Preview"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortalAsesmen;
