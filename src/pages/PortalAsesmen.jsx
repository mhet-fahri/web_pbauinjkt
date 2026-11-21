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
  FileSpreadsheet
} from 'lucide-react';
import { getAkreditasiItems, getLedConfig, getDkpsConfig } from '../services/akreditasiService';
import { getGoogleDrivePreviewUrl, getGoogleDriveDownloadUrl } from '../utils/driveUtils';
import SEO from '../components/SEO';

const PortalAsesmen = () => {
  const [items, setItems] = useState([]);
  const [ledConfig, setLedConfig] = useState(null);
  const [dkpsConfig, setDkpsConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKriteria, setSelectedKriteria] = useState('ALL');

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
        const [fetchedItems, fetchedLed, fetchedDkps] = await Promise.all([
          getAkreditasiItems(),
          getLedConfig(),
          getDkpsConfig()
        ]);
        setItems(fetchedItems);
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
      await navigator.clipboard.writeText(linkToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24">
      <SEO 
        title="Portal Asesmen Lapangan Akreditasi - PBA UIN Jakarta" 
        description="Portal bukti dan dokumen akreditasi program studi Pendidikan Bahasa Arab FITK UIN Syarif Hidayatullah Jakarta untuk Asesor Lapangan."
        url="/portal-asesmen"
      />

      {/* Header Khusus Portal Asesmen (Clean & Professional) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck size={26} />
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
        {/* HERO SECTION 1: DOKUMEN UTAMA (LED & DKPS)                      */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Laporan Evaluasi Diri (LED) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-2xl shadow-blue-600/10 border border-blue-500/20 flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0 shadow-inner">
                <BookOpen size={30} className="text-blue-200" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles size={11} /> Dokumen Induk Kualitatif
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {ledConfig?.title || 'Laporan Evaluasi Diri (LED) PBA'}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {ledConfig?.subtitle || 'Laporan Evaluasi Diri Program Studi Pendidikan Bahasa Arab FITK UIN Syarif Hidayatullah Jakarta.'}
                </p>
              </div>
            </div>

            {/* Tombol Aksi LED */}
            <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/10">
              {ledConfig?.pdfUrl ? (
                <>
                  <button
                    onClick={() => openPreview(ledConfig.title || 'Laporan Evaluasi Diri PBA', ledConfig.pdfUrl)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Eye size={15} />
                    Pratinjau LED
                  </button>
                  <a
                    href={getGoogleDriveDownloadUrl(ledConfig.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
                  >
                    <Download size={15} />
                    Unduh
                  </a>
                </>
              ) : (
                <div className="w-full text-center py-2 px-3 rounded-xl bg-white/10 text-xs text-slate-300 italic border border-white/10">
                  Tautan file LED sedang disiapkan oleh panitia.
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Dokumen Kinerja Program Studi (DKPS) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 text-white p-6 sm:p-8 shadow-2xl shadow-emerald-600/10 border border-emerald-500/20 flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0 shadow-inner">
                <FileSpreadsheet size={30} className="text-emerald-200" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles size={11} /> Dokumen Kuantitatif (Excel)
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {dkpsConfig?.title || 'Dokumen Kinerja Program Studi (DKPS)'}
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {dkpsConfig?.subtitle || 'Tabel Data Kuantitatif Kinerja Program Studi PBA (Format Spreadsheet / Excel).'}
                </p>
              </div>
            </div>

            {/* Tombol Aksi DKPS */}
            <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/10">
              {dkpsConfig?.excelUrl ? (
                <>
                  <button
                    onClick={() => openPreview(dkpsConfig.title || 'Dokumen Kinerja Program Studi (DKPS)', dkpsConfig.excelUrl)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 font-black text-xs shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Eye size={15} />
                    Pratinjau DKPS (Excel)
                  </button>
                  <a
                    href={getGoogleDriveDownloadUrl(dkpsConfig.excelUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
                  >
                    <Download size={15} />
                    Unduh Excel
                  </a>
                </>
              ) : (
                <div className="w-full text-center py-2 px-3 rounded-xl bg-white/10 text-xs text-emerald-100 italic border border-white/10">
                  Tautan file DKPS Excel sedang disiapkan oleh panitia.
                </div>
              )}
            </div>
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
              Semua Butir ({items.length})
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
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Menampilkan {filteredItems.length} Butir Penilaian
            </h3>
            {searchTerm && (
              <span className="text-xs text-blue-600 font-bold">
                Filter aktif: "{searchTerm}"
              </span>
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
                Tidak ada butir yang cocok
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Silakan ubah kata kunci pencarian atau pilih kriteria lainnya.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasBukti = item.bukti && item.bukti.length > 0;

              return (
                <m.div
                  key={item.no}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  {/* Header Butir */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-xs">
                          Butir No. {item.no}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {item.kriteria}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white pt-1">
                        {item.elemen}
                      </h4>
                    </div>

                    <div className="shrink-0">
                      {hasBukti ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800/40">
                          <CheckCircle2 size={14} /> {item.bukti.length} Dokumen Bukti
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold text-xs">
                          Menunggu Berkas
                        </span>
                      )}
                    </div>
                  </div>

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
                                onClick={() => openPreview(b.nama || `Bukti No. ${item.no}`, b.url)}
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
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                      {previewModal.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                      Pratinjau Dokumen Asesmen Akreditasi
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
                    href={previewModal.url}
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

              {/* Iframe Preview Google Drive */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
                <iframe
                  src={previewModal.url}
                  title="Document Preview"
                  className="w-full h-full border-0"
                  allow="autoplay"
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
