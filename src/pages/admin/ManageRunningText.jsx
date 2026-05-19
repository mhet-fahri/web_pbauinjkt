import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Loader2, 
  Calendar, 
  Globe,
  Megaphone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManageRunningText = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    title_en: '',
    category: 'Pengumuman',
    content: '', // Akan digunakan untuk menyimpan Tanggal Akhir Tampil (End Date)
    content_ar: 'إعلان نصي متحرك',
    content_en: 'Running Text Announcement',
    image_url: '',
    author: 'Admin PBA',
    created_at: new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState('id'); // 'id', 'ar', 'en'

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'Pengumuman')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentAnnouncement) {
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', currentAnnouncement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([formData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus running text ini?')) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchAnnouncements();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const openEditModal = (item) => {
    setCurrentAnnouncement(item);
    setFormData({
      title: item.title || '',
      title_ar: item.title_ar || '',
      title_en: item.title_en || '',
      category: 'Pengumuman',
      content: item.content || '',
      content_ar: 'إعلان نصي متحرك',
      content_en: 'Running Text Announcement',
      image_url: item.image_url || '',
      author: item.author || 'Admin PBA',
      created_at: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      title_ar: '',
      title_en: '',
      category: 'Pengumuman', 
      content: '', 
      content_ar: 'إعلان نصي متحرك',
      content_en: 'Running Text Announcement',
      image_url: '', 
      author: 'Admin PBA',
      created_at: new Date().toISOString().split('T')[0]
    });
    setCurrentAnnouncement(null);
    setActiveTab('id');
  };

  const filteredAnnouncements = announcements.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.title_en && item.title_en.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Manajemen Running Text</h1>
            <p className="text-slate-500 dark:text-slate-400">Kelola pengumuman teks berjalan di halaman utama</p>
          </div>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={20} />
          Tambah Teks Berjalan
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Cari teks pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Content */}
      {loading && announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAnnouncements.map((item) => (
            <m.div 
              layout
              key={item.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                    Aktif
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bahasa Indonesia:</span>
                    <p className="text-slate-700 dark:text-slate-200 font-bold">{item.title}</p>
                  </div>
                  {item.title_en && (
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">English:</span>
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">{item.title_en}</p>
                    </div>
                  )}
                  {item.title_ar && (
                    <div dir="rtl" className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">العربية:</span>
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold font-arabic">{item.title_ar}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button 
                  onClick={() => openEditModal(item)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </m.div>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold">Belum ada running text pengumuman.</p>
              <p className="text-slate-400 text-xs mt-1">Gunakan tombol "Tambah Teks Berjalan" di atas untuk menambahkan baru.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <m.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {currentAnnouncement ? 'Edit Teks Berjalan' : 'Tambah Teks Berjalan'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Language Tabs */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                    {[
                      { id: 'id', label: 'Indonesia', icon: <Globe size={14} /> },
                      { id: 'ar', label: 'Arab', icon: <Globe size={14} /> },
                      { id: 'en', label: 'Inggris', icon: <Globe size={14} /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                          activeTab === tab.id 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'id' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Teks Berjalan (ID)</label>
                        <textarea 
                          required
                          rows={3}
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Contoh: Pekan Ujian Tengah Semester (UTS): 11 - 23 Mei 2026"
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'ar' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300" dir="rtl">
                      <div className="space-y-2 text-right">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1 block">النص المتحرك (AR)</label>
                        <textarea 
                          rows={3}
                          value={formData.title_ar}
                          onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                          placeholder="أدخل النص باللغة العربية..."
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-right font-arabic"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'en' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Running Text (EN)</label>
                        <textarea 
                          rows={3}
                          value={formData.title_en}
                          onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                          placeholder="Enter running text in English..."
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Mulai Tampil</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="date"
                          required
                          value={formData.created_at}
                          onChange={(e) => setFormData({...formData, created_at: e.target.value})}
                          className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Akhir Tampil</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="date"
                          required
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors">Batal</button>
                    <button type="submit" disabled={loading} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      {currentAnnouncement ? 'Simpan Perubahan' : 'Simpan Running Text'}
                    </button>
                  </div>
                </form>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageRunningText;
