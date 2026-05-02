import fs from 'fs';
import path from 'path';

const locales = ['id', 'en', 'ar'];
const baseDir = '/Users/fahri/Documents/web_dev/pba-vite/src/i18n/locales';
const outputBaseDir = '/Users/fahri/Documents/web_dev/pba-vite/public/locales';

locales.forEach(lang => {
  const filePath = path.join(baseDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8')).translation;

  const outputDir = path.join(outputBaseDir, lang);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Common: site, nav, hero, footer
  const common = {
    site: data.site,
    nav: data.nav,
    hero: data.hero,
    footer: data.pages.footer
  };

  // Home
  const home = data.pages.home || data.home; 
  // Wait, in id.json, it's data.pages.home. Let's check the structure again.
  // Actually, let's just extract them by key.

  const pages = data.pages;

  const splitData = {
    common: {
      site: data.site,
      nav: data.nav,
      hero: data.hero,
      footer: pages.footer
    },
    home: data.home || pages.home,
    news: pages.news,
    academic: {
      lecturers: pages.lecturers,
      curriculum: pages.curriculum,
      cpl: pages.cpl,
      mata_kuliah: pages.mata_kuliah,
      penelitian: pages.penelitian
    },
    student: {
      mahasiswa: pages.mahasiswa,
      alumni: pages.alumni
    },
    profile: {
      sejarah: pages.sejarah,
      visi: pages.visi,
      tujuan: pages.tujuan,
      profil_lulusan: pages.profil_lulusan
    }
  };

  Object.entries(splitData).forEach(([namespace, content]) => {
    fs.writeFileSync(
      path.join(outputDir, `${namespace}.json`),
      JSON.stringify(content, null, 2)
    );
  });
});

console.log('Splitting complete!');
