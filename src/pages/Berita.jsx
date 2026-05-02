import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  Newspaper, 
  Tag,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { supabase } from '../lib/supabase';
import { getDirectImageUrl } from '../utils/imageUtils';

const demoNews = [
  {
    id: 'demo-1',
    category: "Berita",
    title: "Inovasi Kurikulum PBA: Menyongsong Era Digital 5.0",
    content: "Diskusi panel tentang integrasi teknologi AI dalam pengajaran Bahasa Arab untuk meningkatkan efektivitas pembelajaran.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'demo-2',
    category: "Kegiatan",
    title: "Analisis Linguistik Komparatif: Arab-Indonesia",
    content: "Penelitian terbaru mengungkapkan pengaruh struktur gramatikal Arab terhadap perkembangan kosakata bahasa Indonesia modern.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'demo-3',
    category: "Opini",
    title: "Masa Depan Bahasa Arab di Indonesia",
    content: "Sebuah tinjauan kritis mengenai tantangan dan peluang pengajaran bahasa Arab di era globalisasi.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'demo-4',
    category: "Pengumuman",
    title: "Pendaftaran Mahasiswa Baru Gelombang II Telah Dibuka",
    content: "Kesempatan bergabung dengan prodi PBA UIN Jakarta masih terbuka luas bagi calon mahasiswa berprestasi.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1523050338292-915c857b3661?auto=format&fit=crop&q=80&w=800"
  }
];

const Berita = () => {
  const { t, i18n } = useTranslation(['news', 'common']);
  const currentLang = i18n.language;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [dbNews, setDbNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'Semua', label: t('categories.all') },
    { id: 'Berita', label: t('categories.news') },
    { id: 'Kegiatan', label: t('categories.event') },
    { id: 'Pengumuman', label: t('categories.announcement') },
    { id: 'Opini', label: t('categories.opinion') }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDbNews(data || []);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const displayNews = dbNews.length > 0 ? dbNews : demoNews;

  const filteredNews = displayNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || news.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-6"
          >
            <Newspaper size={16} />
            <span>{t('badge')}</span>
          </m.div>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('title')} <span className="gradient-text">{t('title_accent')}</span>
          </m.h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-600" size={40} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <m.div 
              key={activeCategory + searchTerm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredNews.map((item, i) => (
                <Card key={item.id || i} delay={i * 0.05} className="p-0 overflow-hidden group border-none shadow-md hover:shadow-2xl transition-all">
                  <div className="h-56 overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                    <img 
                      src={getDirectImageUrl(item.image_url, 600) || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-700 shadow-sm">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-medium">
                      <Calendar size={14} className="text-primary-500" />
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-black mb-4 leading-tight text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">
                      {currentLang === 'ar' && item.title_ar ? item.title_ar : 
                       currentLang === 'en' && item.title_en ? item.title_en : 
                       item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {(currentLang === 'ar' && item.content_ar ? item.content_ar : 
                       currentLang === 'en' && item.content_en ? item.content_en : 
                       item.content || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
                    </p>
                    <Link to={`/berita/${item.id}`} className="inline-flex items-center gap-2 text-sm font-black text-primary-600 group/link">
                      {t('read_more')} 
                      <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              ))}
            </m.div>
          </AnimatePresence>
        )}

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <div className="text-slate-400 font-bold">{t('not_found')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Berita;
