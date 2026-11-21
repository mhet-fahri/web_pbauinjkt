/**
 * Utility untuk konversi URL Google Drive ke URL mode Preview dan Download
 */

export const getGoogleDrivePreviewUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Pola 1: /file/d/{id}/...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  // Pola 2: id={id}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  // Pola 3: Folder Google Drive (/drive/folders/{id})
  const folderMatch = trimmed.match(/\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
  }

  // Jika bukan format Google Drive umum, return URL asli
  return trimmed;
};

export const getGoogleDriveDownloadUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

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
