import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  X,
  Save,
  Loader2,
  Calendar,
  Upload,
  Globe
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getDirectImageUrl } from '../../utils/imageUtils';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import GenerateAi from './news/GenerateAi';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ]
};

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    title_en: '',
    category: 'Berita',
    content: '',
    content_ar: '',
    content_en: '',
    image_url: '',
    author: 'Admin PBA',
    created_at: new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState('id'); // 'id', 'ar', 'en'

  const uploadImage = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pba-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pba-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      alert('Gambar berhasil diunggah!');
    } catch (error) {
      alert('Gagal mengunggah gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (err) {
      console.error('Error fetching news:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentNews) {
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', currentNews.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([formData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      resetForm();
      fetchNews();
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchNews();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const openEditModal = (item) => {
    setCurrentNews(item);
    setFormData({
      title: item.title || '',
      title_ar: item.title_ar || '',
      title_en: item.title_en || '',
      category: item.category || 'Berita',
      content: item.content || '',
      content_ar: item.content_ar || '',
      content_en: item.content_en || '',
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
      category: 'Berita', 
      content: '', 
      content_ar: '',
      content_en: '',
      image_url: '', 
      author: 'Admin PBA',
      created_at: new Date().toISOString().split('T')[0]
    });
    setCurrentNews(null);
    setActiveTab('id');
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Berita</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola artikel berita dan kegiatan program studi</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={20} />
          Tambah Berita
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Cari judul berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Content */}
      {loading && news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredNews.map((item) => (
            <m.div 
              layout
              key={item.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {item.image_url ? (
                    <img src={getDirectImageUrl(item.image_url, 400)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
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

          {filteredNews.length === 0 && (
            <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold">Data berita belum tersedia.</p>
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
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {currentNews ? 'Edit Berita' : 'Tambah Berita Baru'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <GenerateAi formData={formData} setFormData={setFormData} lang="ar" />
                    <GenerateAi formData={formData} setFormData={setFormData} lang="en" />
                    <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
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
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Judul Berita (ID)</label>
                        </div>
                        <input 
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Masukkan judul artikel..."
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Konten Berita (ID)</label>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                          <ReactQuill 
                            theme="snow"
                            modules={quillModules}
                            value={formData.content}
                            onChange={(content) => setFormData({...formData, content})}
                            placeholder="Tuliskan isi berita..."
                            className="bg-transparent text-slate-900 dark:text-white border-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ar' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300" dir="rtl">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1 block text-right">عنوان الخبر (Arabic Title)</label>
                        <input 
                          type="text"
                          value={formData.title_ar}
                          onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                          placeholder="أدخل عنوان المقال..."
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1 block text-right">محتوى الخبر (Arabic Content)</label>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-all" dir="ltr">
                          <ReactQuill 
                            theme="snow"
                            modules={quillModules}
                            value={formData.content_ar}
                            onChange={(content) => setFormData({...formData, content_ar: content})}
                            placeholder="اكتب محتوى الخبر هنا..."
                            className="bg-transparent text-slate-900 dark:text-white border-none quill-rtl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'en' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">News Title (English)</label>
                        <input 
                          type="text"
                          value={formData.title_en}
                          onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                          placeholder="Enter article title..."
                          className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">News Content (English)</label>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                          <ReactQuill 
                            theme="snow"
                            modules={quillModules}
                            value={formData.content_en}
                            onChange={(content) => setFormData({...formData, content_en: content})}
                            placeholder="Write news content here..."
                            className="bg-transparent text-slate-900 dark:text-white border-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="border-slate-100 dark:border-slate-800" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                      >
                        <option value="Berita">Berita</option>
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Pengumuman">Pengumuman</option>
                        <option value="Opini">Opini</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Penulis</label>
                      <input 
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Publikasi</label>
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

                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Foto Berita</label>
                    <div className="flex flex-col md:flex-row gap-6">
                      <label className="flex-grow cursor-pointer group">
                        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50/50">
                          {uploading ? <Loader2 className="animate-spin text-indigo-600" size={32} /> : <Upload className="text-slate-400 group-hover:text-indigo-600 mb-2" size={32} />}
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{uploading ? 'Mengunggah...' : 'Pilih Gambar'}</span>
                          <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="hidden" />
                        </div>
                      </label>
                      <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 flex items-center justify-center shrink-0">
                        {formData.image_url ? (
                          <img src={getDirectImageUrl(formData.image_url, 400)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={48} className="text-slate-300" />
                        )}
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={formData.image_url} 
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                      placeholder="Atau tempel link gambar di sini..." 
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    />
                  </div>



                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors">Batal</button>
                    <button type="submit" disabled={loading || uploading} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      {currentNews ? 'Simpan Perubahan' : 'Terbitkan Berita'}
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

export default ManageNews;
