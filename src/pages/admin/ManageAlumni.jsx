import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  MessageSquareQuote,
  X, 
  Save, 
  Loader2,
  Download,
  Upload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getDirectImageUrl } from '../../utils/imageUtils';
import * as XLSX from 'xlsx';

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAlumnus, setEditingAlumnus] = useState(null);
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    graduation_year: '',
    position: '',
    company: '',
    testimony: '',
    image_url: ''
  });

  const uploadImage = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `alumni/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pba-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pba-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      alert('Foto alumni berhasil diunggah!');
    } catch (error) {
      alert('Gagal mengunggah foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alumni_data')
        .select('*')
        .order('graduation_year', { ascending: false });

      if (error) throw error;
      setAlumni(data || []);
    } catch (error) {
      console.error('Error fetching alumni:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Excel Template Download
  const downloadTemplate = () => {
    const template = [
      { 
        "Nama Lengkap": "Siti Rahma, M.Pd.", 
        "Tahun Lulus": "2018", 
        "Pekerjaan": "Guru Bahasa Arab", 
        "Instansi": "MAN 4 Jakarta",
        "Testimoni": "PBA UIN Jakarta memberikan landasan kuat bagi karir saya."
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Alumni");
    XLSX.writeFile(wb, "Template_Data_Alumni_PBA.xlsx");
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
          name: item["Nama Lengkap"],
          graduation_year: item["Tahun Lulus"]?.toString(),
          position: item["Pekerjaan"],
          company: item["Instansi"],
          testimony: item["Testimoni"] || ''
        }));

        const { error } = await supabase
          .from('alumni_data')
          .insert(processedData);

        if (error) throw error;
        alert(`Berhasil mengimpor ${processedData.length} data alumni!`);
        fetchAlumni();
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
      if (editingAlumnus) {
        const { error } = await supabase
          .from('alumni_data')
          .update(formData)
          .eq('id', editingAlumnus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('alumni_data')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchAlumni();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data alumni ini?')) return;
    try {
      const { error } = await supabase
        .from('alumni_data')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchAlumni();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openEdit = (alumnus) => {
    setEditingAlumnus(alumnus);
    setFormData({
      name: alumnus.name,
      graduation_year: alumnus.graduation_year,
      position: alumnus.position,
      company: alumnus.company,
      testimony: alumnus.testimony || '',
      image_url: alumnus.image_url || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingAlumnus(null);
    setFormData({ name: '', graduation_year: '', position: '', company: '', testimony: '', image_url: '' });
  };

  const filteredAlumni = alumni.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Alumni</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola database lulusan dan testimoni sukses</p>
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
            className="flex items-center gap-2 px-4 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-200 transition-all"
          >
            <Upload size={18} />
            Impor Excel
          </button>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
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
          placeholder="Cari nama alumni atau instansi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
        />
      </div>

      {loading && alumni.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlumni.map((alumnus) => (
            <m.div
              layout
              key={alumnus.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-emerald-600">
                  {alumnus.image_url ? (
                    <img src={getDirectImageUrl(alumnus.image_url, 150)} alt={alumnus.name} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap size={32} className="text-slate-300" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(alumnus)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-emerald-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(alumnus.id)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-rose-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight">{alumnus.name}</h3>
              <div className="text-xs font-bold text-emerald-600 mb-6 uppercase tracking-widest">Lulusan Tahun {alumnus.graduation_year}</div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Briefcase size={16} className="text-slate-400" />
                  <span className="font-medium">{alumnus.position}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Building2 size={16} className="text-slate-400" />
                  <span className="font-medium">{alumnus.company}</span>
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
            <m.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingAlumnus ? 'Edit Alumni' : 'Tambah Alumni'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tahun Lulus</label>
                    <input type="text" required value={formData.graduation_year} onChange={(e) => setFormData({...formData, graduation_year: e.target.value})} placeholder="Contoh: 2018" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pekerjaan / Jabatan</label>
                    <input type="text" required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} placeholder="Contoh: Guru Bahasa Arab" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Instansi / Perusahaan</label>
                    <input type="text" required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="Contoh: MAN 4 Jakarta" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kisah Sukses / Testimoni</label>
                  <textarea value={formData.testimony} onChange={(e) => setFormData({...formData, testimony: e.target.value})} rows={3} placeholder="Ceritakan pengalaman Anda selama kuliah di PBA..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none" />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Foto Alumni (Opsional)</label>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      {formData.image_url ? (
                        <img src={getDirectImageUrl(formData.image_url, 300)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap size={48} className="text-slate-300" />
                      )}
                    </div>

                    <label className="flex-grow cursor-pointer group w-full">
                      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-50/50">
                        {uploading ? (
                          <Loader2 className="animate-spin text-emerald-600 mb-2" size={24} />
                        ) : (
                          <Upload className="text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors" size={24} />
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
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingAlumnus ? 'Simpan Perubahan' : 'Tambah Data Alumni'}
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

export default ManageAlumni;
