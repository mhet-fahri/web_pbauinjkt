import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  MessageCircle, 
  Send, 
  Play,
  ArrowRight
} from 'lucide-react';
import logoUin from '../assets/logo-uin.png';

const Footer = () => {
  const { t } = useTranslation();
  const footerLinks = [
    {
      title: t('footer.columns.program.title'),
      links: [
        { name: t('footer.columns.program.vision'), path: '/profil/visi' },
        { name: t('footer.columns.program.curriculum'), path: '/kurikulum' },
        { name: t('footer.columns.program.staff'), path: '/dosen' },
        { name: t('footer.columns.program.accreditation'), path: '/profil/akreditasi' },
      ],
    },
    {
      title: t('footer.columns.services.title'),
      links: [
        { name: t('footer.columns.services.registration'), path: '#' },
        { name: t('footer.columns.services.schedule'), path: '#' },
        { name: t('footer.columns.services.calendar'), path: '#' },
        { name: t('footer.columns.services.help'), path: '#' },
      ],
    },
    {
      title: t('footer.columns.students.title'),
      links: [
        { name: t('footer.columns.students.organization'), path: '#' },
        { name: t('footer.columns.students.scholarship'), path: '#' },
        { name: t('footer.columns.students.achievement'), path: '#' },
        { name: t('footer.columns.students.alumni'), path: '/alumni' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Globe, href: '#' },
    { icon: MessageCircle, href: '#' },
    { icon: Send, href: '#' },
    { icon: Play, href: '#' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-sky-500 to-primary-600" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logoUin} alt="Logo UIN Syarif Hidayatullah Jakarta" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-tight text-white">
                <span className="text-2xl font-black tracking-tight">PBA <span className="text-primary-500">UIN</span></span>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-slate-500">Jakarta</span>
              </div>
            </Link>
            <p className="text-lg leading-relaxed mb-8 text-slate-500">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  aria-label={`Buka tautan sosial ${i + 1}`}
                  className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 border border-slate-800"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.path} 
                        className="hover:text-primary-500 transition-colors flex items-center group"
                      >
                        <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-slate-900 mb-12">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 mb-1">{t('footer.contact.address')}</p>
              <p className="text-white text-sm font-medium">{t('footer.contact.city')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 mb-1">{t('footer.contact.phone')}</p>
              <p className="text-white text-sm font-medium">+62 21 7401925</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 mb-1">{t('footer.contact.email')}</p>
              <a href="mailto:pba.fitk@apps.uinjkt.ac.id" className="text-white text-sm font-medium hover:text-primary-400 transition-colors">pba.fitk@apps.uinjkt.ac.id</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p>&copy; {new Date().getFullYear()} PBA UIN Jakarta. {t('footer.bottom.rights')}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">{t('footer.bottom.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.bottom.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
