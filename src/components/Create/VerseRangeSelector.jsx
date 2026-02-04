import React from 'react';

const VerseRangeSelector = ({
  totalVerses,
  startVerse,
  endVerse,
  onStartChange,
  onEndChange
}) => {
  if (!totalVerses) return null;

  // Create array of verse numbers [1...total]
  const verseOptions = Array.from({length: totalVerses},(_,i) => i + 1);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300">Select Verse Range</h3>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Start Verse</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-sm"
            value={startVerse}
            onChange={(e) => onStartChange(parseInt(e.target.value))}
          >
            {verseOptions.map(num => (
              <option key={`start-${num}`} value={num} disabled={endVerse && num > endVerse}>
                Verse {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">End Verse</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-sm"
            value={endVerse || totalVerses}
            onChange={(e) => onEndChange(parseInt(e.target.value))}
          >
            {verseOptions.map(num => (
              <option key={`end-${num}`} value={num} disabled={num < startVerse}>
                Verse {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default VerseRangeSelector;
