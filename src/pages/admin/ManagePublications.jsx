import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BookOpen, 
  FlaskConical, 
  User, 
  Link as LinkIcon, 
  X, 
  Save, 
  Loader2,
  Calendar,
  Upload,
  Download,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import * as XLSX from 'xlsx';
import { searchOpenAlexWorks, searchCrossRefWorks, parseBibTeX } from '../../services/publicationService';

const ManagePublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPub, setEditingPub] = useState(null);
  const [activeTab, setActiveTab] = useState('approved'); // 'approved' | 'pending'

  // Sync state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncQuery, setSyncQuery] = useState('');
  const [syncSource, setSyncSource] = useState('openalex'); // 'openalex' | 'crossref' | 'bibtex'
  const [bibtexText, setBibtexText] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResults, setSyncResults] = useState([]);
  const [selectedToImport, setSelectedToImport] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    authors: [],
    year: '',
    category: 'Publikasi',
    type: '',
    journal_name: '',
    doi: '',
    link: '',
    description: '',
    citations: 0,
    status: 'approved',
    source: 'manual'
  });

  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      const { data, error } = await supabase
        .from('publications_data')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPub) {
        const { error } = await supabase
          .from('publications_data')
          .update(formData)
          .eq('id', editingPub.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('publications_data')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchPublications();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id, newStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('publications_data')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchPublications();
    } catch (error) {
      alert('Gagal memvalidasi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateAll = async () => {
    const pendingItems = publications.filter(p => p.status === 'pending');
    if (pendingItems.length === 0) return;

    if (!window.confirm(`Apakah Anda yakin ingin menyetujui dan memvalidasi semua (${pendingItems.length}) karya sekaligus?`)) {
      return;
    }

    try {
      setLoading(true);
      const pendingIds = pendingItems.map(p => p.id);
      const { error } = await supabase
        .from('publications_data')
        .update({ status: 'approved' })
        .in('id', pendingIds);

      if (error) throw error;
      alert(`Berhasil memvalidasi ${pendingIds.length} karya! Data kini telah terpublikasi.`);
      setActiveTab('approved');
      fetchPublications();
    } catch (error) {
      alert('Gagal memvalidasi semua: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const { error } = await supabase
        .from('publications_data')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchPublications();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const addAuthor = () => {
    if (newAuthor.trim()) {
      setFormData({
        ...formData,
        authors: [...formData.authors, newAuthor.trim()]
      });
      setNewAuthor('');
    }
  };

  const removeAuthor = (index) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index)
    });
  };

  const openEdit = (pub) => {
    setEditingPub(pub);
    setFormData({
      title: pub.title,
      authors: pub.authors || [],
      year: pub.year,
      category: pub.category,
      type: pub.type || '',
      journal_name: pub.journal_name || '',
      doi: pub.doi || '',
      link: pub.link || '',
      description: pub.description || '',
      citations: pub.citations || 0,
      status: pub.status || 'approved',
      source: pub.source || 'manual'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPub(null);
    setFormData({ 
      title: '', 
      authors: [], 
      year: '', 
      category: 'Publikasi', 
      type: '', 
      journal_name: '', 
      doi: '', 
      link: '', 
      description: '',
      citations: 0,
      status: 'approved',
      source: 'manual'
    });
  };

  // Sync Search Handler
  const handleSyncSearch = async (e) => {
    e?.preventDefault();
    if (syncSource === 'bibtex') {
      if (!bibtexText.trim()) return;
      try {
        const parsed = parseBibTeX(bibtexText);
        if (parsed.length === 0) {
          alert('Format BibTeX tidak terdeteksi atau kosong. Pastikan teks disalin dari tombol Export BibTeX di Google Scholar.');
          return;
        }
        setSyncResults(parsed);
        // Default: tidak menceklis apapun, biarkan admin memilih sendiri secara manual
        setSelectedToImport([]);
      } catch (err) {
        alert('Gagal membaca BibTeX: ' + err.message);
      }
      return;
    }

    if (!syncQuery.trim()) return;

    setSyncLoading(true);
    setSyncResults([]);
    setSelectedToImport([]);
    try {
      let results = [];
      if (syncSource === 'openalex') {
        const res = await searchOpenAlexWorks(syncQuery);
        results = res.results;
      } else {
        results = await searchCrossRefWorks(syncQuery);
      }
      setSyncResults(results);
      // Default: kosongkan pilihan, biarkan admin memilih artikel mana yang mau diimpor
      setSelectedToImport([]);
    } catch (err) {
      alert('Gagal mengambil data dari API: ' + err.message);
    } finally {
      setSyncLoading(false);
    }
  };

  // Helper untuk mengecek apakah karya sudah ada di database (berdasarkan DOI atau kemiripan judul)
  const isAlreadyInDb = (item) => {
    return publications.some(existing => {
      // Cek DOI jika ada
      if (item.doi && existing.doi && item.doi.trim().toLowerCase() === existing.doi.trim().toLowerCase()) {
        return true;
      }
      // Cek kesamaan judul (abaikan huruf besar/kecil & tanda baca)
      const cleanNewTitle = (item.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanExistingTitle = (existing.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanNewTitle.length > 10 && cleanNewTitle === cleanExistingTitle;
    });
  };

  const toggleSelectImport = (index) => {
    if (selectedToImport.includes(index)) {
      setSelectedToImport(selectedToImport.filter(i => i !== index));
    } else {
      setSelectedToImport([...selectedToImport, index]);
    }
  };

  const handleImportSelected = async () => {
    if (selectedToImport.length === 0) return;
    setSyncLoading(true);
    try {
      const itemsToInsert = selectedToImport.map(idx => syncResults[idx]);
      
      const { error } = await supabase
        .from('publications_data')
        .insert(itemsToInsert);

      if (error) throw error;

      alert(`Berhasil mengimpor ${itemsToInsert.length} publikasi ke tab Menunggu Validasi!`);
      setIsSyncModalOpen(false);
      setSyncResults([]);
      setSelectedToImport([]);
      setActiveTab('pending');
      fetchPublications();
    } catch (err) {
      alert('Gagal menyimpan hasil sinkronisasi: ' + err.message);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map(row => ({
          title: row['Judul'] || row['judul'] || '',
          category: row['Kategori'] || row['kategori'] || 'Publikasi',
          year: (row['Tahun'] || row['tahun'] || '').toString(),
          authors: (row['Tim Penulis/Peneliti'] || row['Penulis'] || row['penulis'] || '').split(',').map(a => a.trim()).filter(a => a),
          type: row['Jenis'] || row['jenis'] || '',
          journal_name: row['Nama Jurnal/Penerbit'] || row['Nama Jurnal'] || row['Jurnal'] || row['Penerbit'] || '',
          link: row['Link Artikel'] || row['Link'] || row['link'] || '',
          status: 'approved',
          source: 'excel'
        }));

        const validData = formattedData.filter(d => d.title);

        if (validData.length > 0) {
          const { error } = await supabase
            .from('publications_data')
            .insert(validData);
          
          if (error) throw error;
          alert(`Berhasil menyimpan ${validData.length} data publikasi!`);
          fetchPublications();
        } else {
          alert('Tidak ada data valid yang ditemukan dalam file Excel.');
        }

      } catch (error) {
        alert('Error parsing Excel: ' + error.message);
      } finally {
        setLoading(false);
        e.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const pendingCount = publications.filter(p => p.status === 'pending').length;
  const approvedCount = publications.filter(p => !p.status || p.status === 'approved').length;

  const currentList = publications.filter(p => {
    const itemStatus = p.status || 'approved';
    return itemStatus === activeTab;
  });

  const filteredPubs = currentList.filter(p => {
    const titleMatch = (p.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = Array.isArray(p.authors) 
      ? p.authors.some(a => (a || '').toLowerCase().includes(searchTerm.toLowerCase()))
      : (p.authors || '').toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || authorMatch;
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Penelitian & Publikasi</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola dan sinkronisasi karya ilmiah dosen (OpenAlex, CrossRef, Scopus)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw size={18} />
            Tarik Data Otomatis
          </button>
          <label className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer">
            <Upload size={18} />
            Upload Excel
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            <Plus size={18} />
            Tambah Manual
          </button>
        </div>
      </div>

      {/* Tabs Validasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'approved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle size={16} />
            Terpublikasi ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <AlertCircle size={16} />
            Menunggu Validasi ({pendingCount})
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] text-white font-bold items-center justify-center">
                  {pendingCount}
                </span>
              </span>
            )}
          </button>
        </div>

        {activeTab === 'pending' && pendingCount > 0 && (
          <button
            onClick={handleValidateAll}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <Check size={16} />
            Validasi Semua ({pendingCount} Karya)
          </button>
        )}
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari judul atau nama penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
        />
      </div>

      {loading && publications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : filteredPubs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">
            {activeTab === 'pending' ? 'Tidak Ada Karya Menunggu Validasi' : 'Belum Ada Publikasi'}
          </h3>
          <p className="text-sm text-slate-500">
            {activeTab === 'pending' 
              ? 'Gunakan tombol "Tarik Data Otomatis" untuk mengimpor publikasi dosen dari OpenAlex / CrossRef.' 
              : 'Tambahkan data secara manual atau sinkronisasi otomatis.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPubs.map((pub) => (
            <m.div
              layout
              key={pub.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start justify-between"
            >
              <div className="flex gap-5 flex-grow">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                  pub.category === 'Penelitian' 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                }`}>
                  {pub.category === 'Penelitian' ? <FlaskConical size={24} /> : <BookOpen size={24} />}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border ${
                      pub.category === 'Penelitian'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-emerald-800'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:border-indigo-800'
                    }`}>
                      {pub.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{pub.year}</span>
                    {pub.source && (
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                        {pub.source}
                      </span>
                    )}
                    {typeof pub.citations === 'number' && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                        {pub.citations} Sitasi
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{pub.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(Array.isArray(pub.authors) ? pub.authors : [pub.authors]).map((author, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                        <User size={12} />
                        {author}
                      </div>
                    ))}
                  </div>
                  {pub.journal_name && <p className="text-xs text-slate-400 italic mb-2">{pub.journal_name}</p>}
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline">
                      Buka Tautan <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-center">
                {activeTab === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleValidate(pub.id, 'approved')} 
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      title="Setujui publikasi ini untuk tayang di halaman publik"
                    >
                      <Check size={16} /> Setujui
                    </button>
                    <button 
                      onClick={() => handleDelete(pub.id)} 
                      className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                    >
                      Abaikan / Hapus
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => openEdit(pub)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(pub.id)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </m.div>
          ))}
        </div>
      )}

      {/* Modal Sinkronisasi Otomatis */}
      <AnimatePresence>
        {isSyncModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSyncModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Tarik Publikasi Ilmiah Otomatis</h2>
                  <p className="text-xs text-slate-500">Ambil data publikasi Scopus / Scholar melalui OpenAlex & CrossRef</p>
                </div>
                <button onClick={() => setIsSyncModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
              </div>

              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-2xl mb-4 max-w-md">
                  <button
                    type="button"
                    onClick={() => { setSyncSource('openalex'); setSyncResults([]); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      syncSource === 'openalex' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    OpenAlex (Scholar & Scopus)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSyncSource('crossref'); setSyncResults([]); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      syncSource === 'crossref' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    CrossRef (DOI)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSyncSource('bibtex'); setSyncResults([]); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      syncSource === 'bibtex' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Paste BibTeX Scholar
                  </button>
                </div>

                {syncSource === 'bibtex' ? (
                  <form onSubmit={handleSyncSearch} className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Buka profil Google Scholar dosen → Centang artikel → Klik <b>Ekspor</b> → Pilih <b>BibTeX</b> → Salin dan tempel teksnya di sini:
                    </p>
                    <textarea
                      rows={4}
                      required
                      placeholder="@article{nawawi2023, ... title={...}, author={...}}"
                      value={bibtexText}
                      onChange={(e) => setBibtexText(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                    >
                      Ekstrak Artikel BibTeX
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSyncSearch} className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap dosen (contoh: Mukhshon Nawawi)..."
                      value={syncQuery}
                      onChange={(e) => setSyncQuery(e.target.value)}
                      className="flex-grow px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={syncLoading}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
                    >
                      {syncLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                      Cari Karya
                    </button>
                  </form>
                )}
              </div>

              {/* Hasil Pencarian */}
              <div className="p-6 overflow-y-auto flex-grow space-y-4 custom-scrollbar">
                {syncResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">Ditemukan {syncResults.length} karya. Pilih artikel yang sesuai:</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newOnly = syncResults
                              .map((w, i) => (!isAlreadyInDb(w) ? i : null))
                              .filter(i => i !== null);
                            setSelectedToImport(newOnly);
                          }}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          Pilih Semua Karya Baru
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedToImport([])}
                          className="text-xs font-bold text-slate-500 hover:underline"
                        >
                          Batal Pilih
                        </button>
                      </div>
                    </div>
                    {syncResults.map((work, idx) => {
                      const exists = isAlreadyInDb(work);
                      const isSelected = selectedToImport.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (!exists) toggleSelectImport(idx);
                          }}
                          className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                            exists
                              ? 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 opacity-70 cursor-not-allowed'
                              : isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 cursor-pointer'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={exists}
                            checked={isSelected && !exists}
                            onChange={() => {}}
                            className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-40"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {work.year}
                              </span>
                              {exists ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✓ Sudah Ada di Database
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded">
                                  Karya Baru
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                                {work.citations} Sitasi
                              </span>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                                {work.type}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{work.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {Array.isArray(work.authors) ? work.authors.join(', ') : work.authors} • {work.journal_name || 'Tidak ada info jurnal'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : syncLoading ? (
                  <div className="text-center py-12 text-slate-400">
                    <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">Mencari di repositori OpenAlex & CrossRef...</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-sm">Ketik nama dosen PBA di atas untuk menarik publikasi ilmiah otomatis.</p>
                  </div>
                )}
              </div>

              {/* Footer Import Action */}
              {syncResults.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {selectedToImport.length} karya dipilih
                  </span>
                  <button
                    onClick={handleImportSelected}
                    disabled={selectedToImport.length === 0 || syncLoading}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
                  >
                    Impor ke Validasi Admin
                  </button>
                </div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Manual Form (Edit / Tambah) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <m.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingPub ? 'Edit Karya' : 'Tambah Karya Ilmiah'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Judul Penelitian / Artikel</label>
                  <textarea required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} rows={2} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-bold" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold">
                      <option value="Publikasi">Publikasi Dosen</option>
                      <option value="Penelitian">Penelitian / Hibah</option>
                      <option value="Mahasiswa">Publikasi Mahasiswa</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tahun</label>
                    <input type="text" required value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} placeholder="2024" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Tim Penulis / Peneliti</label>
                  <div className="flex gap-2">
                    <input type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Nama Penulis..." className="flex-grow px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    <button type="button" onClick={addAuthor} className="px-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold"><Plus size={20} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.authors.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                        {a}
                        <button type="button" onClick={() => removeAuthor(i)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jenis / Indeks</label>
                    <input type="text" placeholder="Scopus Q1 / Sinta 2" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Jurnal</label>
                    <input type="text" value={formData.journal_name} onChange={(e) => setFormData({...formData, journal_name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sitasi</label>
                    <input type="number" value={formData.citations} onChange={(e) => setFormData({...formData, citations: parseInt(e.target.value) || 0})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Link Artikel / DOI</label>
                  <input type="text" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} placeholder="https://doi.org/..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingPub ? 'Simpan Perubahan' : 'Terbitkan Karya'}
                  </button>
                </div>
              </form>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePublications;
