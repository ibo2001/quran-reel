import React from 'react';

const SurahSelector = ({surahs,selectedSurah,onSelect}) => {
  if (!surahs || surahs.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Select Surah</label>
      <select
        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
        onChange={(e) => {
          const idx = parseInt(e.target.value);
          const surah = surahs.find(s => s.surah_number === idx);
          onSelect(surah);
        }}
        value={selectedSurah?.surah_number || ''}
      >
        <option value="">Choose Surah (Available tracks)</option>
        {surahs.map(surah => (
          <option key={surah.surah_number} value={surah.surah_number}>
            {surah.surah_number}. {surah.surah_name_en} ({surah.surah_name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SurahSelector;
