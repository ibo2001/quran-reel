import { useState, useEffect } from 'react';
import { fetchReciters, fetchLocalTimings, getAudioUrl } from '../services/mp3QuranApi';
import { fetchChapterVerses, fetchChapterTranslation, fetchChapters } from '../services/quranApi';

/**
 * Hook to manage verse selection, recitation, and synchronization logic using local timings.
 */
export const useVerseManager = () => {
    const [reciters, setReciters] = useState([]);
    const [selectedReciter, setSelectedReciter] = useState(null);
    
    const [recitations, setRecitations] = useState([]);
    const [selectedRecitation, setSelectedRecitation] = useState(null);

    const [fullTimingData, setFullTimingData] = useState(null); // The loaded read_X.json content
    const [allSurahMetadata, setAllSurahMetadata] = useState([]); // High quality names from Quran.com

    const [surahs, setSurahs] = useState([]); 
    const [selectedSurah, setSelectedSurah] = useState(null);
    
    const [surahVerses, setSurahVerses] = useState([]);
    const [surahTranslation, setSurahTranslation] = useState([]);
    
    const [startVerse, setStartVerse] = useState(1);
    const [endVerse, setEndVerse] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Load Reciters and Surah Metadata on mount
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [recitersData, chaptersData] = await Promise.all([
                    fetchReciters(),
                    fetchChapters()
                ]);
                setReciters(recitersData);
                setAllSurahMetadata(chaptersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // 2. Load Recitations when Reciter is selected
    useEffect(() => {
        if (!selectedReciter) {
            setRecitations([]);
            setSelectedRecitation(null);
            return;
        }
        setRecitations(selectedReciter.moshaf || []);
        if (selectedReciter.moshaf?.length > 0) {
            setSelectedRecitation(selectedReciter.moshaf[0]);
        }
    }, [selectedReciter]);

    // 3. Load full Timing JSON when Recitation is selected
    useEffect(() => {
        if (!selectedRecitation || allSurahMetadata.length === 0) {
            setFullTimingData(null);
            setSurahs([]);
            return;
        }

        const loadTimingFile = async () => {
            setLoading(true);
            try {
                const data = await fetchLocalTimings(selectedRecitation.file);
                setFullTimingData(data);
                
                // Map surahs from allSurahMetadata using IDs found in the timing JSON
                const availableIds = new Set(data.chapters.map(c => c.id));
                const filteredSurahs = allSurahMetadata.filter(s => availableIds.has(s.id))
                    .map(s => ({
                        id: s.id,
                        surah_number: s.id,
                        name_simple: s.name_simple,
                        name_arabic: s.name_arabic,
                        surah_name: s.name_simple // fallback
                    }));
                setSurahs(filteredSurahs);
            } catch (err) {
                setError('Failed to load timing file: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        loadTimingFile();
    }, [selectedRecitation, allSurahMetadata]);

    // 4. Load Text + Translation when Surah is selected
    useEffect(() => {
        if (!selectedSurah || !fullTimingData) {
            setSurahVerses([]);
            setSurahTranslation([]);
            setStartVerse(1);
            setEndVerse(null);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Text from Itqan/Quran.com
                const [verses, translation] = await Promise.all([
                    fetchChapterVerses(selectedSurah.surah_number), 
                    fetchChapterTranslation(selectedSurah.surah_number)
                ]);

                // Find timing data in our already loaded fullTimingData
                const chapterTiming = fullTimingData.chapters.find(c => c.id === selectedSurah.surah_number);
                
                if (!chapterTiming) {
                    throw new Error(`Timing for Surah ${selectedSurah.surah_number} not found in current recitation.`);
                }

                // Construct Audio URL using folder_url from timing data
                const audioUrl = getAudioUrl(fullTimingData.folder_url, selectedSurah.surah_number);

                // Map timings to standard format
                const standardTimings = chapterTiming.aya_timing.map(t => ({
                    ayah: t.ayah,
                    start_ms: t.start_time,
                    end_ms: t.end_time
                }));

                // Update selectedSurah with audio/timings (Compat with VideoGenerator)
                selectedSurah.audio_url = audioUrl;
                selectedSurah.ayahs_timings = standardTimings;

                setSurahVerses(verses);
                setSurahTranslation(translation);
                setStartVerse(1);
                setEndVerse(verses.length);
            } catch (err) {
                setError('Failed to fetch data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [selectedSurah, fullTimingData]);

    return {
        reciters,
        selectedReciter,
        setSelectedReciter,
        recitations,
        selectedRecitation,
        setSelectedRecitation,
        surahs,
        selectedSurah,
        setSelectedSurah,
        surahVerses,
        surahTranslation,
        startVerse,
        setStartVerse,
        endVerse,
        setEndVerse,
        loading,
        error
    };
};
