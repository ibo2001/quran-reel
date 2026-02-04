import React from 'react';
import {useLanguage} from '../../context/LanguageContext';

const VerseRangeSelector = ({totalVerses,startVerse,endVerse,onStartChange,onEndChange}) => {
  const {t} = useLanguage();

  // Create array of verse numbers [1, 2, ..., totalVerses]
  const verseNumbers = Array.from({length: totalVerses},(_,i) => i + 1);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300">{t('selectVerseRange') || 'Select Verse Range'}</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-400 block mb-1">{t('startVerse') || 'Start Verse'}</label>
          <select
            value={startVerse}
            onChange={(e) => onStartChange(Number(e.target.value))}
            className="w-full bg-gray-700 text-white text-xs p-2 rounded border border-gray-600 focus:border-emerald-500 outline-none"
          >
            {verseNumbers.map(n => (
              <option key={`start-${n}`} value={n}>
                {t('verse') || 'Verse'} {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 block mb-1">{t('endVerse') || 'End Verse'}</label>
          <select
            value={endVerse}
            onChange={(e) => onEndChange(Number(e.target.value))}
            className="w-full bg-gray-700 text-white text-xs p-2 rounded border border-gray-600 focus:border-emerald-500 outline-none"
          >
            {verseNumbers.map(n => (
              <option key={`end-${n}`} value={n} disabled={n < startVerse}>
                {t('verse') || 'Verse'} {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-gray-500 italic">
        {t('totalVersesSelected') || 'Total verses selected'}: {endVerse - startVerse + 1}
      </p>
    </div>
  );
};

export default VerseRangeSelector;
