/**
 * Service untuk integrasi OpenAlex & CrossRef API serta BibTeX Parser dari Google Scholar
 */

const OPENALEX_BASE_URL = 'https://api.openalex.org';
const CROSSREF_BASE_URL = 'https://api.crossref.org';
const USER_AGENT_EMAIL = 'mailto:pba@uinjkt.ac.id';

/**
 * Cari publikasi spesifik milik Author di OpenAlex
 * Langkah 1: Cari profil Author ID berdasarkan nama
 * Langkah 2: Ambil karya yang hanya ditulis oleh Author ID tersebut
 */
export async function searchOpenAlexWorks(authorName, page = 1, perPage = 25) {
  try {
    const cleanName = authorName.trim();
    if (!cleanName) return { total: 0, results: [] };

    // 1. Cari Author Profile di OpenAlex
    const authorRes = await fetch(`${OPENALEX_BASE_URL}/authors?search=${encodeURIComponent(cleanName)}&per-page=3`, {
      headers: { 'User-Agent': USER_AGENT_EMAIL }
    });

    let worksData = null;

    if (authorRes.ok) {
      const authorJson = await authorRes.json();
      const topAuthor = authorJson.results?.[0];

      // Jika profil ditemukan dan memiliki karya
      if (topAuthor && topAuthor.id) {
        const worksUrl = `${OPENALEX_BASE_URL}/works?filter=author.id:${topAuthor.id}&sort=publication_year:desc&per-page=${perPage}&page=${page}`;
        const worksRes = await fetch(worksUrl, {
          headers: { 'User-Agent': USER_AGENT_EMAIL }
        });
        if (worksRes.ok) {
          worksData = await worksRes.json();
        }
      }
    }

    // Fallback: Jika tidak ketemu author ID khusus, cari via query judul/penulis tapi filter ketat nama
    if (!worksData || !worksData.results || worksData.results.length === 0) {
      const fallbackUrl = `${OPENALEX_BASE_URL}/works?search=${encodeURIComponent(cleanName)}&per-page=50&sort=publication_year:desc`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { 'User-Agent': USER_AGENT_EMAIL }
      });
      if (fallbackRes.ok) {
        const json = await fallbackRes.json();
        // Saring: hanya karya yang daftar penulisnya benar-benar mengandung kata kunci nama
        const queryTerms = cleanName.toLowerCase().split(/\s+/);
        const filtered = (json.results || []).filter(work => {
          const authors = (work.authorships || []).map(a => (a.author?.display_name || '').toLowerCase());
          return authors.some(author => queryTerms.every(term => author.includes(term)));
        });
        worksData = { meta: { count: filtered.length, page }, results: filtered.slice(0, perPage) };
      }
    }

    if (!worksData) {
      return { total: 0, results: [] };
    }

    const formattedWorks = (worksData.results || []).map(work => {
      const authors = (work.authorships || []).map(a => a.author?.display_name).filter(Boolean);
      const journalName = 
        work.primary_location?.source?.display_name || 
        work.primary_location?.source?.host_organization_name || 
        work.host_venue?.display_name || 
        '';

      const link = work.doi || work.primary_location?.landing_page_url || work.id || '';

      let type = 'Jurnal Internasional';
      if (work.type === 'book' || work.type === 'book-chapter') type = 'Buku';
      else if (work.type === 'proceedings-article') type = 'Prosiding Konferensi';
      else if (work.primary_location?.source?.is_in_doaj) type = 'Jurnal Open Access (DOAJ)';

      return {
        openalex_id: work.id,
        title: work.title || 'Untitled',
        authors: authors.length > 0 ? authors : [cleanName],
        year: work.publication_year ? String(work.publication_year) : String(new Date().getFullYear()),
        category: 'Publikasi',
        type: type,
        journal_name: journalName,
        doi: work.doi || '',
        link: link,
        citations: work.cited_by_count || 0,
        source: 'openalex',
        status: 'pending',
        description: ''
      };
    });

    return {
      total: worksData.meta?.count || formattedWorks.length,
      page: worksData.meta?.page || page,
      results: formattedWorks
    };
  } catch (error) {
    console.error('Failed to fetch from OpenAlex:', error);
    throw error;
  }
}

/**
 * Cari publikasi via CrossRef berdasarkan nama peneliti
 */
export async function searchCrossRefWorks(authorName, rows = 20) {
  try {
    const cleanName = authorName.trim();
    const encodedAuthor = encodeURIComponent(cleanName);
    const url = `${CROSSREF_BASE_URL}/works?query.author=${encodedAuthor}&rows=${rows}&sort=published&order=desc`;

    const res = await fetch(url, {
      headers: { 'User-Agent': `PBAPortal/1.0 (${USER_AGENT_EMAIL})` }
    });

    if (!res.ok) throw new Error(`CrossRef error: ${res.status}`);

    const data = await res.json();
    const items = data.message?.items || [];
    const queryTerms = cleanName.toLowerCase().split(/\s+/);

    // Filter agar karya benar-benar memiliki author yang cocok
    const filtered = items.filter(item => {
      const authors = (item.author || []).map(a => `${a.given || ''} ${a.family || ''}`.toLowerCase());
      return authors.some(author => queryTerms.every(term => author.includes(term)));
    });

    return (filtered.length > 0 ? filtered : items.slice(0, 10)).map(item => {
      const authors = (item.author || []).map(a => `${a.given || ''} ${a.family || ''}`.trim()).filter(Boolean);
      const year = item.published?.['date-parts']?.[0]?.[0] || item.created?.['date-parts']?.[0]?.[0] || new Date().getFullYear();
      const journalName = item['container-title']?.[0] || item.publisher || '';
      const title = item.title?.[0] || 'Untitled';
      const doi = item.DOI ? `https://doi.org/${item.DOI}` : '';

      return {
        openalex_id: item.DOI ? `doi:${item.DOI}` : `crossref:${Math.random().toString(36).substring(7)}`,
        title,
        authors: authors.length > 0 ? authors : [cleanName],
        year: String(year),
        category: 'Publikasi',
        type: item.type === 'proceedings-article' ? 'Prosiding' : 'Jurnal Ilmiah',
        journal_name: journalName,
        doi: doi,
        link: item.URL || doi,
        citations: item['is-referenced-by-count'] || 0,
        source: 'crossref',
        status: 'pending',
        description: ''
      };
    });
  } catch (error) {
    console.error('Failed to fetch from CrossRef:', error);
    throw error;
  }
}

/**
 * Parser teks BibTeX (ekspor resmi dari profil Google Scholar)
 * @param {string} bibtexText - Raw teks hasil ekspor dari Google Scholar
 */
export function parseBibTeX(bibtexText) {
  if (!bibtexText || typeof bibtexText !== 'string') return [];

  const entries = [];
  const entryRegex = /@(\w+)\s*\{([^,]+),([\s\S]*?)(?=\n@|\n*$)/g;
  let match;

  while ((match = entryRegex.exec(bibtexText)) !== null) {
    const typeRaw = match[1].toLowerCase();
    const body = match[3];

    const getField = (field) => {
      const fieldRegex = new RegExp(`${field}\\s*=\\s*[\"{]([\\s\\S]*?)[\"}]`, 'i');
      const m = body.match(fieldRegex);
      return m ? m[1].replace(/\s+/g, ' ').trim() : '';
    };

    const title = getField('title');
    if (!title) continue;

    const authorStr = getField('author');
    const authors = authorStr 
      ? authorStr.split(' and ').map(a => a.trim()) 
      : ['Peneliti'];

    const year = getField('year') || String(new Date().getFullYear());
    const journal = getField('journal') || getField('booktitle') || getField('publisher') || '';
    const doi = getField('doi') ? `https://doi.org/${getField('doi')}` : '';
    const url = getField('url') || doi || '';

    let type = 'Jurnal Ilmiah';
    if (typeRaw === 'article') type = 'Jurnal Ilmiah';
    else if (typeRaw === 'inproceedings' || typeRaw === 'conference') type = 'Prosiding Konferensi';
    else if (typeRaw === 'book' || typeRaw === 'inbook') type = 'Buku';

    entries.push({
      title,
      authors,
      year,
      category: 'Publikasi',
      type,
      journal_name: journal,
      doi,
      link: url,
      citations: 0,
      source: 'scholar_bibtex',
      status: 'pending',
      description: ''
    });
  }

  return entries;
}
