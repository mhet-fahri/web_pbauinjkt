/**
 * Utility to convert Google Drive sharing links to direct image links.
 * Uses the high-quality Google CDN (lh3) which supports original quality
 * with dynamic real-time compression via the =w parameter.
 */
export const getDirectImageUrl = (url, width = 800) => {
  if (!url) return '';
  
  // Check if it's a Google Drive link
  if (url.includes('drive.google.com')) {
    let fileId = '';
    
    // Robust extraction for various Google Drive link formats
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || 
                  url.match(/id=([a-zA-Z0-9_-]+)/);
    
    if (match && match[1]) {
      fileId = match[1];
      // Using Google's High-Quality CDN endpoint
      // The =w[width] parameter provides original-quality compression
      return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
    }
  }
  
  // For Unsplash (Standard original quality with dynamic compression)
  if (url.includes('images.unsplash.com') && !url.includes('&w=')) {
    return `${url}&w=${width}&q=80`;
  }
  
  return url;
};
