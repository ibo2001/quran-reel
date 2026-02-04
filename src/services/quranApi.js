const QURAN_API_BASE = 'https://api.quran.com/api/v4';

/**
 * Fetch Verses for a specific Chapter (Surah)
 * Use Uthmani Script (Simple or Indopak as preferred, usually Uthmani for videos)
 * @param {number} chapterId 
 * @returns {Promise<Array>} List of verses (id, verse_key, text_uthmani)
 */
export const fetchChapterVerses = async (chapterId) => {
  try {
    // Fetch all verses for the chapter. Pagination might be needed for large surahs (Bakara).
    // The API default page size is 10. We need ALL.
    // Fortunately, we can request per_page=286 (max verses in Bakara).
    const response = await fetch(`${QURAN_API_BASE}/quran/verses/uthmani?chapter_number=${chapterId}`);
    if (!response.ok) throw new Error('Failed to fetch verses');
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error(`Error fetching verses for chapter ${chapterId}:`, error);
    throw error;
  }
};

/**
 * Fetch Translation for a specific Chapter
 * Default to English (Saheeh International - Resource ID 131)
 * @param {number} chapterId
 * @param {number} resourceId 
 * @returns {Promise<Array>} List of translations (resource_id, text)
 */
export const fetchChapterTranslation = async (chapterId, resourceId = 131) => {
    // NOTE: quran.com api v4 doesn't have a simple "chapter translation" endpoint that returns all at once easily without pagination?
    // Actually /quran/translations/{resource_id}?chapter_number={id} exists?
    // Let's check docs or fallback to /verses/by_chapter/{id}?translations={resource_id}
    // Using /quran/translations/131?chapter_number=1
    try {
        const response = await fetch(`${QURAN_API_BASE}/quran/translations/${resourceId}?chapter_number=${chapterId}`);
        if (!response.ok) throw new Error('Failed to fetch translation');
        const data = await response.json();
        return data.translations;
    } catch (error) {
        console.error('Error fetching translations:', error);
        throw error;
    }
}

/**
 * Get Chapter Info (Name, etc)
 * @returns {Promise<Array>}
 */
export const fetchChapters = async () => {
    try {
        const response = await fetch(`${QURAN_API_BASE}/chapters`);
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data = await response.json();
        return data.chapters;
    } catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
}
