import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
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
import DOMPurify from 'dompurify';

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
  const { t, i18n } = useTranslation(['news', 'common']);
  const currentLang = i18n.language;
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
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

    const fetchOtherNews = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('posts')
            .select('id, title, title_ar, title_en, category, created_at')
            .neq('id', id)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (!error && data) {
            setOtherNews(data);
          }
        }
      } catch (err) {
        console.error('Error fetching other news:', err);
      }
    };

    fetchPost();
    fetchOtherNews();
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
              <span className="text-slate-600 dark:text-slate-300 line-clamp-1">
                {currentLang === 'ar' && post.title_ar ? post.title_ar : 
                 currentLang === 'en' && post.title_en ? post.title_en : 
                 post.title}
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold mb-6 uppercase tracking-widest">
                {post.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
                {currentLang === 'ar' && post.title_ar ? post.title_ar : 
                 currentLang === 'en' && post.title_en ? post.title_en : 
                 post.title}
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
            </m.div>
          </div>

          {/* Featured Image */}
          <m.div
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
          </m.div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 min-w-0">
              <div 
                className={`prose prose-slate dark:prose-invert max-w-none overflow-hidden w-full ${currentLang === 'ar' ? 'text-right' : 'text-left'} text-lg leading-relaxed text-slate-600 dark:text-slate-400`}
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize((() => {
                    let content = currentLang === 'ar' && post.content_ar ? post.content_ar : 
                                  currentLang === 'en' && post.content_en ? post.content_en : 
                                  post.content;
                    if (!content) return '';
                    
                    // Replace non-breaking spaces with normal spaces to allow natural word wrapping
                    content = content.replace(/&nbsp;/g, ' ');

                    // Convert newlines to paragraphs for legacy plain text entries
                    if (!/<[a-z][\s\S]*>/i.test(content)) {
                      return content.split('\n\n').map(p => `<p>${p.replace(/\n/g, ' ')}</p>`).join('');
                    }
                    return content;
                  })())
                }}
              />

              {/* Tags/Share Footer */}
              <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <Share2 size={18} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Bagikan:</span>
                  <div className="flex items-center gap-2 ml-2">
                    <button 
                      onClick={() => {
                        const url = window.location.href;
                        const title = currentLang === 'ar' && post.title_ar ? post.title_ar : currentLang === 'en' && post.title_en ? post.title_en : post.title;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' \n\n' + url)}`, '_blank');
                      }}
                      title="Share to WhatsApp"
                      className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      title="Share to Facebook"
                      className="w-9 h-9 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                    </button>
                    <button 
                      onClick={() => {
                        const url = window.location.href;
                        const title = currentLang === 'ar' && post.title_ar ? post.title_ar : currentLang === 'en' && post.title_en ? post.title_en : post.title;
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                      }}
                      title="Share to X (Twitter)"
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Tautan berhasil disalin!');
                      }}
                      title="Copy Link"
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Related */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[10px]">
                    {t('detail.other_news')}
                  </h3>
                  <div className="space-y-6">
                    {(otherNews.length > 0 ? otherNews : demoNews.filter(n => n.id !== id)).map((item, i) => (
                      <Link key={i} to={`/berita/${item.id}`} className="group block">
                        <h4 className={`font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {currentLang === 'ar' && item.title_ar ? item.title_ar : 
                           currentLang === 'en' && item.title_en ? item.title_en : 
                           item.title}
                        </h4>
                        <div className={`text-[10px] text-slate-400 font-medium ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {item.category === 'Berita' ? t('categories.news') : 
                           item.category === 'Kegiatan' ? t('categories.event') : 
                           item.category === 'Pengumuman' ? t('categories.announcement') : 
                           item.category === 'Opini' ? t('categories.opinion') : 
                           item.category}
                        </div>
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
