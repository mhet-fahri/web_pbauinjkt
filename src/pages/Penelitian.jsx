import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Newspaper, 
  Book, 
  User, 
  Calendar, 
  ExternalLink, 
  FileText, 
  FlaskConical, 
  Database,
  Loader2
} from 'lucide-react';
import { researchData as demoResearch } from '../data/research';
import { supabase } from '../lib/supabase';

const Penelitian = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [dbResearch, setDbResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Semua', 'Penelitian', 'Publikasi'];

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const { data, error } = await supabase
          .from('publications_data')
          .select('*')
          .order('year', { ascending: false });
        
        if (error) throw error;
        setDbResearch(data || []);
      } catch (err) {
        console.error('Error fetching research:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

  const displayResearch = dbResearch.length > 0 ? dbResearch : demoResearch;

  const filteredData = useMemo(() => {
    return displayResearch.filter(item => {
      const authorsString = Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || '');
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        authorsString.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'Semua' || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, displayResearch]);

  const stats = useMemo(() => {
    const total = displayResearch.length;
    const researchCount = displayResearch.filter(d => d.category === 'Penelitian').length;
    const publicationCount = displayResearch.filter(d => d.category === 'Publikasi').length;
    return { total, researchCount, publicationCount };
  }, [displayResearch]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('pages.penelitian.title')} <span className="gradient-text">{t('pages.penelitian.title_accent')}</span>
          </motion.h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('pages.penelitian.subtitle')}
          </p>
        </div>

        {/* Journals Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('pages.penelitian.journals.title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t('pages.penelitian.journals.subtitle')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.a
              href="https://journal.uinjkt.ac.id/index.php/arabiyat"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Book size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {t('pages.penelitian.journals.arabiyat.rank')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                  {t('pages.penelitian.journals.arabiyat.name')}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mt-4">
                Kunjungi Jurnal <ExternalLink size={14} />
              </div>
            </motion.a>

            <motion.a
              href="https://journal.uinjkt.ac.id/kalimatuna"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Book size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {t('pages.penelitian.journals.kalimatuna.rank')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
                  {t('pages.penelitian.journals.kalimatuna.name')}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mt-4">
                Kunjungi Jurnal <ExternalLink size={14} />
              </div>
            </motion.a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: t('pages.penelitian.stats.total'), value: stats.total, icon: Database, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: t('pages.penelitian.stats.research'), value: stats.researchCount, icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: t('pages.penelitian.stats.publication'), value: stats.publicationCount, icon: Newspaper, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          ].map((stat, i) => (
            <motion.div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === cat ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat === 'Semua' ? t('pages.penelitian.tabs.all') : cat === 'Penelitian' ? t('pages.penelitian.tabs.research') : t('pages.penelitian.tabs.publication')}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t('pages.penelitian.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-600" size={40} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + searchTerm} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.category === 'Penelitian' ? 'text-emerald-600 border-emerald-100' : 'text-indigo-600 border-indigo-100'
                    }`}>
                      {item.category === 'Penelitian' ? t('pages.penelitian.tabs.research') : t('pages.penelitian.tabs.publication')}
                    </div>
                    <div className="text-slate-400 text-sm font-bold flex items-center gap-1.5">
                      <Calendar size={14} /> {item.year}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{item.title}</h3>
                  <div className="space-y-4 mb-8 flex-grow">
                    <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <User size={14} className="mt-1" /> {Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}
                    </div>
                    {item.journal_name && <div className="flex items-start gap-3 text-sm text-slate-500 italic"><Book size={14} className="mt-1" /> {item.journal_name}</div>}
                  </div>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.type}</span>
                    {item.link && item.link !== '#' && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold text-sm flex items-center gap-2">
                        {t('pages.penelitian.view_work')} <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Penelitian;
