import React from 'react';
import {useLanguage} from '../../context/LanguageContext';

const SurahSelector = ({surahs,selectedSurah,onSelect}) => {
  const {t} = useLanguage();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300">{t('selectSurah') || 'Select Surah'}</h3>

      <div className="relative">
        <select
          value={selectedSurah?.id || ''}
          onChange={(e) => {
            const surah = surahs.find(s => s.id === parseInt(e.target.value));
            onSelect(surah);
          }}
          className="w-full bg-gray-700 text-white text-xs p-3 rounded border border-gray-600 focus:border-emerald-500 outline-none appearance-none font-sans"
        >
          <option value="" disabled>{t('selectSurah') || 'Select Surah'}</option>
          {surahs.map((surah) => (
            <option key={surah.id} value={surah.id}>
              {surah.id}. {surah.name_simple} - {surah.name_arabic}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SurahSelector;
