import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  Save, 
  X, 
  BookOpen, 
  AlertCircle,
  Filter,
  Link as LinkIcon,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  FileSpreadsheet,
  FileCheck2,
  Upload,
  Loader2,
  Tv
} from 'lucide-react';
import { 
  getAkreditasiItems, 
  updateAkreditasiItem, 
  getRingkasanConfig,
  saveRingkasanConfig,
  getLedConfig, 
  saveLedConfig,
  getDkpsConfig,
  saveDkpsConfig,
  resetAkreditasiItemsToDefault 
} from '../../services/akreditasiService';
import { supabase } from '../../lib/supabase';
import { getGoogleDrivePreviewUrl, isYouTubeUrl } from '../../utils/driveUtils';

const ManageAkreditasi = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKriteria, setSelectedKriteria] = useState('ALL');

  // Ringkasan Eksekutif State
  const [ringkasanConfig, setRingkasanConfigState] = useState({
    title: 'Ringkasan Eksekutif LED PBA',
    subtitle: 'Ikhtisar Eksekutif Laporan Evaluasi Diri Program Studi Pendidikan Bahasa Arab',
    pdfUrl: ''
  });
  const [isEditingRingkasan, setIsEditingRingkasan] = useState(false);
  const [ringkasanForm, setRingkasanForm] = useState({ ...ringkasanConfig });
  const [savingRingkasan, setSavingRingkasan] = useState(false);

  // LED State
  const [ledConfig, setLedConfigState] = useState({
    title: 'Laporan Evaluasi Diri (LED) PBA',
    subtitle: 'Dokumen Induk Akreditasi Program Studi Pendidikan Bahasa Arab',
    pdfUrl: ''
  });
  const [isEditingLed, setIsEditingLed] = useState(false);
  const [ledForm, setLedForm] = useState({ ...ledConfig });
  const [savingLed, setSavingLed] = useState(false);

  // DKPS State (Dokumen Kinerja Program Studi Excel)
  const [dkpsConfig, setDkpsConfigState] = useState({
    title: 'Dokumen Kinerja Program Studi (DKPS)',
    subtitle: 'Data Kuantitatif Kinerja Program Studi Pendidikan Bahasa Arab (Format Excel Spreadsheet dengan Rumus Baku)',
    excelUrl: '',
    fileName: ''
  });
  const [isEditingDkps, setIsEditingDkps] = useState(false);
  const [dkpsForm, setDkpsForm] = useState({ ...dkpsConfig });
  const [savingDkps, setSavingDkps] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  // Edit Bukti Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [tempBuktiList, setTempBuktiList] = useState([]);
  const [savingItem, setSavingItem] = useState(false);

  // Preview Modal State
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewRawUrl, setPreviewRawUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Toast / Alert Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedItems, fetchedRingkasan, fetchedLed, fetchedDkps] = await Promise.all([
        getAkreditasiItems(),
        getRingkasanConfig(),
        getLedConfig(),
        getDkpsConfig()
      ]);
      setItems(fetchedItems);
      setRingkasanConfigState(fetchedRingkasan);
      setRingkasanForm(fetchedRingkasan);
      setLedConfigState(fetchedLed);
      setLedForm(fetchedLed);
      setDkpsConfigState(fetchedDkps);
      setDkpsForm(fetchedDkps);
    } catch (err) {
      console.error('Error loading akreditasi data:', err);
      showToast('Gagal memuat data akreditasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Simpan Ringkasan Eksekutif
  const handleSaveRingkasan = async (e) => {
    e.preventDefault();
    setSavingRingkasan(true);
    try {
      const saved = await saveRingkasanConfig(ringkasanForm);
      setRingkasanConfigState(saved);
      setIsEditingRingkasan(false);
      showToast('Ringkasan Eksekutif LED berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan Ringkasan Eksekutif', 'error');
    } finally {
      setSavingRingkasan(false);
    }
  };

  // Simpan LED
  const handleSaveLed = async (e) => {
    e.preventDefault();
    setSavingLed(true);
    try {
      const saved = await saveLedConfig(ledForm);
      setLedConfigState(saved);
      setIsEditingLed(false);
      showToast('Laporan Evaluasi Diri (LED) berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan LED', 'error');
    } finally {
      setSavingLed(false);
    }
  };

  // Simpan DKPS
  const handleSaveDkps = async (e) => {
    e.preventDefault();
    setSavingDkps(true);
    try {
      const saved = await saveDkpsConfig(dkpsForm);
      setDkpsConfigState(saved);
      setIsEditingDkps(false);
      showToast('Dokumen Kinerja Program Studi (DKPS) berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan DKPS', 'error');
    } finally {
      setSavingDkps(false);
    }
  };

  // Upload File Excel DKPS (File Asli dengan Rumus Baku)
  const handleUploadDkpsFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ekstensi
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'xlsm', 'csv'].includes(ext)) {
      showToast('Harap unggah file Excel (.xlsx, .xls, .xlsm)', 'error');
      return;
    }

    setUploadingExcel(true);
    try {
      let finalUrl = '';

      // Jika Supabase Storage tersedia
      if (supabase) {
        const fileName = `dkps-${Date.now()}.${ext}`;
        const filePath = `akreditasi/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('pba-assets')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('pba-assets')
            .getPublicUrl(filePath);
          finalUrl = publicUrl;
        }
      }

      // Jika Supabase storage belum disetting, kita simpan via FileReader (Base64 Data URI)
      if (!finalUrl) {
        finalUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const updatedForm = {
        ...dkpsForm,
        excelUrl: finalUrl,
        fileName: file.name
      };

      setDkpsForm(updatedForm);
      const saved = await saveDkpsConfig(updatedForm);
      setDkpsConfigState(saved);
      showToast(`File Excel DKPS "${file.name}" berhasil diunggah!`);
    } catch (err) {
      console.error('Upload DKPS error:', err);
      showToast('Gagal mengunggah file Excel: ' + err.message, 'error');
    } finally {
      setUploadingExcel(false);
    }
  };

  // Buka Modal Edit Bukti
  const openEditModal = (item) => {
    setEditingItem(item);
    setTempBuktiList(item.bukti ? JSON.parse(JSON.stringify(item.bukti)) : []);
  };

  // Tambah baris bukti baru
  const handleAddBuktiRow = () => {
    setTempBuktiList([
      ...tempBuktiList,
      {
        id: Date.now().toString(),
        nama: '',
        url: ''
      }
    ]);
  };

  // Update input bukti baris tertentu
  const handleBuktiChange = (index, field, value) => {
    const updated = [...tempBuktiList];
    updated[index][field] = value;
    setTempBuktiList(updated);
  };

  // Hapus bukti baris tertentu
  const handleRemoveBuktiRow = (index) => {
    const updated = tempBuktiList.filter((_, i) => i !== index);
    setTempBuktiList(updated);
  };

  // Pindahkan urutan bukti ke atas
  const handleMoveBuktiUp = (index) => {
    if (index === 0) return;
    const updated = [...tempBuktiList];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setTempBuktiList(updated);
  };

  // Pindahkan urutan bukti ke bawah
  const handleMoveBuktiDown = (index) => {
    if (index === tempBuktiList.length - 1) return;
    const updated = [...tempBuktiList];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setTempBuktiList(updated);
  };

  // Simpan Bukti ke Item
  const handleSaveItemBukti = async () => {
    if (!editingItem) return;
    setSavingItem(true);
    try {
      // Filter out baris yang sama sekali kosong
      const validBukti = tempBuktiList.filter(b => b.nama.trim() || b.url.trim());
      const updated = await updateAkreditasiItem(editingItem.no, {
        bukti: validBukti
      });

      // Update state lokal
      setItems(items.map(it => it.no === updated.no ? updated : it));
      setEditingItem(null);
      showToast(`Bukti butir No. ${updated.no} berhasil disimpan!`);
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan bukti butir', 'error');
    } finally {
      setSavingItem(false);
    }
  };

  // Buka Preview Google Drive
  const handleOpenPreview = (title, rawUrl) => {
    const preview = getGoogleDrivePreviewUrl(rawUrl);
    setPreviewTitle(title);
    setPreviewUrl(preview);
    setPreviewRawUrl(rawUrl);
    setCopiedLink(false);
  };

  const handleCopyPreviewLink = async () => {
    const linkToCopy = previewRawUrl || previewUrl;
    if (!linkToCopy) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(linkToCopy);
      } else {
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
      window.prompt('Salin link di bawah ini:', linkToCopy);
    }
  };

  // Daftar Kriteria Unik untuk Filter
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

  // Total Bukti Terisi
  const totalItems = items.length;
  const itemsWithBukti = items.filter(it => it.bukti && it.bukti.length > 0).length;
  const totalBuktiLinks = items.reduce((acc, it) => acc + (it.bukti ? it.bukti.length : 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-semibold text-sm ${
              toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          >
            <CheckCircle2 size={18} />
            {toastMessage.msg}
          </m.div>
        )}
      </AnimatePresence>

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
            <BookOpen size={16} /> Portal Asesmen Akreditasi
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Kelola Dokumen & Bukti Akreditasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola Laporan Evaluasi Diri (LED), DKPS, dan tautan bukti Google Drive untuk 65 elemen instrumen akreditasi prodi.
          </p>
        </div>

        {/* Statistik Ringkas */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">Total Elemen</div>
            <div className="text-lg font-black text-slate-800 dark:text-white">{totalItems}</div>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-center">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Elemen Terisi</div>
            <div className="text-lg font-black text-slate-800 dark:text-white">{itemsWithBukti}</div>
          </div>
          <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-center">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">Total Tautan</div>
            <div className="text-lg font-black text-slate-800 dark:text-white">{totalBuktiLinks}</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Ringkasan Eksekutif LED, LED, & DKPS Excel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Ringkasan Eksekutif LED */}
        <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl shadow-orange-600/15 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <FileCheck2 size={24} className="text-white" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase mb-1">
                  Executive Summary
                </span>
                <h2 className="text-base sm:text-lg font-black">{ringkasanConfig.title}</h2>
                <p className="text-amber-100 text-xs mt-0.5 line-clamp-2">
                  {ringkasanConfig.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-amber-200">
              <LinkIcon size={13} className="shrink-0" />
              <span className="truncate font-mono">
                {ringkasanConfig.pdfUrl ? ringkasanConfig.pdfUrl : '(Link Google Drive Ringkasan belum diisi)'}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 relative z-10">
            {ringkasanConfig.pdfUrl ? (
              <button
                onClick={() => handleOpenPreview('Ringkasan Eksekutif LED PBA', ringkasanConfig.pdfUrl)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-md transition-all"
              >
                <Eye size={13} />
                Pratinjau
              </button>
            ) : <div />}
            <button
              onClick={() => {
                setRingkasanForm({ ...ringkasanConfig });
                setIsEditingRingkasan(!isEditingRingkasan);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
            >
              <Edit3 size={13} />
              {isEditingRingkasan ? 'Batal' : 'Edit Link'}
            </button>
          </div>

          {/* Panel Edit Link Ringkasan */}
          <AnimatePresence>
            {isEditingRingkasan && (
              <m.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveRingkasan}
                className="mt-4 pt-4 border-t border-white/20 space-y-3 relative z-10"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-100 mb-1">
                    Judul Dokumen
                  </label>
                  <input
                    type="text"
                    value={ringkasanForm.title}
                    onChange={(e) => setRingkasanForm({ ...ringkasanForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-amber-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-100 mb-1">
                    Tautan Google Drive (PDF / Dokumen)
                  </label>
                  <input
                    type="url"
                    value={ringkasanForm.pdfUrl}
                    onChange={(e) => setRingkasanForm({ ...ringkasanForm, pdfUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-amber-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs font-mono"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-100 mb-1">
                    Deskripsi / Keterangan
                  </label>
                  <input
                    type="text"
                    value={ringkasanForm.subtitle}
                    onChange={(e) => setRingkasanForm({ ...ringkasanForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-amber-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingRingkasan(false)}
                    className="px-3 py-1.5 rounded-lg text-white text-xs hover:bg-white/10 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={savingRingkasan}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-orange-700 font-bold text-xs shadow hover:bg-orange-50 transition"
                  >
                    <Save size={13} />
                    {savingRingkasan ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>

        {/* Card 2: LED */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase mb-1">
                  Dokumen Induk Kualitatif
                </span>
                <h2 className="text-base sm:text-lg font-black">{ledConfig.title}</h2>
                <p className="text-blue-100 text-xs mt-0.5 line-clamp-2">
                  {ledConfig.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-blue-200">
              <LinkIcon size={13} className="shrink-0" />
              <span className="truncate font-mono">
                {ledConfig.pdfUrl ? ledConfig.pdfUrl : '(Link Google Drive LED belum diisi)'}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 relative z-10">
            {ledConfig.pdfUrl ? (
              <button
                onClick={() => handleOpenPreview('Laporan Evaluasi Diri (LED)', ledConfig.pdfUrl)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all"
              >
                <Eye size={13} />
                Pratinjau
              </button>
            ) : <div />}
            <button
              onClick={() => {
                setLedForm({ ...ledConfig });
                setIsEditingLed(!isEditingLed);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
            >
              <Edit3 size={13} />
              {isEditingLed ? 'Batal' : 'Edit Link'}
            </button>
          </div>

          {/* Panel Edit Link LED */}
          <AnimatePresence>
            {isEditingLed && (
              <m.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveLed}
                className="mt-4 pt-4 border-t border-white/20 space-y-3 relative z-10"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-100 mb-1">
                    Judul Dokumen
                  </label>
                  <input
                    type="text"
                    value={ledForm.title}
                    onChange={(e) => setLedForm({ ...ledForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-100 mb-1">
                    Tautan Google Drive LED (PDF)
                  </label>
                  <input
                    type="url"
                    value={ledForm.pdfUrl}
                    onChange={(e) => setLedForm({ ...ledForm, pdfUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs font-mono"
                    placeholder="https://drive.google.com/file/d/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-100 mb-1">
                    Deskripsi / Keterangan
                  </label>
                  <input
                    type="text"
                    value={ledForm.subtitle}
                    onChange={(e) => setLedForm({ ...ledForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingLed(false)}
                    className="px-3 py-1.5 rounded-lg text-white text-xs hover:bg-white/10 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={savingLed}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs shadow hover:bg-blue-50 transition"
                  >
                    <Save size={13} />
                    {savingLed ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>

        {/* Card 3: DKPS (Excel Spreadsheet dengan Upload Langsung File Asli) */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-600/15 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <FileSpreadsheet size={24} className="text-white" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase mb-1">
                  Dokumen Kuantitatif (Excel)
                </span>
                <h2 className="text-base sm:text-lg font-black">{dkpsConfig.title}</h2>
                <p className="text-emerald-100 text-xs mt-0.5 line-clamp-2">
                  {dkpsConfig.subtitle}
                </p>
              </div>
            </div>

            {/* Nama File Excel yang Terunggah */}
            <div className="mt-4 flex flex-col gap-1 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <LinkIcon size={13} className="shrink-0" />
                <span className="truncate font-mono">
                  {dkpsConfig.fileName ? `File: ${dkpsConfig.fileName}` : (dkpsConfig.excelUrl ? dkpsConfig.excelUrl : '(File Excel belum diunggah)')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 relative z-10">
            {dkpsConfig.excelUrl ? (
              <button
                onClick={() => handleOpenPreview('Dokumen Kinerja Program Studi (DKPS)', dkpsConfig.excelUrl)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all"
              >
                <Eye size={13} />
                Pratinjau
              </button>
            ) : <div />}
            <button
              onClick={() => {
                setDkpsForm({ ...dkpsConfig });
                setIsEditingDkps(!isEditingDkps);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
            >
              <Edit3 size={13} />
              {isEditingDkps ? 'Batal' : 'Kelola / Upload Excel'}
            </button>
          </div>

          {/* Panel Kelola & Upload File Excel DKPS */}
          <AnimatePresence>
            {isEditingDkps && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/20 space-y-3 relative z-10"
              >
                {/* Upload File Excel Asli */}
                <div className="bg-white/10 p-3 rounded-2xl border border-white/20 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-100 flex items-center justify-between">
                    <span>1. Upload File Excel DKPS (Rumus Baku)</span>
                    {uploadingExcel && <Loader2 size={13} className="animate-spin text-white" />}
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white text-emerald-700 font-bold text-xs cursor-pointer hover:bg-emerald-50 shadow transition">
                    <Upload size={14} />
                    <span>{uploadingExcel ? 'Mengunggah file...' : 'Pilih File Excel (.xlsx)'}</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .xlsm, .csv"
                      onChange={handleUploadDkpsFile}
                      disabled={uploadingExcel}
                      className="hidden"
                    />
                  </label>
                  {dkpsConfig.fileName && (
                    <div className="text-[10px] text-emerald-200 truncate">
                      File aktif: <strong>{dkpsConfig.fileName}</strong>
                    </div>
                  )}
                </div>

                {/* Atau Input Link Alternatif */}
                <form onSubmit={handleSaveDkps} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-100 mb-1">
                      2. Atau Paste Tautan Google Drive Excel
                    </label>
                    <input
                      type="url"
                      value={dkpsForm.excelUrl}
                      onChange={(e) => setDkpsForm({ ...dkpsForm, excelUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-emerald-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs font-mono"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-100 mb-1">
                      Deskripsi / Keterangan
                    </label>
                    <input
                      type="text"
                      value={dkpsForm.subtitle}
                      onChange={(e) => setDkpsForm({ ...dkpsForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-emerald-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingDkps(false)}
                      className="px-3 py-1.5 rounded-lg text-white text-xs hover:bg-white/10 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingDkps}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-700 font-bold text-xs shadow hover:bg-emerald-50 transition"
                    >
                      <Save size={13} />
                      {savingDkps ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: Filter & Pencarian Butir */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari elemen, kata kunci (misal: RPS, microteaching, SPMI, visi, kurikulum)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Kriteria */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedKriteria}
              onChange={(e) => setSelectedKriteria(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Kriteria (1 s.d. 9)</option>
              {kriteriaList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Cepat Kriteria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedKriteria('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedKriteria === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua ({items.length})
          </button>
          {kriteriaList.map((k, idx) => {
            const count = items.filter(i => i.kriteria === k).length;
            const shortName = `Kriteria ${idx + 1}`;
            return (
              <button
                key={k}
                onClick={() => setSelectedKriteria(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedKriteria === k
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title={k}
              >
                {shortName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Daftar Tabel Butir */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold animate-pulse">
          Memuat data elemen akreditasi...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <AlertCircle size={40} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Tidak ada elemen yang cocok</h3>
          <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter kriteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const hasBukti = item.bukti && item.bukti.length > 0;
            return (
              <div
                key={item.no}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Info Elemen */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-xs">
                        Elemen No. {item.no}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.kriteria}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {item.elemen}
                    </h3>

                    {/* Indikator Rincian */}
                    {item.indikator && item.indikator.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800/60">
                        <div className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                          Indikator Penilaian:
                        </div>
                        {item.indikator.map((ind, i) => (
                          <div key={i} className="leading-relaxed">
                            {ind}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bagian Bukti & Tombol Aksi */}
                  <div className="lg:w-80 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Bukti Terhubung ({item.bukti ? item.bukti.length : 0})
                        </span>
                        {hasBukti ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={12} /> Lengkap
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                            Belum Ada Bukti
                          </span>
                        )}
                      </div>

                      {/* List Bukti yang Sudah Diisi */}
                      {hasBukti ? (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {item.bukti.map((b, idx) => (
                            <div
                              key={b.id || idx}
                              className="group flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText size={14} className="text-blue-500 shrink-0" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={b.nama}>
                                  {b.nama || `Bukti ${idx + 1}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleOpenPreview(b.nama || `Bukti No. ${item.no}`, b.url)}
                                  className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title="Pratinjau Dokumen"
                                >
                                  <Eye size={14} />
                                </button>
                                <a
                                  href={b.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                                  title="Buka Link Tab Baru"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          Klik tombol kelola bukti di bawah untuk menautkan link Google Drive bukti asesmen.
                        </p>
                      )}
                    </div>

                    {/* Tombol Buka Modal Edit Bukti */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all shadow-sm"
                    >
                      <Plus size={14} />
                      {hasBukti ? 'Edit / Tambah Bukti' : '+ Masukkan Bukti'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Edit Bukti (Multi-link) */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-xs">
                      Elemen No. {editingItem.no}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{editingItem.kriteria}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {editingItem.elemen}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tambahkan satu atau lebih tautan Google Drive dokumen bukti untuk elemen ini.
                  </p>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Modal: Daftar Input Bukti */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {tempBuktiList.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Belum ada link bukti</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Klik tombol "+ Tambah Tautan Bukti" di bawah untuk mulai mengisi.
                    </p>
                  </div>
                ) : (
                  tempBuktiList.map((bukti, index) => (
                    <div
                      key={bukti.id || index}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                            Urutan #{index + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {bukti.nama ? `"${bukti.nama}"` : 'Dokumen Bukti'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Tombol Atur Susunan: Ke Atas */}
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveBuktiUp(index)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-transparent transition"
                            title="Pindah ke Atas"
                          >
                            <ArrowUp size={14} />
                          </button>

                          {/* Tombol Atur Susunan: Ke Bawah */}
                          <button
                            type="button"
                            disabled={index === tempBuktiList.length - 1}
                            onClick={() => handleMoveBuktiDown(index)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-transparent transition"
                            title="Pindah ke Bawah"
                          >
                            <ArrowDown size={14} />
                          </button>

                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => handleRemoveBuktiRow(index)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1 text-xs font-bold"
                            title="Hapus Bukti Ini"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        <div className="md:col-span-5">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <span className="text-rose-500">*</span> Nama / Label Bukti:
                          </label>
                          <input
                            type="text"
                            value={bukti.nama}
                            onChange={(e) => handleBuktiChange(index, 'nama', e.target.value)}
                            placeholder="Contoh: SK Dosen Tetap 2024 / Notula Rapat"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            required
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Nama dokumen yang akan dibaca oleh asesor
                          </span>
                        </div>
                        <div className="md:col-span-7">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <span className="text-rose-500">*</span> Link Google Drive Bukti:
                          </label>
                          <input
                            type="url"
                            value={bukti.url}
                            onChange={(e) => handleBuktiChange(index, 'url', e.target.value)}
                            placeholder="https://drive.google.com/file/d/..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            required
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Paste link file/folder dari Google Drive
                          </span>
                        </div>
                      </div>

                      {bukti.url && (
                        <div className="flex items-center gap-2 pt-1 text-[11px]">
                          <span className="text-slate-400">Preview link:</span>
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(bukti.nama || 'Bukti', bukti.url)}
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Eye size={12} /> Cek Pratinjau
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Tombol Tambah Baris */}
                <button
                  type="button"
                  onClick={handleAddBuktiRow}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Plus size={16} />
                  + Tambah Tautan Bukti Baru
                </button>
              </div>

              {/* Footer Modal */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={savingItem}
                  onClick={handleSaveItemBukti}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition"
                >
                  <Save size={15} />
                  {savingItem ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Google Drive Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Header Preview */}
              <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isYouTubeUrl(previewRawUrl)
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-600'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'
                  }`}>
                    {isYouTubeUrl(previewRawUrl) ? <Tv size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white truncate max-w-lg">
                      {previewTitle}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      {isYouTubeUrl(previewRawUrl) ? 'YouTube Video Preview' : 'Google Drive Document Preview'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPreviewLink}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                    title="Salin tautan dokumen bukti"
                  >
                    {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>

                  <a
                    href={previewRawUrl || previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <ExternalLink size={13} />
                    Buka Tab Baru
                  </a>
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Iframe Preview Google Drive / YouTube */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
                <iframe
                  src={previewUrl}
                  title="Document Preview"
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

export default ManageAkreditasi;
