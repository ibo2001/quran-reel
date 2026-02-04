import { useState, useEffect } from 'react';
import { fetchReciters, fetchRecitations, fetchRecitationTracks } from '../services/itqanApi';
import { fetchChapterVerses, fetchChapterTranslation } from '../services/quranApi';

/**
 * Hook to manage verse selection, recitation, and synchronization logic.
 */
export const useVerseManager = () => {
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  
  const [recitations, setRecitations] = useState([]);
  const [selectedRecitation, setSelectedRecitation] = useState(null);

  const [surahs, setSurahs] = useState([]); // List of available Surahs for the selected recitation
  const [selectedSurah, setSelectedSurah] = useState(null);
  
  // Verse data
  const [surahVerses, setSurahVerses] = useState([]);
  const [surahTranslation, setSurahTranslation] = useState([]);
  
  // Range Selection
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Reciters on mount
  useEffect(() => {
    const loadReciters = async () => {
      setLoading(true);
      try {
        const data = await fetchReciters();
        setReciters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReciters();
  }, []);

  // Load Recitations when Reciter is selected
  useEffect(() => {
    if (!selectedReciter) {
      setRecitations([]);
      return;
    }
    const loadRecitations = async () => {
      setLoading(true);
      try {
        const data = await fetchRecitations(selectedReciter.id);
        setRecitations(data);
        // Auto-select first recitation logic could go here or be manual
        if (data.length > 0) setSelectedRecitation(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRecitations();
  }, [selectedReciter]);

  // Load Tracks (Surahs) when Recitation is selected
  useEffect(() => {
    if (!selectedRecitation) {
      setSurahs([]);
      return;
    }
    const loadTracks = async () => {
      setLoading(true);
      try {
        // Fetch tracks for the recitation asset
        // The Recitation object likely has an ID we use.
        // Wait, fetchRecitationTracks expects asset_id. The /recitations endpoint returns objects with 'id'.
        // Let's assume recitation.id is the asset_id.
        const data = await fetchRecitationTracks(selectedRecitation.id);
        setSurahs(data); // This contains audio_url and ayahs_timings
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, [selectedRecitation]);

  // Load Text + Translation when Surah is selected
  useEffect(() => {
    if (!selectedSurah) {
        setSurahVerses([]);
        setSurahTranslation([]);
        setStartVerse(1);
        setEndVerse(null);
        return;
    }
    const loadText = async () => {
        setLoading(true);
        try {
            const [verses, translation] = await Promise.all([
                fetchChapterVerses(selectedSurah.surah_number), 
                fetchChapterTranslation(selectedSurah.surah_number)
            ]);
            setSurahVerses(verses);
            setSurahTranslation(translation);
            setStartVerse(1);
            setEndVerse(verses.length);
        } catch (err) {
            setError('Failed to fetch Quran text: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    loadText();
  }, [selectedSurah]);

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
