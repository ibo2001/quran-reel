import { TIMING_INDEX } from '../assets/ayah_timing/index';

const BASE_URL = 'https://mp3quran.net/api/v3';

// Dynamic import for local timing files
const timingFiles = import.meta.glob('../assets/ayah_timing/*.json');

/**
 * Fetch list of reciters from the local TIMING_INDEX
 * @returns {Promise<Array>} List of reciters with their grouped moshafs
 */
export const fetchReciters = async () => {
    // Group by name for the UI
    const recitersMap = new Map();

    TIMING_INDEX.forEach(item => {
        if (!recitersMap.has(item.name)) {
            recitersMap.set(item.name, {
                id: item.id,
                name: item.name,
                name_en: item.name_en,
                moshaf: []
            });
        }
        
        const reciter = recitersMap.get(item.name);
        reciter.moshaf.push({
            id: item.id,
            name: item.rewaya,
            style: item.rewaya,
            file: item.file
        });
    });

    return Array.from(recitersMap.values());
};

/**
 * Fetch the full timing JSON for a specific read/file
 * @param {string} fileName - e.g. "read_1.json"
 * @returns {Promise<Object>} The full JSON content
 */
export const fetchLocalTimings = async (fileName) => {
    const loader = timingFiles[`../assets/ayah_timing/${fileName}`];
    if (!loader) throw new Error(`Timing file ${fileName} not found`);
    
    // The glob loader returns a module with a default export (the JSON)
    const module = await loader();
    return module.default || module;
};

/**
 * Fetch Surah metadata (still useful for names if needed, but we can get from JSON)
 * @param {string} lang 
 * @returns {Promise<Array>} List of surahs
 */
export const fetchSurahsData = async (lang = 'ar') => {
    try {
        const response = await fetch(`${BASE_URL}/suwar?language=${lang}`);
        if (!response.ok) throw new Error('Failed to fetch surahs');
        const data = await response.json();
        return data.suwar;
    } catch (error) {
        console.error('Surah fetch error:', error);
        throw error;
    }
};

/**
 * Helper to construct Audio URL
 * @param {string} serverUrl - The base server URL 
 * @param {number} surahId - 1 to 114
 * @returns {string} e.g. https://server.com/path/001.mp3
 */
export const getAudioUrl = (serverUrl, surahId) => {
    const paddedId = String(surahId).padStart(3, '0');
    return `${serverUrl}/${paddedId}.mp3`;
};
