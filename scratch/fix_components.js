import fs from 'fs';
import path from 'path';

const pagesDir = '/Users/fahri/Documents/web_dev/pba-vite/src/pages';
const componentsDir = '/Users/fahri/Documents/web_dev/pba-vite/src/components';

const mappings = [
  { files: ['Home.jsx'], ns: ['home', 'common'], prefix: 'pages.home.' },
  { files: ['Berita.jsx', 'DetailBerita.jsx'], ns: ['news', 'common'], prefix: 'pages.news.' },
  { files: ['Dosen.jsx', 'Kurikulum.jsx', 'CPL.jsx', 'MataKuliah.jsx', 'Penelitian.jsx'], ns: ['academic', 'common'], prefix: 'pages.' },
  { files: ['Mahasiswa.jsx', 'DataMahasiswa.jsx', 'LayananAkademik.jsx', 'Alumni.jsx', 'DataAlumni.jsx', 'TracerStudy.jsx'], ns: ['student', 'common'], prefix: 'pages.' },
  { files: ['Profil.jsx', 'Sejarah.jsx', 'Visi.jsx', 'Tujuan.jsx', 'ProfilLulusan.jsx'], ns: ['profile', 'common'], prefix: 'pages.' },
  { files: ['ExamCards.jsx'], ns: ['home', 'common'], prefix: 'pages.home.' }
];

function processFile(filePath, ns, prefix) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update useTranslation
  const nsString = ns.map(n => `'${n}'`).join(', ');
  content = content.replace(/useTranslation\(\)/g, `useTranslation([${nsString}])`);
  
  // Remove prefix
  const escapedPrefix = prefix.replace(/\./g, '\\.');
  const regex = new RegExp(`t\\('${escapedPrefix}`, 'g');
  content = content.replace(regex, "t('");
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

mappings.forEach(m => {
  m.files.forEach(file => {
    let fullPath = path.join(pagesDir, file);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(componentsDir, file);
    }
    processFile(fullPath, m.ns, m.prefix);
  });
});
