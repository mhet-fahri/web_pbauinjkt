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
  FileText,
  Calendar,
  Layers,
  Upload,
  Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import * as XLSX from 'xlsx';

const ManagePublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPub, setEditingPub] = useState(null);
  
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
    description: ''
  });

  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
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
      description: pub.description || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPub(null);
    setFormData({ title: '', authors: [], year: '', category: 'Publikasi', type: '', journal_name: '', doi: '', link: '', description: '' });
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
          link: row['Link Artikel'] || row['Link'] || row['link'] || ''
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
        e.target.value = null; // reset input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredPubs = publications.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Penelitian & Publikasi</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola karya ilmiah dan hibah penelitian dosen</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/template_publikasi.xlsx"
            download
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Download Template Excel"
          >
            <Download size={20} />
            Template
          </a>
          <label className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer">
            <Upload size={20} />
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={20} />
            Tambah Karya
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari judul, penulis, atau kata kunci..."
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
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPubs.map((pub) => (
            <m.div
              layout
              key={pub.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start"
            >
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                pub.category === 'Penelitian' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                  : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
              }`}>
                {pub.category === 'Penelitian' ? <FlaskConical size={24} /> : <BookOpen size={24} />}
              </div>

              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    pub.category === 'Penelitian'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-emerald-800'
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:border-indigo-800'
                  }`}>
                    {pub.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{pub.year}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{pub.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pub.authors.map((author, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      <User size={12} />
                      {author}
                    </div>
                  ))}
                </div>
                {pub.journal_name && <p className="text-xs text-slate-400 italic mb-2">{pub.journal_name}</p>}
              </div>

              <div className="flex md:flex-col gap-2 shrink-0">
                <button onClick={() => openEdit(pub)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(pub.id)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </m.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jenis (Contoh: Jurnal Q1)</label>
                    <input type="text" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Jurnal / Penerbit</label>
                    <input type="text" value={formData.journal_name} onChange={(e) => setFormData({...formData, journal_name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Link Artikel / DOI (Opsional)</label>
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
