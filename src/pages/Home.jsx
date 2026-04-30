import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Star,
  ChevronRight,
  Search,
  ExternalLink,
  Calendar,
  Globe,
  Newspaper,
  Loader2
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import uinJakarta from '../assets/uin-jakarta.jpg';
import { supabase } from '../lib/supabase';
import { getDirectImageUrl } from '../utils/imageUtils';

const demoNews = [
  {
    id: 'demo-1',
    category: "Pendidikan",
    title: "Persiapan Akreditasi 2026",
    content: "PBA FITK UIN Jakarta melakukan persiapan akreditasi 2026",
    created_at: new Date().toISOString(),
    image_url: "https://drive.google.com/file/d/1gQX7JSL4Mu7ghbB7qWTaOWdiUkDE8CvU/view?usp=sharing"
  },
  {
    id: 'demo-2',
    category: "Penelitian",
    title: "Analisis Linguistik Komparatif: Arab-Indonesia",
    content: "Penelitian terbaru mengungkapkan pengaruh struktur gramatikal Arab terhadap perkembangan kosakata bahasa Indonesia modern.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'demo-3',
    category: "Acara",
    title: "Seminar Internasional Literasi Bahasa Arab 2026",
    content: "Menghadirkan pembicara dari Universitas Al-Azhar untuk membahas masa depan literasi Arab di kancah internasional.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
  }
];

const Home = () => {
  const { t } = useTranslation();

  const quickLinks = [
    {
      category: t('pages.home.quick_links.documents'),
      links: [
        { name: t('pages.home.quick_links.accreditation'), url: "#" },
        { name: t('pages.home.quick_links.curriculum_doc'), url: "#" },
        { name: t('pages.home.quick_links.academic_guidelines'), url: "#" },
        { name: t('pages.home.quick_links.writing_guidelines'), url: "#" },
        { name: t('pages.home.quick_links.microteaching_guidelines'), url: "#" },
        { name: t('pages.home.quick_links.circulars'), url: "#" },
      ]
    },
    {
      category: t('pages.home.quick_links.students'),
      links: [
        { name: t('pages.home.quick_links.registration'), url: "https://spmb.uinjkt.ac.id/" },
        { name: t('pages.home.quick_links.portal'), url: "https://ais.uinjkt.ac.id/" },
        { name: t('pages.home.quick_links.esemesta'), url: "https://esemesta.uinjkt.ac.id/" },
      ]
    },
    {
      category: t('pages.home.quick_links.programs'),
      links: [
        { name: t('pages.home.quick_links.s1'), url: "#" },
        { name: t('pages.home.quick_links.s2'), url: "#" },
        { name: t('pages.home.quick_links.intensive'), url: "#" },
        { name: t('pages.home.quick_links.continuing'), url: "#" },
      ]
    }
  ];

  const [dbNews, setDbNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayNews = dbNews.length > 0 ? dbNews : demoNews;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100/50 dark:bg-primary-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-sky-100/50 dark:bg-sky-900/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-6">
                <Globe size={14} />
                <span>{t('pages.home.badge')}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1]">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://spmb.uinjkt.ac.id/spmbv2/home.zul" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="group">
                    {t('pages.home.hero_cta')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </a>
                <Link to="/kurikulum">
                  <Button variant="secondary" size="lg">
                    {t('pages.home.hero_curriculum')}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800"
              >
                <img
                  src={uinJakarta}
                  alt="Gedung Kampus UIN Syarif Hidayatullah Jakarta"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-padding bg-white dark:bg-slate-900/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('pages.home.news_title')} <span className="gradient-text">{t('pages.home.news_title_accent')}</span></h2>
            <Link to="/berita">
              <Button variant="secondary">{t('pages.home.news_see_all')}</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayNews.map((item, i) => (
                <Card key={item.id || i} className="overflow-hidden p-0 border-none shadow-md group h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    <img
                      src={getDirectImageUrl(item.image_url, 600) || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[10px] font-black text-primary-600 uppercase mb-2 block tracking-widest">{item.category}</span>
                    <h3 className="text-xl font-bold mb-3 leading-tight line-clamp-2 text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.content ? item.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ') : ''}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Calendar size={12} className="text-primary-500" />
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <Link
                        to={`/berita/${item.id}`}
                        className="px-4 py-1.5 rounded-lg border border-primary-600 text-primary-600 font-bold text-xs hover:bg-primary-600 hover:text-white transition-all flex items-center gap-2"
                      >
                        {t('pages.home.news_read_more')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {quickLinks.map((group, idx) => (
              <div key={idx}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-primary-500" />
                  {group.category}
                </h3>
                <ul className="space-y-4">
                  {group.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors font-medium">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 bg-slate-50 dark:bg-slate-950">
        <div className="container-custom">
          <div className="bg-primary-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6">{t('pages.home.cta_title')}</h2>
              <p className="text-lg text-primary-50 mb-10 max-w-2xl mx-auto">
                {t('pages.home.cta_desc')}
              </p>
              <a href="https://spmb.uinjkt.ac.id/spmbv2/home.zul" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                  {t('pages.home.cta_button')}
                </Button>
              </a>
            </div>
            {/* Background Decorative Icon */}
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <Globe size={300} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
