import React,{useState} from 'react';
import {useLanguage} from '../../context/LanguageContext';

const ReciterSelector = ({reciters,selectedReciter,onSelect}) => {
  const {t} = useLanguage();

  // Mapping for manual Arabic names if needed (redundant if using t() directly)
  // But t() uses keys like 'reciter_1'. API reciters have ID.
  // We can try to map ID to translation key.
  const getReciterName = (reciter) => {
    return t(`reciter_${reciter.id}`) || reciter.name;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300">{t('selectReciter') || 'Select Reciter'}</h3>

      <div className="relative">
        <select
          value={selectedReciter?.id || ''}
          onChange={(e) => {
            const reciter = reciters.find(r => r.id === parseInt(e.target.value));
            onSelect(reciter);
          }}
          className="w-full bg-gray-700 text-white text-xs p-3 rounded border border-gray-600 focus:border-emerald-500 outline-none appearance-none"
        >
          <option value="" disabled>{t('selectReciter') || 'Select Reciter'}</option>
          {reciters.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {getReciterName(reciter)}
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

export default ReciterSelector;
