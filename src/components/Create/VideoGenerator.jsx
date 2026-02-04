import React,{useEffect,useState,useMemo} from 'react';
import {useVerseManager} from '../../hooks/useVerseManager';
import ReciterSelector from './ReciterSelector';
import RecitationSelector from './RecitationSelector';
import SurahSelector from './SurahSelector';
import VideoPreview from './VideoPreview';
import BackgroundSelector from './BackgroundSelector';
import VerseRangeSelector from './VerseRangeSelector';
import StyleSelector from './StyleSelector';
import Navbar from '../Layout/Navbar';
import {useAuth} from '../../hooks/useAuth';
import {saveProject} from '../../services/db';
import {FONTS,COLORS,ANIMATIONS} from '../../constants';
import {useLanguage} from '../../context/LanguageContext';

const VideoGenerator = () => {
  const {
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
  } = useVerseManager();

  const {user,loginWithGoogle} = useAuth();
  const {t} = useLanguage();
  const [selectedBackground,setSelectedBackground] = useState(null);
  const [isSaving,setIsSaving] = useState(false);

  // Style State
  const [selectedFont,setSelectedFont] = useState(FONTS[0]); // Default KFGQPC
  const [selectedColor,setSelectedColor] = useState(COLORS[0]);
  const [selectedAnimation,setSelectedAnimation] = useState(ANIMATIONS[0]);

  // Filter Verses based on Range
  const filteredData = useMemo(() => {
    if (!selectedSurah || surahVerses.length === 0) return {verses: [],timings: [],translation: []};

    const startIdx = (startVerse || 1) - 1;
    const endIdx = (endVerse || surahVerses.length) - 1;

    const slicedVerses = surahVerses.slice(startIdx,endIdx + 1);
    const slicedTranslation = surahTranslation && surahTranslation.length > 0
      ? surahTranslation.slice(startIdx,endIdx + 1)
      : [];

    const fullTimings = selectedSurah.ayahs_timings || [];
    const slicedTimings = fullTimings.slice(startIdx,endIdx + 1);

    // Safety check if timings exist
    if (slicedTimings.length > 0) {
      return {
        verses: slicedVerses,
        translation: slicedTranslation,
        timings: slicedTimings,
        startTime: slicedTimings[0].start_ms / 1000,
        endTime: slicedTimings[slicedTimings.length - 1].end_ms / 1000
      };
    }
    return {verses: slicedVerses,translation: slicedTranslation,timings: [],startTime: 0,endTime: 0};

  },[surahVerses,surahTranslation,selectedSurah,startVerse,endVerse]);

  const handleSave = async () => {
    if (!user) {
      loginWithGoogle();
      return;
    }
    if (!selectedSurah) return;

    setIsSaving(true);
    try {
      const projectData = {
        reciter: {id: selectedReciter?.id,name: selectedReciter?.name},
        recitation: {id: selectedRecitation?.id,name: selectedRecitation?.name},
        surah: {number: selectedSurah.surah_number,name: selectedSurah.surah_name},
        range: {start: startVerse,end: endVerse},
        background: selectedBackground ? {type: selectedBackground.type,url: selectedBackground.url,name: selectedBackground.name} : null,
        style: {
          font: selectedFont,
          color: selectedColor,
          animation: selectedAnimation
        }
      };

      await saveProject(user.uid,projectData);
      alert("Project saved to 'My Creations'!");
    } catch (err) {
      alert("Failed to save project.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-800 p-6 flex flex-col space-y-6 overflow-y-auto border-r border-gray-700 z-10 shadow-xl scrollbar-thin scrollbar-thumb-gray-700">
          <h1 className="text-xl font-bold text-emerald-400 mb-2">{t('editorOptions') || 'Editor Options'}</h1>

          {loading && <div className="text-blue-400 text-sm animate-pulse">{t('loading') || 'Loading data...'}</div>}
          {error && <div className="text-red-500 bg-red-900/20 p-2 rounded text-sm">{t('error') || 'Error'}: {error}</div>}

          <ReciterSelector
            reciters={reciters}
            selectedReciter={selectedReciter}
            onSelect={setSelectedReciter}
          />

          <RecitationSelector
            recitations={recitations}
            selectedRecitation={selectedRecitation}
            onSelect={setSelectedRecitation}
          />

          <SurahSelector
            surahs={surahs}
            selectedSurah={selectedSurah}
            onSelect={setSelectedSurah}
          />

          {surahVerses.length > 0 && (
            <VerseRangeSelector
              totalVerses={surahVerses.length}
              startVerse={startVerse}
              endVerse={endVerse || surahVerses.length}
              onStartChange={(val) => {
                setStartVerse(val);
                if (endVerse && val > endVerse) setEndVerse(val);
              }}
              onEndChange={setEndVerse}
            />
          )}

          <BackgroundSelector
            selectedBackground={selectedBackground}
            onSelect={setSelectedBackground}
          />

          <StyleSelector
            selectedFont={selectedFont}
            onFontChange={setSelectedFont}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            selectedAnimation={selectedAnimation}
            onAnimationChange={setSelectedAnimation}
          />

          {filteredData.verses.length > 0 && (
            <div className="flex-1 mt-4 overflow-hidden flex flex-col">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                {t('versesPreview') || 'Verses Preview'} ({filteredData.verses.length})
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 text-xs">
                {filteredData.verses.map((v) => (
                  <div key={v.id} className="p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer">
                    <span className="font-bold mr-2">{v.verse_key}</span>
                    <span className="break-words font-arabic" dir="rtl">{v.text_uthmani ? v.text_uthmani.substring(0,50) + '...' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-black flex items-center justify-center p-8 relative">
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={handleSave}
              disabled={!selectedSurah || isSaving}
              className={`px-6 py-2 rounded-full font-bold shadow-lg transition flex items-center gap-2 ${!selectedSurah
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
            >
              <span>{isSaving ? (t('saving') || 'Saving...') : (user ? (t('saveProject') || '💾 Save Project') : (t('loginToSave') || 'Login to Save'))}</span>
            </button>
          </div>

          {selectedSurah && selectedSurah.audio_url ? (
            <VideoPreview
              audioUrl={selectedSurah.audio_url}
              data={{
                verses: filteredData.verses,
                timings: filteredData.timings,
                translation: filteredData.translation,
                background: selectedBackground,
                rangeStart: filteredData.startTime,
                rangeEnd: filteredData.endTime,
                reciter: selectedReciter,
                selectedSurah: selectedSurah,
                startVerse: startVerse,
                style: {
                  font: selectedFont,
                  color: selectedColor,
                  animation: selectedAnimation
                }
              }}
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-xl mb-2">🎬</p>
              <p>{t('previewPlaceholder') || 'Preview will appear here'}</p>
              <p className="text-sm mt-2 text-gray-700">{t('selectSurah') || 'Select a Surah to start'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
