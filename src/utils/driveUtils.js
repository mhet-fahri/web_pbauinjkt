/**
 * Utility untuk identifikasi dan konversi URL dokumen/media (Google Drive, YouTube, dll)
 * ke URL mode Preview dan Download yang kompatibel untuk disematkan di iframe.
 */

// Regex untuk mendeteksi URL YouTube (watch, embed, short link, shorts)
const YOUTUBE_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/;

/**
 * Cek apakah URL merupakan tautan YouTube
 */
export const isYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return YOUTUBE_REGEX.test(url.trim());
};

/**
 * Ekstrak YouTube Video ID
 */
export const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.trim().match(YOUTUBE_REGEX);
  return match ? match[1] : null;
};

/**
 * Mengubah URL (Google Drive / YouTube / dll) menjadi URL embed preview yang aman untuk iframe
 */
export const getGoogleDrivePreviewUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Pola YouTube -> ubah ke format embed YouTube
  const ytId = getYouTubeVideoId(trimmed);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
  }

  // Pola 1: Google Drive /file/d/{id}/...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  // Pola 2: Google Drive id={id}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  // Pola 3: Folder Google Drive (/drive/folders/{id})
  const folderMatch = trimmed.match(/\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
  }

  // Jika bukan format Google Drive / YouTube umum, return URL asli
  return trimmed;
};

/**
 * Mendapatkan tautan unduh langsung (khusus Google Drive file).
 * Mengembalikan null jika tipe URL tidak mendukung direct download (misal: YouTube).
 */
export const getGoogleDriveDownloadUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // YouTube tidak memiliki direct file download
  if (isYouTubeUrl(trimmed)) {
    return null;
  }

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }

  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
  }

  return trimmed;
};
