import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  X, 
  Save, 
  Loader2,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    student_name: '',
    student_nim: '',
    examiner_1: '',
    examiner_2: '',
    date: '',
    time: '',
    location: '',
    type: 'seminar_proposal',
    custom_type: ''
  });

  const examTypes = [
    { value: 'seminar_proposal', label: 'Ujian Proposal Penelitian' },
    { value: 'komprehensif', label: 'Ujian Komprehensif' },
    { value: 'skripsi', label: 'Ujian Skripsi' },
    { value: 'lainnya', label: 'Ujian Lainnya' }
  ];

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.error('Table "exams" does not exist. Please create it in Supabase.');
        } else {
          throw error;
        }
      }
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.type === 'lainnya') {
        dataToSubmit.type = dataToSubmit.custom_type;
      }
      delete dataToSubmit.custom_type;

      if (editingExam) {
        const { error } = await supabase
          .from('exams')
          .update(dataToSubmit)
          .eq('id', editingExam.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('exams')
          .insert([dataToSubmit]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchExams();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus jadwal ujian ini?')) return;
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchExams();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      student_name: exam.student_name,
      student_nim: exam.student_nim || '',
      examiner_1: exam.examiner_1 || '',
      examiner_2: exam.examiner_2 || '',
      date: exam.date,
      time: exam.time || '',
      location: exam.location,
      type: examTypes.find(t => t.value === exam.type) ? exam.type : 'lainnya',
      custom_type: examTypes.find(t => t.value === exam.type) ? '' : exam.type
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingExam(null);
    setFormData({
      title: '',
      student_name: '',
      student_nim: '',
      examiner_1: '',
      examiner_2: '',
      date: '',
      time: '',
      location: '',
      type: 'seminar_proposal',
      custom_type: ''
    });
  };

  const filteredExams = exams.filter(e => 
    e.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.student_nim && e.student_nim.includes(searchTerm))
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Jadwal Ujian</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola jadwal ujian proposal, komprehensif, skripsi, dan lainnya</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          Tambah Jadwal
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama, NIM, atau judul..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {loading && exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExams.map((exam) => (
            <motion.div
              layout
              key={exam.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  exam.type === 'seminar_proposal' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' :
                  exam.type === 'komprehensif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' :
                  'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                }`}>
                  {exam.type === 'seminar_proposal' ? 'Ujian Proposal Penelitian' : exam.type.replace('_', ' ')}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(exam)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">{exam.title}</h3>
              
              <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-blue-500" />
                  <div>
                    <p className="font-bold leading-none">{exam.student_name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">NIM: {exam.student_nim || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} />
                  <span>{new Date(exam.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} />
                  <span>{exam.time || '--:--'} WIB</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>{exam.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingExam ? 'Edit Jadwal' : 'Tambah Jadwal'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Ujian</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  >
                    {examTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {formData.type === 'lainnya' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Ujian Lainnya</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.custom_type} 
                      onChange={(e) => setFormData({...formData, custom_type: e.target.value})} 
                      placeholder="Masukkan jenis ujian baru..." 
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" 
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Judul Skripsi / Seminar</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Masukkan judul lengkap..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Mahasiswa</label>
                    <input type="text" required value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} placeholder="Nama lengkap..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">NIM Mahasiswa</label>
                    <input type="text" value={formData.student_nim} onChange={(e) => setFormData({...formData, student_nim: e.target.value})} placeholder="Contoh: 112001000..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Penguji 1 / Pembimbing</label>
                    <input type="text" value={formData.examiner_1} onChange={(e) => setFormData({...formData, examiner_1: e.target.value})} placeholder="Nama dosen..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Penguji 2</label>
                    <input type="text" value={formData.examiner_2} onChange={(e) => setFormData({...formData, examiner_2: e.target.value})} placeholder="Nama dosen..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Waktu (WIB)</label>
                    <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lokasi / Ruangan</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Contoh: Ruang 3.05 atau Zoom" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingExam ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageExams;
