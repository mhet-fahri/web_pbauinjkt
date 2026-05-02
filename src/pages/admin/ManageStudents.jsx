import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  GraduationCap, 
  Award, 
  X, 
  Save, 
  Loader2,
  User,
  Calendar,
  Download,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getDirectImageUrl } from '../../utils/imageUtils';
import * as XLSX from 'xlsx';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    batch: '',
    status: 'Aktif',
    achievements: [],
    image_url: ''
  });

  const [newAchievement, setNewAchievement] = useState('');

  const uploadImage = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `students/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pba-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pba-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      alert('Foto mahasiswa berhasil diunggah!');
    } catch (error) {
      alert('Gagal mengunggah foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students_data')
        .select('*')
        .order('batch', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Excel Template Download
  const downloadTemplate = () => {
    const template = [
      { 
        "Nama Lengkap": "Ahmad Zaki", 
        "NIM": "11223344", 
        "Angkatan": "2023", 
        "Prestasi": "Juara 1 Debat Bahasa Arab, Finalis MTQ" 
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Mahasiswa");
    XLSX.writeFile(wb, "Template_Data_Mahasiswa_PBA.xlsx");
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
          nim: item["NIM"]?.toString(),
          batch: item["Angkatan"]?.toString(),
          achievements: item["Prestasi"] ? item["Prestasi"].split(',').map(s => s.trim()) : [],
          status: 'Aktif'
        }));

        const { error } = await supabase
          .from('students_data')
          .insert(processedData);

        if (error) throw error;
        alert(`Berhasil mengimpor ${processedData.length} data mahasiswa!`);
        fetchStudents();
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
      if (editingStudent) {
        const { error } = await supabase
          .from('students_data')
          .update(formData)
          .eq('id', editingStudent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students_data')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data mahasiswa ini?')) return;
    try {
      const { error } = await supabase
        .from('students_data')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      nim: student.nim,
      batch: student.batch,
      status: student.status,
      achievements: student.achievements || [],
      image_url: student.image_url || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({ name: '', nim: '', batch: '', status: 'Aktif', achievements: [], image_url: '' });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Mahasiswa</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola data akademik dan prestasi mahasiswa</p>
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
          placeholder="Cari nama atau NIM mahasiswa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {loading && students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudents.map((student) => (
            <m.div
              layout
              key={student.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-blue-600">
                  {student.image_url ? (
                    <img src={getDirectImageUrl(student.image_url, 150)} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-slate-300" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(student)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-blue-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(student.id)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-rose-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight">{student.name}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                <span>NIM {student.nim}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Angkatan {student.batch}</span>
              </div>

              <div className="space-y-4">
                {student.achievements && student.achievements.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prestasi</div>
                    <div className="flex flex-wrap gap-2">
                      {student.achievements.slice(0, 3).map((a, i) => (
                        <div key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 dark:border-emerald-800">
                          {a}
                        </div>
                      ))}
                      {student.achievements.length > 3 && <div className="text-[10px] font-bold text-slate-400">+{student.achievements.length - 3} lainnya</div>}
                    </div>
                  </div>
                )}
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
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingStudent ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">NIM</label>
                    <input type="text" required value={formData.nim} onChange={(e) => setFormData({...formData, nim: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Angkatan</label>
                  <input type="text" required value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} placeholder="Contoh: 2023" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Daftar Prestasi</label>
                  <div className="flex gap-2">
                    <input type="text" value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} placeholder="Contoh: Juara 1 Debat" className="flex-grow px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <button type="button" onClick={addAchievement} className="px-6 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold"><Plus size={20} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-xs font-bold border border-blue-100 dark:border-blue-800">
                        {a}
                        <button type="button" onClick={() => removeAchievement(i)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Foto Mahasiswa (Opsional)</label>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                      {formData.image_url ? (
                        <img src={getDirectImageUrl(formData.image_url, 300)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-slate-300" />
                      )}
                    </div>

                    <label className="flex-grow cursor-pointer group w-full">
                      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50/50">
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
                    {editingStudent ? 'Simpan Perubahan' : 'Tambah Data Mahasiswa'}
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

export default ManageStudents;
