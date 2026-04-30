import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  Award, 
  User, 
  Users, 
  Filter, 
  Loader2, 
  TrendingUp,
  BookOpen,
  FileText,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { studentData as demoStudents } from '../data/students';
import { supabase } from '../lib/supabase';
import { getDirectImageUrl } from '../utils/imageUtils';

const DataMahasiswa = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'publications'
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStudents, setDbStudents] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static stats for 2020-2026 (Totals from the image data)
  const staticStats = [
    { year: '2020', count: 427 }, // Using Ganjil 2020/2021
    { year: '2021', count: 657 }, // Using Ganjil 2021/2022
    { year: '2022', count: 568 }, // Using Ganjil 2022/2023
    { year: '2023', count: 541 }, // Using Ganjil 2023/2024
    { year: '2024', count: 578 }, // Using Ganjil 2024/2025
    { year: '2025', count: 565 }, // Using Ganjil 2025/2026
    { year: '2026', count: 0 },   // Future
  ];

  const semesterStats = [
    { semester: "2025/2026 Genap", count: 0 },
    { semester: "2025/2026 Ganjil", count: 565 },
    { semester: "2024/2025 Genap", count: 423 },
    { semester: "2024/2025 Ganjil", count: 578 },
    { semester: "2023/2024 Genap", count: 467 },
    { semester: "2023/2024 Ganjil", count: 541 },
    { semester: "2022/2023 Genap", count: 520 },
    { semester: "2022/2023 Ganjil", count: 568 },
    { semester: "2021/2022 Genap", count: 585 },
    { semester: "2021/2022 Ganjil", count: 657 },
    { semester: "2020/2021 Genap", count: 419 },
    { semester: "2020/2021 Ganjil", count: 427 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Students
      const { data: sData, error: sError } = await supabase
        .from('students_data')
        .select('*')
        .order('batch', { ascending: false })
        .order('name', { ascending: true });
      
      if (!sError) setDbStudents(sData || []);

      // Fetch Student Publications
      const { data: pData, error: pError } = await supabase
        .from('publications_data')
        .select('*')
        .eq('category', 'Mahasiswa')
        .order('year', { ascending: false });
      
      if (!pError) setPublications(pData || []);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayStudents = dbStudents.length > 0 ? dbStudents : demoStudents;

  const filteredStudents = useMemo(() => {
    return displayStudents.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.nim && s.nim.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, displayStudents]);

  const filteredPublications = useMemo(() => {
    return publications.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, publications]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        <div className="max-w-4xl mb-16 text-center mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('pages.mahasiswa.data.title')} <span className="gradient-text">{t('pages.mahasiswa.data.title_accent')}</span>
          </motion.h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('pages.mahasiswa.data.subtitle')}
          </p>
        </div>

        {/* Animated Growth Chart */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-primary-500/5 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('pages.mahasiswa.stats.title')}</h3>
                  <p className="text-sm text-slate-500 font-medium">{t('pages.mahasiswa.stats.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('pages.mahasiswa.stats.label')}</span>
                  </div>
                </div>
              </div>

              {/* The Chart - Now using Semester Stats */}
              <div className="flex items-end justify-between gap-1.5 md:gap-3 h-64 border-b border-slate-100 dark:border-slate-800 pb-2 mb-8 overflow-x-auto no-scrollbar">
                {[...semesterStats].reverse().map((stat, idx) => {
                  const maxHeight = 700; 
                  const height = (stat.count / maxHeight) * 100;
                  
                  return (
                    <div key={idx} className="flex-grow h-full flex flex-col justify-end items-center group relative min-w-[32px]">
                      {/* Hover Tooltip */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg mb-2 pointer-events-none z-20 whitespace-nowrap">
                        {stat.count} {t('pages.nav.students')}
                      </div>

                      {/* Static Label on Top of Bar */}
                      {stat.count > 0 && (
                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 mb-2">
                          {stat.count}
                        </span>
                      )}
                      
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: idx * 0.05, duration: 1, ease: "easeOut" }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all relative ${
                          stat.semester.includes('Ganjil') 
                            ? 'bg-primary-600 group-hover:bg-primary-500 shadow-lg shadow-primary-500/20' 
                            : 'bg-indigo-400 group-hover:bg-indigo-300 shadow-lg shadow-indigo-400/20'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-lg" />
                      </motion.div>
                      <div className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-center leading-none">
                        {stat.semester.replace(/20/g, '').replace(' Ganjil', ' G').replace(' Genap', ' GN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('pages.mahasiswa.data.ganjil')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('pages.mahasiswa.data.genap')}</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none text-primary-600">
              <TrendingUp size={300} />
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'directory' 
                  ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-md' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users size={18} />
              {t('pages.mahasiswa.data.directory_tab')}
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'publications' 
                  ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-md' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen size={18} />
              {t('pages.mahasiswa.data.publications_tab')}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={activeTab === 'directory' ? t('pages.mahasiswa.data.search_placeholder_students') : t('pages.mahasiswa.data.search_placeholder_publications')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-bold uppercase tracking-widest text-[10px]">{t('pages.mahasiswa.stats.loading')}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'directory' ? (
              <motion.div
                key="directory"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredStudents.map((student, i) => (
                  <div
                    key={student.id}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-blue-600 shrink-0">
                        {student.image_url ? (
                          <img src={getDirectImageUrl(student.image_url, 150)} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={28} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{student.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('pages.mahasiswa.data.batch_label')} {student.batch}</p>
                      </div>
                    </div>

                    {student.achievements && student.achievements.length > 0 && (
                      <div className="space-y-3 mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Award size={14} className="text-amber-500" />
                          {t('pages.mahasiswa.data.top_achievements')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {student.achievements.map((a, idx) => (
                            <div key={idx} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 dark:border-emerald-800">
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="publications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 gap-6"
              >
                {filteredPublications.length > 0 ? (
                  filteredPublications.map((pub) => (
                    <div
                      key={pub.id}
                      className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 items-start"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 shrink-0 flex items-center justify-center">
                        <FileText size={28} />
                      </div>

                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-500">
                            {pub.type || t('pages.mahasiswa.data.publication_type_default')}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Calendar size={14} />
                            {pub.year}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{pub.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {pub.authors.map((author, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                              <User size={12} className="text-primary-500" />
                              {author}
                            </div>
                          ))}
                        </div>
                        {pub.journal_name && (
                          <p className="text-sm text-slate-400 italic mb-4 font-medium flex items-center gap-2">
                            <BookOpen size={16} /> {pub.journal_name}
                          </p>
                        )}
                      </div>

                      {pub.link && (
                        <a 
                          href={pub.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="shrink-0 w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center hover:bg-primary-600 transition-all shadow-lg"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('pages.mahasiswa.data.no_publications')}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DataMahasiswa;
