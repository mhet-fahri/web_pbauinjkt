import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Clock, 
  User, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getDirectImageUrl } from '../utils/imageUtils';

// Demo data for fallback (Must match Home.jsx demo IDs)
const demoNews = [
  {
    id: 'demo-1',
    category: "Pendidikan",
    title: "Persiapan Akreditasi 2026",
    content: "PBA FITK UIN Jakarta terus berkomitmen untuk meningkatkan mutu pendidikan melalui pembaruan kurikulum yang berorientasi pada kebutuhan zaman. Perubahan lanskap pendidikan global, kemajuan teknologi digital, serta dinamika masyarakat multikultural menuntut adanya pembelajaran bahasa Arab yang tidak hanya bersifat tekstual dan teoritis, tetapi juga inovatif, integratif, dan aplikatif. \n\nOleh karena itu, pemutakhiran kurikulum ini merupakan langkah strategis untuk memperkuat relevansi program studi dengan perkembangan ilmu pengetahuan, teknologi, dan kebutuhan dunia kerja. Melalui integrasi riset, pendekatan tugas autentik, dan literasi digital, kurikulum ini diharapkan tidak hanya memperkuat identitas keilmuan program studi, tetapi juga meningkatkan daya saing lulusan di berbagai bidang profesi dan keilmuan.",
    created_at: new Date().toISOString(),
    image_url: "https://drive.google.com/file/d/1gQX7JSL4Mu7ghbB7qWTaOWdiUkDE8CvU/view?usp=sharing",
    author: "Admin PBA"
  },
  {
    id: 'demo-2',
    category: "Penelitian",
    title: "Analisis Linguistik Komparatif: Arab-Indonesia",
    content: "Penelitian terbaru mengungkapkan pengaruh struktur gramatikal Arab terhadap perkembangan kosakata bahasa Indonesia modern. Studi ini melibatkan berbagai ahli bahasa dari kedua negara untuk mengeksplorasi bagaimana serapan kata dan struktur kalimat Arab memberikan warna unik pada bahasa Indonesia kontemporer. \n\nKajian ini menemukan bahwa lebih dari 3000 kosakata dalam Kamus Besar Bahasa Indonesia (KBBI) merupakan kata serapan dari bahasa Arab. Hal ini menunjukkan betapa dalamnya pengaruh budaya dan bahasa Arab dalam membentuk identitas bahasa Indonesia kita saat ini.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200",
    author: "Tim Riset PBA"
  },
  {
    id: 'demo-3',
    category: "Acara",
    title: "Seminar Internasional Literasi Bahasa Arab 2026",
    content: "UIN Syarif Hidayatullah Jakarta sukses menggelar Seminar Internasional Literasi Bahasa Arab yang menghadirkan para pakar dari Universitas Al-Azhar, Kairo. Acara ini dihadiri oleh lebih dari 500 peserta dari berbagai universitas di Indonesia. \n\nDiskusi hangat terjadi mengenai bagaimana mempopulerkan bahasa Arab di kalangan generasi Z melalui media sosial dan platform digital interaktif. Rektor UIN Jakarta dalam sambutannya menekankan pentingnya kolaborasi internasional untuk memperkuat posisi bahasa Arab sebagai bahasa ilmu pengetahuan global.",
    created_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    author: "Humas PBA"
  }
];

const DetailBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // 1. Try to find in demo data first if it's a demo ID
        if (id && id.startsWith('demo-')) {
          const found = demoNews.find(n => n.id === id);
          if (found) {
            setPost(found);
            setLoading(false);
            return;
          }
        }

        // 2. Otherwise fetch from Supabase
        if (supabase) {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();
          
          if (!error && data) {
            setPost(data);
            setLoading(false);
            return;
          }
        }

        // Fallback to demo 1 if not found
        setPost(demoNews[0]);
      } catch (err) {
        console.error('Error fetching post:', err);
        setPost(demoNews[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Berita Tidak Ditemukan</h2>
        <Link to="/berita">
          <button className="px-6 py-2 bg-primary-600 text-white rounded-xl">Kembali ke Berita</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-950">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Link to="/berita" className="hover:text-primary-600 transition-colors">Berita</Link>
              <ChevronRight size={14} />
              <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{post.title}</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold mb-6 uppercase tracking-widest">
                {post.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary-500" />
                  {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-primary-500" />
                  {post.author || 'Admin PBA'}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary-500" />
                  5 menit baca
                </div>
              </div>
            </motion.div>
          </div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl bg-slate-100 dark:bg-slate-800"
          >
            <img 
              src={getDirectImageUrl(post.image_url, 1000) || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200"} 
              alt={post.title}
              className="w-full h-auto object-cover max-h-[550px]"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200";
              }}
            />
          </motion.div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {post.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 mb-6 text-justify">
                    {para}
                  </p>
                ))}
              </div>

              {/* Tags/Share Footer */}
              <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <Share2 size={18} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Bagikan:</span>
                  <div className="flex items-center gap-2 ml-2">
                    {[1, 2, 3].map((i) => (
                      <button key={i} className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                        <Share2 size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Related */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[10px]">Berita Lainnya</h3>
                  <div className="space-y-6">
                    {demoNews.map((item, i) => (
                      <Link key={i} to={`/berita/${item.id}`} className="group block">
                        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
                          {item.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-medium">{item.category}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBerita;
