import { API_BASE_URL, DEFAULT_PAGE_SIZE } from '../constants';

/**
 * Fetch list of Reciters
 * @returns {Promise<Array>} List of reciters
 */
export const fetchReciters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reciters/?page_size=${DEFAULT_PAGE_SIZE}`);
    if (!response.ok) throw new Error('Failed to fetch reciters');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching reciters:', error);
    throw error;
  }
};

/**
 * Fetch Recitations for a specific Reciter
 * @param {number} reciterId 
 * @returns {Promise<Array>} List of recitations
 */
export const fetchRecitations = async (reciterId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recitations/?reciter_id=${reciterId}&page_size=${DEFAULT_PAGE_SIZE}`);
    if (!response.ok) throw new Error('Failed to fetch recitations');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching recitations for reciter ${reciterId}:`, error);
    throw error;
  }
};

/**
 * Fetch Tracks (Surahs) for a specific Recitation Asset
 * @param {number} assetId - The recitation ID
 * @returns {Promise<Array>} List of tracks (Surahs) with audio and timings
 */
export const fetchRecitationTracks = async (assetId) => {
  try {
    // We might need to handle pagination if there are 114 surahs and page size is small.
    // Max page size might be limited. We'll try fetching 114.
    const response = await fetch(`${API_BASE_URL}/recitation-tracks/${assetId}/?page_size=114`);
    if (!response.ok) throw new Error('Failed to fetch recitation tracks');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching tracks for recitation ${assetId}:`, error);
    throw error;
  }
};
