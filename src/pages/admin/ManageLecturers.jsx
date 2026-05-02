import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User, 
  Mail, 
  X, 
  Save, 
  Loader2,
  Camera,
  Briefcase,
  Hash,
  Download,
  Upload,
  Phone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getDirectImageUrl } from '../../utils/imageUtils';
import * as XLSX from 'xlsx';

const ManageLecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLecturer, setEditingLecturer] = useState(null);
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    position: '',
    expertise: '',
    image_url: '',
    email: '',
    scholar_link: ''
  });

  const uploadImage = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `lecturers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pba-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pba-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      alert('Foto dosen berhasil diunggah!');
    } catch (error) {
      alert('Gagal mengunggah foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lecturers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setLecturers(data || []);
    } catch (error) {
      console.error('Error fetching lecturers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Excel Template Download
  const downloadTemplate = () => {
    const template = [
      { 
        "Nama Lengkap & Gelar": "Prof. Dr. Ahmad Zaki, M.A.", 
        "NIP": "197501012000031001", 
        "Jabatan": "Guru Besar", 
        "Bidang Keahlian": "Metodologi Pembelajaran Bahasa Arab",
        "Email": "ahmad.zaki@uinjkt.ac.id",
        "Google Scholar": "https://scholar.google.com/citations?user=..."
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Dosen");
    XLSX.writeFile(wb, "Template_Data_Dosen_PBA.xlsx");
  };

  // Excel Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setLoading(true);
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const processedData = data.map(item => ({
          name: item["Nama Lengkap & Gelar"],
          nip: item["NIP"]?.toString(),
          position: item["Jabatan"],
          expertise: item["Bidang Keahlian"],
          email: item["Email"],
          scholar_link: item["Google Scholar"]
        }));

        const { error } = await supabase
          .from('lecturers')
          .insert(processedData);

        if (error) throw error;
        alert(`Berhasil mengimpor ${processedData.length} data dosen!`);
        fetchLecturers();
      } catch (error) {
        alert('Gagal mengimpor file: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingLecturer) {
        const { error } = await supabase
          .from('lecturers')
          .update(formData)
          .eq('id', editingLecturer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lecturers')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchLecturers();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data dosen ini?')) return;
    try {
      const { error } = await supabase
        .from('lecturers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchLecturers();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openEdit = (lecturer) => {
    setEditingLecturer(lecturer);
    setFormData({
      name: lecturer.name,
      nip: lecturer.nip,
      position: lecturer.position,
      expertise: lecturer.expertise,
      image_url: lecturer.image_url || '',
      email: lecturer.email || '',
      scholar_link: lecturer.scholar_link || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingLecturer(null);
    setFormData({ name: '', nip: '', position: '', expertise: '', image_url: '', email: '', scholar_link: '' });
  };

  const filteredLecturers = lecturers.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.nip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Dosen</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola data tenaga pendidik PBA UIN Jakarta</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            <Download size={18} />
            Template
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl font-bold hover:bg-blue-200 transition-all"
          >
            <Upload size={18} />
            Impor Excel
          </button>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Tambah Manual
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama atau NIP dosen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {loading && lecturers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLecturers.map((lecturer) => (
            <m.div
              layout
              key={lecturer.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                    {lecturer.image_url ? (
                      <img src={getDirectImageUrl(lecturer.image_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-slate-300" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(lecturer)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(lecturer.id)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight">{lecturer.name}</h3>
              <p className="text-blue-600 text-sm font-bold mb-6">{lecturer.position}</p>

              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Hash size={14} />
                  <span className="font-bold tracking-wider">{lecturer.nip || 'NIP Kosong'}</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-500 leading-relaxed">
                  <Briefcase size={14} className="shrink-0 mt-0.5" />
                  <span>{lecturer.expertise}</span>
                </div>
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
            <m.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingLecturer ? 'Edit Data Dosen' : 'Tambah Dosen'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap & Gelar</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Dr. Ahmad, M.A." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">NIP</label>
                    <input type="text" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} placeholder="19xxxxxxxxxxxx" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jabatan</label>
                    <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} placeholder="Contoh: Lektor Kepala" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bidang Keahlian</label>
                  <input type="text" value={formData.expertise} onChange={(e) => setFormData({...formData, expertise: e.target.value})} placeholder="Contoh: Metodologi Pembelajaran Bahasa Arab" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="dosen@uinjkt.ac.id" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Google Scholar</label>
                    <input type="text" value={formData.scholar_link} onChange={(e) => setFormData({...formData, scholar_link: e.target.value})} placeholder="Tautan Profil Scholar" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Foto Profil Dosen</label>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Preview Area */}
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      {formData.image_url ? (
                        <img 
                          src={getDirectImageUrl(formData.image_url, 300)} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User size={48} className="text-slate-300" />
                      )}
                    </div>

                    {/* Upload Button */}
                    <label className="flex-grow cursor-pointer group w-full">
                      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10">
                        {uploading ? (
                          <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
                        ) : (
                          <Upload className="text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" size={24} />
                        )}
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                          {uploading ? 'Mengunggah...' : 'Unggah Foto Baru'}
                        </span>
                        <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="hidden" />
                      </div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Atau masukkan Link Manual (Google Drive)</p>
                    <input 
                      type="text" 
                      value={formData.image_url} 
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                      placeholder="https://..." 
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingLecturer ? 'Simpan Perubahan' : 'Tambah Data Dosen'}
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

export default ManageLecturers;
